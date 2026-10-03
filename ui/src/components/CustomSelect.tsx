import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
  badge?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  icon,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group options if groups exist
  const groups: Record<string, SelectOption[]> = {};
  options.forEach((opt) => {
    const g = opt.group || '';
    if (!groups[g]) groups[g] = [];
    groups[g].push(opt);
  });

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${className}`}
      style={{ position: 'relative', width: '100%', userSelect: 'none' }}
    >
      <div
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          color: '#111827',
          cursor: 'pointer',
          transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isOpen ? '0 0 0 2px rgba(17, 24, 39, 0.1)' : 'none',
          borderColor: isOpen ? '#111827' : '#E5E7EB'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', flex: 1 }}>
          {selectedOption?.imageUrl ? (
            <img
              src={selectedOption.imageUrl}
              alt=""
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                objectFit: 'cover',
                flexShrink: 0,
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            />
          ) : selectedOption?.icon ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {selectedOption.icon}
            </span>
          ) : icon ? (
            <span style={{ display: 'flex', alignItems: 'center', color: '#6B7280', flexShrink: 0 }}>
              {icon}
            </span>
          ) : null}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={14}
          style={{
            color: '#6B7280',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 200ms ease',
            flexShrink: 0,
            marginLeft: 6
          }}
        />
      </div>

      {isOpen && (
        <div
          className="custom-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 50,
            maxHeight: 280,
            overflowY: 'auto',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 10,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            padding: 4,
            animation: 'fadeInSlide 150ms ease-out'
          }}
        >
          {Object.entries(groups).map(([groupTitle, opts]) => (
            <div key={groupTitle}>
              {groupTitle && (
                <div
                  style={{
                    padding: '6px 10px 4px',
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#9CA3AF'
                  }}
                >
                  {groupTitle}
                </div>
              )}
              {opts.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#111827' : '#374151',
                      background: isSelected ? '#F3F4F6' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 100ms ease',
                      gap: 8
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', flex: 1 }}>
                      {opt.imageUrl ? (
                        <img
                          src={opt.imageUrl}
                          alt=""
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 4,
                            objectFit: 'cover',
                            flexShrink: 0,
                            border: '1px solid rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      ) : opt.icon ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {opt.icon}
                        </span>
                      ) : null}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {opt.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {opt.badge && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 999,
                            background: '#E0E7FF',
                            color: '#3730A3',
                            fontWeight: 600
                          }}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check size={14} style={{ color: '#111827' }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
