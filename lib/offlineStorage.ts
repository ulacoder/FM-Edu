// IndexedDB для хранения оффлайн-контента
const DB_NAME = 'fm_edu_offline';
const DB_VERSION = 1;
const STORES = {
  LESSONS: 'lessons',
  TESTS: 'tests',
  MATERIALS: 'materials',
  PROGRESS: 'progress',
};

class OfflineStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Создаем хранилища если их нет
        if (!db.objectStoreNames.contains(STORES.LESSONS)) {
          db.createObjectStore(STORES.LESSONS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.TESTS)) {
          db.createObjectStore(STORES.TESTS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.MATERIALS)) {
          db.createObjectStore(STORES.MATERIALS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
          db.createObjectStore(STORES.PROGRESS, { keyPath: 'id' });
        }
      };
    });
  }

  async saveLesson(lesson: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.LESSONS], 'readwrite');
      const store = transaction.objectStore(STORES.LESSONS);
      const request = store.put({ ...lesson, cachedAt: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getLesson(id: string): Promise<any | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.LESSONS], 'readonly');
      const store = transaction.objectStore(STORES.LESSONS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllLessons(): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.LESSONS], 'readonly');
      const store = transaction.objectStore(STORES.LESSONS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveTest(test: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.TESTS], 'readwrite');
      const store = transaction.objectStore(STORES.TESTS);
      const request = store.put({ ...test, cachedAt: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getTest(id: string): Promise<any | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.TESTS], 'readonly');
      const store = transaction.objectStore(STORES.TESTS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMaterial(material: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.MATERIALS], 'readwrite');
      const store = transaction.objectStore(STORES.MATERIALS);
      const request = store.put({ ...material, cachedAt: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedSize(): Promise<number> {
    if (!this.db) await this.init();

    try {
      const lessons = await this.getAllLessons();
      const lessonsSize = JSON.stringify(lessons).length;

      const transaction = this.db!.transaction([STORES.TESTS, STORES.MATERIALS], 'readonly');

      const testsRequest = transaction.objectStore(STORES.TESTS).getAll();
      const materialsRequest = transaction.objectStore(STORES.MATERIALS).getAll();

      const tests = await new Promise<any[]>((resolve) => {
        testsRequest.onsuccess = () => resolve(testsRequest.result || []);
      });

      const materials = await new Promise<any[]>((resolve) => {
        materialsRequest.onsuccess = () => resolve(materialsRequest.result || []);
      });

      const testsSize = JSON.stringify(tests).length;
      const materialsSize = JSON.stringify(materials).length;

      return lessonsSize + testsSize + materialsSize;
    } catch (error) {
      console.error('Error calculating cached size:', error);
      return 0;
    }
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(
      [STORES.LESSONS, STORES.TESTS, STORES.MATERIALS],
      'readwrite'
    );

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore(STORES.LESSONS).clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore(STORES.TESTS).clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore(STORES.MATERIALS).clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    ]);
  }
}

export const offlineStorage = new OfflineStorage();

// Инициализируем при загрузке
if (typeof window !== 'undefined') {
  offlineStorage.init().catch(console.error);
}
