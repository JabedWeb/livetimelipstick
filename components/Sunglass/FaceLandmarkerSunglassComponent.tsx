"use client";
import { useEffect, useRef } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import { useSunglassContext } from "@/context/SunglassContext";

export default function SunglassesLandmarkerComponent() {
  const {
    selectedGlassProduct,
    selectedVariant,
    setSelectedVariant,
    isWebcamActive,
    setIsWebcamActive,
  } = useSunglassContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const sunglassesImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = selectedVariant.image;
    img.onload = () => {
      sunglassesImageRef.current = img;
    };
  }, [selectedVariant]);

  useEffect(() => {
    async function loadModel() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );
      faceLandmarkerRef.current = landmarker;
    }

    loadModel();

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const processVideo = () => {
    if (
      !faceLandmarkerRef.current ||
      !videoRef.current ||
      !canvasRef.current
    )
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const drawFrame = () => {
      const results = faceLandmarkerRef.current!.detectForVideo(
        video,
        performance.now()
      );
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
for (const landmarks of results.faceLandmarks) {
          const leftEye = landmarks[33];
          const rightEye = landmarks[263];
          const nose = landmarks[168];

          const eyeLeftX = leftEye.x * canvas.width;
          const eyeLeftY = leftEye.y * canvas.height;
          const eyeRightX = rightEye.x * canvas.width;
          const eyeRightY = rightEye.y * canvas.height;

          const centerX = (eyeLeftX + eyeRightX) / 2;
          const centerY = (eyeLeftY + eyeRightY) / 2;

          const dx = eyeRightX - eyeLeftX;
          const dy = eyeRightY - eyeLeftY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.hypot(dx, dy);

          const glassesWidth = distance * 2.2;
          const glassesHeight = glassesWidth * 1;

          if (sunglassesImageRef.current) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.drawImage(
              sunglassesImageRef.current,
              -glassesWidth / 2,
              -glassesHeight / 2,
              glassesWidth,
              glassesHeight
            );
            ctx.restore();
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();
  };

  useEffect(() => {
    if (isWebcamActive) {
      const enableWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadeddata = () => processVideo();
          }
        } catch (error) {
          console.error("Webcam error:", error);
        }
      };
      enableWebcam();
    } else {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isWebcamActive]);

  const handleCloseWebcam = () => {
    if (animationFrameId.current)
      cancelAnimationFrame(animationFrameId.current);
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
        zIndex: isWebcamActive ? 100 : -1,
      }}
    >
      <div
        style={{
          position: "relative",
          display: isWebcamActive ? "block" : "none",
          width: "640px",
          height: "100vh",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
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
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            width: "600px",
            height: "auto",
            pointerEvents: "none",
          }}
        />
        <button
          onClick={handleCloseWebcam}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#e63946",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Close
        </button>

        {/* Variant Selector */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
            padding: "10px",
            backgroundColor: "#f7f7f7",
            borderRadius: "8px",
          }}
        >
          {selectedGlassProduct.variations.map((variant, index) => (
            <div
              key={index}
              onClick={() => setSelectedVariant(variant)}
              style={{
                cursor: "pointer",
                border:
                  selectedVariant.name === variant.name
                    ? "2px solid #e63946"
                    : "1px solid #ccc",
                borderRadius: "8px",
                padding: "5px",
                backgroundColor: "#fff",
                boxShadow:
                  selectedVariant.name === variant.name
                    ? "0 0 10px rgba(230, 57, 70, 0.5)"
                    : "0 0 5px rgba(0,0,0,0.1)",
                width: "70px",
                textAlign: "center",
              }}
            >
              <img
                src={variant.image}
                alt={variant.name}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
              <p style={{ fontSize: "10px", margin: "4px 0 0" }}>
                {variant.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
