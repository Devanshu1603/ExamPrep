import os
import tempfile
from yt_dlp import YoutubeDL
import webvtt
from services.llm_wrapper import get_llm_response

MAX_TOKENS = 10000  # Safe limit for LLM

def fetch_and_summarize_transcript(video_url: str) -> str:
    try:
        # Create a temporary directory for subtitle download
        with tempfile.TemporaryDirectory() as tmpdir:
            options = {
                'skip_download': True,
                'writesubtitles': True,
                'writeautomaticsub': True,
                'subtitleslangs': ['en'],
                'outtmpl': os.path.join(tmpdir, '%(id)s.%(ext)s'),
                'quiet': True
            }

            with YoutubeDL(options) as ydl:
                info = ydl.extract_info(video_url, download=True)
                video_id = info.get("id")
                vtt_file = os.path.join(tmpdir, f"{video_id}.en.vtt")

                if not os.path.exists(vtt_file):
                    return "No English subtitles found for this video."

                # Parse VTT file and extract text
                lines = []
                for caption in webvtt.read(vtt_file):
                    lines.append(caption.text)
                transcript = " ".join(lines).replace('\n', ' ').strip()

                if not transcript:
                    return "Transcript is empty or could not be parsed."

                # Truncate large inputs by character length
                if len(transcript) > MAX_TOKENS * 4:
                    print("Transcript too long. Truncating...")
                    transcript = transcript[:MAX_TOKENS * 4]

                # Build prompt
                prompt = (
                    "You are an expert content summarizer. Summarize the following video transcript "
                    "clearly and concisely in a few paragraphs (3-5), suitable for display on a website. "
                    "Avoid bullet points or lists. Use simple language, and focus on the key ideas and highlights:\n\n"
                    f"{transcript}"
                )

                # Call LLM
                summary = get_llm_response(prompt)
                return summary

    except Exception as e:
        print("❌ Unexpected error while summarizing:", str(e))
        return f"Error fetching or summarizing transcript: {str(e)}"
