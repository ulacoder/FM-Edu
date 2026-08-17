import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Инициализация папки data
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory storage для production (Vercel serverless)
const memoryStore: Record<string, any[]> = {};

// Проверка среды
const isProduction = process.env.VERCEL === '1';

// Универсальные CRUD операции
export function readData<T>(filename: string): T[] {
  if (isProduction) {
    // В production используем память
    if (!memoryStore[filename]) {
      memoryStore[filename] = [];
      // Инициализируем базовые данные
      initializeMemoryStore(filename);
    }
    return memoryStore[filename] as T[];
  }

  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export function writeData<T>(filename: string, data: T[]): void {
  if (isProduction) {
    memoryStore[filename] = data;
    return;
  }

  const filePath = path.join(DATA_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function initializeMemoryStore(filename: string): void {
  // Инициализация тем при первом запуске
  if (filename === 'topics') {
    const { allTopics } = require('./seed-topics');
    memoryStore[filename] = allTopics.map((topic: any, index: number) => ({
      ...topic,
      id: `topic-${index}`,
    }));
  } else {
    memoryStore[filename] = [];
  }
}

export function findById<T extends { id: string }>(filename: string, id: string): T | undefined {
  const items = readData<T>(filename);
  return items.find(item => item.id === id);
}

export function findBy<T>(filename: string, predicate: (item: T) => boolean): T[] {
  const items = readData<T>(filename);
  return items.filter(predicate);
}

export function create<T extends { id: string }>(filename: string, item: T): T {
  const items = readData<T>(filename);
  items.push(item);
  writeData(filename, items);
  return item;
}

export function update<T extends { id: string }>(filename: string, id: string, updates: Partial<T>): T | null {
  const items = readData<T>(filename);
  const index = items.findIndex(item => item.id === id);

  if (index === -1) return null;

  items[index] = { ...items[index], ...updates };
  writeData(filename, items);
  return items[index];
}

export function deleteById<T extends { id: string }>(filename: string, id: string): boolean {
  const items = readData<T>(filename);
  const filtered = items.filter(item => item.id !== id);

  if (filtered.length === items.length) return false;

  writeData(filename, filtered);
  return true;
}

// Генерация ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
