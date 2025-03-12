"use client";
import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export default function FaceLandmarkerComponent({ realshade, isWebcamActive }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameId = useRef<number | null>(null); // To manage animation frame
  const lipColorRef = useRef(realshade); // Default lipstick color

  // Load FaceLandmarker model once on mount
  useEffect(() => {
    lipColorRef.current = realshade;
    console.log("Updated lipColorRef with realshade:", lipColorRef.current);
  }, [realshade]);

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

    // Cleanup on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Process video and draw lip color
  const processVideo = () => {
    if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size based on video size to maintain proper scaling
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const drawFrame = () => {
      if (!faceLandmarkerRef.current || !videoRef.current) return;

      const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
        const drawingUtils = new DrawingUtils(ctx);
        for (const landmarks of results.faceLandmarks) {
          const outerLipPoints = [
            61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61,
            185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
          ].map((index) => ({
            x: landmarks[index].x * videoWidth, // Scaling by video width
            y: landmarks[index].y * videoHeight, // Scaling by video height
          }));

          const innerLipPoints = [
            78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78,
            191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
          ].map((index) => ({
            x: landmarks[index].x * videoWidth, // Scaling by video width
            y: landmarks[index].y * videoHeight, // Scaling by video height
          }));

          ctx.beginPath();
          ctx.moveTo(outerLipPoints[0].x, outerLipPoints[0].y);
          outerLipPoints.forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.closePath();

          ctx.moveTo(innerLipPoints[0].x, innerLipPoints[0].y);
          innerLipPoints.forEach((point) => ctx.lineTo(point.x, point.y));
          ctx.closePath();

          ctx.fillStyle = lipColorRef.current; // Use prop directly instead of ref
          ctx.fill("evenodd");

          // Draw lip landmarks for debugging
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

  // Handle webcam start/stop
  useEffect(() => {
    if (isWebcamActive) {
      const enableWebcam = async () => {
        if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => processVideo();
        } catch (error) {
          console.error("Error accessing webcam:", error);
        }
      };
      enableWebcam();
    } else {
      // Cleanup when webcam is turned off
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isWebcamActive]);

  return (
    <div style={{ 
      position: "fixed", 
      top: "50%", 
      left: "50%", 
      transform: "translate(-50%, -50%)", 
      zIndex: isWebcamActive ? 10 : -1 
    }}>
      <div
        style={{
          position: "relative",
          display: isWebcamActive ? "block" : "none",
          width: "640px",  
          height: "100vh", 
          margin: "0 auto", 
        }}
      >
          <video
          ref={videoRef}
          autoPlay
          playsInline 
          style={{ position: "absolute", top: 50, left: 0 }}
        ></video>
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", top: 50, left: 0 }}
        ></canvas>
      </div>
    </div>
  );
}





























// "use client";
// import { useEffect, useRef } from "react";
// import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

// export default function FaceLandmarkerComponent({ realshade, isWebcamActive }) {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
//   const animationFrameId = useRef<number | null>(null); // To manage animation frame
//   const lipColorRef = useRef("realshade"); // Default lipstick color

//   // Load FaceLandmarker model once on mount
// useEffect(() => {
//     lipColorRef.current = realshade;
//     console.log("Updated lipColorRef with realshade:", lipColorRef.current);
//   }, [realshade]);

//   useEffect(() => {
//     async function loadModel() {
//       const filesetResolver = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
//       );
//       const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//         baseOptions: {
//           modelAssetPath:
//             "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//           delegate: "GPU",
//         },
//         outputFaceBlendshapes: true,
//         runningMode: "VIDEO",
//         numFaces: 1,
//       });
//       faceLandmarkerRef.current = landmarker;
//     }
//     loadModel();

//     // Cleanup on unmount
//     return () => {
//       if (animationFrameId.current) {
//         cancelAnimationFrame(animationFrameId.current);
//       }
//       if (videoRef.current && videoRef.current.srcObject) {
//         const stream = videoRef.current.srcObject as MediaStream;
//         stream.getTracks().forEach((track) => track.stop());
//         videoRef.current.srcObject = null;
//       }
//     };
//   }, []);

//   // Process video and draw lip color
//   const processVideo = () => {
//     if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     if (!ctx) return;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const drawFrame = () => {
//       if (!faceLandmarkerRef.current || !videoRef.current) return;

//       const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       if (results.faceLandmarks) {
//         const drawingUtils = new DrawingUtils(ctx);
//         for (const landmarks of results.faceLandmarks) {
//           const outerLipPoints = [
//             61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61,
//             185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
//           ].map((index) => ({
//             x: landmarks[index].x * canvas.width,
//             y: landmarks[index].y * canvas.height,
//           }));

//           const innerLipPoints = [
//             78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 78,
//             191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
//           ].map((index) => ({
//             x: landmarks[index].x * canvas.width,
//             y: landmarks[index].y * canvas.height,
//           }));

//           ctx.beginPath();
//           ctx.moveTo(outerLipPoints[0].x, outerLipPoints[0].y);
//           outerLipPoints.forEach((point) => ctx.lineTo(point.x, point.y));
//           ctx.closePath();

//           ctx.moveTo(innerLipPoints[0].x, innerLipPoints[0].y);
//           innerLipPoints.forEach((point) => ctx.lineTo(point.x, point.y));
//           ctx.closePath();

//           ctx.fillStyle = lipColorRef.current; // Use prop directly instead of ref
//           ctx.fill("evenodd");

//           drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, {
//             color: "black",
//             lineWidth: 1,
//           });
//         }
//       }

//       animationFrameId.current = requestAnimationFrame(drawFrame);
//     };

//     drawFrame();
//   };

//   // Handle webcam start/stop
//   useEffect(() => {
//     if (isWebcamActive) {
//       const enableWebcam = async () => {
//         if (!faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;

//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//           videoRef.current.srcObject = stream;
//           videoRef.current.onloadeddata = () => processVideo();
//         } catch (error) {
//           console.error("Error accessing webcam:", error);
//         }
//       };
//       enableWebcam();
//     } else {
//       // Cleanup when webcam is turned off
//       if (animationFrameId.current) {
//         cancelAnimationFrame(animationFrameId.current);
//       }
//       if (videoRef.current && videoRef.current.srcObject) {
//         const stream = videoRef.current.srcObject as MediaStream;
//         stream.getTracks().forEach((track) => track.stop());
//         videoRef.current.srcObject = null;
//       }
//     }
//   }, [isWebcamActive]);

//   return (
//     <div style={{ position: "relative", zIndex: isWebcamActive ? 10 : -1 }}>
//       <div style={{ position: "relative", display: isWebcamActive ? "block" : "none" }}>
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline 
//           className="mx-sm:w-96 mx-sm:h-96"
//           style={{ position: "absolute", top: 50, left: 0 }}
//         ></video>
//         <canvas
//           ref={canvasRef}
//           className="max-sm:h-[270px]"
//           style={{ position: "absolute", top: 50, left: 0 }}
//         ></canvas>
//       </div>
//     </div>
//   );
// }














