import json
import os

filepath = r'd:\PROGRAMMING\WEB\LEARNING\nextjs\human\data\questions.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

mapping = {
    'A': 'ا',
    'B': 'ب',
    'C': 'ج'
}

for q in data['questions']:
    if q.get('type') == 'mcq':
        # Update answer
        if q['answer'] in mapping:
            q['answer'] = mapping[q['answer']]
        
        # Update choices
        if 'choices' in q:
            new_choices = []
            for choice in q['choices']:
                for eng, ara in mapping.items():
                    if choice.startswith(f"{eng}. "):
                        choice = choice.replace(f"{eng}. ", f"{ara}. ", 1)
                new_choices.append(choice)
            q['choices'] = new_choices

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Migration complete!")
