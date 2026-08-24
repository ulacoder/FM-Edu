"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Minimize2, Maximize2, Sparkles, Loader2, Mic, MicOff, Volume2, Edit2 } from "lucide-react";

interface Message {
  role: "user" | "navi";
  content: string;
  timestamp: Date;
}

export function NaviMentor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice mode states (как в Isida AI)
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Add greeting message on first load
  useEffect(() => {
    if (!hasInitialized && messages.length === 0) {
      const greeting = "Привет! 👋 Я Navi — твой персональный AI-ментор. Задавай любые вопросы о платформе, учебе или NIS программе!";
      setMessages([{
        role: "navi",
        content: greeting,
        timestamp: new Date()
      }]);
      setHasInitialized(true);
    }
  }, [hasInitialized, messages]);

  // Initialize Speech Recognition (как в Isida AI)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setTranscribedText(transcript);
          setInputValue(transcript);
          setIsEditing(true);
          setIsTranscribing(false);
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsTranscribing(false);
          setIsRecording(false);
          alert('Ошибка распознавания речи. Попробуй еще раз.');
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (!transcribedText && !isEditing) {
            setIsTranscribing(false);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [transcribedText, isEditing]);

  // Listen for openNavi event from Sidebar
  useEffect(() => {
    const handleOpenNavi = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };

    window.addEventListener('openNavi', handleOpenNavi);
    return () => window.removeEventListener('openNavi', handleOpenNavi);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startVoiceRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      setIsTranscribing(true);
      setTranscribedText("");
      setIsEditing(false);
      recognitionRef.current.start();
    } else {
      alert('Распознавание речи не поддерживается в вашем браузере. Используйте Chrome или Edge.');
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const speakMessage = async (text: string) => {
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
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setTranscribedText("");
    setIsEditing(false);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      let studentId = null;

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'student') {
            studentId = user.id;
          }
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }

      const conversationHistory = messages.map(msg => ({
        role: msg.role === "navi" ? "assistant" : "user",
        content: msg.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory,
          studentId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const naviMessage: Message = {
        role: "navi",
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, naviMessage]);

      // Автоматически озвучиваем ответ если включен голосовой режим
      if (isVoiceMode) {
        await speakMessage(data.response);
      }
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage: Message = {
        role: "navi",
        content: "Упс, что-то пошло не так 😅 Попробуй спросить ещё раз!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {/* Character Image with floating animation */}
        <div className="relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="relative"
          >
            {/* Character */}
            <div className="w-20 h-20 sm:w-32 sm:h-32 animate-bounce-slow">
              <img
                src="/navi-character.png"
                alt="Navi AI Mentor"
                className="w-full h-full object-contain drop-shadow-2xl transition-transform group-hover:scale-110"
              />
            </div>

            {/* Online indicator */}
            <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>

            {/* Sparkles effect */}
            <Sparkles className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-5 h-5 sm:w-6 sm:h-6 text-purple-600 animate-pulse" />
          </button>

          {/* Tip bubble */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-500 rounded-lg p-3 shadow-xl max-w-xs">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Кликни, чтобы поговорить со мной! 💬
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-2 right-2 sm:bottom-6 sm:right-6 bg-white dark:bg-gray-900 border-2 border-purple-600 dark:border-purple-500 rounded-3xl shadow-2xl z-50 flex flex-col transition-all ${
        isMinimized
          ? "w-64 sm:w-80 h-16"
          : "w-[calc(100vw-1rem)] sm:w-96 h-[70vh] sm:h-[600px] max-h-[500px] sm:max-h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-t-3xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-8 h-8 sm:w-12 sm:h-12">
            <img
              src="/navi-character.png"
              alt="Navi"
              className="w-full h-full object-contain"
            />
            <span className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Navi</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              AI-ментор • Онлайн
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Voice Mode Toggle (как в Isida AI) */}
          <button
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              isVoiceMode ? 'bg-purple-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
            title={isVoiceMode ? 'Выключить голосовой режим' : 'Включить голосовой режим'}
          >
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 sm:p-2 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 sm:p-2 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 bg-gray-50 dark:bg-gray-950">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === "user" ? "text-purple-200" : "text-gray-500 dark:text-gray-400"}`}>
                    {msg.timestamp.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Думаю...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Transcription Box (как в Isida AI) */}
          {isEditing && transcribedText && (
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border-t border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Распознанный текст (редактируй если нужно):</p>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-2 text-sm border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-950/30 border-t border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-600 dark:text-red-400 font-medium">Запись... Говори</span>
            </div>
          )}

          {/* Transcribing Indicator */}
          {isTranscribing && !isRecording && (
            <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-950/30 border-t border-yellow-200 dark:border-yellow-800 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-spin" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Обрабатываю речь...</span>
            </div>
          )}

          {/* Input */}
          <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-3xl">
            <div className="flex gap-1 sm:gap-2">
              {/* Microphone Button (как в Isida AI) */}
              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                disabled={isLoading || isTranscribing}
                className={`p-2 sm:p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                }`}
                title={isRecording ? "Остановить запись" : "Голосовой ввод"}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Напиши сообщение..."
                className="flex-1 px-2 sm:px-4 py-2 text-base sm:text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading || isRecording}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading || isRecording}
                className="px-2 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
