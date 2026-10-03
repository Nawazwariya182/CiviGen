import React, { useEffect, useRef } from 'react';

interface StyleCardDotMatrixProps {
  active?: boolean;
  isHovered?: boolean;
  isAuto?: boolean;
}

export const StyleCardDotMatrix: React.FC<StyleCardDotMatrixProps> = ({
  active = false,
  isHovered = false,
  isAuto = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = Math.random() * 10;

    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      // Advance speed depending on state
      const speed = isAuto ? 0.04 : (active ? 0.055 : (isHovered ? 0.04 : 0.022));
      time += speed;

      ctx.clearRect(0, 0, width, height);

      if (isAuto) {
        // Pure White background for Auto card as requested by theme
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      const spacing = 7.0; // Crisp high-density dot spacing
      const cx = width * 0.5;
      const cy = height * 0.5;

      // Color wave propagation centers moving across the matrix
      const emitterX = cx + Math.cos(time * 0.9) * (width * 0.4);
      const emitterY = cy + Math.sin(time * 0.7) * (height * 0.35);

      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const dx = x - emitterX;
          const dy = y - emitterY;
          const distSq = dx * dx + dy * dy;
          const emitterEnergy = Math.exp(-distSq / (2 * 45 * 45));

          const wave = Math.sin((x * 0.035 + y * 0.02) - time * 2.0);
          const rawEnergy = emitterEnergy * 0.7 + (wave + 1.0) * 0.3;
          const energy = Math.max(0, Math.min(1.0, rawEnergy));

          const baseRadius = 0.75;
          const dotRadius = baseRadius + energy * (active ? 0.85 : 0.55);

          if (isAuto) {
            // High contrast dots on pure white
            if (energy > 0.7) {
              ctx.fillStyle = '#1D4ED8';
            } else if (energy > 0.4) {
              ctx.fillStyle = 'rgba(37, 99, 235, 0.85)';
            } else {
              ctx.fillStyle = 'rgba(203, 213, 225, 0.65)';
            }
          } else {
            // Translucent glowing matrix dots overlaid on the architectural photograph
            if (active) {
              if (energy > 0.65) {
                ctx.fillStyle = '#1D4ED8'; // Electric Royal Blue
              } else if (energy > 0.35) {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.9)'; // Vivid Azure
              } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; // Crisp white resting dot
              }
            } else if (isHovered) {
              if (energy > 0.5) {
                ctx.fillStyle = 'rgba(37, 99, 235, 0.85)';
              } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
              }
            } else {
              // Subtle resting dot matrix: clean fine dots visible on top of image
              if (energy > 0.7) {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
              } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
              }
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [active, isHovered, isAuto]);

  return (
    <canvas
      ref={canvasRef}
      width={96}
      height={56}
      className={`style-card-canvas ${active ? 'active' : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        borderRadius: '8px 8px 0 0'
      }}
    />
  );
};
