import { NextRequest, NextResponse } from 'next/server';
import { PointsTransaction } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacherId, studentId, amount, category, description, classId } = body;

    if (!teacherId || !studentId || !amount || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
    }

    // Проверяем баланс учителя
    const usersStr = localStorage.getItem('fm_edu_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    const teacherIndex = users.findIndex((u: any) => u.id === teacherId);

    if (teacherIndex === -1) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const teacher = users[teacherIndex];
    const currentBalance = teacher.pointsBalance || 0;

    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Недостаточно баллов на балансе учителя' }, { status: 400 });
    }

    // Проверяем существование студента
    const studentIndex = users.findIndex((u: any) => u.id === studentId && u.role === 'student');

    if (studentIndex === -1) {
      return NextResponse.json({ error: 'Студент с таким ID не найден' }, { status: 404 });
    }

    // Создаём транзакцию
    const transactionsStr = localStorage.getItem('fm_edu_transactions');
    const transactions: PointsTransaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];

    const newTransaction: PointsTransaction = {
      id: `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      teacherId,
      studentId,
      classId,
      amount,
      category,
      description: description || '',
      createdAt: new Date(),
    };

    transactions.push(newTransaction);
    localStorage.setItem('fm_edu_transactions', JSON.stringify(transactions));

    // Обновляем баланс учителя
    users[teacherIndex].pointsBalance = currentBalance - amount;

    // Обновляем баллы студента
    const currentStudentPoints = users[studentIndex].totalPoints || 0;
    users[studentIndex].totalPoints = currentStudentPoints + amount;

    localStorage.setItem('fm_edu_users', JSON.stringify(users));

    return NextResponse.json({
      success: true,
      transaction: newTransaction,
      newTeacherBalance: users[teacherIndex].pointsBalance,
      newStudentPoints: users[studentIndex].totalPoints
    });
  } catch (error) {
    console.error('Error awarding points:', error);
    return NextResponse.json({ error: 'Failed to award points' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const studentId = request.nextUrl.searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    const transactionsStr = localStorage.getItem('fm_edu_transactions');
    const transactions: PointsTransaction[] = transactionsStr ? JSON.parse(transactionsStr) : [];

    const studentTransactions = transactions.filter(t => t.studentId === studentId);

    return NextResponse.json({ transactions: studentTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
