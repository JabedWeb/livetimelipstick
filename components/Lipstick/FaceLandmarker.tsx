"use client";

import { useEffect, useRef } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useLipstickContext } from "@/context/ColorContext";

export default function FaceLandmarkerComponent() {
  const {
    selectedProduct,
    selectedShade,
    setSelectedShade,
    isWebcamActive,
    setIsWebcamActive,
  } = useLipstickContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Live hex color
  const lipColorRef = useRef(selectedShade.hex);

  useEffect(() => {
    lipColorRef.current = selectedShade.hex;
  }, [selectedShade]);

  // Load model
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

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const processVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!video || !canvas || !ctx || !faceLandmarkerRef.current) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const drawFrame = () => {
      const results = faceLandmarkerRef.current!.detectForVideo(video, performance.now());
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
        const drawingUtils = new DrawingUtils(ctx);
        for (const landmarks of results.faceLandmarks) {
          const outerLipPoints = [
            61, 146, 91, 181, 84, 17, 314, 405, 321,
            375, 291, 61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
          ].map((i) => ({
            x: landmarks[i].x * canvas.width,
            y: landmarks[i].y * canvas.height,
          }));

          const innerLipPoints = [
            78, 95, 88, 178, 87, 14, 317, 402, 318,
            324, 308, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
          ].map((i) => ({
            x: landmarks[i].x * canvas.width,
            y: landmarks[i].y * canvas.height,
          }));

          ctx.beginPath();
          ctx.moveTo(outerLipPoints[0].x, outerLipPoints[0].y);
          outerLipPoints.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.closePath();

          ctx.moveTo(innerLipPoints[0].x, innerLipPoints[0].y);
          innerLipPoints.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.closePath();

          ctx.fillStyle = lipColorRef.current;
          ctx.fill("evenodd");

          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, {
            color: "black",
            lineWidth: 1,
          });
        }
      }

      animationFrameId.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();
  };

  // Webcam stream
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => processVideo();
        }
      } catch (err) {
        console.error("Webcam access error:", err);
      }
    };

    if (isWebcamActive) {
      startWebcam();
    } else {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isWebcamActive]);

  const handleCloseWebcam = () => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: isWebcamActive ? 10 : -1,
      }}
    >
      <div
        style={{
          position: "relative",
          display: isWebcamActive ? "block" : "none",
          width: "640px",
          height: "100vh",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            width: "600px",
            height: "auto",
            borderRadius: "10px",
          }}
        ></video>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            width: "600px",
            height: "auto",
            borderRadius: "10px",
          }}
        ></canvas>

        {/* Close Webcam Button */}
        <button
          onClick={handleCloseWebcam}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#e63946",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Close
        </button>

        {/* Shade Picker */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {selectedProduct.shades.map((shade, i) => (
            <button
              key={i}
              onClick={() => setSelectedShade(shade)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: shade.hex,
                border:
                  shade.hex === selectedShade.hex
                    ? "3px solid #e63946"
                    : "1px solid #ccc",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {shade.hex === selectedShade.hex && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-22px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    color: "#333",
                  }}
                >
                  {shade.name}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
