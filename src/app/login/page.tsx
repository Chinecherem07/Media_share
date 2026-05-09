'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/components/Toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'consumer' | 'creator'>('consumer');
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    const form = new FormData(e.currentTarget);
    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const body = tab === 'login' ? { email: form.get('email'), password: form.get('password') } : { email: form.get('email'), password: form.get('password'), displayName: form.get('displayName'), role };
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message || 'Request failed');
      setAuth(data.data.user, data.data.token);
      showToast(tab === 'login' ? 'Welcome back!' : 'Account created!', 'success');
      router.push(data.data.user.role === 'creator' ? '/upload' : '/feed');
    } catch (err) { showToast((err as Error).message, 'error'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm animate-[fadeIn_0.4s_ease]">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">MediaShare</h1>
          <p className="text-sm text-[#a3a3a3] mt-1.5">Continue to your account</p>
        </div>

        {/* Underline Tabs */}
        <div className="flex gap-6 mb-10 border-b border-[#e5e5e5]">
          <button className={`pb-3 text-sm font-medium transition-colors ${tab === 'login' ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]' : 'text-[#a3a3a3] hover:text-[#737373]'}`} onClick={() => setTab('login')}>Sign In</button>
          <button className={`pb-3 text-sm font-medium transition-colors ${tab === 'signup' ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]' : 'text-[#a3a3a3] hover:text-[#737373]'}`} onClick={() => setTab('signup')}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#737373] mb-2 uppercase tracking-widest">Role</label>
                  <div className="flex gap-3">
                    <button type="button" className={`flex-1 h-10 text-sm font-medium rounded-lg border transition-colors ${role === 'creator' ? 'border-[#18181b] bg-[#18181b] text-white' : 'border-[#e5e5e5] text-[#737373] hover:bg-[#f5f5f5]'}`} onClick={() => setRole('creator')}>Creator</button>
                    <button type="button" className={`flex-1 h-10 text-sm font-medium rounded-lg border transition-colors ${role === 'consumer' ? 'border-[#18181b] bg-[#18181b] text-white' : 'border-[#e5e5e5] text-[#737373] hover:bg-[#f5f5f5]'}`} onClick={() => setRole('consumer')}>Consumer</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#737373] mb-2 uppercase tracking-widest" htmlFor="displayName">Name</label>
                  <input className="w-full h-11 px-4 border border-[#e5e5e5] rounded-lg bg-transparent text-[#1a1a1a] outline-none focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b]/10 transition-all placeholder:text-[#a3a3a3] text-sm" name="displayName" id="displayName" type="text" placeholder="Your name" required />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-[#737373] mb-2 uppercase tracking-widest" htmlFor="email">Email</label>
              <input className="w-full h-11 px-4 border border-[#e5e5e5] rounded-lg bg-transparent text-[#1a1a1a] outline-none focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b]/10 transition-all placeholder:text-[#a3a3a3] text-sm" name="email" id="email" type="email" placeholder="you@email.com" required />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#737373] mb-2 uppercase tracking-widest" htmlFor="password">Password</label>
              <input className="w-full h-11 px-4 border border-[#e5e5e5] rounded-lg bg-transparent text-[#1a1a1a] outline-none focus:border-[#18181b] focus:ring-1 focus:ring-[#18181b]/10 transition-all placeholder:text-[#a3a3a3] text-sm" name="password" id="password" type="password" placeholder="••••••••" required minLength={6} />
            </div>

            <button type="submit" className="w-full h-11 mt-2 bg-[#18181b] text-white rounded-lg font-medium text-sm hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (tab === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
