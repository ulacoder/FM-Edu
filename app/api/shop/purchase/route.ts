import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Purchase, Student, StudentInventory, ShopItem, OwnedItem } from '@/types';

const PURCHASES_FILE = path.join(process.cwd(), 'data', 'purchases.json');
const INVENTORY_FILE = path.join(process.cwd(), 'data', 'inventory.json');
const STUDENTS_FILE = path.join(process.cwd(), 'data', 'students.json');
const SHOP_ITEMS_FILE = path.join(process.cwd(), 'data', 'shop-items.json');

// POST - купить товар
export async function POST(req: NextRequest) {
  try {
    const { studentId, itemId, shippingInfo } = await req.json();

    if (!studentId || !itemId) {
      return NextResponse.json(
        { error: 'studentId and itemId are required' },
        { status: 400 }
      );
    }

    // Загружаем данные
    const studentsData = await fs.readFile(STUDENTS_FILE, 'utf-8');
    const students: Student[] = JSON.parse(studentsData);

    const shopItemsData = await fs.readFile(SHOP_ITEMS_FILE, 'utf-8');
    const shopItems: ShopItem[] = JSON.parse(shopItemsData);

    const inventoryData = await fs.readFile(INVENTORY_FILE, 'utf-8');
    let inventories: StudentInventory[] = JSON.parse(inventoryData);

    const purchasesData = await fs.readFile(PURCHASES_FILE, 'utf-8');
    const purchases: Purchase[] = JSON.parse(purchasesData);

    // Находим студента и товар
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const item = shopItems.find(i => i.id === itemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const student = students[studentIndex];
    const studentPoints = student.totalPoints || 0;

    // Проверяем хватает ли баллов
    if (studentPoints < item.price) {
      return NextResponse.json(
        { error: `Недостаточно баллов. Нужно: ${item.price}, у вас: ${studentPoints}` },
        { status: 400 }
      );
    }

    // Проверяем stock для физических товаров
    if (item.stock !== undefined && item.stock <= 0) {
      return NextResponse.json({ error: 'Товар закончился' }, { status: 400 });
    }

    // Списываем баллы
    students[studentIndex].totalPoints = studentPoints - item.price;

    // Создаем покупку
    const purchase: Purchase = {
      id: Date.now().toString(),
      studentId,
      itemId,
      pointsSpent: item.price,
      purchasedAt: new Date(),
      status: item.category === 'merch' ? 'pending' : 'completed',
      shippingInfo: item.category === 'merch' ? shippingInfo : undefined
    };
    purchases.push(purchase);

    // Добавляем в инвентарь
    let inventory = inventories.find(inv => inv.studentId === studentId);
    if (!inventory) {
      inventory = {
        studentId,
        ownedItems: []
      };
      inventories.push(inventory);
    }

    const ownedItem: OwnedItem = {
      itemId,
      purchasedAt: new Date(),
      isEquipped: false
    };
    inventory.ownedItems.push(ownedItem);

    // Уменьшаем stock если это физический товар
    if (item.stock !== undefined) {
      const shopItemIndex = shopItems.findIndex(i => i.id === itemId);
      if (shopItemIndex !== -1) {
        shopItems[shopItemIndex].stock = (shopItems[shopItemIndex].stock || 0) - 1;
        await fs.writeFile(SHOP_ITEMS_FILE, JSON.stringify(shopItems, null, 2), 'utf-8');
      }
    }

    // Сохраняем все изменения
    await fs.writeFile(STUDENTS_FILE, JSON.stringify(students, null, 2), 'utf-8');
    await fs.writeFile(PURCHASES_FILE, JSON.stringify(purchases, null, 2), 'utf-8');
    await fs.writeFile(INVENTORY_FILE, JSON.stringify(inventories, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      purchase,
      newBalance: students[studentIndex].totalPoints
    });
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
