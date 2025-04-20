
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './ui/use-toast';

interface SongSuggestion {
  title: string;
  artist: string;
  url: string;
}

const TextEmotionInput = () => {
  const [emotion, setEmotion] = useState('');
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotion.trim()) return;

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[#1A1A1A] text-white">
      <CardHeader>
        <CardTitle>Describe Your Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="How are you feeling? (e.g., 'nostalgic but hopeful')"
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="bg-[#222222] border-gray-700"
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Getting Suggestions...' : 'Get Song Suggestions'}
          </Button>
        </form>

        {suggestions.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Suggested Songs for Your Mood</h3>
            <div className="grid gap-4">
              {suggestions.map((song, index) => (
                <a
                  key={index}
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-[#222222] rounded-lg hover:bg-[#333333] transition-colors"
                >
                  <h4 className="font-medium text-green-500">{song.title}</h4>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextEmotionInput;
