import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // If no API key, return placeholder
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({
        videoId: 'dQw4w9WgXcQ', // Placeholder
        title: 'Видео урок будет добавлен',
        thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`
      });
    }

    // Search YouTube
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}&relevanceLanguage=ru`
    );

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return NextResponse.json({
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url
      });
    }

    return NextResponse.json({ error: 'No videos found' }, { status: 404 });
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
