from docx import Document
import json
import re

# Read DOCX
doc = Document('C:/Users/Ulagat/Downloads/Математика 7-12 класс - конспект по темам.docx')

# Extract all text as one string
full_text = '\n'.join([p.text for p in doc.paragraphs])

# Load existing topics to get IDs
with open('data/topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

math_topics = [t for t in topics if t['subject'] == 'mathematics']
math_topics.sort(key=lambda x: (x['grade'], x['quarter']))

# Split by major section headers
sections = re.split(r'\n(\d+)\s+КЛАСС\s*·\s*ЧЕТВЕРТЬ\s+\d+\n', full_text)

# Parse each topic section
parsed_lessons = {}
topic_idx = 0

for i in range(1, len(sections), 2):
    if topic_idx >= len(math_topics):
        break

    grade_header = sections[i]
    content = sections[i+1] if i+1 < len(sections) else ''

    # Extract topic title (e.g., "1. Рациональные числа. Модуль числа")
    title_match = re.search(r'^\d+\.\s+(.+?)(?=\n|$)', content)
    if not title_match:
        continue

    # Get the full content for this topic
    # Split at next topic number or end
    next_topic = re.search(r'\n\d+\.\s+[А-Яа-я]', content[title_match.end():])
    if next_topic:
        topic_content = content[title_match.end():title_match.end() + next_topic.start()]
    else:
        topic_content = content[title_match.end():]

    # Clean up content - remove "Тестовые вопросы" section
    topic_content = re.sub(r'Тестовые вопросы.*?(?=Видео по теме|$)', '', topic_content, flags=re.DOTALL)

    # Format as markdown
    topic_content = topic_content.strip()
    topic_content = re.sub(r'\nОпределение\n', '\n## Определение\n\n', topic_content)
    topic_content = re.sub(r'\nКлючевые формулы\n', '\n## Ключевые формулы\n\n', topic_content)
    topic_content = re.sub(r'\nПримеры решения задач\n', '\n## Примеры решения задач\n\n', topic_content)
    topic_content = re.sub(r'\nВидео по теме\n', '\n## Видео по теме\n\n', topic_content)
    topic_content = re.sub(r'Пример (\d+)\.', r'\n**Пример \1.**', topic_content)

    topic = math_topics[topic_idx]

    parsed_lessons[topic['id']] = {
        'topicId': topic['id'],
        'subject': 'mathematics',
        'grade': topic['grade'],
        'quarter': topic['quarter'],
        'title': topic['title'],
        'content': f"# {topic['title']}\n\n{topic_content}",
        'youtubeQuery': f"{topic['title']} {topic['grade']} класс математика",
        'keywords': []
    }

    topic_idx += 1

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
print('\nSample topics updated:')
for i, (tid, lesson) in enumerate(list(parsed_lessons.items())[:3]):
    print(f"  {i+1}. Grade {lesson['grade']}Q{lesson['quarter']}: {lesson['title']}")
