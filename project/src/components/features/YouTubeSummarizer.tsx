import React, { useState } from 'react';
import { Youtube, ArrowRight } from 'lucide-react';

const YouTubeSummarizer: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setIsSubmitting(true);
    setSummary('');
    setError('');

    try {
      const response = await fetch(
      `http://localhost:8000/yt-summarize?video_url=${encodeURIComponent(videoUrl)}`
      );

      const result = await response.text();

      let summaryText = '';
      if (response.ok) {
      // Try to parse JSON and extract summary
      try {
        const data = JSON.parse(result);
        if (typeof data.summary === 'string') {
        // Split summary into points by detecting sentences or newlines
        // Here, we split by ". " and join with "\n\n" for points
        summaryText = data.summary
          .split(/\. +/)
          .filter(Boolean)
          .map((point: string, idx: number, arr: string[]) =>
          // Add the period back except for the last point if it already ends with one
          point.endsWith('.') || idx === arr.length - 1 ? point : point + '.'
          )
          .join('\n\n');
        } else {
        summaryText = 'No summary found in response.';
        }
      } catch {
        summaryText = result;
      }
      setSummary(summaryText);
      } else {
      setError(result || 'Failed to fetch summary.');
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
    };

  return (
    <div className="w-full px-2 sm:px-8 py-4 mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400 mb-4">
          <Youtube className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">YouTube Video Summarizer</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Enter a YouTube video URL to get a comprehensive summary and key points.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 w-full">
        <div className="mb-4">
          <label htmlFor="youtube-url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            YouTube Video URL
          </label>
          <input
            id="youtube-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 
                      bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white input-focus text-lg min-h-[48px]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !videoUrl.trim()}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium
                    transition-colors duration-200 ${
                      isSubmitting || !videoUrl.trim()
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                        : 'bg-error-600 hover:bg-error-700 text-white'
                    }`}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <span>Summarize Video</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Summary Output */}
      {summary && (
        <div className="mt-6 bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 min-h-[160px] w-full">
          <h3 className="text-lg font-semibold mb-2">Video Summary:</h3>
          <p className="text-neutral-800 dark:text-neutral-300 whitespace-pre-line text-lg">{summary}</p>
        </div>
      )}

      {/* Error Output */}
      {error && (
        <div className="mt-6 text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}
    </div>
  );
};

export default YouTubeSummarizer;
