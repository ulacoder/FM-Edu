import { OfflineMaterial } from '@/types/offline-bank';

// Публичные материалы (доступны всем)
export const PUBLIC_MATERIALS: OfflineMaterial[] = [
  // Математика
  {
    id: 'pub_math_1',
    title: 'Сборник олимпиадных задач по математике 9-11 класс',
    subject: 'mathematics',
    file_url: '/materials/math/olympiad-problems.pdf',
    file_size: 2.4 * 1024 * 1024, // 2.4 MB
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'pub_math_2',
    title: 'Формулы и теоремы для ЕНТ - Математика',
    subject: 'mathematics',
    file_url: '/materials/math/ent-formulas.pdf',
    file_size: 1.8 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-16').toISOString(),
  },
  {
    id: 'pub_math_3',
    title: '500 задач по алгебре с решениями',
    subject: 'mathematics',
    file_url: '/materials/math/algebra-500.pdf',
    file_size: 3.2 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-17').toISOString(),
  },
  {
    id: 'pub_math_4',
    title: 'Геометрия 7-9 класс - Полный справочник',
    subject: 'mathematics',
    file_url: '/materials/math/geometry-guide.pdf',
    file_size: 2.1 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-18').toISOString(),
  },
  {
    id: 'pub_math_5',
    title: 'Тригонометрия: от простого к сложному',
    subject: 'mathematics',
    file_url: '/materials/math/trigonometry.pdf',
    file_size: 1.6 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-19').toISOString(),
  },
  {
    id: 'pub_math_6',
    title: 'Производные и интегралы - Шпаргалка',
    subject: 'mathematics',
    file_url: '/materials/math/calculus-cheatsheet.pdf',
    file_size: 0.9 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-20').toISOString(),
  },

  // Физика
  {
    id: 'pub_phys_1',
    title: 'Формулы и шпаргалки по физике 9-11 класс',
    subject: 'physics',
    file_url: '/materials/physics/formulas-cheatsheet.pdf',
    file_size: 1.4 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'pub_phys_2',
    title: 'Механика: задачи повышенной сложности',
    subject: 'physics',
    file_url: '/materials/physics/mechanics-advanced.pdf',
    file_size: 2.7 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-16').toISOString(),
  },
  {
    id: 'pub_phys_3',
    title: 'Электричество и магнетизм - Полный курс',
    subject: 'physics',
    file_url: '/materials/physics/electricity-magnetism.pdf',
    file_size: 3.5 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-17').toISOString(),
  },
  {
    id: 'pub_phys_4',
    title: 'Оптика и волны: теория и практика',
    subject: 'physics',
    file_url: '/materials/physics/optics-waves.pdf',
    file_size: 2.2 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-18').toISOString(),
  },
  {
    id: 'pub_phys_5',
    title: 'Термодинамика - Сборник задач',
    subject: 'physics',
    file_url: '/materials/physics/thermodynamics.pdf',
    file_size: 1.9 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-19').toISOString(),
  },
  {
    id: 'pub_phys_6',
    title: 'Физика для олимпиад - Подготовка',
    subject: 'physics',
    file_url: '/materials/physics/olympiad-prep.pdf',
    file_size: 4.1 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-20').toISOString(),
  },

  // Информатика
  {
    id: 'pub_info_1',
    title: 'Практикум по алгоритмам и Python',
    subject: 'informatics',
    file_url: '/materials/informatics/algorithms-python.pdf',
    file_size: 2.8 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'pub_info_2',
    title: 'Структуры данных: от массивов до графов',
    subject: 'informatics',
    file_url: '/materials/informatics/data-structures.pdf',
    file_size: 3.3 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-16').toISOString(),
  },
  {
    id: 'pub_info_3',
    title: 'Решение задач по программированию - 200 примеров',
    subject: 'informatics',
    file_url: '/materials/informatics/coding-problems-200.pdf',
    file_size: 2.5 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-17').toISOString(),
  },
  {
    id: 'pub_info_4',
    title: 'Основы баз данных и SQL',
    subject: 'informatics',
    file_url: '/materials/informatics/databases-sql.pdf',
    file_size: 1.7 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-18').toISOString(),
  },
  {
    id: 'pub_info_5',
    title: 'Web-разработка: HTML, CSS, JavaScript',
    subject: 'informatics',
    file_url: '/materials/informatics/web-development.pdf',
    file_size: 4.2 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-19').toISOString(),
  },
  {
    id: 'pub_info_6',
    title: 'Олимпиадное программирование - Стратегии',
    subject: 'informatics',
    file_url: '/materials/informatics/competitive-programming.pdf',
    file_size: 3.6 * 1024 * 1024,
    file_format: 'pdf',
    is_public: true,
    created_at: new Date('2026-08-20').toISOString(),
  },
];

// Инициализация материалов в localStorage
export function initializeOfflineMaterials() {
  const existingMaterials = localStorage.getItem('fm_edu_offline_materials');

  if (!existingMaterials) {
    localStorage.setItem('fm_edu_offline_materials', JSON.stringify(PUBLIC_MATERIALS));
  }
}

// Получить все материалы (публичные + приватные для конкретного студента)
export function getMaterialsForStudent(studentClassIds: string[]): OfflineMaterial[] {
  const materialsStr = localStorage.getItem('fm_edu_offline_materials');
  if (!materialsStr) return PUBLIC_MATERIALS;

  const allMaterials: OfflineMaterial[] = JSON.parse(materialsStr);

  // Показываем публичные + материалы для классов студента
  return allMaterials.filter(
    (material) =>
      material.is_public ||
      (material.target_class_id && studentClassIds.includes(material.target_class_id))
  );
}

// Добавить материал (учитель)
export function addTeacherMaterial(material: OfflineMaterial) {
  const materialsStr = localStorage.getItem('fm_edu_offline_materials');
  const materials: OfflineMaterial[] = materialsStr ? JSON.parse(materialsStr) : PUBLIC_MATERIALS;

  materials.unshift(material); // Добавляем в начало (приватные материалы сверху)
  localStorage.setItem('fm_edu_offline_materials', JSON.stringify(materials));
}
