"use client";
import { useState, useRef, useEffect } from "react";
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

const products = [
  {
    id: 1,
    name: "Lipstick Shade",
    description: "A smooth, long-lasting lipstick.",
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi9U5DUN0k2I7s8Y51Yjcde8vtBueuMooJYQ&s", "/lipstick2.png"],
    price: "$15.00",
  },
];

export default function ProductPage() {
  const lipColorRef = useRef("#FF3030")
    const videoRef = useRef<HTMLVideoElement | null>(null);
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);;
  
  useEffect(() => {
    async function loadModel() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      });
      faceLandmarkerRef.current = landmarker;
    }
    loadModel();
  }, []);

  const processVideo = () => {
    if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

     const drawFrame = () => {
      if (!faceLandmarkerRef.current) return;

      const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
        const drawingUtils = new DrawingUtils(ctx!);
        for (const landmarks of results.faceLandmarks) {
          // Get lip landmarks
          const outerLipPoints = [
            61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61, // Outer lip
            185, 40, 39, 37, 0, 267, 269, 270, 409, 291,  // Extra top-lip details
          ].map(index => ({
            x: landmarks[index].x * canvas.width,
            y: landmarks[index].y * canvas.height,
          }));

          const innerLipPoints = [
            78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78,   // Inner lip
            191, 80, 81, 82, 13, 312, 311, 310, 415, 308 // Extra lower-lip details
          ].map(index => ({
            x: landmarks[index].x * canvas.width,
            y: landmarks[index].y * canvas.height,
          }));

          // Start drawing lips
          ctx!.beginPath();

          // Draw outer lip shape
          ctx!.moveTo(outerLipPoints[0].x, outerLipPoints[0].y);
          outerLipPoints.forEach((point) => ctx!.lineTo(point.x, point.y));
          ctx!.closePath();

          // Create a separate path for the inner lips (mouth opening)
          ctx!.moveTo(innerLipPoints[0].x, innerLipPoints[0].y);
          innerLipPoints.forEach((point) => ctx!.lineTo(point.x, point.y));
          ctx!.closePath();

          // Use "evenodd" fill rule to remove the inside of the mouth
          ctx!.fillStyle = lipColorRef.current;
          ctx!.fill("evenodd");

          // Draw Lip Outline for Better Look
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LIPS,
            { color: "black", lineWidth: 1 } // Thin outline for natural look
          );
        }
      }

      requestAnimationFrame(drawFrame);
    };
    drawFrame();
  };

  const enableWebcam = async () => {
    if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.onloadeddata = () => processVideo();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{products[0].name}</h1>
      <p className="text-gray-600 mb-4">{products[0].description}</p>
      <img
        src={products[0].images[0]}
        alt={products[0].name}
        className="w-64 h-64 object-cover rounded-lg shadow-md mb-4"
      />
      <p className="text-lg font-semibold text-gray-700">{products[0].price}</p>
      <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700">
        Add to Cart
      </button>
      <div className="mt-6">
        <select
          className="border p-2 rounded-md"
          onChange={(e) => (lipColorRef.current = e.target.value)}
        >
          <option value="#FF3030">Red</option>
          <option value="#800080">Purple</option>
          <option value="#8B0000">Deep Red</option>
        </select>
        <button
          className="ml-4 bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700"
          onClick={enableWebcam}
        >
          Real-time Color
        </button>
      </div>
      <div className="relative mt-6 w-96 h-64  bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full -mt-2 h-full object-cover "
        ></video>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        ></canvas>
      </div>
    </div>
  );
}
