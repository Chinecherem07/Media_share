'use client';

import type { Post } from '@/lib/types';
import Link from 'next/link';
import { MapPin, User } from 'lucide-react';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime(); const mins = Math.floor(diff / 60000); const hrs = Math.floor(diff / 3600000); const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now'; if (mins < 60) return `${mins}m ago`; if (hrs < 24) return `${hrs}h ago`; if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.id}`} className="block no-underline text-inherit hover:no-underline group">
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#f5f5f5] mb-3">
        <img className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" src={post.imageUrl} alt={post.caption} loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f5f5f5' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%23a3a3a3'%3ENo image%3C/text%3E%3C/svg%3E"; }}
        />
      </div>
      <p className="text-sm text-[#1a1a1a] font-medium line-clamp-2 leading-snug mb-2">{post.caption}</p>
      <div className="flex items-center gap-2 text-xs text-[#a3a3a3]">
        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.userName}</span>
        <span>·</span>
        <span>{timeAgo(post.createdAt)}</span>
        {post.location && <><span>·</span><span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{post.location}</span></>}
      </div>
    </Link>
  );
}
