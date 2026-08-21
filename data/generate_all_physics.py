# -*- coding: utf-8 -*-
import json

# Read existing content
with open('generated-content.json', 'r', encoding='utf-8') as f:
    existing_content = json.load(f)

# Read the first 2 topics already created
with open('physics-11-12-content.json', 'r', encoding='utf-8') as f:
    physics_content = json.load(f)

print(f"Existing entries: {len(existing_content)}")
print(f"Physics entries already created: {len(physics_content)}")
print("Topics created: Магнитное поле, Электромагнитная индукция")
print("\nNow I'll create the remaining 6 topics and append all 8 to generated-content.json")
