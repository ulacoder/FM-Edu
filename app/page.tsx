import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold tracking-tight" style={{ color: '#013220' }}>
            FM Edu
          </Link>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#50C878' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0B6E4F'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#50C878'}
            >
              Начать
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6">
        <section className="py-24 max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight" style={{ color: '#013220' }}>
              Персонализированное<br />образование с AI
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Адаптивная платформа для школьников 7-12 классов. Диагностика уровня знаний,
              индивидуальный план обучения и мгновенная обратная связь.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="px-7 py-3.5 text-white text-sm font-medium rounded-lg transition-colors"
                style={{ backgroundColor: '#50C878' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0B6E4F'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#50C878'}
              >
                Начать обучение
              </Link>
              <Link
                href="/diagnostic"
                className="px-7 py-3.5 border text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#0B6E4F', color: '#013220' }}
              >
                Пройти диагностику
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-t border-gray-100">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D1F2EB' }}>
                <svg className="w-6 h-6" style={{ color: '#0B6E4F' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#013220' }}>Адаптивный план</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI анализирует результаты диагностики и создаёт индивидуальную траекторию обучения
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D1F2EB' }}>
                <svg className="w-6 h-6" style={{ color: '#0B6E4F' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#013220' }}>Программа МОН РК</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Все материалы соответствуют официальной школьной программе Казахстана
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D1F2EB' }}>
                <svg className="w-6 h-6" style={{ color: '#0B6E4F' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#013220' }}>Обратная связь</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Мгновенные персонализированные объяснения к каждому решённому заданию
              </p>
            </div>
          </div>
        </section>

        {/* Subjects */}
        <section className="py-20 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12" style={{ color: '#013220' }}>Предметы</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'Математика',
                'Физика',
                'Информатика',
                'Химия',
                'Биология',
                'Экономика',
                'География',
                'Английский'
              ].map((subject) => (
                <div
                  key={subject}
                  className="px-4 py-6 border rounded-lg text-center transition-all cursor-pointer"
                  style={{ borderColor: '#D1F2EB' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#50C878';
                    e.currentTarget.style.backgroundColor = '#D1F2EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#D1F2EB';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="text-sm font-medium" style={{ color: '#013220' }}>{subject}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-gray-100">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: '#013220' }}>
              Начните персонализированное обучение
            </h2>
            <p className="text-lg text-gray-600">
              Доступно школьникам по всему Казахстану
            </p>
            <Link
              href="/register"
              className="inline-block px-7 py-3.5 text-white text-sm font-medium rounded-lg transition-colors"
              style={{ backgroundColor: '#50C878' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0B6E4F'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#50C878'}
            >
              Создать аккаунт
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm text-gray-500">
            © 2026 FM Edu — Образовательная платформа для школьников Казахстана
          </p>
        </div>
      </footer>
    </div>
  );
}
