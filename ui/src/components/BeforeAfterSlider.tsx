import React, { useState, useRef } from 'react';
import { MoveHorizontal, Columns, Maximize2, SplitSquareHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  onOpenModal?: (url: string, title: string) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Input Reference / Sketch',
  afterLabel = 'AI Render',
  onOpenModal
}) => {
  // Default to interactive slider view as requested by user
  const [mode, setMode] = useState<'side_by_side' | 'slider'>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {/* Comparison Mode Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: '6px 12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setMode('side_by_side')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: mode === 'side_by_side' ? 600 : 500,
              background: mode === 'side_by_side' ? '#111827' : 'transparent',
              color: mode === 'side_by_side' ? '#FFFFFF' : '#4B5563',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <Columns size={13} /> Full Side-by-Side
          </button>

          <button
            onClick={() => setMode('slider')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: mode === 'slider' ? 600 : 500,
              background: mode === 'slider' ? '#111827' : 'transparent',
              color: mode === 'slider' ? '#FFFFFF' : '#4B5563',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <SplitSquareHorizontal size={13} /> Split Slider
          </button>
        </div>

        {mode === 'slider' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#6B7280', marginRight: 4 }}>Quick View:</span>
            <button
              onClick={() => setSliderPosition(100)}
              style={{
                fontSize: 11,
                padding: '2px 8px',
                border: '1px solid #D1D5DB',
                borderRadius: 4,
                background: sliderPosition === 100 ? '#111827' : '#FFFFFF',
                color: sliderPosition === 100 ? '#FFFFFF' : '#374151',
                cursor: 'pointer'
              }}
            >
              100% Input
            </button>
            <button
              onClick={() => setSliderPosition(50)}
              style={{
                fontSize: 11,
                padding: '2px 8px',
                border: '1px solid #D1D5DB',
                borderRadius: 4,
                background: sliderPosition === 50 ? '#111827' : '#FFFFFF',
                color: sliderPosition === 50 ? '#FFFFFF' : '#374151',
                cursor: 'pointer'
              }}
            >
              50/50
            </button>
            <button
              onClick={() => setSliderPosition(0)}
              style={{
                fontSize: 11,
                padding: '2px 8px',
                border: '1px solid #D1D5DB',
                borderRadius: 4,
                background: sliderPosition === 0 ? '#111827' : '#FFFFFF',
                color: sliderPosition === 0 ? '#FFFFFF' : '#374151',
                cursor: 'pointer'
              }}
            >
              100% Render
            </button>
          </div>
        )}
      </div>

      {/* Mode 1: Full Side-by-Side (Full images, not half) */}
      {mode === 'side_by_side' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14, width: '100%' }}>
          {/* Before Image Panel */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 10,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div
              style={{
                padding: '8px 12px',
                background: '#FAFAFA',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#E0E7FF', color: '#3730A3', padding: '2px 6px', borderRadius: 4 }}>
                  Input
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                  {beforeLabel}
                </span>
              </div>
              {onOpenModal && (
                <button
                  onClick={() => onOpenModal(beforeUrl, beforeLabel)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center' }}
                  title="Expand to Fullscreen"
                >
                  <Maximize2 size={13} />
                </button>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F3F4F6',
                padding: 12,
                minHeight: 380,
                maxHeight: 560
              }}
            >
              <img
                src={beforeUrl}
                alt={beforeLabel}
                style={{
                  maxWidth: '100%',
                  maxHeight: 520,
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 6,
                  cursor: onOpenModal ? 'pointer' : 'default',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onClick={() => onOpenModal && onOpenModal(beforeUrl, beforeLabel)}
              />
            </div>
          </div>

          {/* After Image Panel */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 10,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div
              style={{
                padding: '8px 12px',
                background: '#FAFAFA',
                borderBottom: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: 4 }}>
                  Output
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                  {afterLabel}
                </span>
              </div>
              {onOpenModal && (
                <button
                  onClick={() => onOpenModal(afterUrl, afterLabel)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center' }}
                  title="Expand to Fullscreen"
                >
                  <Maximize2 size={13} />
                </button>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F3F4F6',
                padding: 12,
                minHeight: 380,
                maxHeight: 560
              }}
            >
              <img
                src={afterUrl}
                alt={afterLabel}
                style={{
                  maxWidth: '100%',
                  maxHeight: 520,
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 6,
                  cursor: onOpenModal ? 'pointer' : 'default',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onClick={() => onOpenModal && onOpenModal(afterUrl, afterLabel)}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Interactive Split Slider */
        <div
          ref={containerRef}
          className="comparison-container"
          style={{ height: 500, background: '#1E293B' }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
        >
          {/* After Image (Full background) */}
          <div className="comparison-image-after">
            <img
              src={afterUrl}
              alt={afterLabel}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 4, backdropFilter: 'blur(4px)', fontWeight: 600 }}>
              {afterLabel}
            </span>
          </div>

          {/* Before Image (Clipped with polygon) */}
          <div
            className="comparison-image-before"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
            }}
          >
            <img
              src={beforeUrl}
              alt={beforeLabel}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <span style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, padding: '4px 10px', borderRadius: 4, backdropFilter: 'blur(4px)', fontWeight: 600 }}>
              {beforeLabel}
            </span>
          </div>

          {/* Slider Divider Bar */}
          <div
            className="comparison-slider-handle"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="comparison-slider-circle">
              <MoveHorizontal size={16} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
