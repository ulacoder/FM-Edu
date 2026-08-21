import os
import re

# Fix all static lesson pages - escape < and > ONLY in text content, not in JSX tags
static_dir = 'app/courses/mathematics-static'

for root, dirs, files in os.walk(static_dir):
    for file in files:
        if file == 'page.tsx':
            filepath = os.path.join(root, file)

            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Strategy: replace < and > with JSX expressions {'>'}  and {'<'}
            # But ONLY in text between > and <, not in tag attributes

            def escape_text_content(text):
                """Escape < and > in plain text content"""
                # Replace < with {' < '} and > with {' > '}
                text = text.replace('>', "{'>'}").replace('<', "{'<'}")
                return text

            # Process line by line
            lines = content.split('\n')
            fixed_lines = []

            for line in lines:
                # Skip lines that are pure JSX (className, etc)
                if 'className=' in line or 'export' in line or 'return' in line or '/>' in line:
                    fixed_lines.append(line)
                    continue

                # Find text content between tags
                # Pattern: >TEXT HERE<
                def fix_between_tags(match):
                    before_tag = match.group(1)  # >
                    text = match.group(2)
                    after_tag = match.group(3)   # <

                    # Check if text contains < or >
                    if '<' in text or '>' in text:
                        # Replace with JSX expressions
                        text = text.replace('>', " {'>'}").replace('<', "{'<'} ")

                    return before_tag + text + after_tag

                # Apply to text between tags
                line = re.sub(r'(>)([^<>]+)(<)', fix_between_tags, line)

                fixed_lines.append(line)

            content = '\n'.join(fixed_lines)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f'✅ Fixed {filepath}')

print('\n🎉 Fixed all JSX syntax errors!')
