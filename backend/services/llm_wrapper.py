# backend/services/llm_wrapper.py

import google.generativeai as genai
from config.env import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash")

def get_llm_response(prompt: str) -> str:
    try:
        print("\n🔹 Sending prompt to Gemini LLM...")
        print("🔸 Prompt preview:\n", prompt[:500], "\n...")

        response = model.generate_content(prompt)

        print("🔸 Raw Gemini response object:", response)

        if response and hasattr(response, "text") and response.text:
            print("✅ Gemini returned a response.")
            return response.text.strip()
        else:
            print("⚠️ Gemini response was empty or malformed.")
            return "LLM returned an empty summary."

    except Exception as e:
        print("❌ Error calling Gemini:", str(e))
        return f"LLM Error: {str(e)}"
