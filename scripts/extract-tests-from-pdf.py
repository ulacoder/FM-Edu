import pdfplumber
import json
import re

# Read PDF
pdf_path = 'C:/Users/Ulagat/Downloads/Математика 7-12 класс - конспект по темам.pdf'

with pdfplumber.open(pdf_path) as pdf:
    full_text = ''
    for page in pdf.pages:
        full_text += page.extract_text()

# Load topics to match tests
with open('data/topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

math_topics = [t for t in topics if t['subject'] == 'mathematics']
math_topics.sort(key=lambda x: (x['grade'], x['quarter']))

# Parse tests manually - split by topic sections
all_tests = {}

# Split text by class/quarter headers
sections = re.split(r'(\d+)\s+КЛАСС\s*·\s*ЧЕТВЕРТЬ\s+\d+', full_text)

topic_idx = 0

for i in range(1, len(sections), 2):
    if i >= len(sections) - 1:
        break

    content = sections[i+1]

    if topic_idx >= len(math_topics):
        break

    topic = math_topics[topic_idx]

    # Find test section
    test_match = re.search(r'Тестовые вопросы \(10\) с ответами\s+Вопрос\s+Ответ\s+(.*?)(?=Видео по теме|$)', content, re.DOTALL)

    if test_match:
        test_text = test_match.group(1).strip()

        # Parse questions - they are in format:
        # 1. Question text Answer text
        # 2. Next question Next answer

        questions = []
        lines = test_text.split('\n')

        current_q = {'number': 0, 'question': '', 'answer': ''}

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if starts with number (1-10)
            num_match = re.match(r'^(\d+)\.\s+(.+)', line)
            if num_match and int(num_match.group(1)) <= 10:
                # Save previous question
                if current_q['number'] > 0:
                    questions.append(current_q)

                # Start new question
                num = int(num_match.group(1))
                rest = num_match.group(2)

                # Try to split question and answer
                # Usually answer is on same line or next line
                current_q = {
                    'number': num,
                    'question': rest,
                    'answer': ''
                }
            else:
                # This is either continuation of question or answer
                if current_q['number'] > 0:
                    if not current_q['answer']:
                        # Could be answer
                        current_q['answer'] = line
                    else:
                        # Continuation of answer
                        current_q['answer'] += ' ' + line

        # Add last question
        if current_q['number'] > 0:
            questions.append(current_q)

        # Clean up questions - split question and answer better
        cleaned = []
        for q in questions:
            # If question text is very long, likely contains answer at the end
            q_text = q['question']
            a_text = q['answer']

            cleaned.append({
                'number': q['number'],
                'question': q_text,
                'answer': a_text
            })

        if len(cleaned) >= 5:  # At least some questions parsed
            all_tests[topic['id']] = {
                'topicId': topic['id'],
                'grade': topic['grade'],
                'quarter': topic['quarter'],
                'title': topic['title'],
                'questions': cleaned
            }
            print(f"✅ Grade {topic['grade']}Q{topic['quarter']} - {topic['title']}: {len(cleaned)} questions")

    topic_idx += 1

# Save parsed tests
with open('data/parsed-tests-pdf.json', 'w', encoding='utf-8') as f:
    json.dump(all_tests, f, ensure_ascii=False, indent=2)

print(f'\n📊 Total tests parsed: {len(all_tests)}/24')
print('💾 Saved to data/parsed-tests-pdf.json')
