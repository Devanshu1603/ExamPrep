from llm_wrapper import generate_answer_from_context

context = "Python is a high-level, interpreted programming language."
query = "What is Python?"

answer = generate_answer_from_context(context, query)
print("Gemini LLM Response:", answer)
