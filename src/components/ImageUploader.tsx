import React, { useRef, useState } from 'react';
import { Upload, Camera } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageSelect: (base64: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'wide';
}

export default function ImageUploader({
  currentImage,
  onImageSelect,
  label = 'Upload Photo',
  aspectRatio = 'square',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageSelect(result);
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const displayImage = preview || currentImage;

  const ratioClass = aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'landscape' ? 'aspect-[4/3]' : aspectRatio === 'wide' ? 'aspect-video' : 'aspect-[3/4]';

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all cursor-pointer group ${ratioClass} ${displayImage ? 'border-indigo-200 dark:border-indigo-800' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'}`}
      >
        {displayImage ? (
          <>
            <img src={displayImage} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
            <Upload className="w-6 h-6" />
            <span className="text-xs font-medium">Click to upload</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      </div>
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
