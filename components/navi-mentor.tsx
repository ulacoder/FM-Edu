"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Minimize2, Maximize2, Sparkles, Loader2 } from "lucide-react";

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

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
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
          conversationHistory
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
      <div className="fixed bottom-6 right-6 z-50">
        {/* Character Image with floating animation */}
        <div className="relative group">
          <button
            onClick={() => setIsOpen(true)}
            className="relative"
          >
            {/* Character */}
            <div className="w-32 h-32 animate-bounce-slow">
              <img
                src="/navi-character.png"
                alt="Navi AI Mentor"
                className="w-full h-full object-contain drop-shadow-2xl transition-transform group-hover:scale-110"
              />
            </div>

            {/* Online indicator */}
            <span className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>

            {/* Sparkles effect */}
            <Sparkles className="absolute -top-2 -left-2 w-6 h-6 text-purple-600 animate-pulse" />
          </button>

          {/* Tip bubble */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-white border-2 border-purple-600 rounded-lg p-3 shadow-xl max-w-xs">
              <p className="text-sm font-medium text-gray-900">
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
      className={`fixed bottom-6 right-6 bg-white border-2 border-purple-600 rounded-lg shadow-2xl z-50 flex flex-col transition-all ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <img
              src="/navi-character.png"
              alt="Navi"
              className="w-full h-full object-contain"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Navi</h3>
            <p className="text-xs text-gray-600">
              AI-ментор • Онлайн
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-gray-100 p-1 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-gray-600" />
            ) : (
              <Minimize2 className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-gray-100 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === "user" ? "text-purple-200" : "text-gray-500"}`}>
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
                <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-600">Думаю...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                placeholder="Напиши сообщение..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Navi работает на Qwen AI 🤖
            </p>
          </div>
        </>
      )}
    </div>
  );
}
