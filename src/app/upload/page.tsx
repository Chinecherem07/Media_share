'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { showToast } from '@/components/Toast';
import type { Post } from '@/lib/types';
import { Upload, Image, CheckCircle, AlertTriangle, Sparkles, Shield, Loader2, ArrowRight } from 'lucide-react';

export default function UploadPage() {
  const { isLoggedIn, user } = useAuth(); const api = useApi(); const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null); const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState(''); const [location, setLocation] = useState('');
  const [uploading, setUploading] = useState(false); const [result, setResult] = useState<Post | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { if (!isLoggedIn) router.push('/login'); else if (user?.role !== 'creator') { showToast('Creators only', 'error'); router.push('/feed'); } }, [isLoggedIn, user, router]);

  const handleFile = (f: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type)) { showToast('Invalid file.', 'error'); return; }
    if (f.size > 10 * 1024 * 1024) { showToast('Max 10MB.', 'error'); return; }
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!file) { showToast('Select image', 'error'); return; } if (!caption.trim()) { showToast('Caption required', 'error'); return; }
    setUploading(true); try { const fd = new FormData(); fd.append('image', file); fd.append('caption', caption); if (location.trim()) fd.append('location', location);
    const res = await api.createPost(fd); setResult(res.data as Post); showToast('Created!', 'success'); } catch (err) { showToast((err as Error).message, 'error'); } finally { setUploading(false); }
  };

  const resetForm = () => { setFile(null); setPreview(null); setCaption(''); setLocation(''); setResult(null); };
  if (!isLoggedIn || user?.role !== 'creator') return null;

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <h1 className="text-xl font-semibold text-[#1a1a1a] mb-8">Upload</h1>
      {result ? (
        <div className="animate-[fadeIn_0.3s_ease]">
          <div className="text-center mb-8"><CheckCircle className="w-8 h-8 text-[#16a34a] mx-auto mb-2" /><p className="font-semibold text-[#1a1a1a]">Post Created</p></div>
          <img className="max-h-72 rounded-lg mx-auto mb-8" src={result.imageUrl} alt={result.caption} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="border border-[#e5e5e5] rounded-lg p-6 mb-8 space-y-3 text-sm">
            <div className="font-medium text-[#1a1a1a] flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Analysis</div>
            <p className="text-[#737373]">{result.aiCaption}</p>
            <div className="flex flex-wrap gap-1.5">{result.tags.map((t) => <span key={t} className="px-2 py-0.5 bg-[#f5f5f5] text-[#1a1a1a] rounded text-xs">{t}</span>)}</div>
            <p className="text-[#737373]">Status: <span className={result.moderationStatus === 'safe' ? 'text-[#16a34a]' : 'text-[#dc2626]'}>{result.moderationStatus}</span></p>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 h-11 bg-[#18181b] text-white rounded-lg font-medium text-sm hover:bg-[#27272a] transition-colors" onClick={resetForm}>Upload Another</button>
            <button className="flex-1 h-11 border border-[#e5e5e5] rounded-lg text-sm font-medium text-[#737373] hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-1.5" onClick={() => router.push(`/post/${result.id}`)}>View <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`border border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${dragOver ? 'border-[#18181b] bg-[#f5f5f5]' : preview ? 'border-[#e5e5e5] p-4' : 'border-[#d4d4d4] hover:border-[#18181b]'}`}
            onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
            {preview ? <img className="max-h-72 rounded-lg mx-auto" src={preview} alt="Preview" /> : (
              <><Image className="w-10 h-10 text-[#d4d4d4] mx-auto mb-3" /><p className="text-sm font-medium text-[#1a1a1a]">Drop image or click</p><p className="text-xs text-[#a3a3a3] mt-1">Max 10MB</p></>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
          {preview && (<div className="space-y-6 animate-[fadeIn_0.3s_ease]">
            <div><label className="block text-xs font-medium text-[#737373] mb-2 uppercase tracking-widest">Caption *</label>
              <textarea className="w-full px-4 py-3 border border-[#e5e5e5] rounded-lg bg-transparent text-[#1a1a1a] text-sm outline-none focus:border-[#18181b] transition-colors min-h-24 resize-y placeholder:text-[#a3a3a3]" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe..." maxLength={2000} required />
              <div className="text-xs text-[#a3a3a3] text-right mt-1">{caption.length}/2000</div>
            </div>
            <div><label className="block text-xs font-medium text-[#737373] mb-2 uppercase tracking-widest">Location</label>
              <input className="w-full h-11 px-4 border border-[#e5e5e5] rounded-lg bg-transparent text-[#1a1a1a] text-sm outline-none focus:border-[#18181b] transition-colors placeholder:text-[#a3a3a3]" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" maxLength={200} />
            </div>
            <button type="submit" className="w-full h-11 bg-[#18181b] text-white rounded-lg font-medium text-sm hover:bg-[#27272a] disabled:opacity-50 transition-colors flex items-center justify-center gap-2" disabled={uploading}>
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload</>}
            </button>
          </div>)}
        </form>
      )}
    </div>
  );
}
