'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps { value?: number; onChange?: (value: number) => void; readonly?: boolean; size?: 'sm' | 'md' | 'lg'; }
const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };

export default function StarRating({ value = 0, onChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button"
          className={`transition-all ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)} disabled={readonly}
        >
          <Star className={`${sizeMap[size]} ${star <= (hover || value) ? 'text-[#18181b] fill-[#18181b]' : 'text-[#e5e5e5]'}`} />
        </button>
      ))}
    </div>
  );
}
