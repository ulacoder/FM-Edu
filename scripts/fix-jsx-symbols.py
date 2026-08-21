import os
import re

# Fix all static lesson pages - escape < and > for JSX
static_dir = 'app/courses/mathematics-static'

for root, dirs, files in os.walk(static_dir):
    for file in files:
        if file == 'page.tsx':
            filepath = os.path.join(root, file)

            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Replace < and > with HTML entities in text content
            # But NOT in JSX tags like <div>, <h1>, etc.

            # Find all <p> tags with text content
            def fix_symbols(match):
                tag_content = match.group(1)
                # Replace < and > with HTML entities
                fixed = tag_content.replace('<', '&lt;').replace('>', '&gt;')
                return f'<p{fixed}</p>'

            # Fix in <p> tags
            content = re.sub(r'<p([^>]*>[^<]*)</p>', fix_symbols, content)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f'✅ Fixed {filepath}')

print('\n🎉 Fixed all JSX syntax errors!')
