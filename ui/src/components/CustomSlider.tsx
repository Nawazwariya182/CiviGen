import React from 'react';

interface CustomSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: '#111827',
            background: '#F3F4F6',
            padding: '2px 8px',
            borderRadius: 6,
            border: '1px solid #E5E7EB'
          }}
        >
          {value}{unit}
        </span>
      </div>

      <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
        {/* Track Background */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 6,
            borderRadius: 999,
            background: '#E5E7EB',
            overflow: 'hidden'
          }}
        >
          {/* Active Fill Track */}
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: '#111827',
              borderRadius: 999,
              transition: 'width 50ms linear'
            }}
          />
        </div>

        {/* Native Transparent Slider with Custom Thumb Styling */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 10,
            margin: 0
          }}
        />

        {/* Visual Thumb Follower */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${percentage}% - 8px)`,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '2px solid #111827',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            pointerEvents: 'none',
            transition: 'left 50ms linear, transform 100ms ease'
          }}
        />
      </div>
    </div>
  );
};
