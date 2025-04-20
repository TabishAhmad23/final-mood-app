import React from 'react';
import { Music, Image, Target } from 'lucide-react';
import FaceDetection from '@/components/FaceDetection';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Mood Music App</h1>
        <p className="text-xl text-gray-300">Let your emotions guide your music journey</p>
      </div>

      <FaceDetection />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
        <div className="bg-[#1A1A1A] p-6 rounded-lg text-center transition-all hover:bg-[#222222] hover:scale-105">
          <Image className="mx-auto mb-4 text-green-500" size={48} />
          <h2 className="text-xl font-semibold mb-2">Image Upload</h2>
          <p className="text-gray-400">Upload a photo to analyze your mood and get personalized song recommendations</p>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-lg text-center transition-all hover:bg-[#222222] hover:scale-105">
          <Target className="mx-auto mb-4 text-green-500" size={48} />
          <h2 className="text-xl font-semibold mb-2">Real-time Emotion Detection</h2>
          <p className="text-gray-400">Use your webcam to capture your current mood and get song suggestions that match</p>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-lg text-center transition-all hover:bg-[#222222] hover:scale-105">
          <Music className="mx-auto mb-4 text-green-500" size={48} />
          <h2 className="text-xl font-semibold mb-2">Text Based Recommendations</h2>
          <p className="text-gray-400">Describe how you're feeling and we'll find the perfect soundtrack for your mood</p>
        </div>
      </div>

      <footer className="mt-12 text-gray-500">
        © 2025 Moodify. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
