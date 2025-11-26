import React, { useState } from 'react';
import { Download, Youtube, AlertCircle, CheckCircle2, Loader2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Label, Button } from '../../components/ui';

interface Comment {
  author: string;
  comment: string;
  reply_author: string;
  reply: string;
  publishedAt: string;
}

const YouTubeCrawlerContent: React.FC = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState('');

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';

  const extractVideoId = (url: string): string | null => {
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    const regex1 = /[?&]v=([^&]+)/;
    const match1 = url.match(regex1);
    if (match1) return match1[1];

    // Format: https://youtu.be/VIDEO_ID
    const regex2 = /youtu\.be\/([^?]+)/;
    const match2 = url.match(regex2);
    if (match2) return match2[1];

    // Format: https://www.youtube.com/shorts/VIDEO_ID
    const regex3 = /\/shorts\/([^?]+)/;
    const match3 = url.match(regex3);
    if (match3) return match3[1];

    return null;
  };

  const isShorts = (url: string): boolean => {
    return url.includes('/shorts/');
  };

  const fetchComments = async (
    videoId: string,
    apiKey: string,
    pageToken?: string
  ): Promise<{ items: any[]; nextPageToken?: string }> => {
    let url = `https://www.googleapis.com/youtube/v3/commentThreads?key=${apiKey}&textFormat=plainText&part=snippet&videoId=${videoId}&maxResults=100`;
    
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch comments');
    }

    return await response.json();
  };

  const fetchReplies = async (
    commentId: string,
    apiKey: string
  ): Promise<any[]> => {
    const url = `https://www.googleapis.com/youtube/v3/comments?key=${apiKey}&textFormat=plainText&part=snippet&parentId=${commentId}`;
    
    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();
    return data.items || [];
  };

  const getYouTubeComments = async (
    videoId: string,
    apiKey: string
  ): Promise<Comment[]> => {
    const comments: Comment[] = [];
    let pageToken: string | undefined = undefined;
    let pageCount = 0;

    do {
      const data = await fetchComments(videoId, apiKey, pageToken);
      pageCount++;
      setProgress(`Fetching page ${pageCount}...`);

      for (const item of data.items || []) {
        const topComment = item.snippet.topLevelComment.snippet;
        const commentId = item.snippet.topLevelComment.id;

        const comment = topComment.textDisplay;
        const author = topComment.authorDisplayName;
        const commentTime = topComment.publishedAt;

        const replyItems = await fetchReplies(commentId, apiKey);
        
        if (replyItems.length > 0) {
          comments.push({
            author,
            comment,
            reply_author: replyItems[0].snippet.authorDisplayName,
            reply: replyItems[0].snippet.textDisplay,
            publishedAt: commentTime,
          });

          for (let i = 1; i < replyItems.length; i++) {
            comments.push({
              author: '',
              comment: '',
              reply_author: replyItems[i].snippet.authorDisplayName,
              reply: replyItems[i].snippet.textDisplay,
              publishedAt: '',
            });
          }
        } else {
          comments.push({
            author,
            comment,
            reply_author: '',
            reply: '',
            publishedAt: commentTime,
          });
        }
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    return comments;
  };

  const generateExcel = (comments: Comment[], filename: string) => {
    const headers = ['Author', 'Comment', 'Reply Author', 'Reply', 'Published At'];
    const rows = comments.map(c => [
      c.author,
      c.comment.replace(/"/g, '""'),
      c.reply_author,
      c.reply.replace(/"/g, '""'),
      c.publishedAt,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleCrawl = async () => {
    setError(null);
    setSuccess(false);
    setProgress('');

    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your YouTube API Key');
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError('Invalid YouTube URL. Please check the format.');
      return;
    }

    setIsLoading(true);

    try {
      setProgress('Starting to fetch comments...');
      const comments = await getYouTubeComments(videoId, apiKey);

      if (comments.length === 0) {
        setError('No comments found for this video.');
        return;
      }

      setProgress(`Found ${comments.length} comments. Generating file...`);

      const videoType = isShorts(videoUrl) ? 'shorts' : 'video';
      const filename = `youtube_${videoType}_comments_${videoId}_${Date.now()}.csv`;
      
      generateExcel(comments, filename);

      setSuccess(true);
      setVideoUrl('');
      setProgress(`Successfully downloaded ${comments.length} comments!`);
      
      setTimeout(() => {
        setSuccess(false);
        setProgress('');
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to crawl comments. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950">
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 transition-all duration-200 group"
      >
        <Home className="h-5 w-5" />
      </button>

      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-900/50">
              <Youtube className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-100">YouTube Crawler</h1>
            <p className="text-zinc-400">Extract comments from YouTube videos and shorts</p>
          </div>
        </div>

        <Card>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {/* <div className="space-y-2">
                <Label htmlFor="apiKey">YouTube API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                />
                <p className="text-xs text-zinc-500">
                  Get your API key from{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 underline"
                  >
                    Google Cloud Console
                  </a>
                </p>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube Video URL</Label>
                <Input
                  id="videoUrl"
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                />
                <p className="text-xs text-zinc-500">
                  Supports regular videos and shorts
                </p>
              </div>
            </div>

            {progress && (
              <div className="rounded-lg bg-blue-950/30 border border-blue-900/50 p-3">
                <p className="text-sm text-blue-400">{progress}</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 text-sm text-green-400 bg-green-950/30 border border-green-900/50 p-3 rounded-lg">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Comments downloaded successfully!</span>
              </div>
            )}

            <Button
              className="w-full h-12 text-base font-semibold !bg-red-600 hover:!bg-red-700 !text-white"
              onClick={handleCrawl}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Crawling...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Crawl & Download
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="text-center text-xs text-zinc-500 px-4">
          <p className="mt-1">
            Note: YouTube API has quota limits. Free tier allows ~10,000 requests/day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default YouTubeCrawlerContent;