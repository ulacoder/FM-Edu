import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">EduAI.kz</div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600">
            Войти
          </Link>
          <Link href="/register" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Регистрация
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Персонализированное образование с искусственным интеллектом
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Качественное образование для школьников Казахстана независимо от региона.
            AI-платформа адаптируется под ваш уровень и помогает достигать целей.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700">
              Начать обучение
            </Link>
            <Link href="/diagnostic" className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg rounded-lg hover:bg-blue-50">
              Пройти диагностику
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Персонализация</h3>
            <p className="text-gray-600">
              AI анализирует ваш уровень и создаёт индивидуальный план обучения
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Программа МОН РК</h3>
            <p className="text-gray-600">
              Все материалы соответствуют школьной программе Казахстана
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI-поддержка</h3>
            <p className="text-gray-600">
              Мгновенная обратная связь и помощь по любым вопросам
            </p>
          </div>
        </div>

        {/* Subjects */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Доступные предметы</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {['Математика', 'Физика', 'Информатика', 'Химия', 'Биология', 'Экономика', 'Английский'].map((subject) => (
              <div key={subject} className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-lg font-semibold">{subject}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 bg-blue-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы начать персонализированное обучение?
          </h2>
          <p className="text-xl mb-8">
            Присоединяйтесь к тысячам учеников по всему Казахстану
          </p>
          <Link href="/register" className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100">
            Создать аккаунт
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-24 border-t text-center text-gray-600">
        <p>© 2026 EduAI.kz — Образовательная AI-платформа для школьников Казахстана</p>
      </footer>
    </div>
  );
}
