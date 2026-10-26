"""
Model Loader for Myra AI (Level 4 Fine-Tuned Model Integration).
Detects and loads fine-tuned LoRA checkpoints or merged models, providing local inference.
Falls back gracefully to Level 1-2 providers if fine-tuned weights are not present.
"""

import os
from pathlib import Path
from typing import Optional, List, Dict

ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_LORA_PATHS = [
    ROOT_DIR / "training" / "llama_factory" / "saves" / "myra-math-lora",
    ROOT_DIR / "models" / "myra-math-lora",
    ROOT_DIR / "models" / "myra-math-model"
]

_loaded_pipeline = None
_model_path_used = None

def get_finetuned_model_path() -> Optional[Path]:
    """Checks for existing fine-tuned weights."""
    custom_path = os.getenv("FINETUNED_MODEL_PATH")
    if custom_path and Path(custom_path).exists():
        return Path(custom_path)

    for p in DEFAULT_LORA_PATHS:
        # Check if adapter_config.json or config.json exists
        if p.exists() and ((p / "adapter_config.json").exists() or (p / "config.json").exists()):
            return p
    return None

def is_finetuned_model_available() -> bool:
    """Returns True if fine-tuned weights are present."""
    return get_finetuned_model_path() is not None

def generate_finetuned_reply(
    message: str,
    system_prompt: str,
    context: str = "",
    history: List[Dict[str, str]] = None
) -> Optional[str]:
    """Generates a reply using the fine-tuned model if loaded."""
    global _loaded_pipeline, _model_path_used

    model_path = get_finetuned_model_path()
    if not model_path:
        return None

    try:
        if _loaded_pipeline is None or _model_path_used != str(model_path):
            print(f"[Myra ModelLoader] Loading fine-tuned weights from {model_path}...")
            from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
            import torch

            device = "cuda" if torch.cuda.is_available() else "cpu"
            tokenizer = AutoTokenizer.from_pretrained(str(model_path), trust_remote_code=True)
            model = AutoModelForCausalLM.from_pretrained(
                str(model_path),
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                device_map="auto" if device == "cuda" else None,
                trust_remote_code=True
            )
            _loaded_pipeline = pipeline("text-generation", model=model, tokenizer=tokenizer)
            _model_path_used = str(model_path)

        # Assemble prompt with Myra system instructions
        full_system = f"{system_prompt}\n\n{context}" if context else system_prompt
        messages = [{"role": "system", "content": full_system}]
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": message})

        prompt = _loaded_pipeline.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        out = _loaded_pipeline(prompt, max_new_tokens=600, do_sample=True, temperature=0.3)
        generated_text = out[0]["generated_text"][len(prompt):].strip()
        return generated_text

    except Exception as e:
        print(f"[Myra ModelLoader] Error generating with fine-tuned model: {e}")
        return None
