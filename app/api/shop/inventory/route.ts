import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { StudentInventory } from '@/types';

const INVENTORY_FILE = path.join(process.cwd(), 'data', 'inventory.json');

// GET - получить инвентарь студента
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'studentId required' }, { status: 400 });
    }

    const data = await fs.readFile(INVENTORY_FILE, 'utf-8');
    const inventories: StudentInventory[] = JSON.parse(data);

    let inventory = inventories.find(inv => inv.studentId === studentId);

    // Если инвентаря нет - создаем пустой
    if (!inventory) {
      inventory = {
        studentId,
        ownedItems: []
      };
    }

    return NextResponse.json({ inventory });
  } catch (error: any) {
    console.error('Error loading inventory:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - экипировать/снять предмет
export async function PATCH(req: NextRequest) {
  try {
    const { studentId, itemId, slot } = await req.json();

    if (!studentId || !itemId || !slot) {
      return NextResponse.json(
        { error: 'studentId, itemId, and slot are required' },
        { status: 400 }
      );
    }

    const data = await fs.readFile(INVENTORY_FILE, 'utf-8');
    let inventories: StudentInventory[] = JSON.parse(data);

    const invIndex = inventories.findIndex(inv => inv.studentId === studentId);
    if (invIndex === -1) {
      return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
    }

    // Проверяем есть ли предмет
    const hasItem = inventories[invIndex].ownedItems.find(item => item.itemId === itemId);
    if (!hasItem) {
      return NextResponse.json({ error: 'Item not owned' }, { status: 400 });
    }

    // Экипируем предмет в нужный слот
    if (slot === 'frame') {
      inventories[invIndex].equippedFrame = itemId;
    } else if (slot === 'badge') {
      inventories[invIndex].equippedBadge = itemId;
    } else if (slot === 'avatar') {
      inventories[invIndex].equippedAvatar = itemId;
    } else if (slot === 'theme') {
      inventories[invIndex].equippedTheme = itemId;
    }

    await fs.writeFile(INVENTORY_FILE, JSON.stringify(inventories, null, 2), 'utf-8');

    return NextResponse.json({ success: true, inventory: inventories[invIndex] });
  } catch (error: any) {
    console.error('Error updating inventory:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
