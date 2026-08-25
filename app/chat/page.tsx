'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Award, X, Check, MessageCircle } from 'lucide-react';
import type { Region, RegionalChatMessage, BountyQuestion, BountyThreadMessage, Student } from '@/types';
import { regionNames } from '@/types';

export default function RegionalChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<Student | null>(null);
  const [messages, setMessages] = useState<RegionalChatMessage[]>([]);
  const [bountyQuestions, setBountyQuestions] = useState<BountyQuestion[]>([]);
  const [messageText, setMessageText] = useState('');
  const [showBountySelector, setShowBountySelector] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState<100 | 200 | 300 | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<BountyThreadMessage[]>([]);
  const [threadMessageText, setThreadMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr) as Student;
      if (userData.role !== 'student') {
        router.push('/dashboard/teacher');
        return;
      }
      setUser(userData);
      loadChatData(userData.region || 'astana');
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const loadChatData = async (region: Region) => {
    // Load regular messages
    const messagesRes = await fetch(`/api/chat/messages?region=${region}`);
    if (messagesRes.ok) {
      const data = await messagesRes.json();
      setMessages(data.messages || []);
    }

    // Load bounty questions
    const bountyRes = await fetch(`/api/chat/bounty-questions?region=${region}`);
    if (bountyRes.ok) {
      const data = await bountyRes.json();
      setBountyQuestions(data.questions || []);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, bountyQuestions]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user) return;

    const newMessage: RegionalChatMessage = {
      id: Date.now().toString(),
      region: user.region || 'astana',
      studentId: user.id,
      studentName: user.name,
      message: messageText,
      timestamp: new Date(),
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');

    // Send to server
    await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage),
    });
  };

  const handleSendBountyQuestion = async () => {
    if (!messageText.trim() || !selectedBounty || !user) return;

    // Check balance
    const balance = user.totalPoints || 0;
    if (balance < selectedBounty) {
      alert(`Недостаточно баллов! У вас ${balance} Б, а нужно ${selectedBounty} Б`);
      return;
    }

    const newQuestion: BountyQuestion = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      region: user.region || 'astana',
      questionText: messageText,
      bountyAmount: selectedBounty,
      status: 'open',
      createdAt: new Date(),
    };

    // Optimistic update
    setBountyQuestions(prev => [...prev, newQuestion]);
    setMessageText('');
    setShowBountySelector(false);
    setSelectedBounty(null);

    // Send to server
    await fetch('/api/chat/bounty-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion),
    });
  };

  const handleAcceptBountyQuestion = async (questionId: string) => {
    if (!user) return;

    const question = bountyQuestions.find(q => q.id === questionId);
    if (!question) return;

    // Prevent author from accepting own question
    if (question.authorId === user.id) {
      alert('Вы не можете взяться за свой собственный вопрос!');
      return;
    }

    // Race condition protection: check if already taken
    const checkRes = await fetch(`/api/chat/bounty-questions/${questionId}`);
    if (checkRes.ok) {
      const data = await checkRes.json();
      if (data.question.status !== 'open') {
        alert('Этот вопрос уже взял другой ученик!');
        loadChatData(user.region || 'astana'); // Refresh
        return;
      }
    }

    // Accept question
    const res = await fetch(`/api/chat/bounty-questions/${questionId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ helperId: user.id, helperName: user.name }),
    });

    if (res.ok) {
      const data = await res.json();
      // Update local state
      setBountyQuestions(prev =>
        prev.map(q => (q.id === questionId ? data.question : q))
      );
      // Open thread
      setSelectedThread(questionId);
    } else {
      const error = await res.json();
      alert(error.error || 'Ошибка при принятии вопроса');
      loadChatData(user.region || 'astana'); // Refresh
    }
  };

  const handleResolveBountyQuestion = async (questionId: string) => {
    if (!user) return;

    const question = bountyQuestions.find(q => q.id === questionId);
    if (!question || question.authorId !== user.id) {
      alert('Только автор вопроса может подтвердить решение!');
      return;
    }

    if (!confirm(`Подтвердить решение и перевести ${question.bountyAmount} Б помогающему?`)) {
      return;
    }

    const res = await fetch(`/api/chat/bounty-questions/${questionId}/resolve`, {
      method: 'POST',
    });

    if (res.ok) {
      const data = await res.json();
      setBountyQuestions(prev =>
        prev.map(q => (q.id === questionId ? data.question : q))
      );
      alert(`${question.bountyAmount} Б переведены ${question.helperName}!`);
      setSelectedThread(null);
    } else {
      alert('Ошибка при подтверждении решения');
    }
  };

  const handleCancelBountyQuestion = async (questionId: string) => {
    if (!user) return;

    const question = bountyQuestions.find(q => q.id === questionId);
    if (!question) return;

    // Only author or helper can cancel
    if (question.authorId !== user.id && question.helperId !== user.id) {
      return;
    }

    if (!confirm('Отменить вопрос? Баллы вернутся автору.')) {
      return;
    }

    const res = await fetch(`/api/chat/bounty-questions/${questionId}/cancel`, {
      method: 'POST',
    });

    if (res.ok) {
      const data = await res.json();
      setBountyQuestions(prev =>
        prev.map(q => (q.id === questionId ? data.question : q))
      );
      setSelectedThread(null);
    }
  };

  const handleSendThreadMessage = async () => {
    if (!threadMessageText.trim() || !selectedThread || !user) return;

    const newMessage: BountyThreadMessage = {
      id: Date.now().toString(),
      bountyQuestionId: selectedThread,
      senderId: user.id,
      senderName: user.name,
      message: threadMessageText,
      timestamp: new Date(),
    };

    // Optimistic update
    setThreadMessages(prev => [...prev, newMessage]);
    setThreadMessageText('');

    // Send to server
    await fetch(`/api/chat/bounty-questions/${selectedThread}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage),
    });
  };

  const openThread = async (questionId: string) => {
    setSelectedThread(questionId);
    // Load thread messages
    const res = await fetch(`/api/chat/bounty-questions/${questionId}/messages`);
    if (res.ok) {
      const data = await res.json();
      setThreadMessages(data.messages || []);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  const currentQuestion = selectedThread
    ? bountyQuestions.find(q => q.id === selectedThread)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
          <h1 className="text-2xl font-bold">
            Региональный чат — {regionNames[user.region || 'astana']}
          </h1>
          <p className="text-sm text-muted-foreground">
            Общайтесь с учениками из вашего региона, помогайте друг другу и зарабатывайте баллы!
          </p>
          <div className="mt-2 text-sm">
            Ваш баланс: <span className="font-bold text-primary">{user.totalPoints || 0} Б</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Chat */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Regular messages */}
                {messages.map(msg => (
                  <div key={msg.id} className="bg-muted rounded-lg p-3">
                    <div className="font-semibold text-sm">{msg.studentName}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="mt-1">{msg.message}</div>
                  </div>
                ))}

                {/* Bounty questions */}
                {bountyQuestions.map(question => (
                  <div
                    key={question.id}
                    className={`border-2 rounded-lg p-4 ${
                      question.status === 'open'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                        : question.status === 'in_progress'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-green-500 bg-green-50 dark:bg-green-950/20'
                    }`}
                  >
                    {/* Question header */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold">{question.authorName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(question.createdAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1 rounded-full font-bold">
                        <Award className="w-4 h-4" />
                        {question.bountyAmount} Б
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="mb-3 text-foreground">{question.questionText}</div>

                    {/* Status */}
                    {question.status === 'in_progress' && (
                      <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                        ⏳ В процессе решения • Помогает: {question.helperName}
                      </div>
                    )}
                    {question.status === 'resolved' && (
                      <div className="text-sm text-green-600 dark:text-green-400 mb-2">
                        ✅ Решено • {question.bountyAmount} Б переведены {question.helperName}
                      </div>
                    )}
                    {question.status === 'cancelled' && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        ❌ Отменено
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {question.status === 'open' && question.authorId !== user.id && (
                        <button
                          onClick={() => handleAcceptBountyQuestion(question.id)}
                          className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                          Помочь / Объяснить
                        </button>
                      )}

                      {question.status === 'in_progress' &&
                        (question.authorId === user.id || question.helperId === user.id) && (
                          <>
                            <button
                              onClick={() => openThread(question.id)}
                              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Открыть диалог
                            </button>

                            {question.authorId === user.id && (
                              <button
                                onClick={() => handleResolveBountyQuestion(question.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Понятно
                              </button>
                            )}

                            <button
                              onClick={() => handleCancelBountyQuestion(question.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Отменить
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-border p-4">
                {showBountySelector ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Выберите награду:</div>
                      <button
                        onClick={() => {
                          setShowBountySelector(false);
                          setSelectedBounty(null);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {[100, 200, 300].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setSelectedBounty(amount as 100 | 200 | 300)}
                          className={`flex-1 px-4 py-3 rounded-lg font-bold transition-colors ${
                            selectedBounty === amount
                              ? 'bg-yellow-500 text-white'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                          }`}
                        >
                          {amount} Б
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      placeholder="Опишите ваш вопрос подробно..."
                      className="w-full px-4 py-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary outline-none bg-background"
                      rows={3}
                    />
                    <button
                      onClick={handleSendBountyQuestion}
                      disabled={!messageText.trim() || !selectedBounty}
                      className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      <Award className="w-5 h-5" />
                      Опубликовать вопрос за {selectedBounty || 0} Б
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBountySelector(true)}
                      className="bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition-colors"
                      title="Задать вопрос с наградой"
                    >
                      <Award className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Написать сообщение..."
                      className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-background"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thread / Sidebar */}
          <div className="lg:col-span-1">
            {selectedThread && currentQuestion ? (
              <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-[600px]">
                {/* Thread header */}
                <div className="border-b border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold">Приватный диалог</div>
                    <button
                      onClick={() => setSelectedThread(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Вопрос от {currentQuestion.authorName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Награда: {currentQuestion.bountyAmount} Б
                  </div>
                </div>

                {/* Thread messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {threadMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`rounded-lg p-3 ${
                        msg.senderId === user.id
                          ? 'bg-primary text-primary-foreground ml-8'
                          : 'bg-muted mr-8'
                      }`}
                    >
                      <div className="font-semibold text-xs">{msg.senderName}</div>
                      <div className="text-sm mt-1">{msg.message}</div>
                    </div>
                  ))}
                </div>

                {/* Thread input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={threadMessageText}
                      onChange={e => setThreadMessageText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendThreadMessage()}
                      placeholder="Написать..."
                      className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none bg-background"
                    />
                    <button
                      onClick={handleSendThreadMessage}
                      disabled={!threadMessageText.trim()}
                      className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6 h-[600px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <div>Выберите вопрос с наградой</div>
                  <div className="text-sm">чтобы открыть приватный диалог</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
