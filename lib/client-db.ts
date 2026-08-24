// Client-side database using localStorage for MVP
import { User, Student, Teacher } from '@/types';

const STORAGE_KEYS = {
  USERS: 'fm_edu_users',
  STUDENTS: 'fm_edu_students',
  TEACHERS: 'fm_edu_teachers',
};

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// User operations
export function getAllUsers(): User[] {
  return getFromStorage<User>(STORAGE_KEYS.USERS);
}

export function findUserByEmail(email: string): User | undefined {
  const users = getAllUsers();
  return users.find(u => u.email === email);
}

export function createUser(user: User): void {
  const users = getAllUsers();
  users.push(user);
  saveToStorage(STORAGE_KEYS.USERS, users);
}

// Student operations
export function getAllStudents(): Student[] {
  return getFromStorage<Student>(STORAGE_KEYS.STUDENTS);
}

export function findStudentById(id: string): Student | undefined {
  const students = getAllStudents();
  return students.find(s => s.id === id);
}

export function createStudent(student: Student): void {
  const students = getAllStudents();
  students.push(student);
  saveToStorage(STORAGE_KEYS.STUDENTS, students);
}

// Teacher operations
export function getAllTeachers(): Teacher[] {
  return getFromStorage<Teacher>(STORAGE_KEYS.TEACHERS);
}

export function findTeacherById(id: string): Teacher | undefined {
  const teachers = getAllTeachers();
  return teachers.find(t => t.id === id);
}

export function createTeacher(teacher: Teacher): void {
  const teachers = getAllTeachers();
  teachers.push(teacher);
  saveToStorage(STORAGE_KEYS.TEACHERS, teachers);
}

// ID generation
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
