'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>('ru');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && ['ru', 'kk', 'en'].includes(saved)) {
      setLocale(saved);
    }
  }, []);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('localeChange', { detail: newLocale }));
  };

  const languages = [
    { code: 'ru' as Locale, label: 'ru' },
    { code: 'kk' as Locale, label: 'kz' },
    { code: 'en' as Locale, label: 'en' },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-card border border-border/60 rounded-lg shadow-lg z-20 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full px-4 py-2.5 text-sm transition-colors ${
                  locale === lang.code
                    ? 'bg-primary text-white'
                    : 'hover:bg-muted/50'
                }`}
              >
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
