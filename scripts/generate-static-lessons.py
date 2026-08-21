from docx import Document
import json
import re
import os

# Read DOCX
doc = Document('C:/Users/Ulagat/Downloads/Математика 7-12 класс - конспект по темам.docx')
paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]

# Load topics
with open('data/topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

math_topics = [t for t in topics if t['subject'] == 'mathematics']
topic_map = {(t['grade'], t['quarter']): t for t in math_topics}

# Parse content from docx
lessons_data = []

i = 0
while i < len(paragraphs):
    para = paragraphs[i]
    grade_match = re.match(r'^(\d+)\s+КЛАСС\s*·\s*ЧЕТВЕРТЬ\s+(\d+)$', para)

    if grade_match:
        grade = int(grade_match.group(1))
        quarter = int(grade_match.group(2))
        topic = topic_map.get((grade, quarter))

        if topic:
            content_lines = []
            i += 1

            # Skip topic number line
            if i < len(paragraphs) and re.match(r'^\d+\.', paragraphs[i]):
                i += 1

            # Collect content
            while i < len(paragraphs):
                line = paragraphs[i]
                if re.match(r'^\d+\s+КЛАСС\s*·\s*ЧЕТВЕРТЬ\s+\d+$', line):
                    break
                if re.match(r'^\d+\.\s+[А-Яа-я].*?\(\d+\s+КЛАСС', line):
                    break
                content_lines.append(line)
                i += 1

            raw_content = '\n\n'.join(content_lines).strip()

            # Remove test questions section
            raw_content = re.sub(r'Тестовые вопросы.*?(?=Видео по теме|$)', '', raw_content, flags=re.DOTALL)

            # Extract video URL if present
            video_url = ''
            video_match = re.search(r'▶.*?https://www\.youtube\.com/watch\?v=([A-Za-z0-9_-]+)', raw_content)
            if video_match:
                video_url = video_match.group(1)

            lessons_data.append({
                'topic': topic,
                'content': raw_content,
                'videoId': video_url
            })
    else:
        i += 1

# Now generate static TSX pages
template = '''export default function Lesson_{slug}() {{
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">Математика • {grade} класс • {quarter} четверть</p>
        </div>

        <div className="bg-card rounded-xl border border-border/60 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
{content_html}
          </div>
        </div>

        {video_section}
      </div>
    </div>
  );
}}
'''

# Generate pages
output_dir = 'app/courses/mathematics-static'
os.makedirs(output_dir, exist_ok=True)

for lesson in lessons_data:
    topic = lesson['topic']
    content = lesson['content']
    video_id = lesson['videoId']

    # Create slug
    slug = f"grade{topic['grade']}_q{topic['quarter']}"

    # Convert content to JSX
    content_lines = content.split('\n\n')
    jsx_lines = []

    for line in content_lines:
        line = line.strip()
        if not line:
            continue

        # Escape special chars for JSX
        line_escaped = line.replace('{', '{{').replace('}', '}}').replace('`', "'")
        # Escape < and > with JSX expressions
        line_escaped = line_escaped.replace('<', "{'<'}").replace('>', "{'>'}")

        if line.startswith('Определение'):
            jsx_lines.append('            <h2 className="text-2xl font-bold mt-6 mb-4">Определение</h2>')
        elif line.startswith('Ключевые формулы'):
            jsx_lines.append('            <h2 className="text-2xl font-bold mt-6 mb-4">Ключевые формулы</h2>')
        elif line.startswith('Примеры решения задач'):
            jsx_lines.append('            <h2 className="text-2xl font-bold mt-6 mb-4">Примеры решения задач</h2>')
        elif line.startswith('Пример'):
            jsx_lines.append(f'            <p className="font-bold mt-4">{line_escaped}</p>')
        elif line.startswith('Решение:'):
            jsx_lines.append(f'            <p className="ml-4 text-muted-foreground">{line_escaped}</p>')
        elif line.startswith('Видео по теме'):
            continue
        elif line.startswith('▶'):
            continue
        else:
            jsx_lines.append(f'            <p className="my-2">{line_escaped}</p>')

    content_html = '\n'.join(jsx_lines)

    # Video section
    if video_id:
        video_section = f'''<div className="bg-card rounded-xl border border-border/60 p-8">
          <h2 className="text-2xl font-bold mb-4">Видео-урок</h2>
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/{video_id}"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>'''
    else:
        video_section = ''

    # Generate file
    page_content = template.format(
        slug=slug,
        title=topic['title'],
        grade=topic['grade'],
        quarter=topic['quarter'],
        content_html=content_html,
        video_section=video_section
    )

    filename = f"{output_dir}/{slug}.tsx"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(page_content)

    print(f"✅ Created {filename}")

print(f"\n🎉 Generated {len(lessons_data)} static lesson pages!")
