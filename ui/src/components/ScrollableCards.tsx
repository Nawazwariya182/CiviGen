import React from 'react';
import { Check, Sparkles, Sun, Moon, Sunrise, Lamp, Video } from 'lucide-react';
import { StyleCardDotMatrix } from './StyleCardDotMatrix';

/* =========================================================================
 * 1. Aspect Ratio Cards (ALL aspect ratios with x-scroll and hidden scrollbar)
 * ========================================================================= */
interface AspectRatioOption {
  value: string;
  label: string;
  wireframe: { w: number; h: number };
  isAuto?: boolean;
}

const ALL_ASPECT_RATIOS: AspectRatioOption[] = [
  { value: 'auto', label: 'Auto', wireframe: { w: 18, h: 18 }, isAuto: true },
  { value: '1:1', label: '1:1', wireframe: { w: 18, h: 18 } },
  { value: '16:9', label: '16:9', wireframe: { w: 26, h: 15 } },
  { value: '9:16', label: '9:16', wireframe: { w: 15, h: 26 } },
  { value: '4:3', label: '4:3', wireframe: { w: 22, h: 17 } },
  { value: '3:4', label: '3:4', wireframe: { w: 17, h: 22 } },
  { value: '3:2', label: '3:2', wireframe: { w: 24, h: 16 } },
  { value: '2:3', label: '2:3', wireframe: { w: 16, h: 24 } },
  { value: '5:4', label: '5:4', wireframe: { w: 21, h: 17 } },
  { value: '4:5', label: '4:5', wireframe: { w: 17, h: 21 } },
  { value: '21:9', label: '21:9', wireframe: { w: 30, h: 13 } },
  { value: '2:1', label: '2:1', wireframe: { w: 28, h: 14 } },
  { value: '1:2', label: '1:2', wireframe: { w: 14, h: 28 } },
  { value: '32:9', label: '32:9', wireframe: { w: 34, h: 10 } }
];

