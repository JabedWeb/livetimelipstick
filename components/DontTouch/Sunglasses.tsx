"use client";

import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Image from "next/image";
import { useSunglassContext } from "@/context/SunglassContext";

export default function Sunglasses() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const sunglassesImageRef = useRef<HTMLImageElement | null>(null);

  const {
    glasses,
    selectedGlass,
    setSelectedGlass,
    isWebcamActive,
    setIsWebcamActive,
  } = useSunglassContext();

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

      const img = document.createElement("img");
img.src = selectedGlass.image;
img.onload = () => {
  sunglassesImageRef.current = img;
};

    }

    loadModel();
  }, []);

  useEffect(() => {
    const img = document.createElement("img");
img.src = selectedGlass.image;
img.onload = () => {
  sunglassesImageRef.current = img;
};

  }, [selectedGlass]);

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
          const leftEye = landmarks[33];
          const rightEye = landmarks[263];

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
    setIsWebcamActive(true);
  };

  const disableWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-center">Virtual Sunglasses Try-On</h2>

      {!isWebcamActive && (
        <button
          onClick={enableWebcam}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          Enable Webcam
        </button>
      )}

      {isWebcamActive && (
        <>
          <div className="relative w-full max-w-2xl aspect-video border rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>

          <div className="flex items-center justify-center gap-4">
            {glasses.map((glass, index) => (
              <button
                key={index}
                onClick={() => setSelectedGlass(glass)}
                className={`border-2 p-2 rounded-xl ${
                  selectedGlass.name === glass.name ? "border-black" : "border-transparent"
                } hover:scale-105 transition`}
              >
                <Image
                  src={glass.image}
                  alt={glass.name}
                  width={60}
                  height={30}
                  className="rounded"
                />
              </button>
            ))}
          </div>

          <button
            onClick={disableWebcam}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Close Webcam
          </button>
        </>
      )}
    </div>
  );
}
