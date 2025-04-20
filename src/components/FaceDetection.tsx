
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Camera } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './ui/use-toast';

interface SongSuggestion {
  title: string;
  artist: string;
  url: string;
}

const FaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);

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

  const getSongSuggestions = async (emotion: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-songs-from-emotion', {
        body: { emotion },
      });

      if (error) throw error;
      
      setSuggestions(data.suggested_songs);
      toast({
        title: "Songs Found!",
        description: "Here are some songs that match your mood.",
      });
    } catch (error) {
      console.error('Error getting song suggestions:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get song suggestions. Please try again.",
      });
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

        // Get the dominant emotion
        const expressions = resizedDetections[0].expressions;
        const dominantEmotion = Object.entries(expressions).reduce((a, b) => 
          a[1] > b[1] ? a : b
        )[0];

        // Get song suggestions based on the emotion
        await getSongSuggestions(dominantEmotion);
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
        <div className="space-y-6">
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

          {suggestions.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold text-center">Suggested Songs for Your Mood</h2>
              <div className="grid gap-4">
                {suggestions.map((song, index) => (
                  <a
                    key={index}
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-[#1A1A1A] rounded-lg hover:bg-[#222222] transition-colors"
                  >
                    <h3 className="font-medium text-green-500">{song.title}</h3>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceDetection;