export const AspectRatioCards: React.FC<{
  value: string;
  onChange: (val: string) => void;
  detectedRatio?: string;
}> = ({ value, onChange, detectedRatio }) => {
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="sidebar-group-section" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Aspect Ratio</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '1px 7px', borderRadius: 4 }}>
          {value === 'auto' && detectedRatio ? detectedRatio : (ALL_ASPECT_RATIOS.find((r) => r.value === value)?.label || 'Auto')}
        </span>
      </div>

      <div
        className="scroll-strip-no-scrollbar"
        onWheel={handleWheel}
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '4px 2px 6px 2px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          width: '100%'
        }}
      >
        {ALL_ASPECT_RATIOS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <div
              key={opt.value}
              className={`sidebar-opt-card ${isSelected ? 'active' : ''}`}
              onClick={() => onChange(opt.value)}
              title={`Aspect Ratio: ${opt.label}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 62,
                height: 60,
                flexShrink: 0,
                padding: '6px 4px',
                borderRadius: 8,
                border: isSelected ? '1.5px solid #111827' : '1.5px solid #E5E7EB',
                background: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
                  }}
                >
                  <Check size={9} strokeWidth={3} />
                </div>
              )}

              <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {opt.isAuto ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 3px)', gap: 2 }}>
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 3,
                          height: 3,
                          borderRadius: '50%',
                          background: isSelected ? '#2563EB' : '#64748B'
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      width: opt.wireframe.w,
                      height: opt.wireframe.h,
                      border: isSelected ? '1.5px solid #111827' : '1.5px solid #64748B',
                      borderRadius: 2,
                      background: isSelected ? 'rgba(17, 24, 39, 0.08)' : 'transparent',
                      transition: 'all 120ms ease'
                    }}
                  />
                )}
              </div>

              <span style={{ fontSize: 11, fontWeight: isSelected ? 700 : 500, color: isSelected ? '#111827' : '#4B5563', marginTop: 2 }}>
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
 * 2. Resolution Cards (4 Pills in a Row: Auto, 1K, 1.5K, 2K)
 * ========================================================================= */
const RESOLUTION_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1K', label: '1K' },
  { value: '1.5K', label: '1.5K' },
  { value: '2K', label: '2K' }
];

export const ResolutionCards: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="sidebar-group-section" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Resolution</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: '100%' }}>
        {RESOLUTION_OPTIONS.map((opt) => {
          const isSelected = value.toLowerCase() === opt.value.toLowerCase();
          return (
            <div
              key={opt.value}
              className={`sidebar-opt-card ${isSelected ? 'active' : ''}`}
              onClick={() => onChange(opt.value)}
              title={`Resolution: ${opt.label}`}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 34,
                borderRadius: 8,
                border: isSelected ? '1.5px solid #111827' : '1.5px solid #E5E7EB',
                background: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#0F172A' : '#4B5563',
                transition: 'all 150ms ease',
                boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
                  }}
                >
                  <Check size={9} strokeWidth={3} />
                </div>
              )}
              <span>{opt.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
 * 3. Style Preset Cards (ALL styles with x-scroll and hidden scrollbar)
 * ========================================================================= */
interface StylePresetOption {
  value: string;
  label: string;
  imageUrl?: string;
  isAuto?: boolean;
}

const ALL_STYLE_PRESETS: StylePresetOption[] = [
  {
    value: 'auto',
    label: 'Auto',
    isAuto: true
  },
  {
    value: 'Modern Luxury Villa',
    label: 'Modern Luxury',
    imageUrl: '/presets/modern_luxury.jpg'
  },
  {
    value: 'Minimalist Japandi',
    label: 'Japandi',
    imageUrl: '/presets/japandi.jpg'
  },
  {
    value: 'Industrial Brutalist',
    label: 'Brutalist',
    imageUrl: '/presets/brutalist.jpg'
  },
  {
    value: 'Biophilic Contemporary',
    label: 'Biophilic',
    imageUrl: '/presets/biophilic.jpg'
  },
  {
    value: 'Mid-Century Modern',
    label: 'Mid-Century',
    imageUrl: '/presets/midcentury.jpg'
  },
  {
    value: 'Scandinavian Warm',
    label: 'Scandinavian',
    imageUrl: '/presets/scandinavian.jpg'
  },
  {
    value: 'Contemporary Architecture',
    label: 'Contemporary',
    imageUrl: '/presets/contemporary.jpg'
  },
  {
    value: 'Parametric Futuristic',
    label: 'Parametric',
    imageUrl: '/presets/parametric.jpg'
  }
];

export const StylePresetCards: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="sidebar-group-section" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Style Preset</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '1px 7px', borderRadius: 4, maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {ALL_STYLE_PRESETS.find((s) => s.value === value)?.label || 'Auto'}
        </span>
      </div>

      <div
        className="scroll-strip-no-scrollbar"
        onWheel={handleWheel}
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '4px 2px 6px 2px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          width: '100%'
        }}
      >
        {ALL_STYLE_PRESETS.map((opt) => {
          const isSelected = value === opt.value || (opt.isAuto && (value === 'auto' || !value));
          return (
            <div
              key={opt.value}
              className={`sidebar-opt-card ${isSelected ? 'active' : ''}`}
              onClick={() => onChange(opt.value)}
              title={opt.label}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: 76,
                flexShrink: 0,
                borderRadius: 8,
                overflow: 'hidden',
                border: isSelected ? '1.5px solid #111827' : '1.5px solid #E5E7EB',
                background: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
                  }}
                >
                  <Check size={9} strokeWidth={3} />
                </div>
              )}

              <div
                style={{
                  width: '100%',
                  height: 48,
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#F1F5F9'
                }}
              >
                {opt.isAuto ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'radial-gradient(circle at center, #EFF6FF 0%, #DBEAFE 100%)'
                    }}
                  >
                    <StyleCardDotMatrix active={isSelected} isAuto={true} />
                  </div>
                ) : (
                  <img
                    src={opt.imageUrl}
                    alt={opt.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                )}
              </div>

              <div
                style={{
                  padding: '5px 3px',
                  fontSize: 10.5,
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#111827' : '#4B5563',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {opt.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
 * 4. Lighting Atmosphere Cards (ALL lighting options with x-scroll and hidden scrollbar)
 * ========================================================================= */
interface LightingOption {
  value: string;
  label: string;
  isAuto?: boolean;
  gradient: string;
  icon: React.ReactNode;
}

const ALL_LIGHTING_OPTIONS: LightingOption[] = [
  {
    value: 'auto',
    label: 'Auto',
    isAuto: true,
    gradient: 'radial-gradient(circle at center, #E0F2FE 0%, #BAE6FD 60%, #7DD3FC 100%)',
    icon: <Sparkles size={13} style={{ color: '#0369A1' }} />
  },
  {
    value: 'Twilight Golden Hour',
    label: 'Golden Hour',
    gradient: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 50%, #B45309 100%)',
    icon: <Sunrise size={13} style={{ color: '#FFFFFF' }} />
  },
  {
    value: 'Overcast Soft Daylight',
    label: 'Daylight',
    gradient: 'linear-gradient(135deg, #E0F2FE 0%, #38BDF8 60%, #0284C7 100%)',
    icon: <Sun size={13} style={{ color: '#FFFFFF' }} />
  },
  {
    value: 'Cinematic Architectural Dusk',
    label: 'Night',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)',
    icon: <Moon size={13} style={{ color: '#FCD34D' }} />
  },
  {
    value: 'Warm Interior Accent',
    label: 'Warm Accent',
    gradient: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 35%, #D97706 100%)',
    icon: <Lamp size={13} style={{ color: '#78350F' }} />
  },
  {
    value: 'Crisp High Noon',
    label: 'High Noon',
    gradient: 'linear-gradient(135deg, #FDF4FF 0%, #FDE047 30%, #38BDF8 100%)',
    icon: <Sun size={13} style={{ color: '#EAB308' }} />
  },
  {
    value: 'Studio Key Lighting',
    label: 'Studio Key',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #475569 100%)',
    icon: <Video size={13} style={{ color: '#38BDF8' }} />
  }
];

export const LightingPresetCards: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="sidebar-group-section" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Lighting Atmosphere</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '1px 7px', borderRadius: 4, maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {ALL_LIGHTING_OPTIONS.find((l) => l.value === value)?.label || 'Auto'}
        </span>
      </div>

      <div
        className="scroll-strip-no-scrollbar"
        onWheel={handleWheel}
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '4px 2px 6px 2px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          width: '100%'
        }}
      >
        {ALL_LIGHTING_OPTIONS.map((opt) => {
          const isSelected = value === opt.value || (opt.isAuto && (value === 'auto' || !value));
          return (
            <div
              key={opt.value}
              className={`sidebar-opt-card ${isSelected ? 'active' : ''}`}
              onClick={() => onChange(opt.value)}
              title={opt.label}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: 76,
                flexShrink: 0,
                borderRadius: 8,
                overflow: 'hidden',
                border: isSelected ? '1.5px solid #111827' : '1.5px solid #E5E7EB',
                background: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 15,
                    height: 15,
                    borderRadius: '50%',
                    background: '#0F172A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
                  }}
                >
                  <Check size={9} strokeWidth={3} />
                </div>
              )}

              <div
                style={{
                  width: '100%',
                  height: 48,
                  position: 'relative',
                  background: opt.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {opt.icon}
                </div>
              </div>

              <div
                style={{
                  padding: '5px 3px',
                  fontSize: 10.5,
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#111827' : '#4B5563',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {opt.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
