"use client";
import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export default function FaceLandmarkerComponent() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const lipColorRef = useRef("#FF3030"); // ✅ Use useRef instead of state

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
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LIPS,
            { color: lipColorRef.current, lineWidth: 4 } // ✅ Reads latest color from useRef
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
