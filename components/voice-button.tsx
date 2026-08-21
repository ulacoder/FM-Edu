'use client';

import { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VoiceButtonProps {
  text: string;
  className?: string;
}

export function VoiceButton({ text, className = '' }: VoiceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleSpeak = async () => {
    // Если уже играет - остановить
    if (isPlaying && audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audioElement = new Audio(audioUrl);
      setAudio(audioElement);

      audioElement.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audioElement.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audioElement.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('TTS error:', error);
      alert('Ошибка озвучивания. Проверь настройки FishAudio API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={isLoading}
      className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      title={isPlaying ? 'Остановить' : 'Озвучить'}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="w-4 h-4 text-purple-600" />
      ) : (
        <Volume2 className="w-4 h-4 text-gray-600 hover:text-purple-600" />
      )}
    </button>
  );
}
