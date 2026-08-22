'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Region, regionNames, RegionalChatMessage } from '@/types';
import {
  MessageCircle,
  Send,
  GraduationCap,
  MapPin,
  Users
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { getTranslation, type Locale } from '@/lib/i18n';

export default function RegionalChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<RegionalChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [locale, setLocale] = useState<Locale>('ru');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

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

      if (!userData.region) {
        alert('Пожалуйста, сначала выберите свой регион в профиле');
        router.push('/profile');
        return;
      }

      setUser(userData);
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/login');
    }

    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && ['ru', 'kk', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    setLoading(false);

    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener);
  }, [router]);

  useEffect(() => {
    if (user && user.region) {
      loadMessages();
      // Обновляем сообщения каждые 5 секунд
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user?.region) return;

    try {
      const response = await fetch(`/api/chat/regional?region=${user.region}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !user?.region) return;

    setSending(true);
    try {
      const response = await fetch('/api/chat/regional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: user.region,
          studentId: user.id,
          studentName: user.name,
          message: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        await loadMessages();
      } else {
        alert('Ошибка при отправке сообщения');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка при отправке сообщения');
    }
    setSending(false);
  };

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;

    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm z-50 bg-background/80 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-base sm:text-lg font-bold">
                FM Edu
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link href="/dashboard/student">
                <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                  Дашборд
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-muted/20 flex flex-col overflow-hidden">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border/40 bg-background/80 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  Региональный чат
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{regionNames[user.region as Region]}</span>
                  <span>•</span>
                  <Users className="w-4 h-4" />
                  <span>Студенты региона</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-semibold mb-2">Пока нет сообщений</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Будь первым! Познакомься с другими студентами из {regionNames[user.region as Region]}
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.studentId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] sm:max-w-md rounded-lg px-4 py-3 ${
                      msg.studentId === user.id
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border/60'
                    }`}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {msg.studentId === user.id ? 'Ты' : msg.studentName}
                      </span>
                      <span
                        className={`text-xs ${
                          msg.studentId === user.id
                            ? 'text-white/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-t border-border/40 bg-background/80 flex-shrink-0">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Напиши сообщение..."
                className="flex-1 px-4 py-2.5 bg-card border border-border/60 rounded-lg focus:outline-none focus:border-primary/60 transition-colors text-sm"
                maxLength={500}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Отправить</span>
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Будь дружелюбным и уважительным к другим студентам
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
