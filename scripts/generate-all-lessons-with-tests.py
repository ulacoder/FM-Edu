import pdfplumber
import json
import re

pdf_path = r'C:\Users\Ulagat\Downloads\Математика 7-12 класс - конспект по темам.pdf'

# Topic mapping
topics = [
    {"id": "math-7-q2-1", "grade": "7", "quarter": "2", "title": "Рациональные числа"},
    {"id": "math-7-q2-2", "grade": "7", "quarter": "2", "title": "Одночлены и многочлены"},
    # ... (добавим все 24 темы)
]

with pdfplumber.open(pdf_path) as pdf:
    full_text = ''
    for page in pdf.pages:
        full_text += page.extract_text() + '\n'

# Parse topics
topic_sections = re.split(r'\n\d+\. [А-Яа-я]', full_text)

for i, topic in enumerate(topics):
    section = topic_sections[i+1] if i+1 < len(topic_sections) else ''

    # Extract tests (table format)
    tests = []
    test_match = re.search(r'Тестовые вопросы.*?\n(.*?)(?=Видео по теме|$)', section, re.DOTALL)
    if test_match:
        test_text = test_match.group(1)
        # Parse table rows
        lines = test_text.strip().split('\n')
        current_q = None
        for line in lines:
            line = line.strip()
            if re.match(r'^\d+\.', line):
                if current_q:
                    tests.append(current_q)
                current_q = {'question': line, 'answer': ''}
            elif current_q and line:
                current_q['answer'] = line
        if current_q:
            tests.append(current_q)

    # Generate TSX with tests
    jsx = f'''export default function Lesson() {{
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">{topic['title']}</h1>

      {{/* ... контент урока ... */}}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Тестовые вопросы</h2>
        <div className="space-y-4">
'''

    for test in tests[:10]:  # Max 10 questions
        q = test['question'].replace('{', '{{').replace('}', '}}')
        a = test['answer'].replace('{', '{{').replace('}', '}}')
        jsx += f'''          <details className="border rounded p-4">
            <summary className="font-medium cursor-pointer">{q}</summary>
            <p className="mt-2 text-green-600">Ответ: {a}</p>
          </details>
'''

    jsx += '''        </div>
      </div>
    </div>
  )
}
'''

    # Write file
    filename = f"app/courses/mathematics/{topic['id'].replace('-', '_')}/page.tsx"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(jsx)

    print(f"✅ {topic['title']} - {len(tests)} вопросов")

print("ГОТОВО!")
