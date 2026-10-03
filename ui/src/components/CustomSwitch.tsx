import React from 'react';

interface CustomSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  label,
  checked,
  onChange,
  description
}) => {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '4px 0'
      }}
      onClick={(e) => {
        e.preventDefault();
        onChange(!checked);
      }}
    >
      <div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{label}</span>
        {description && (
          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{description}</p>
        )}
      </div>

      <div
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: checked ? '#111827' : '#E5E7EB',
          position: 'relative',
          transition: 'background 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          flexShrink: 0,
          marginLeft: 12
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FFFFFF',
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            transition: 'left 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>
    </label>
  );
};
