"use client";
import { useEffect, useRef } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useSunglassContext } from "@/context/SunglassContext";

export default function SunglassesLandmarkerComponent() {
  const {
    sunglasses,
    selectedGlass,
    setSelectedGlass,
    isWebcamActive,
    setIsWebcamActive,
  } = useSunglassContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const sunglassesImageRef = useRef<HTMLImageElement | null>(null);

  // Load selected sunglasses image when changed
  useEffect(() => {
    const img = new Image();
    img.src = selectedGlass.image;
    img.onload = () => {
      sunglassesImageRef.current = img;
    };
  }, [selectedGlass.image]);

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

// ...keep the rest of the component as before

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
      const noseX = nose.x * canvas.width;
      const noseY = nose.y * canvas.height;

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
    }

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
        zIndex: isWebcamActive ? 10 : -1,
      }}
    >
      <div
        style={{
          position: "relative",
          display: isWebcamActive ? "block" : "none",
          width: "640px",
          height: "100vh",
          margin: "0 auto",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
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
        ></video>
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
        ></canvas>

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

        {/* Style Selector */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {sunglasses.map((glass, index) => (
            <button
              key={index}
              onClick={() => setSelectedGlass(glass)}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundImage: `url(${glass.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border:
                  selectedGlass.name === glass.name
                    ? "3px solid #e63946"
                    : "1px solid #ccc",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {selectedGlass.name === glass.name && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    color: "#333",
                  }}
                >
                  {glass.name}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
