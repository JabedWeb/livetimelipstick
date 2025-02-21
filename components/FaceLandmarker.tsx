"use client";
import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export default function FaceLandmarkerComponent() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const lipColorRef = useRef("#FF3030"); // Default lipstick color

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


        //  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61, // Outer lip
        //     185, 40, 39, 37, 0, 267, 269, 270, 409, 291, // Extra top-lip details
        //     78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78, // Inner lip
        //     191, 80, 81, 82, 13, 312, 311, 310, 415, 308 // Extra lower-lip details

        for (const landmarks of results.faceLandmarks) {
          // Get lip landmarks
          const outerLipPoints = [
            61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61,
            185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
          ].map(index => ({
            x: landmarks[index].x * canvas.width,
            y: landmarks[index].y * canvas.height,
          }));

          const innerLipPoints = [
            78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78,
            191, 80, 81, 82, 13, 312, 311, 310, 415, 308
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
    <div>
      <h1>Next.js Face Landmarker</h1>
      <select onChange={(e) => (lipColorRef.current = e.target.value)}>
        <option value="#FF3030">Red</option>
        <option value="#800080">Purple</option>
        <option value="#8B0000">Deep Red</option>
      </select>
      <button onClick={enableWebcam}>Enable Webcam</button>
      <div style={{ position: "relative" }}>
        <video ref={videoRef} autoPlay playsInline style={{ position: "absolute" }}></video>
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}></canvas>
      </div>
    </div>
  );
}
