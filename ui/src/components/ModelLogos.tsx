import React from 'react';

/**
 * Official Qwen logo using user-specified Google CDN image
 */
export const QwenLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <img
    src="/models/qwen.png"
    alt="Qwen"
    className={className}
    style={{
      width: size,
      height: size,
      borderRadius: 4,
      objectFit: 'cover',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0
    }}
    onError={(e) => {
      // Fallback directly to user-provided Google CDN image
      e.currentTarget.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTINT7RBWAGPTsMVAVkxNZcvaNNugTwhLg2xxr5MY_y43DTr15gMyeY3D5b&s=10';
    }}
  />
);

/**
 * Official Flux logo using user-specified Google CDN image
 */
export const FluxLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <img
    src="/models/flux.png"
    alt="Flux"
    className={className}
    style={{
      width: size,
      height: size,
      borderRadius: 4,
      objectFit: 'cover',
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0
    }}
    onError={(e) => {
      // Fallback directly to user-provided Google CDN image
      e.currentTarget.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTln4CoeCjXVsLvjo-PYmqQ6zl-c7QSfg1ulfBr9zAJYg&s=10';
    }}
  />
);
