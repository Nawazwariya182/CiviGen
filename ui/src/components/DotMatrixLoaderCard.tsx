import React, { useEffect, useRef, useState } from 'react';
import { Square } from 'lucide-react';

interface DotMatrixLoaderCardProps {
  modelName?: string;
  taskCode?: string;
  prompt?: string;
  onCancel?: () => void;
  onStop?: () => void;
}

export const DotMatrixLoaderCard: React.FC<DotMatrixLoaderCardProps> = ({ onCancel, onStop }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState<number>(3);

  // Poll real diffusion step progress directly from the backend sampler
  useEffect(() => {
    let isMounted = true;
    let pollCount = 0;

    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/v1/generation-progress');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.is_generating && typeof data.percentage === 'number' && data.percentage > 0) {
              // During active generation, track real sampler step % and clamp to 99% max before final render arrives
              const target = Math.min(99, Math.max(3, data.percentage));
              setProgress((prev) => (target > prev ? target : prev));
            } else {
              // During initial API dispatch/conditioning, smoothly crawl 1% at a time up to 12% max
              pollCount++;
              if (pollCount < 15) {
                setProgress((prev) => Math.min(12, prev + 1));
              }
            }
          }
        }
      } catch {
        pollCount++;
        if (isMounted && pollCount < 15) {
          setProgress((prev) => Math.min(12, prev + 1));
        }
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 180);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 60 FPS Canvas: Fixed Static Dot Grid on Pure White with Traveling Color Waves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.032;
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      // 1. Pure White Theme Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const spacing = 12.0; // Crisp high-density dot matrix spacing
      const cx = width * 0.5;
      const cy = height * 0.5;

      // Color wave propagation centers moving gracefully across the matrix
      const colorEmitters = [
        {
          x: cx + Math.cos(time * 0.85) * (width * 0.32),
          y: cy + Math.sin(time * 0.65) * (height * 0.32),
          radius: 95
        },
        {
          x: cx + Math.sin(time * 1.1 + 2.0) * (width * 0.36),
          y: cy + Math.cos(time * 0.9 + 1.5) * (height * 0.34),
          radius: 110
        },
        {
          x: cx + Math.cos(time * 0.55 + 4.0) * (width * 0.28),
          y: cy + Math.sin(time * 0.8 + 3.2) * (height * 0.26),
          radius: 85
        }
      ];

      // Draw every dot at FIXED regular positions (NO dot movement, only COLOR flows)
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          // Calculate chromatic wave intensity at this static dot location
          let emitterEnergy = 0;
          for (let i = 0; i < colorEmitters.length; i++) {
            const em = colorEmitters[i];
            const dx = x - em.x;
            const dy = y - em.y;
            const d2 = dx * dx + dy * dy;
            emitterEnergy += Math.exp(-d2 / (2 * em.radius * em.radius));
          }

          // Harmonic diagonal color waves sweeping across the matrix
          const wave1 = Math.sin((x + y) * 0.018 - time * 2.2);
          const wave2 = Math.cos((x * 0.02 - y * 0.015) + time * 1.6);
          const wave3 = Math.sin(Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) * 0.035 - time * 2.4);

          // Combined normalized color energy [0..1]
          const rawEnergy = emitterEnergy * 0.65 + (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3 + 1.0) * 0.35;
          const energy = Math.max(0, Math.min(1.0, rawEnergy));

          // Small max dot size: Base radius 1.0px, illuminated peak 1.6px
          const dotRadius = 1.0 + energy * 0.6;

          // Color flows through the static dots:
          // Low energy: soft subtle pale-blue resting dot
          // High energy: rich electric blue, vivid royal blue, and deep sapphire
          if (energy > 0.75) {
            // Core color wave: Deep Royal Blue
            ctx.fillStyle = '#1D4ED8';
          } else if (energy > 0.48) {
            // Mid crest: Vibrant Electric Azure
            const alpha = 0.55 + (energy - 0.48) * 1.5;
            ctx.fillStyle = `rgba(37, 99, 235, ${Math.min(1.0, alpha)})`;
          } else if (energy > 0.26) {
            // Leading edge: Soft Sky Blue
            const alpha = 0.28 + energy * 0.4;
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          } else {
            // Ambient resting dots: Clean subtle slate-blue on white
            ctx.fillStyle = 'rgba(203, 213, 225, 0.65)';
          }

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Keep canvas 1:1 square matching parent dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          const side = Math.floor(entry.contentRect.width);
          canvas.width = side;
          canvas.height = side;
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      const side = canvas.parentElement.clientWidth || 440;
      canvas.width = side;
      canvas.height = side;
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: 440,
        width: '100%',
        aspectRatio: '1 / 1',
        margin: '0 0 24px 0', // Aligned flush to the left
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        animation: 'fadeIn 250ms ease-out'
      }}
    >
      {/* 1:1 Canvas with Fixed Dot Grid where Color Moves on Pure White */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />

      {/* Stop Generation Button */}
      {(onCancel || onStop) && (
        <button
          type="button"
          onClick={() => {
            if (onCancel) onCancel();
            else if (onStop) onStop();
          }}
          className="loader-stop-btn"
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            zIndex: 10,
            marginTop: 0,
            padding: '5px 12px',
            fontSize: 11
          }}
          title="Stop active generation"
        >
          <Square size={10} fill="currentColor" /> Stop
        </button>
      )}

      {/* Floating Percentage Capsule Badge in bottom right corner */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          right: 14,
          background: 'rgba(17, 24, 39, 0.92)',
          backdropFilter: 'blur(8px)',
          borderRadius: 9999,
          padding: '4px 13px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 13,
          fontWeight: 700,
          color: '#38BDF8',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          letterSpacing: '-0.02em',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        {progress}%
      </div>
    </div>
  );
};
