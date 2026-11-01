import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG template for the "for ink" Chrysanthemum App Icon
function createSvgIcon(size, isMaskable = false) {
  // If maskable, scale and center within 80% safe-zone to prevent Android circle/squircle clipping
  const scale = isMaskable ? 0.72 : 0.88;
  const center = size / 2;

  // Generate 24 chrysanthemum petals around center
  let petalsSvg = '';
  const numPetals = 24;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i * 360) / numPetals;
    const isPinkOuter = i % 2 === 0;
    const fill = isPinkOuter ? '#F4A7BA' : '#E26887';
    const fillSecondary = isPinkOuter ? '#FCE7F0' : '#FDA4AF';
    petalsSvg += `
      <g transform="rotate(${angle} ${center} ${center})">
        <path d="M ${center - 8} ${center - 40} Q ${center} ${center - 110} ${center + 8} ${center - 40} Z" fill="${fill}" opacity="0.9" />
        <path d="M ${center - 5} ${center - 30} Q ${center} ${center - 85} ${center + 5} ${center - 30} Z" fill="${fillSecondary}" opacity="0.95" />
      </g>
    `;
  }

  // Inner ring of petals (16 petals)
  for (let i = 0; i < 16; i++) {
    const angle = (i * 360) / 16 + 11.25;
    petalsSvg += `
      <g transform="rotate(${angle} ${center} ${center})">
        <path d="M ${center - 5} ${center - 25} Q ${center} ${center - 60} ${center + 5} ${center - 25} Z" fill="#FCE7F0" opacity="0.98" />
      </g>
    `;
  }

  const bgGradient = `
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#16241B" />
        <stop offset="50%" stop-color="#243B2B" />
        <stop offset="100%" stop-color="#3A5B44" />
      </linearGradient>
      <radialGradient id="flowerCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FEF08A" />
        <stop offset="40%" stop-color="#FCD34D" />
        <stop offset="100%" stop-color="#D97706" />
      </radialGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      ${bgGradient}
      <!-- Background -->
      <rect width="${size}" height="${size}" rx="${isMaskable ? 0 : size * 0.22}" fill="url(#bgGrad)" />
      
      <!-- Flower group scaled -->
      <g transform="translate(${center * (1 - scale)}, ${center * (1 - scale)}) scale(${scale})">
        <!-- Delicate foliage behind petals -->
        <g opacity="0.8">
          <path d="M ${center - 50} ${center + 30} C ${center - 110} ${center + 60}, ${center - 90} ${center + 120}, ${center - 30} ${center + 80} Z" fill="#4ADE80" opacity="0.4" />
          <path d="M ${center + 50} ${center + 30} C ${center + 110} ${center + 60}, ${center + 90} ${center + 120}, ${center + 30} ${center + 80} Z" fill="#4ADE80" opacity="0.4" />
        </g>

        <!-- Petals -->
        <g filter="url(#softGlow)">
          ${petalsSvg}
        </g>

        <!-- Golden Flower Center Core -->
        <circle cx="${center}" cy="${center}" r="26" fill="url(#flowerCenter)" />
        <circle cx="${center}" cy="${center}" r="16" fill="#F59E0B" opacity="0.6" />
        <circle cx="${center}" cy="${center}" r="8" fill="#FDE047" />

        <!-- Subtitle: for ink -->
        <text x="${center}" y="${center + 125}" 
              font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" 
              font-size="28" 
              font-weight="700" 
              letter-spacing="3" 
              text-anchor="middle" 
              fill="#FCE7F0" 
              opacity="0.95">FOR INK</text>
      </g>
    </svg>
  `;
}

async function generate() {
  console.log('Generating PWA icons...');
  
  // 192x192 icon
  const svg192 = Buffer.from(createSvgIcon(192, false));
  await sharp(svg192).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('pwa-192x192.png generated.');

  // 512x512 icon (standard)
  const svg512 = Buffer.from(createSvgIcon(512, false));
  await sharp(svg512).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('pwa-512x512.png generated.');

  // 512x512 maskable icon (padded for Android circular/squircle crop)
  const svgMaskable = Buffer.from(createSvgIcon(512, true));
  await sharp(svgMaskable).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('pwa-maskable-512x512.png generated.');

  // 180x180 Apple touch icon
  const svgApple = Buffer.from(createSvgIcon(180, false));
  await sharp(svgApple).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png generated.');

  // Favicon (64x64 PNG)
  const svgFavicon = Buffer.from(createSvgIcon(64, false));
  await sharp(svgFavicon).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
  console.log('favicon.png generated.');

  console.log('All icons generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
