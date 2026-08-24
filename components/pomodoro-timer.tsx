'use client';

import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, Settings, X } from 'lucide-react';

type PomodoroMode = '25/5' | '50/10';
type TimerState = 'idle' | 'work' | 'break';

export function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [mode, setMode] = useState<PomodoroMode>('25/5');
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // секунды
  const [isRunning, setIsRunning] = useState(false);
  const [brownNoiseEnabled, setBrownNoiseEnabled] = useState(false);
  const [brownNoiseVolume, setBrownNoiseVolume] = useState(0.5);

  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wasDragged, setWasDragged] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const brownNoiseRef = useRef<{
    context: AudioContext | null;
    source: AudioBufferSourceNode | null;
    gainNode: GainNode | null;
  }>({ context: null, source: null, gainNode: null });

  // Initialize position after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({ x: window.innerWidth - 100, y: 20 });
    }
  }, []);

  // Listen for openPomodoroTimer event from Header
  useEffect(() => {
    const handleOpenPomodoro = () => {
      setIsMinimized(false);
    };

    window.addEventListener('openPomodoroTimer', handleOpenPomodoro);
    return () => window.removeEventListener('openPomodoroTimer', handleOpenPomodoro);
  }, []);

  // Initialize brown noise generator with Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();

      // Create brown noise buffer
      const bufferSize = 2 * audioContext.sampleRate;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Boost volume
      }

      // Create gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = brownNoiseVolume;
      gainNode.connect(audioContext.destination);

      brownNoiseRef.current = { context: audioContext, source: null, gainNode };
    }

    return () => {
      if (brownNoiseRef.current.context) {
        brownNoiseRef.current.context.close();
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (brownNoiseRef.current.gainNode) {
      brownNoiseRef.current.gainNode.gain.value = brownNoiseVolume;
    }
  }, [brownNoiseVolume]);

  // Brown noise control
  useEffect(() => {
    const { context, gainNode } = brownNoiseRef.current;

    if (context && gainNode) {
      if (brownNoiseEnabled) {
        // Create and start brown noise source
        const bufferSize = 2 * context.sampleRate;
        const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const source = context.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        source.connect(gainNode);
        source.start(0);

        brownNoiseRef.current.source = source;
      } else {
        // Stop brown noise
        if (brownNoiseRef.current.source) {
          brownNoiseRef.current.source.stop();
          brownNoiseRef.current.source = null;
        }
      }
    }

    return () => {
      if (brownNoiseRef.current.source) {
        try {
          brownNoiseRef.current.source.stop();
        } catch (e) {
          // Already stopped
        }
      }
    };
  }, [brownNoiseEnabled]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer finished - switch state
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);

    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.error('Notification sound error:', e));

    // Switch between work and break
    if (timerState === 'work') {
      const breakTime = mode === '25/5' ? 5 * 60 : 10 * 60;
      setTimeLeft(breakTime);
      setTimerState('break');
      alert('🎉 Время отдыха! Сделай перерыв.');
    } else {
      const workTime = mode === '25/5' ? 25 * 60 : 50 * 60;
      setTimeLeft(workTime);
      setTimerState('work');
      alert('💪 Перерыв закончен! Время работать.');
    }
  };

  const startTimer = () => {
    if (timerState === 'idle') {
      setTimerState('work');
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerState('idle');
    const workTime = mode === '25/5' ? 25 * 60 : 50 * 60;
    setTimeLeft(workTime);
  };

  const changeMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimerState('idle');
    const workTime = newMode === '25/5' ? 25 * 60 : 50 * 60;
    setTimeLeft(workTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = timerState === 'work'
      ? (mode === '25/5' ? 25 * 60 : 50 * 60)
      : (mode === '25/5' ? 5 * 60 : 10 * 60);
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // Dragging handlers - поддержка touch для мобилы
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.draggable-handle')) {
      setIsDragging(true);
      setWasDragged(false);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        setWasDragged(true);
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, dragOffset]);

  // Minimized circular button - скрываем на мобиле
  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          top: `${position.y}px`,
          left: `${position.x}px`,
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onPointerDown={handlePointerDown}
        className="draggable-handle hidden md:block"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!wasDragged) {
              setIsMinimized(false);
            }
          }}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
            timerState === 'work' && isRunning
              ? 'bg-red-500 animate-pulse'
              : timerState === 'break' && isRunning
              ? 'bg-green-500 animate-pulse'
              : 'bg-purple-600'
          }`}
        >
          <Timer className="w-5 h-5 text-white" />
          {isRunning && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
              {Math.floor(timeLeft / 60)}
            </div>
          )}
        </button>
      </div>
    );
  }

  // Expanded panel - десктоп (плавающий) или мобиль (центр экрана с оверлеем)
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
        onClick={() => setIsMinimized(true)}
      />

      {/* Timer Panel */}
      <div
        style={{
          position: 'fixed',
          top: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : `${position.y}px`,
          left: typeof window !== 'undefined' && window.innerWidth < 768 ? '50%' : `${position.x}px`,
          transform: typeof window !== 'undefined' && window.innerWidth < 768 ? 'translate(-50%, -50%)' : 'none',
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        className="w-80 sm:w-64 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border-2 border-purple-600 dark:border-purple-500"
      >
      {/* Header */}
      <div
        className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-grab active:cursor-grabbing md:cursor-grab"
        onPointerDown={handlePointerDown}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="p-1 hover:bg-purple-100 rounded transition-colors"
            title="Свернуть таймер"
          >
            <Timer className="w-5 h-5 text-purple-600" />
          </button>
          <h3 className="font-bold text-gray-900">Pomodoro Timer</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Mode Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => changeMode('25/5')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === '25/5'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            25 / 5 мин
          </button>
          <button
            onClick={() => changeMode('50/10')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === '50/10'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            50 / 10 мин
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative">
          <div className="text-center py-6">
            <div className="text-sm text-gray-600 mb-2">
              {timerState === 'idle' ? 'Готов к старту' :
               timerState === 'work' ? '💼 Работа' : '☕ Перерыв'}
            </div>
            <div className="text-5xl font-bold text-gray-900">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress Circle */}
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={timerState === 'work' ? '#ef4444' : '#10b981'}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Play className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
            >
              <Pause className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={resetTimer}
            className="p-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Brown Noise */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Brown Noise</span>
            <button
              onClick={() => setBrownNoiseEnabled(!brownNoiseEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                brownNoiseEnabled
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {brownNoiseEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {brownNoiseEnabled && (
            <div className="flex items-center gap-2">
              <VolumeX className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                min="0"
                max="100"
                value={brownNoiseVolume * 100}
                onChange={(e) => setBrownNoiseVolume(Number(e.target.value) / 100)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Volume2 className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
