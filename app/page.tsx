'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Target, MessageSquare, GraduationCap } from "lucide-react";
import { getTranslation, type Locale } from "@/lib/i18n";

export default function Home() {
  const [locale, setLocale] = useState<Locale>('ru');

  const t = (key: keyof typeof import('@/lib/i18n').translations.ru) => getTranslation(locale, key);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;

    if (savedLocale && ['ru', 'kk', 'en'].includes(savedLocale)) {
      setLocale(savedLocale);
    }

    const handleLocaleChange = (e: CustomEvent<Locale>) => {
      setLocale(e.detail);
    };

    window.addEventListener('localeChange', handleLocaleChange as EventListener);
    return () => window.removeEventListener('localeChange', handleLocaleChange as EventListener);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 mb-6">
              <span className="text-sm font-medium text-primary">AI-платформа для школьников</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/register">
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium">
                  {t('startLearning')}
                </button>
              </Link>
              <Link href="/diagnostic">
                <button className="px-6 py-3 border border-border hover:border-primary/40 rounded-lg transition-colors font-medium">
                  {t('takeDiagnostic')}
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-border/40">
              <div>
                <div className="text-2xl font-semibold">8</div>
                <div className="text-sm text-muted-foreground">{t('subjects')}</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">6</div>
                <div className="text-sm text-muted-foreground">{t('grades')}</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">NIS</div>
                <div className="text-sm text-muted-foreground">{t('nisProgram')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-3">
              {t('whyFmEdu')}
            </h2>
            <p className="text-muted-foreground">
              {t('modernApproach')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <Target className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('adaptiveLearning')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('adaptiveLearningDesc')}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <BookOpen className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('nisProgContent')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('nisProgContentDesc')}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-card border border-border/60 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('instantFeedback')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('instantFeedbackDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">{t('availableSubjects')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'math', nameKey: 'mathematics' as const, status: 'available', href: '/courses/mathematics' },
              { id: 'phys', nameKey: 'physics' as const, status: 'available', href: '/courses/physics' },
              { id: 'info', nameKey: 'informatics' as const, status: 'development', href: '/courses/informatics-static/grade7_q1' },
              { id: 'geo', nameKey: 'geography' as const, status: 'soon' },
              { id: 'chem', nameKey: 'chemistry' as const, status: 'soon' },
              { id: 'bio', nameKey: 'biology' as const, status: 'soon' },
              { id: 'econ', nameKey: 'economics' as const, status: 'soon' },
              { id: 'eng', nameKey: 'english' as const, status: 'soon' }
            ].map((subject) => {
              const isDisabled = subject.status === 'soon';
              const isDev = subject.status === 'development';

              const badge = subject.status === 'available'
                ? <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-green-500/20 text-green-600 dark:text-green-400 rounded">{t('available')}</span>
                : subject.status === 'development'
                ? <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded">{t('development')}</span>
                : <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded">{t('soon')}</span>;

              const displayName = t(subject.nameKey);

              const card = (
                <div
                  className={`bg-card border border-border/60 rounded-lg p-6 text-center transition-all ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : isDev
                      ? 'hover:border-yellow-400/40 hover:bg-yellow-500/5 cursor-pointer'
                      : 'hover:border-primary/40 hover:bg-primary/5 cursor-pointer'
                  }`}
                >
                  <div className="text-sm font-medium mb-2">{displayName}</div>
                  {badge}
                </div>
              );

              return isDisabled || !subject.href ? (
                <div key={subject.id}>{card}</div>
              ) : (
                <Link key={subject.id} href={subject.href}>
                  {card}
                </Link>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-green-500/20 text-green-600 dark:text-green-400 rounded">{t('available')}</span>
              <span>— {t('fullContent')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded">{t('development')}</span>
              <span>— {t('possibleErrors')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded">{t('soon')}</span>
              <span>— {t('contentInProgress')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t('startPersonalized')}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('availableForAll')}
            </p>
            <Link href="/register">
              <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium">
                {t('createAccountFree')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">FM Edu</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t('personalizedPlatform')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('platformTitle')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/diagnostic" className="hover:text-foreground transition-colors">{t('diagnostic')}</Link></li>
                <li><Link href="/courses" className="hover:text-foreground transition-colors">{t('courses')}</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">{t('dashboard')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('aboutUs')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">{t('aboutPlatform')}</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">{t('contacts')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 FM Edu. {t('allRightsReserved')}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
