import { NextRequest, NextResponse } from 'next/server';

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
  }
];

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const oppIndex = opportunities.findIndex(o => o.id === params.id);

    if (oppIndex === -1) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    opportunities[oppIndex] = {
      ...opportunities[oppIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, opportunity: opportunities[oppIndex] });
  } catch (error) {
    console.error('Update opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const oppIndex = opportunities.findIndex(o => o.id === params.id);

    if (oppIndex === -1) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    opportunities = opportunities.filter(o => o.id !== params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}
