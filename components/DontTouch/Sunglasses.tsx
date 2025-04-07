"use client";
import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function Sunglasses() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const sunglassesImageRef = useRef<HTMLImageElement | null>(null);

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
        runningMode: "VIDEO",
        numFaces: 1,
      });
      faceLandmarkerRef.current = landmarker;

      // Load sunglasses image
      const img = new Image();
      img.src = "/sunglasses.png"; // Put your image in public folder
      img.onload = () => (sunglassesImageRef.current = img);
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
      if (!faceLandmarkerRef.current || !sunglassesImageRef.current) return;

      const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          const leftEye = landmarks[33];  // left eye outer corner
          const rightEye = landmarks[263]; // right eye outer corner
          const nose = landmarks[168]; // nose bridge

          const eyeLeftX = leftEye.x * canvas.width;
          const eyeLeftY = leftEye.y * canvas.height;
          const eyeRightX = rightEye.x * canvas.width;
          const eyeRightY = rightEye.y * canvas.height;
          const noseX = nose.x * canvas.width;
          const noseY = nose.y * canvas.height;

          const centerX = (eyeLeftX + eyeRightX) / 2;
          const centerY = (eyeLeftY + eyeRightY) / 2;

          const dx = eyeRightX - eyeLeftX;
          const dy = eyeRightY - eyeLeftY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.hypot(dx, dy);

          // sunglasses size based on distance between eyes
          const glassesWidth = distance * 2.2; 
          const glassesHeight = glassesWidth * 1;

          ctx!.save();
          ctx!.translate(centerX, centerY);
          ctx!.rotate(angle);
          ctx!.drawImage(
            sunglassesImageRef.current,
            -glassesWidth / 2,
            -glassesHeight / 2,
            glassesWidth,
            glassesHeight
          );
          ctx!.restore();
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
      <h1>Virtual Sunglasses (Live)</h1>
      <button onClick={enableWebcam}>Enable Webcam</button>
      <div style={{ position: "relative" }}>
        <video ref={videoRef} autoPlay playsInline style={{ position: "absolute" }}></video>
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}></canvas>
      </div>
    </div>
  );
}
