import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Получаем активные рекомендации
    const { data: recommendations, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('generated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching recommendations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      );
    }

    if (!recommendations || recommendations.length === 0) {
      return NextResponse.json({
        hasRecommendations: false,
        message: 'No recommendations found. Generate new ones.'
      });
    }

    const latest = recommendations[0];

    return NextResponse.json({
      hasRecommendations: true,
      recommendations: latest.recommendations,
      reasoning: latest.reasoning,
      generatedAt: latest.generated_at,
      expiresAt: latest.expires_at,
      factorsUsed: latest.factors_used
    });

  } catch (error: any) {
    console.error('Recommendations fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
