'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import StarRating from '@/components/StarRating';
import { showToast } from '@/components/Toast';
import type { Post, Comment } from '@/lib/types';
import { ArrowLeft, Sparkles, Star, MessageSquare, MapPin, Send, Loader2 } from 'lucide-react';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime(); const mins = Math.floor(diff / 60000); const hrs = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now'; if (mins < 60) return `${mins}m ago`; if (hrs < 24) return `${hrs}h ago`; if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const { isLoggedIn, user } = useAuth(); const api = useApi(); const router = useRouter();
  const [post, setPost] = useState<Post | null>(null); const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState(''); const [userRating, setUserRating] = useState(0);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true); const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!isLoggedIn) router.push('/login'); }, [isLoggedIn, router]);

  const loadPost = useCallback(async () => {
    try { const [pRes, cRes, rRes] = await Promise.all([api.getPost(id), api.getComments(id), api.getRatings(id)]);
    setPost(pRes.data as Post); setComments((cRes.data || []) as Comment[]);
    const rd = rRes.data as { stats: { averageRating: number; totalRatings: number } }; setRatingStats(rd.stats);
    } catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  }, [api, id]);

  useEffect(() => { if (isLoggedIn) loadPost(); }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleComment = async (e: React.FormEvent) => { e.preventDefault(); if (!commentText.trim()) return; setSubmitting(true);
    try { const res = await api.addComment(id, commentText.trim()); setComments((prev) => [res.data as Comment, ...prev]); setCommentText(''); showToast('Added!', 'success'); }
    catch (err) { showToast((err as Error).message, 'error'); } finally { setSubmitting(false); } };

  const handleRate = async (score: number) => { setUserRating(score);
    try { await api.addRating(id, score); showToast(`Rated ${score}/5`, 'success'); const rr = await api.getRatings(id);
    const rd = rr.data as { stats: { averageRating: number; totalRatings: number } }; setRatingStats(rd.stats); }
    catch (err) { showToast((err as Error).message, 'error'); } };

  if (!isLoggedIn) return null;
  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-5 h-5 animate-spin text-[#a3a3a3]" /></div>;
  if (!post) return <div className="text-center py-32"><p className="text-sm text-[#a3a3a3] mb-3">Not found</p><button onClick={() => router.push('/feed')} className="text-sm text-[#18181b] underline">Back</button></div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-[#a3a3a3] hover:text-[#1a1a1a] transition-colors mb-8"><ArrowLeft className="w-4 h-4" /> Back</button>

      <img className="w-full rounded-lg mb-8" src={post.imageUrl} alt={post.caption} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#18181b] text-white flex items-center justify-center font-semibold text-sm">{post.userName.charAt(0).toUpperCase()}</div>
        <div><div className="text-sm font-medium text-[#1a1a1a]">{post.userName}</div><div className="text-xs text-[#a3a3a3]">{timeAgo(post.createdAt)}</div></div>
      </div>

      <p className="text-base text-[#1a1a1a] leading-relaxed mb-2">{post.caption}</p>
      {post.location && <p className="flex items-center gap-1 text-sm text-[#a3a3a3] mb-8"><MapPin className="w-3.5 h-3.5" />{post.location}</p>}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-8">{post.tags.map((t) => <span key={t} className="px-2.5 py-1 bg-[#f5f5f5] text-[#1a1a1a] rounded-md text-xs">{t}</span>)}</div>

      {/* AI */}
      <div className="border-t border-[#e5e5e5] pt-6 mb-6">
        <h3 className="text-xs font-medium text-[#a3a3a3] uppercase tracking-widest mb-3">AI Analysis</h3>
        <p className="text-sm text-[#737373] italic leading-relaxed">{post.aiCaption}</p>
      </div>

      {/* Rating */}
      <div className="border-t border-[#e5e5e5] pt-6 mb-6">
        <h3 className="text-xs font-medium text-[#a3a3a3] uppercase tracking-widest mb-3">Rating</h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-[#1a1a1a]">{ratingStats.averageRating}</span>
          <StarRating value={Math.round(ratingStats.averageRating)} readonly size="md" />
          <span className="text-sm text-[#a3a3a3]">({ratingStats.totalRatings})</span>
        </div>
        {user?.role === 'consumer' && <div className="flex items-center gap-3"><span className="text-sm text-[#737373]">Rate:</span><StarRating value={userRating} onChange={handleRate} /></div>}
      </div>

      {/* Comments */}
      <div className="border-t border-[#e5e5e5] pt-6">
        <h3 className="text-xs font-medium text-[#a3a3a3] uppercase tracking-widest mb-4">Comments ({comments.length})</h3>
        {user?.role === 'consumer' && (
          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <input className="flex-1 h-10 px-3 border border-[#e5e5e5] rounded-lg text-sm bg-transparent text-[#1a1a1a] outline-none focus:border-[#18181b] transition-colors placeholder:text-[#a3a3a3]" type="text" placeholder="Comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} maxLength={1000} />
            <button type="submit" className="h-10 px-4 bg-[#18181b] text-white rounded-lg text-sm font-medium hover:bg-[#27272a] disabled:opacity-50 transition-colors" disabled={submitting || !commentText.trim()}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        )}
        {comments.length === 0 ? <p className="text-sm text-[#a3a3a3] italic">No comments yet.</p> : (
          <div className="space-y-4">{comments.map((c) => (
            <div key={c.id}><div className="flex items-center gap-2 mb-1"><span className="text-sm font-medium text-[#1a1a1a]">{c.userName}</span><span className="text-xs text-[#a3a3a3]">{timeAgo(c.createdAt)}</span></div><p className="text-sm text-[#737373]">{c.text}</p></div>
          ))}</div>
        )}
      </div>
    </div>
  );
}
