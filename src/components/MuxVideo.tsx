import { getMuxThumbnail } from '../lib/mux';

interface MuxVideoProps {
  playbackId: string;
  className?: string;
  poster?: string;
}

export default function MuxVideo({ playbackId, className = '', poster }: MuxVideoProps) {
  const posterUrl = poster || getMuxThumbnail(playbackId);

  return (
    <mux-player
      className={className}
      playback-id={playbackId}
      poster={posterUrl}
      stream-type="on-demand"
      metadata-video-title="Portfolio Video"
    />
  );
}
