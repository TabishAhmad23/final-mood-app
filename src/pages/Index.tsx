
import React, { useState } from 'react';
import { Music, Image, Target } from 'lucide-react';
import FaceDetection from '@/components/FaceDetection';
import TextEmotionInput from '@/components/TextEmotionInput';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Add this import

const Index = () => {
  const [activeComponent, setActiveComponent] = useState<'camera' | 'text' | null>(null);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Mood Music App</h1>
        <p className="text-xl text-gray-300">Let your emotions guide your music journey</p>
      </div>

      {!activeComponent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
          <Card 
            className="bg-[#1A1A1A] p-6 rounded-lg text-center transition-all hover:bg-[#222222] hover:scale-105 cursor-pointer"
            onClick={() => setActiveComponent('camera')}
          >
            <Target className="mx-auto mb-4 text-green-500" size={48} />
            <h2 className="text-xl font-semibold mb-2">Real-time Emotion Detection</h2>
            <p className="text-gray-400">Use your webcam to capture your current mood and get song suggestions that match</p>
          </Card>

          <Card 
            className="bg-[#1A1A1A] p-6 rounded-lg text-center transition-all hover:bg-[#222222] hover:scale-105 cursor-pointer"
            onClick={() => setActiveComponent('text')}
          >
            <Music className="mx-auto mb-4 text-green-500" size={48} />
            <h2 className="text-xl font-semibold mb-2">Text Based Recommendations</h2>
            <p className="text-gray-400">Describe how you're feeling and we'll find the perfect soundtrack for your mood</p>
          </Card>
        </div>
      ) : (
        <div className="w-full max-w-4xl mt-12">
          {activeComponent === 'camera' ? (
            <div className="space-y-4">
              <Button 
                onClick={() => setActiveComponent(null)} 
                variant="outline" 
                className="mb-4"
              >
                Back to Menu
              </Button>
              <FaceDetection />
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                onClick={() => setActiveComponent(null)} 
                variant="outline" 
                className="mb-4"
              >
                Back to Menu
              </Button>
              <TextEmotionInput />
            </div>
          )}
        </div>
      )}

      <footer className="mt-12 text-gray-500">
        © 2025 Moodify. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
