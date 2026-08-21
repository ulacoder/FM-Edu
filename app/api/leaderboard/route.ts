import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Student, LeaderboardEntry, Region, StudentInventory, ShopItem } from '@/types';

const STUDENTS_FILE = path.join(process.cwd(), 'data', 'students.json');
const INVENTORY_FILE = path.join(process.cwd(), 'data', 'inventory.json');
const SHOP_ITEMS_FILE = path.join(process.cwd(), 'data', 'shop-items.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const regionParam = searchParams.get('region');

    const studentsData = await fs.readFile(STUDENTS_FILE, 'utf-8');
    const students: Student[] = JSON.parse(studentsData);

    // Загружаем инвентарь и товары магазина
    const inventoryData = await fs.readFile(INVENTORY_FILE, 'utf-8');
    const inventories: StudentInventory[] = JSON.parse(inventoryData);

    const shopItemsData = await fs.readFile(SHOP_ITEMS_FILE, 'utf-8');
    const shopItems: ShopItem[] = JSON.parse(shopItemsData);

    // Фильтруем по региону если указан
    let filteredStudents = students;
    if (regionParam && regionParam !== 'all') {
      filteredStudents = students.filter(s => s.region === regionParam);
    }

    // Сортируем по баллам
    const sortedStudents = filteredStudents
      .filter(s => s.totalPoints !== undefined)
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

    // Формируем лидерборд с бейджами
    const leaderboard: any[] = sortedStudents.map((student, index) => {
      const inventory = inventories.find(inv => inv.studentId === student.id);
      let badgeInfo = null;

      if (inventory?.equippedBadge) {
        const badge = shopItems.find(item => item.id === inventory.equippedBadge);
        if (badge) {
          badgeInfo = {
            id: badge.id,
            name: badge.name,
            rarity: badge.rarity
          };
        }
      }

      return {
        studentId: student.id,
        studentName: student.name,
        grade: student.grade,
        region: student.region || 'other',
        totalPoints: student.totalPoints || 0,
        rank: index + 1,
        badge: badgeInfo
      };
    });

    return NextResponse.json({
      leaderboard,
      region: regionParam || 'all',
      totalStudents: leaderboard.length
    });

  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка при загрузке лидерборда' },
      { status: 500 }
    );
  }
}
