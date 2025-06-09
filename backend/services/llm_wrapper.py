# backend/services/llm_wrapper.py

import google.generativeai as genai
from config.env import GEMINI_API_KEY  # 👈 Import the key

# ✅ Configure the Gemini SDK with the key from .env
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Load the model (no "models/" prefix needed)
model = genai.GenerativeModel("gemini-2.0-flash-exp")

def get_llm_response(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
        else:
            print("Empty Gemini response object:", response)
            return "The LLM returned no summary."
    except Exception as e:
        print("Error calling Gemini:", str(e))
        return f"LLM Error: {str(e)}"
