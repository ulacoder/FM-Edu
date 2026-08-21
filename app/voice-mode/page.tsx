'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Volume2, Loader2, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'navi';
  content: string;
  timestamp: Date;
}

export default function VoiceModePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role !== 'student') {
        router.push('/dashboard/teacher');
        return;
      }
      setUser(userData);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceInput(audioBlob);

        // Останавливаем стрим
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Не удалось получить доступ к микрофону. Проверь разрешения.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Добавляем временное сообщение пользователя
      const userMessage: Message = {
        role: 'user',
        content: '[Голосовое сообщение]',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Отправляем аудио на сервер
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('history', JSON.stringify(messages));
      formData.append('studentId', user?.id || '');

      const response = await fetch('/api/voice/chat', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process voice input');
      }

      const data = await response.json();

      // Добавляем ответ AI
      const naviMessage: Message = {
        role: 'navi',
        content: data.text,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, naviMessage]);

      // Озвучиваем ответ
      await speakText(data.text);

    } catch (error) {
      console.error('Voice processing error:', error);

      const errorMessage: Message = {
        role: 'navi',
        content: 'Извини, не удалось обработать голосовое сообщение. Попробуй еще раз.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string) => {
    setIsSpeaking(true);

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
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/student">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Голосовой режим</h1>
              <p className="text-sm text-gray-600">Говори с Navi в реальном времени</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Volume2 className="w-4 h-4 animate-pulse" />
                Navi говорит...
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                Обрабатываю...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                <Mic className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Привет, {user.name}! 👋
              </h2>
              <p className="text-gray-600 mb-6">
                Нажми на микрофон и начни разговор с Navi
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">💬 Спроси о предметах</h3>
                  <p className="text-sm text-gray-600">"Объясни квадратные уравнения"</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">🎯 Получи помощь</h3>
                  <p className="text-sm text-gray-600">"Как подготовиться к олимпиаде?"</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">📚 Узнай о платформе</h3>
                  <p className="text-sm text-gray-600">"Какие темы есть по физике?"</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">🎮 Поиграй</h3>
                  <p className="text-sm text-gray-600">"Какие игры посоветуешь?"</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl px-6 py-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                  {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Recording Controls */}
      <div className="bg-white border-t border-gray-200 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing || isSpeaking}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : isProcessing || isSpeaking
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 hover:scale-110'
            } disabled:opacity-50 shadow-lg`}
          >
            {isRecording ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isRecording
            ? 'Нажми чтобы остановить запись'
            : isProcessing
            ? 'Обрабатываю твое сообщение...'
            : isSpeaking
            ? 'Navi отвечает...'
            : 'Нажми чтобы начать говорить'}
        </p>
      </div>
    </div>
  );
}
