#!/usr/bin/env python3
"""
Generate fine-tuning dataset pairs for Myra (EdWorld Co.) using LLMs.
Implements the exact template and schema from Part 2 of the specification.
"""

import os
import sys
import json
import argparse
from typing import List, Dict

CATEGORIES = [
    "timetable",
    "roadmap",
    "exam strategy",
    "subject help",
    "course and college choice",
    "career",
    "study abroad",
    "wellbeing",
    "boundaries",
]

SYSTEM_PROMPT_TEMPLATE = """You are Myra, the study and career mentor from EdWorld Co for students from Class 12 to college and beyond. Give clear, practical, honest guidance with timetables and roadmaps. Never invent exam dates, cutoffs, fees or ranks; tell students to confirm on official websites. Never guarantee results. Be warm and supportive; if a student is in distress, urge them to talk to a trusted adult or helpline."""

PART_2_GENERATOR_PROMPT = """You are helping me build a fine-tuning dataset for "Myra", an AI study and
career mentor for students from Class 12 to postgraduate level in India.

Write {count} NEW question and answer pairs in the category: {category}
(examples of categories: timetable, roadmap, exam strategy, subject help,
course and college choice, career, study abroad, wellbeing, boundaries).

Rules for the QUESTIONS:
- Write them exactly as real students type: short, sometimes casual or with
  spelling slips, sometimes with context (class, exam, hours, months left).
- Cover different exams, streams (Science, Commerce, Arts), levels (Class
  12, UG, PG) and situations (school, dropper, college, working).
- No two questions may ask the same thing in different words.

Rules for the ANSWERS:
- Follow the Myra system prompt above: warm, practical, honest.
- Use specific numbers, steps, tables and examples. No vague advice.
- Never invent exam dates, cutoffs, fees or ranks. Say to check the
  official source where facts change.
- 80 to 300 words each, except timetables and roadmaps.

Output as JSON Lines, one object per line:
{{"messages":[{{"role":"system","content":"{system_prompt}"}},
{{"role":"user","content":"<question>"}},
{{"role":"assistant","content":"<answer>"}}]}}

After generating, a teacher must review every pair before training.
"""

def validate_jsonl_file(filepath: str) -> Dict[str, int]:
    """Validates each line of a JSONL file against Myra training format."""
    total = 0
    valid = 0
    errors = []

    with open(filepath, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            total += 1
            try:
                data = json.loads(line)
                messages = data.get("messages", [])
                if len(messages) >= 3 and messages[0]["role"] == "system" and messages[1]["role"] == "user" and messages[2]["role"] == "assistant":
                    valid += 1
                else:
                    errors.append(f"Line {idx}: Missing standard 3-turn message sequence")
            except Exception as e:
                errors.append(f"Line {idx}: Invalid JSON ({e})")

    return {"total": total, "valid": valid, "errors": errors}

def main():
    parser = argparse.ArgumentParser(description="Myra AI Dataset Generator & Validator")
    parser.add_argument("--category", choices=CATEGORIES, help="Specific category to prompt")
    parser.add_argument("--count", type=int, default=5, help="Number of QA pairs to request")
    parser.add_argument("--validate", type=str, help="Path to JSONL file to validate")
    parser.add_argument("--print-prompt", action="store_true", help="Print the exact prompt to paste into any LLM")

    args = parser.parse_args()

    if args.validate:
        results = validate_jsonl_file(args.validate)
        print(f"Validation Report for {args.validate}:")
        print(f"  Total lines: {results['total']}")
        print(f"  Valid rows:  {results['valid']}")
        if results["errors"]:
            print("  Errors:")
            for err in results["errors"][:10]:
                print(f"    - {err}")
        sys.exit(0 if results["total"] == results["valid"] else 1)

    category = args.category or "timetable"
    prompt = PART_2_GENERATOR_PROMPT.format(
        count=args.count,
        category=category,
        system_prompt=SYSTEM_PROMPT_TEMPLATE,
    )

    if args.print_prompt or not args.validate:
        print("=== PROMPT FOR LLM DATASET GENERATION ===")
        print(prompt)
        print("=========================================")

if __name__ == "__main__":
    main()
