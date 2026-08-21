import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ShopItem } from '@/types';

const SHOP_ITEMS_FILE = path.join(process.cwd(), 'data', 'shop-items.json');

// GET - получить все товары или фильтровать по категории
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const data = await fs.readFile(SHOP_ITEMS_FILE, 'utf-8');
    let items: ShopItem[] = JSON.parse(data);

    // Фильтр по категории если указан
    if (category) {
      items = items.filter(item => item.category === category);
    }

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Error loading shop items:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
