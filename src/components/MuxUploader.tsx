import React from 'react';

interface MuxUploaderProps {
  onUploadComplete: (playbackId: string, assetId: string) => void;
  onError: (error: Error) => void;
}

export default function MuxUploader({ onUploadComplete, onError }: MuxUploaderProps) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch('/api/mux/upload', { method: 'POST' });
      const { url, asset_id } = await res.json();

      const uploadRes = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'video/mp4' },
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const checkAsset = async () => {
        const statusRes = await fetch(`/api/mux/asset/${asset_id}`);
        const data = await statusRes.json();
        if (data.playback_id) {
          onUploadComplete(data.playback_id, asset_id);
        } else {
          setTimeout(checkAsset, 2000);
        }
      };
      checkAsset();
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Upload failed'));
    }
  };

  return (
    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
      <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
      Upload Video
    </label>
  );
}
