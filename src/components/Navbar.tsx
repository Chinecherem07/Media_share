'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Upload, Search, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="h-14 border-b border-[#e5e5e5] bg-white">
      <div className="max-w-3xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="font-semibold text-base text-[#1a1a1a] tracking-tight no-underline hover:no-underline">
          MediaShare
        </Link>
        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <>
              {user.role === 'creator' && (
                <Link href="/my-posts" className="text-sm text-[#737373] hover:text-[#1a1a1a] no-underline hover:no-underline transition-colors">Posts</Link>
              )}
              <Link href="/feed" className="text-sm text-[#737373] hover:text-[#1a1a1a] no-underline hover:no-underline transition-colors">Feed</Link>
              {user.role === 'creator' && (
                <Link href="/upload" className="inline-flex items-center gap-1.5 h-9 px-4 bg-[#18181b] text-white rounded-lg text-sm font-medium no-underline hover:no-underline hover:bg-[#27272a] transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload
                </Link>
              )}
              <button onClick={() => { logout(); router.push('/'); }} className="flex items-center justify-center w-9 h-9 rounded-lg text-[#a3a3a3] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-[#737373] hover:text-[#1a1a1a] no-underline hover:no-underline transition-colors font-medium">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
