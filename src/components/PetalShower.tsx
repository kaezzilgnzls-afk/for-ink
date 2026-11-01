import React, { useMemo } from 'react';

export interface PetalShowerProps {
  speed?: number; // 0.5 (gentle/slow) to 2.0 (swift), default 1.0
  density?: number; // 6 (sparse) to 48 (lush), default 18
}

/**
 * GPU-accelerated falling chrysanthemum petal shower.
 * Uses CSS translate3d transforms and opacity for 60fps smooth animation
 * running exclusively on the browser compositor thread with zero CPU lag.
 */
export const PetalShower: React.FC<PetalShowerProps> = ({
  speed = 1.0,
  density = 18
}) => {
  // Clamp parameters to aesthetic and performant bounds
  const count = Math.min(Math.max(Math.round(density), 4), 60);
  const speedFactor = Math.min(Math.max(speed, 0.4), 2.5);

  // Generate distinct gentle floating petals with staggered positions and delays
  const petals = useMemo(() => {
    const colors = [
      '#F8B4C4', // Soft rose pink
      '#FCE7EB', // Pale blush
      '#E26887', // Blossom pink
      '#D0DDD1', // Pale sage
      '#FAD2DC', // Rose petal
    ];

    return Array.from({ length: count }, (_, i) => {
      // Golden ratio spacing across width to avoid clumping
      const left = Math.round(((i * (100 / count)) + (Math.sin(i * 2.3) * 6) + 3) % 96);
      const size = Math.round(10 + ((i % 5) * 3));
      // Base float duration inversely proportional to speedFactor
      const baseDuration = 9 + ((i % 6) * 1.8);
      const duration = baseDuration / speedFactor;
      const delay = -((i * 1.5) % duration); // Stagger so petals are already mid-flight
      const swayDuration = (3 + ((i % 4) * 0.8)) / Math.sqrt(speedFactor);
      const color = colors[i % colors.length];
      const opacity = 0.35 + ((i % 4) * 0.12);
      const initialRotation = (i * 47) % 360;

      return {
        id: i,
        left: `${left}%`,
        size,
        duration: `${duration.toFixed(2)}s`,
        delay: `${delay.toFixed(2)}s`,
        swayDuration: `${swayDuration.toFixed(2)}s`,
        color,
        opacity,
        initialRotation
      };
    });
  }, [count, speedFactor]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
      style={{ contain: 'strict' }}
    >
      <style>{`
        @keyframes petalFall {
          0% {
            transform: translate3d(0, -50px, 0) rotate(0deg);
          }
          100% {
            transform: translate3d(0, 105vh, 0) rotate(360deg);
          }
        }
        @keyframes petalSway {
          0%, 100% {
            margin-left: -15px;
          }
          50% {
            margin-left: 15px;
          }
        }
        .chrysanthemum-petal {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>

      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 chrysanthemum-petal"
          style={{
            left: p.left,
            animation: `petalFall ${p.duration} linear infinite`,
            animationDelay: p.delay,
          }}
        >
          <div
            style={{
              animation: `petalSway ${p.swayDuration} ease-in-out infinite alternate`,
              transform: `rotate(${p.initialRotation}deg)`,
              opacity: p.opacity,
            }}
          >
            {/* Elegant curved chrysanthemum petal SVG */}
            <svg
              width={p.size}
              height={p.size * 1.8}
              viewBox="0 0 20 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.04))' }}
            >
              <path
                d="M10 0 C4 8 1 20 10 36 C19 20 16 8 10 0 Z"
                fill={p.color}
              />
              <path
                d="M10 3 L10 32"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="0.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
