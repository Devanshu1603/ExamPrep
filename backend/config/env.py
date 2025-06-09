# config/env.py
import os
from dotenv import load_dotenv

# Automatically locate and load .env file
load_dotenv()

# Export the API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in .env file!")
