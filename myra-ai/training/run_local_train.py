"""
Local Training Launcher & Validator for Myra AI (Level 4 Fine-Tuning).
Checks dataset integrity, config, and launches local LLaMA-Factory SFT.
"""

import os
import sys
import subprocess
from pathlib import Path

TRAINING_DIR = Path(__file__).resolve().parent
ROOT_DIR = TRAINING_DIR.parent
LLAMA_FACTORY_DIR = TRAINING_DIR / "llama_factory"
DATA_FILE = LLAMA_FACTORY_DIR / "data" / "myra_math_sft.json"
CONFIG_FILE = TRAINING_DIR / "configs" / "myra_lora_sft.yaml"

def check_environment():
    print("=" * 65)
    print("MYRA AI - LEVEL 4 MATH TRAINING PRE-FLIGHT CHECK")
    print("=" * 65)
    
    # 1. Dataset Check
    if not DATA_FILE.exists():
        print(f"[-] Converted dataset not found at {DATA_FILE}")
        print("    Running conversion script...")
        convert_script = ROOT_DIR / "scripts" / "convert_math_to_myra.py"
        subprocess.run([sys.executable, str(convert_script), "--samples", "2500"], check=True)
    else:
        print(f"[+] Dataset verified: {DATA_FILE} ({os.path.getsize(DATA_FILE) / 1024:.1f} KB)")

    # 2. Config Check
    if not CONFIG_FILE.exists():
        print(f"[-] Configuration file not found at {CONFIG_FILE}")
        sys.exit(1)
    else:
        print(f"[+] Configuration verified: {CONFIG_FILE}")

    # 3. LLaMA-Factory Check
    if not LLAMA_FACTORY_DIR.exists():
        print(f"[-] LLaMA-Factory repo not found at {LLAMA_FACTORY_DIR}")
        sys.exit(1)
    else:
        print(f"[+] LLaMA-Factory directory: {LLAMA_FACTORY_DIR}")

    # 4. Hardware Detection
    try:
        import torch
        cuda_avail = torch.cuda.is_available()
        device_name = torch.cuda.get_device_name(0) if cuda_avail else "CPU (No CUDA)"
        print(f"[+] PyTorch Device: {device_name} (CUDA available: {cuda_avail})")
    except ImportError:
        print("[!] PyTorch not detected in active environment.")
        cuda_avail = False

    print("=" * 65)
    return cuda_avail

def run_training(dry_run: bool = False):
    cuda_avail = check_environment()
    
    if not cuda_avail and not dry_run:
        print("\n[NOTE] No CUDA GPU detected on this host (Intel Iris Xe / CPU).")
        print("Training a 1.5B or 7B math model on CPU takes days to converge.")
        print("\nRECOMMENDED WORKFLOWS:")
        print("1. Cloud GPU (1-Click Free Colab T4 GPU):")
        print(f"   Open: {TRAINING_DIR / 'train_colab.ipynb'}")
        print("2. Dry Run / Pipeline Test (CPU):")
        print("   python training/run_local_train.py --dry-run")
        return

    print("\nStarting LLaMA-Factory SFT for Myra Math...")
    # Add llama_factory to python path
    env = os.environ.copy()
    env["PYTHONPATH"] = str(LLAMA_FACTORY_DIR / "src") + os.pathsep + env.get("PYTHONPATH", "")

    cmd = [
        sys.executable,
        "-m", "llamafactory.cli", "train",
        str(CONFIG_FILE)
    ]
    
    print(f"Executing: {' '.join(cmd)}\n")
    try:
        subprocess.run(cmd, cwd=str(LLAMA_FACTORY_DIR), env=env, check=True)
    except subprocess.CalledProcessError as e:
        print(f"\nTraining process exited with code {e.returncode}")
    except KeyboardInterrupt:
        print("\nTraining interrupted by user.")

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv
    run_training(dry_run=is_dry)
