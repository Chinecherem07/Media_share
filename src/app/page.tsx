'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-16 animate-[fadeIn_0.6s_ease]">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.15] tracking-tight text-[#1a1a1a] mb-6">
          Share your vision.
          <br />
          Discover amazing content.
        </h1>
        <p className="text-base text-[#737373] mb-12 leading-relaxed max-w-md mx-auto">
          An AI-powered media platform. Upload images, discover through intelligent search, and engage with a creative community.
        </p>
        <div className="flex gap-3 justify-center">
          {isLoggedIn && user ? (
            <Link href={user.role === 'creator' ? '/upload' : '/feed'} className="inline-flex items-center gap-2 h-11 px-6 bg-[#18181b] text-white rounded-lg font-medium text-sm no-underline hover:no-underline hover:bg-[#27272a] transition-colors">
              {user.role === 'creator' ? 'Start Uploading' : 'Explore Feed'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 h-11 px-6 bg-[#18181b] text-white rounded-lg font-medium text-sm no-underline hover:no-underline hover:bg-[#27272a] transition-colors">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center h-11 px-6 text-[#737373] border border-[#e5e5e5] rounded-lg font-medium text-sm no-underline hover:no-underline hover:bg-[#f5f5f5] transition-colors">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
