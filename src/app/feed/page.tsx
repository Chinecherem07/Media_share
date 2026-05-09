'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import PostCard from '@/components/PostCard';
import { showToast } from '@/components/Toast';
import type { Post, PaginationMeta } from '@/lib/types';
import { Search, X, Loader2 } from 'lucide-react';

export default function FeedPage() {
  const { isLoggedIn } = useAuth(); const api = useApi(); const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]); const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true); const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false); const [page, setPage] = useState(1);

  useEffect(() => { if (!isLoggedIn) router.push('/login'); }, [isLoggedIn, router]);

  const loadFeed = useCallback(async (pageNum: number) => {
    setLoading(true); try { const res = await api.getFeed(pageNum); setPosts(res.data as Post[]); setPagination(res.pagination || null); setIsSearching(false); }
    catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  }, [api]);

  const handleSearch = useCallback(async (pageNum: number = 1) => {
    if (!searchQuery.trim()) { loadFeed(1); return; } setLoading(true);
    try { const res = await api.searchPosts(searchQuery.trim(), pageNum); setPosts(res.data as Post[]); setPagination(res.pagination || null); setIsSearching(true); }
    catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  }, [api, searchQuery, loadFeed]);

  useEffect(() => { if (isLoggedIn) loadFeed(1); }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps
  const handlePageChange = (newPage: number) => { setPage(newPage); isSearching ? handleSearch(newPage) : loadFeed(newPage); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  if (!isLoggedIn) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
        <h1 className="text-xl font-semibold text-[#1a1a1a] tracking-tight">{isSearching ? `"${searchQuery}"` : 'Explore'}</h1>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); handleSearch(1); }} className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
          <input className="w-full h-10 pl-9 pr-8 border border-[#e5e5e5] rounded-lg text-sm bg-transparent text-[#1a1a1a] outline-none focus:border-[#18181b] transition-colors placeholder:text-[#a3a3a3]" type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {isSearching && <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a3a3a3] hover:text-[#1a1a1a]" onClick={() => { setSearchQuery(''); setPage(1); loadFeed(1); }}><X className="w-3.5 h-3.5" /></button>}
        </form>
      </div>
      {loading ? <div className="flex justify-center py-24"><Loader2 className="w-5 h-5 animate-spin text-[#a3a3a3]" /></div>
      : posts.length === 0 ? <div className="text-center py-24"><p className="text-sm text-[#a3a3a3]">{isSearching ? 'No results found.' : 'No posts yet.'}</p></div>
      : (<>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-14">
            <button className="text-sm text-[#737373] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors" disabled={!pagination.hasPrevPage} onClick={() => handlePageChange(page - 1)}>Previous</button>
            <span className="text-xs text-[#a3a3a3]">{pagination.currentPage} / {pagination.totalPages}</span>
            <button className="text-sm text-[#737373] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors" disabled={!pagination.hasNextPage} onClick={() => handlePageChange(page + 1)}>Next</button>
          </div>
        )}
      </>)}
    </div>
  );
}
