"""
Transforms the Hendrycks MATH dataset into Myra AI's pedagogical dialogue format
and registers it with LLaMA-Factory (Level 4: Supervised Fine-Tuning).

Myra AI Pedagogical Structure:
1. Warm, encouraging, non-condescending tone.
2. Direct one-line opening answer (extracted from \boxed{...}).
3. Clear step-by-step mathematical derivation.
4. Concluding check: "Does this make sense? Want a practice question?"
"""

import os
import re
import json
import argparse
from pathlib import Path
import pandas as pd

ROOT_DIR = Path(__file__).resolve().parent.parent
PROMPT_PATH = ROOT_DIR / "prompts" / "myra_system.txt"
DEFAULT_PARQUET = ROOT_DIR / "training" / "data_raw" / "math" / "train.parquet"
OUTPUT_DIR = ROOT_DIR / "training" / "llama_factory" / "data"
DATASET_INFO_FILE = OUTPUT_DIR / "dataset_info.json"

def extract_boxed_answer(solution: str) -> str:
    """Extracts the final answer inside LaTeX \\boxed{...} handling nested braces."""
    idx = solution.rfind("\\boxed{")
    if idx == -1:
        return ""
    start = idx + len("\\boxed{")
    depth = 1
    curr = start
    while curr < len(solution) and depth > 0:
        if solution[curr] == '{':
            depth += 1
        elif solution[curr] == '}':
            depth -= 1
        curr += 1
    return solution[start:curr - 1].strip()

def format_myra_solution(problem: str, raw_solution: str, problem_type: str, level: str) -> str:
    """Formats raw competition math solution into Myra's pedagogical response."""
    boxed = extract_boxed_answer(raw_solution)
    
    # 1. Direct one-line answer
    if boxed:
        intro = f"The final answer is ${boxed}$."
    else:
        intro = "Here is the exact method and final result for this problem."

    # 2. Step-by-step method cleanup
    # Remove redundant \\boxed line at the very end to avoid duplication
    cleaned_solution = raw_solution.strip()
    
    # Break into natural paragraphs or steps
    lines = [l.strip() for l in cleaned_solution.split("\n") if l.strip()]
    formatted_steps = "\n\n".join(lines)

    # 3. Assemble Myra response
    myra_response = (
        f"{intro}\n\n"
        f"Let us walk through the steps together:\n\n"
        f"{formatted_steps}\n\n"
        f"Does this make sense? Want a practice question?"
    )
    return myra_response

def convert_dataset(
    parquet_path: Path = DEFAULT_PARQUET,
    output_json: Path = OUTPUT_DIR / "myra_math_sft.json",
    max_samples: int = 3000,
    balanced: bool = True
):
    if not parquet_path.exists():
        raise FileNotFoundError(f"MATH dataset not found at {parquet_path}. Download it first.")

    print(f"Loading Hendrycks MATH dataset from {parquet_path}...")
    df = pd.read_parquet(parquet_path)
    total_raw = len(df)
    print(f"Loaded {total_raw} competition math problems.")

    # Load Myra system prompt
    if PROMPT_PATH.exists():
        with open(PROMPT_PATH, "r", encoding="utf-8") as f:
            system_prompt = f.read().strip()
    else:
        system_prompt = (
            "You are Myra, the friendly AI study buddy from EdWorld Co. Your mascot is a teddy bear in a hoodie. "
            "Explain math step by step in simple English. Always end with: 'Does this make sense? Want a practice question?'"
        )

    # Balance across categories
    if balanced and max_samples < total_raw:
        categories = df['type'].unique()
        per_cat = max(1, max_samples // len(categories))
        samples = []
        for cat in categories:
            cat_df = df[df['type'] == cat]
            take = min(len(cat_df), per_cat)
            samples.append(cat_df.sample(n=take, random_state=42))
        selected_df = pd.concat(samples).sample(frac=1.0, random_state=42)
    else:
        selected_df = df.iloc[:max_samples]

    print(f"Processing {len(selected_df)} balanced problems into Myra format...")

    dialogues = []
    for _, row in selected_df.iterrows():
        problem_text = row['problem'].strip()
        raw_sol = row['solution'].strip()
        ptype = str(row.get('type', 'Mathematics'))
        level = str(row.get('level', 'Level 3'))

        myra_reply = format_myra_solution(problem_text, raw_sol, ptype, level)

        dialogues.append({
            "conversations": [
                {
                    "from": "human",
                    "value": problem_text
                },
                {
                    "from": "gpt",
                    "value": myra_reply
                }
            ],
            "system": system_prompt,
            "category": ptype,
            "level": level
        })

    # Save to output file
    output_json.parent.mkdir(parents=True, exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(dialogues, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved {len(dialogues)} Myra math dialogues to:\n  {output_json}")

    # Register in LLaMA-Factory dataset_info.json
    register_dataset_info(output_json.name)

def register_dataset_info(filename: str):
    if not DATASET_INFO_FILE.exists():
        print(f"Warning: {DATASET_INFO_FILE} not found. Skipping auto-registration.")
        return

    with open(DATASET_INFO_FILE, "r", encoding="utf-8") as f:
        info = json.load(f)

    info["myra_math"] = {
        "file_name": filename,
        "formatting": "sharegpt",
        "columns": {
            "messages": "conversations",
            "system": "system"
        }
    }

    with open(DATASET_INFO_FILE, "w", encoding="utf-8") as f:
        json.dump(info, f, indent=2, ensure_ascii=False)

    print(f"Registered 'myra_math' dataset in LLaMA-Factory: {DATASET_INFO_FILE}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=2500, help="Number of balanced problems to convert")
    args = parser.parse_args()
    convert_dataset(max_samples=args.samples)
