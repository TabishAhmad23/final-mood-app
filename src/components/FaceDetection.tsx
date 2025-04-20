
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera } from 'lucide-react';
import { Button } from './ui/button';

const FaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    loadModels();
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const handleDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsDetecting(true);

    const detectFaces = async () => {
      if (!isDetecting) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const canvas = canvasRef.current;
      const displaySize = { 
        width: videoRef.current!.videoWidth, 
        height: videoRef.current!.videoHeight 
      };
      faceapi.matchDimensions(canvas, displaySize);

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      
      if (resizedDetections.length > 0) {
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }

      if (isDetecting) {
        requestAnimationFrame(detectFaces);
      }
    };

    detectFaces();
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {isLoading ? (
        <div className="text-center py-8">Loading face detection models...</div>
      ) : (
        <>
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              autoPlay
              playsInline
              onPlay={handleDetection}
            />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          </div>
          <div className="mt-4 flex justify-center gap-4">
            {!isDetecting ? (
              <Button onClick={startVideo} className="gap-2">
                <Camera className="size-4" />
                Start Camera
              </Button>
            ) : (
              <Button onClick={stopDetection} variant="destructive" className="gap-2">
                Stop Detection
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FaceDetection;
