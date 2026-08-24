import { NextRequest, NextResponse } from 'next/server';

// Mock opportunities database
let opportunities = [
  {
    id: '1',
    title: 'Стипендия Болашак',
    description: 'Полное финансирование обучения в лучших университетах мира',
    category: 'scholarship',
    deadline: '2026-12-31',
    eligibility: ['10-12 класс', 'Средний балл 4.5+', 'IELTS 6.5+'],
    link: 'https://bolashak.gov.kz',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Google Summer of Code',
    description: 'Трёхмесячная стажировка в open-source проектах с оплатой',
    category: 'internship',
    deadline: '2027-03-15',
    eligibility: ['18+ лет', 'Программирование', 'Английский'],
    link: 'https://summerofcode.withgoogle.com',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Международная олимпиада по физике',
    description: 'Престижная олимпиада для школьников с призами и грантами',
    category: 'competition',
    deadline: '2027-01-20',
    eligibility: ['10-11 класс', 'Физика', 'Английский B2'],
    link: 'https://ipho.org',
    imageUrl: 'https://images.unsplash.com/photo-1636690619969-4f29c749c49e?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error('Opportunities API error:', error);
    return NextResponse.json(
      { error: 'Failed to load opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newOpportunity = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    opportunities.push(newOpportunity);

    return NextResponse.json({ success: true, opportunity: newOpportunity });
  } catch (error) {
    console.error('Create opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
