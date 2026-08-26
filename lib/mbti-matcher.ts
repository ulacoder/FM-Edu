// Утилиты для MBTI Matchmaking

import { MBTIMatchResult } from '@/types/matchmaking';

/**
 * Валидные MBTI типы
 */
const VALID_MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
] as const;

export type MBTIType = typeof VALID_MBTI_TYPES[number];

/**
 * Проверяет, является ли строка валидным MBTI типом
 */
export function isValidMBTI(mbti: string | null | undefined): mbti is MBTIType {
  if (!mbti) return false;
  return VALID_MBTI_TYPES.includes(mbti.toUpperCase() as MBTIType);
}

/**
 * Нормализует MBTI тип (приводит к uppercase)
 */
export function normalizeMBTI(mbti: string | null | undefined): MBTIType | null {
  if (!mbti) return null;
  const normalized = mbti.toUpperCase();
  return isValidMBTI(normalized) ? normalized : null;
}

/**
 * Подсчитывает количество совпадающих букв между двумя MBTI типами
 * @param mbti1 - Первый MBTI тип (например, "ENTP")
 * @param mbti2 - Второй MBTI тип (например, "INTP")
 * @returns Количество совпадающих букв (0-4)
 */
export function calculateMBTIMatchScore(
  mbti1: string | null | undefined,
  mbti2: string | null | undefined
): number {
  const normalized1 = normalizeMBTI(mbti1);
  const normalized2 = normalizeMBTI(mbti2);

  if (!normalized1 || !normalized2) return 0;
  if (normalized1 === normalized2) return 4;

  let score = 0;
  for (let i = 0; i < 4; i++) {
    if (normalized1[i] === normalized2[i]) {
      score++;
    }
  }

  return score;
}

/**
 * Проверяет совместимость MBTI на основе режима фильтрации
 * @param userMBTI - MBTI пользователя, который хочет вступить
 * @param targetMBTI - Целевой MBTI из фильтра (может быть null)
 * @param matchMode - Режим фильтрации ('any' | 'exact' | 'auto')
 * @returns Результат проверки совместимости
 */
export function checkMBTICompatibility(
  userMBTI: string | null | undefined,
  targetMBTI: string | null | undefined,
  matchMode: 'any' | 'exact' | 'auto'
): MBTIMatchResult {
  // Режим "any" - принимаем всех
  if (matchMode === 'any') {
    return {
      isMatch: true,
      matchScore: 4,
      message: 'Принимаются все типы MBTI',
    };
  }

  const normalizedUserMBTI = normalizeMBTI(userMBTI);
  const normalizedTargetMBTI = normalizeMBTI(targetMBTI);

  // Если у пользователя нет MBTI
  if (!normalizedUserMBTI) {
    return {
      isMatch: false,
      matchScore: 0,
      message: 'Пожалуйста, укажите ваш MBTI тип в профиле',
    };
  }

  // Если целевой MBTI не указан, используем режим "any"
  if (!normalizedTargetMBTI) {
    return {
      isMatch: true,
      matchScore: 4,
      message: 'Целевой MBTI не указан, принимаются все типы',
    };
  }

  const matchScore = calculateMBTIMatchScore(normalizedUserMBTI, normalizedTargetMBTI);

  // Режим "exact" - только точное совпадение
  if (matchMode === 'exact') {
    if (matchScore === 4) {
      return {
        isMatch: true,
        matchScore,
        message: `Точное совпадение: ${normalizedUserMBTI}`,
      };
    } else {
      return {
        isMatch: false,
        matchScore,
        message: `Требуется точное совпадение с ${normalizedTargetMBTI}, ваш тип: ${normalizedUserMBTI}`,
      };
    }
  }

  // Режим "auto" - минимум 3 из 4 букв
  if (matchMode === 'auto') {
    if (matchScore >= 3) {
      return {
        isMatch: true,
        matchScore,
        message: `Хорошая совместимость: ${normalizedUserMBTI} и ${normalizedTargetMBTI} (${matchScore}/4 совпадений)`,
      };
    } else {
      return {
        isMatch: false,
        matchScore,
        message: `Низкая совместимость: ${normalizedUserMBTI} и ${normalizedTargetMBTI} (${matchScore}/4 совпадений). Требуется минимум 3/4.`,
      };
    }
  }

  // Fallback (не должно произойти)
  return {
    isMatch: false,
    matchScore: 0,
    message: 'Неизвестный режим фильтрации',
  };
}

/**
 * Получает список рекомендуемых MBTI типов на основе целевого типа
 * Возвращает типы с совпадением 3 или 4 из 4 букв
 */
export function getRecommendedMBTITypes(targetMBTI: string | null | undefined): MBTIType[] {
  const normalized = normalizeMBTI(targetMBTI);
  if (!normalized) return [];

  return VALID_MBTI_TYPES.filter((mbti) => {
    const score = calculateMBTIMatchScore(normalized, mbti);
    return score >= 3;
  });
}

/**
 * Форматирует MBTI match mode для отображения
 */
export function formatMBTIMatchMode(
  matchMode: 'any' | 'exact' | 'auto',
  targetMBTI?: string | null
): string {
  switch (matchMode) {
    case 'any':
      return 'Любой MBTI';
    case 'exact':
      return targetMBTI ? `Только ${targetMBTI}` : 'Точное совпадение';
    case 'auto':
      if (targetMBTI) {
        const recommended = getRecommendedMBTITypes(targetMBTI);
        return `Автоподбор: ${targetMBTI} и совместимые (${recommended.length} типов)`;
      }
      return 'Автоподбор (совпадение 3/4 букв)';
    default:
      return 'Не указан';
  }
}

/**
 * Получает цветовой индикатор для match score
 */
export function getMBTIMatchColor(matchScore: number): string {
  if (matchScore === 4) return 'text-green-600';
  if (matchScore === 3) return 'text-yellow-600';
  if (matchScore === 2) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Получает emoji для match score
 */
export function getMBTIMatchEmoji(matchScore: number): string {
  if (matchScore === 4) return '✅';
  if (matchScore === 3) return '🟢';
  if (matchScore === 2) return '🟡';
  if (matchScore === 1) return '🟠';
  return '🔴';
}
