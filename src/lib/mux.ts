const MUX_TOKEN_ID = import.meta.env.VITE_MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = import.meta.env.VITE_MUX_TOKEN_SECRET;

export async function createMuxUpload() {
  const res = await fetch('https://api.mux.com/video/v1/uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`),
    },
    body: JSON.stringify({
      cors_origin: window.location.origin,
      new_asset_settings: { playback_policy: ['public'] },
    }),
  });
  return res.json();
}

export function getMuxPlaybackUrl(playbackId: string) {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function getMuxThumbnail(playbackId: string) {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg`;
}
