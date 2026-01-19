import json
import sys

# Read the JSON file
with open('data/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

questions = data['questions']
print(f"Total questions before: {len(questions)}")

# Track duplicates and unique questions
seen_questions = {}
unique_questions = []
duplicates = []

for q in questions:
    # Create a unique key based on question text and type
    key = (q['question'].strip(), q['type'])
    
    if key in seen_questions:
        duplicates.append({
            'id': q['id'],
            'question': q['question'][:80] + '...' if len(q['question']) > 80 else q['question'],
            'type': q['type'],
            'original_id': seen_questions[key]
        })
    else:
        seen_questions[key] = q['id']
        unique_questions.append(q)

# Renumber IDs sequentially
for idx, q in enumerate(unique_questions, start=1):
    q['id'] = idx

# Sort by ID to ensure proper order
unique_questions.sort(key=lambda x: x['id'])

# Save the cleaned data
data['questions'] = unique_questions
with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Total questions after: {len(unique_questions)}")
print(f"Duplicates removed: {len(duplicates)}")
print("\n=== DUPLICATE REPORT ===")
print(f"Total duplicates found: {len(duplicates)}\n")

if duplicates:
    print("Duplicated questions:")
    for i, dup in enumerate(duplicates, 1):
        print(f"{i}. ID {dup['id']} (was duplicate of ID {dup['original_id']})")
        print(f"   Question: {dup['question']}")
        print(f"   Type: {dup['type']}\n")
