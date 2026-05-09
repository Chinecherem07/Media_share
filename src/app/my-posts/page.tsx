'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import PostCard from '@/components/PostCard';
import { showToast } from '@/components/Toast';
import type { Post, PaginationMeta } from '@/lib/types';
import { Upload, Loader2 } from 'lucide-react';

export default function MyPostsPage() {
  const { isLoggedIn, user } = useAuth(); const api = useApi(); const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]); const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true); const [page, setPage] = useState(1);

  useEffect(() => { if (!isLoggedIn) router.push('/login'); else if (user?.role !== 'creator') router.push('/feed'); }, [isLoggedIn, user, router]);

  const loadPosts = useCallback(async (pageNum: number) => {
    setLoading(true); try { const res = await api.getMyPosts(pageNum); setPosts(res.data as Post[]); setPagination(res.pagination || null); }
    catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  }, [api]);

  useEffect(() => { if (isLoggedIn && user?.role === 'creator') loadPosts(1); }, [isLoggedIn, user]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!isLoggedIn || user?.role !== 'creator') return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-xl font-semibold text-[#1a1a1a] tracking-tight">My Posts</h1>
        <button onClick={() => router.push('/upload')} className="inline-flex items-center gap-1.5 h-9 px-4 bg-[#18181b] text-white rounded-lg text-sm font-medium hover:bg-[#27272a] transition-colors">
          <Upload className="w-3.5 h-3.5" /> Upload
        </button>
      </div>
      {loading ? <div className="flex justify-center py-24"><Loader2 className="w-5 h-5 animate-spin text-[#a3a3a3]" /></div>
      : posts.length === 0 ? <div className="text-center py-24"><p className="text-sm text-[#a3a3a3] mb-4">No posts yet.</p><button onClick={() => router.push('/upload')} className="text-sm text-[#18181b] underline underline-offset-2">Upload first image</button></div>
      : (<>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-14">
            <button className="text-sm text-[#737373] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors" disabled={!pagination.hasPrevPage} onClick={() => { setPage(page - 1); loadPosts(page - 1); }}>Previous</button>
            <span className="text-xs text-[#a3a3a3]">{pagination.currentPage} / {pagination.totalPages}</span>
            <button className="text-sm text-[#737373] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors" disabled={!pagination.hasNextPage} onClick={() => { setPage(page + 1); loadPosts(page + 1); }}>Next</button>
          </div>
        )}
      </>)}
    </div>
  );
}
