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
        `http://127.0.0.1:8000/yt-summarize/?video_url=${encodeURIComponent(videoUrl)}`
      );

      const data = await response.json();

      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.detail || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please ensure the backend is running.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 dark:bg-error-900/30 text-error-600 dark:text-error-400 mb-4">
          <Youtube className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">YouTube Video Summarizer</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Enter a YouTube video URL to get a comprehensive summary and key points.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5">
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
            className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 
                      bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white input-focus"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !videoUrl.trim()}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium
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

      {summary && (
        <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded">
          <h3 className="text-lg font-semibold mb-2">Summary:</h3>
          <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 dark:text-red-400">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default YouTubeSummarizer;
