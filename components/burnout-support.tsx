"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Gamepad2, Sparkles } from "lucide-react";
import { detectBurnout, getBurnoutMessage, shouldShowBurnoutSupport, markBurnoutSupportShown } from "@/lib/burnout-detection";

export function BurnoutSupportWidget() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [burnoutLevel, setBurnoutLevel] = useState<'none' | 'low' | 'medium' | 'high'>('none');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Проверяем выгорание только если не показывали недавно
    if (shouldShowBurnoutSupport(userData.id)) {
      const burnoutData = detectBurnout(userData.id);

      if (burnoutData.isBurnedOut) {
        setMessage(getBurnoutMessage(burnoutData, userData.name));
        setBurnoutLevel(burnoutData.burnoutLevel);
        setIsVisible(true);
        markBurnoutSupportShown(userData.id);
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePlayGames = () => {
    router.push('/games');
    setIsVisible(false);
  };

  if (!isVisible || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-in fade-in duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navi Character */}
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src="/navi-character.png"
              alt="Navi"
              className="w-full h-full object-contain animate-bounce"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className={`w-6 h-6 ${
                burnoutLevel === 'high' ? 'text-red-500' :
                burnoutLevel === 'medium' ? 'text-orange-500' :
                'text-yellow-500'
              }`} />
              <h3 className="text-2xl font-bold">
                {burnoutLevel === 'high' ? '💙 Navi заботится о тебе' :
                 burnoutLevel === 'medium' ? '🌈 Привет от Navi!' :
                 '✨ Navi здесь!'}
              </h3>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-line">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Спасибо, Navi
          </button>
          <button
            onClick={handlePlayGames}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center gap-2"
          >
            <Gamepad2 className="w-5 h-5" />
            Попробовать игры
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-t-2xl" />
      </div>
    </div>
  );
}
