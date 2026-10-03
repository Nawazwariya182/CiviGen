import React, { useEffect, useState } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 30,
  className = '',
  animateBy = 'words'
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setInView(true);
  }, []);

  return (
    <span className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', gap: animateBy === 'words' ? '0.3em' : '0.05em' }}>
      {elements.map((el, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            transition: `all 400ms cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}ms`,
            opacity: inView ? 1 : 0,
            filter: inView ? 'blur(0px)' : 'blur(8px)',
            transform: inView ? 'translateY(0px)' : 'translateY(6px)'
          }}
        >
          {el}
        </span>
      ))}
    </span>
  );
};
