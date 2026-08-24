'use client';

import { BookOpen, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

interface InteractiveNotesProps {
  title: string;
  content: {
    formulas?: Array<{ title: string; formula: string; example: string }>;
    tips?: string[];
    commonMistakes?: Array<{ wrong: string; correct: string }>;
    examples?: Array<{ question: string; solution: string }>;
  };
}

export function InteractiveNotes({ title, content }: InteractiveNotesProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Интерактивный конспект • Легкий формат
          </p>
        </div>
      </div>

      {/* Formulas */}
      {content.formulas && content.formulas.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">
            📐 Основные формулы
          </h3>
          <div className="space-y-4">
            {content.formulas.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-blue-100 dark:border-blue-900"
              >
                <h4 className="font-semibold mb-2 text-sm sm:text-base">{item.title}</h4>
                <p className="font-mono text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {item.formula}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  <span className="font-medium">Пример:</span> {item.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {content.tips && content.tips.length > 0 && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h3 className="text-lg sm:text-xl font-bold text-green-900 dark:text-green-100">
              Как запомнить?
            </h3>
          </div>
          <div className="space-y-2">
            {content.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm sm:text-base text-green-900 dark:text-green-100"
              >
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Mistakes */}
      {content.commonMistakes && content.commonMistakes.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            <h3 className="text-lg sm:text-xl font-bold text-red-900 dark:text-red-100">
              Типичные ошибки
            </h3>
          </div>
          <div className="space-y-3">
            {content.commonMistakes.map((mistake, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-red-100 dark:border-red-900"
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-red-600 font-bold text-sm sm:text-base">❌</span>
                  <p className="text-xs sm:text-sm text-red-800 dark:text-red-200 line-through">
                    {mistake.wrong}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-sm sm:text-base">✅</span>
                  <p className="text-xs sm:text-sm text-green-800 dark:text-green-200 font-medium">
                    {mistake.correct}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {content.examples && content.examples.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-purple-900 dark:text-purple-100">
            📝 Примеры с решениями
          </h3>
          <div className="space-y-4">
            {content.examples.map((example, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-purple-100 dark:border-purple-900"
              >
                <p className="font-semibold mb-2 text-sm sm:text-base text-purple-900 dark:text-purple-100">
                  {example.question}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line">
                  {example.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
