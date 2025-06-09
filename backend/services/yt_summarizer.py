from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from services.llm_wrapper import get_llm_response
from urllib.parse import urlparse, parse_qs

def extract_video_id(video_url: str) -> str:
    query = urlparse(video_url).query
    return parse_qs(query).get("v", [None])[0]

def fetch_and_summarize_transcript(video_url: str) -> str:
    try:
        video_id = extract_video_id(video_url)
        print("video-id :-", video_id)

        if not video_id:
            return "Invalid YouTube URL."
        
        print("Fetching transcript for video_id:", video_id)

        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        print("transcript :-", transcript_list)

        text = "\n".join([t['text'] for t in transcript_list])
        print("transcript-text :-", text[:300])  # partial print

        if not text.strip():
            return "Transcript is empty."

        prompt = (
            "You are an expert content summarizer. Summarize the following video transcript "
            "clearly and concisely in a few paragraphs (3-5), suitable for display on a website. "
            "Avoid bullet points or lists. Use simple language, and focus on the key ideas and highlights:\n\n"
            f"{text}"
        )

        summary = get_llm_response(prompt)
        print("Generated Summary:", summary[:300])  # partial print
        return summary

    except (TranscriptsDisabled, NoTranscriptFound):
        return "No English transcripts found for this video."
    except Exception as e:
        print("Exception while fetching transcript:", str(e))
        print("Unexpected error:", str(e))
        return f"Unexpected error: {str(e)}"
