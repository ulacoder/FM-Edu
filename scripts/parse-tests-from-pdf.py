import PyPDF2
import re
import json

# Read PDF
with open('C:/Users/Ulagat/Downloads/Математика 7-12 класс - конспект по темам.pdf', 'rb') as f:
    pdf = PyPDF2.PdfReader(f)

    # Extract all text
    full_text = ''
    for page in pdf.pages:
        full_text += page.extract_text()

# Load topics to match tests with topicIds
with open('data/topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

math_topics = [t for t in topics if t['subject'] == 'mathematics']
math_topics.sort(key=lambda x: (x['grade'], x['quarter']))

# Parse tests for each topic
all_tests = {}

# Split by topic sections
sections = re.split(r'(\d+)\s+КЛАСС\s*·\s*ЧЕТВЕРТЬ\s+\d+', full_text)

for i in range(1, len(sections), 2):
    if i >= len(sections) - 1:
        break

    grade_header = sections[i]
    content = sections[i+1]

    # Parse grade/quarter
    grade_match = re.search(r'(\d+)', grade_header)
    if not grade_match:
        continue

    grade = int(grade_match.group(1))
    quarter_match = re.search(r'ЧЕТВЕРТЬ\s+(\d+)', grade_header)
    if not quarter_match:
        continue

    quarter = int(quarter_match.group(1))

    # Find topic
    topic = next((t for t in math_topics if t['grade'] == grade and t['quarter'] == quarter), None)
    if not topic:
        continue

    # Find test section in this content
    test_match = re.search(r'Тестовые вопросы \(10\) с ответами\s+Вопрос\s+Ответ\s+(.*?)(?=Видео по теме|$)', content, re.DOTALL)

    if test_match:
        test_content = test_match.group(1)

        # Parse questions - pattern: "1. Question text? Answer text"
        questions = []
        lines = test_content.split('\n')

        current_q = None
        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if line starts with number
            q_match = re.match(r'^(\d+)\.\s+(.+)', line)
            if q_match:
                # Save previous question if exists
                if current_q:
                    questions.append(current_q)

                current_q = {
                    'number': int(q_match.group(1)),
                    'question': q_match.group(2),
                    'answer': ''
                }
            elif current_q:
                # This is continuation or answer
                current_q['answer'] = line

        # Add last question
        if current_q:
            questions.append(current_q)

        if questions:
            all_tests[topic['id']] = {
                'grade': grade,
                'quarter': quarter,
                'title': topic['title'],
                'questions': questions
            }
            print(f"✅ Grade {grade}Q{quarter} - {topic['title']}: {len(questions)} questions")

print(f'\n📊 Total topics with tests: {len(all_tests)}/24')

# Save to JSON for inspection
with open('data/parsed-tests-from-pdf.json', 'w', encoding='utf-8') as f:
    json.dump(all_tests, f, ensure_ascii=False, indent=2)

print('✅ Tests saved to data/parsed-tests-from-pdf.json')
