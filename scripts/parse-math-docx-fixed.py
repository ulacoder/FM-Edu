from docx import Document
import json
import re

# Read DOCX
doc = Document('C:/Users/Ulagat/Downloads/Математика 7-12 класс - конспект по темам.docx')
paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]

# Load existing topics to get IDs
with open('data/topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

math_topics = [t for t in topics if t['subject'] == 'mathematics']

# Create map: (grade, quarter) -> topic
topic_map = {}
for t in math_topics:
    topic_map[(t['grade'], t['quarter'])] = t

# Parse content from docx
parsed_lessons = {}

# Find all grade/quarter sections
i = 0
while i < len(paragraphs):
    para = paragraphs[i]

    # Match: "7 КЛАСС · ЧЕТВЕРТЬ 1"
    grade_match = re.match(r'^(\d+)\s+КЛАСС\s*·\s*ЧЕТВЕРТЬ\s+(\d+)$', para)

    if grade_match:
        grade = int(grade_match.group(1))
        quarter = int(grade_match.group(2))

        # Get topic for this grade/quarter
        topic = topic_map.get((grade, quarter))
        if not topic:
            i += 1
            continue

        # Extract content until next grade/quarter section
        content_lines = []
        i += 1

        # Skip topic number line (e.g., "13. Тригонометрические функции...")
        if i < len(paragraphs) and re.match(r'^\d+\.', paragraphs[i]):
            i += 1

        # Collect content until next section
        while i < len(paragraphs):
            line = paragraphs[i]

            # Stop at next grade/quarter
            if re.match(r'^\d+\s+КЛАСС\s*·\s*ЧЕТВЕРТЬ\s+\d+$', line):
                break

            # Stop at next topic number in content list (at beginning of file)
            if re.match(r'^\d+\.\s+[А-Яа-я].*?\(\d+\s+КЛАСС', line):
                break

            content_lines.append(line)
            i += 1

        # Clean and format content
        content = '\n\n'.join(content_lines)

        # Remove "Тестовые вопросы" section
        content = re.sub(r'Тестовые вопросы.*?(?=Видео по теме|$)', '', content, flags=re.DOTALL)

        # Format sections
        content = re.sub(r'\n(Определение)\n', r'\n## \1\n\n', content)
        content = re.sub(r'\n(Ключевые формулы)\n', r'\n## \1\n\n', content)
        content = re.sub(r'\n(Примеры решения задач)\n', r'\n## \1\n\n', content)
        content = re.sub(r'\n(Видео по теме)\n', r'\n## \1\n\n', content)
        content = re.sub(r'Пример (\d+)\.', r'\n**Пример \1.**', content)

        content = content.strip()

        if content:
            parsed_lessons[topic['id']] = {
                'topicId': topic['id'],
                'subject': 'mathematics',
                'grade': topic['grade'],
                'quarter': topic['quarter'],
                'title': topic['title'],
                'content': f"# {topic['title']}\n\n{content}",
                'youtubeQuery': f"{topic['title']} {topic['grade']} класс математика",
                'keywords': []
            }
    else:
        i += 1

# Load existing lessons.json
try:
    with open('data/lessons.json', 'r', encoding='utf-8') as f:
        existing_lessons = json.load(f)
except:
    existing_lessons = {}

# Update math lessons
for topic_id, lesson in parsed_lessons.items():
    existing_lessons[topic_id] = lesson

# Save updated lessons
with open('data/lessons.json', 'w', encoding='utf-8') as f:
    json.dump(existing_lessons, f, ensure_ascii=False, indent=2)

print(f'✅ Parsed {len(parsed_lessons)} math lessons')
print(f'Total lessons in DB: {len(existing_lessons)}')
print('\nПроверка контента:')
for grade in [7, 10, 12]:
    for q in [1]:
        key = (grade, q)
        if key in topic_map:
            topic = topic_map[key]
            if topic['id'] in parsed_lessons:
                content_preview = parsed_lessons[topic['id']]['content'][:200]
                print(f"\n{grade} класс Q{q} - {topic['title']}:")
                print(f"  Контент: {content_preview}...")
