from fastapi import APIRouter, Query, HTTPException
from services.yt_summarizer import fetch_and_summarize_transcript

router = APIRouter()

@router.get("/yt-summarize/")
async def yt_summarize(video_url: str = Query(...)):
    print("Route hit with video_url:", video_url)
    try:
        summary = fetch_and_summarize_transcript(video_url)
        return {"summary": summary}
    except RuntimeError as e:
        print("Backend error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
