import React, { useEffect, useRef } from 'react';
import { WallpaperConfig, renderWallpaperOnCanvas, getCanvasDimensions } from '../../utils/wallpaperGenerator';

interface Props {
  config: WallpaperConfig;
  className?: string;
}

export const WallpaperPreviewCanvas: React.FC<Props> = ({ config, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = getCanvasDimensions(config.aspectRatio);

  // Re-render wallpaper canvas whenever config changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderWallpaperOnCanvas(canvas, config);
  }, [config]);

  // Compute CSS aspect ratio
  const aspectRatioStyle = {
    aspectRatio: `${width} / ${height}`,
  };

  return (
    <div
      className={`relative rounded-[36px] overflow-hidden shadow-2xl border-4 border-zinc-800/80 bg-black flex items-center justify-center transition-all ${className}`}
      style={aspectRatioStyle}
    >
      {/* High-Resolution Live Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none select-none"
        style={{ display: 'block' }}
      />

      {/* Subtle Phone Bezel Reflection */}
      <div className="absolute inset-0 rounded-[32px] pointer-events-none border border-white/10 shadow-inner" />
    </div>
  );
};

