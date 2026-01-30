import './style.css'

// Configuration Data
const COLORS = [
  // Neutrals / White
  { name: 'Naturel (C900)', hex: '#EFEBD6' },
  { name: 'Blanchi (CH101)', hex: '#FFFFFF' },
  { name: 'Ivoire (CH1451)', hex: '#FFFFF0' },
  { name: 'Noir (CH83)', hex: '#111111' },
  { name: 'Charcoal (CH4275)', hex: '#36454F' },
  { name: 'Gris foncé (CH271)', hex: '#555555' },
  { name: 'Gris pâle (CH415)', hex: '#D3D3D3' },
  { name: 'Stone (CH8115)', hex: '#888c8d' },

  // Blues
  { name: 'Marine (CH1425)', hex: '#000080' },
  { name: 'Royal (CH963)', hex: '#2b4f81' },
  { name: 'Bleu Cobalt (CH4274)', hex: '#0047AB' },
  { name: 'Bleu (CH4272)', hex: '#0000FF' },
  { name: 'Jeans (CH4271)', hex: '#5dade2' },
  { name: 'Peacock (CH4616)', hex: '#007090' },
  { name: 'Turquoise (CH1510)', hex: '#40E0D0' },
  { name: 'Periwinkle (CH5067)', hex: '#CCCCFF' },

  // Greens
  { name: 'Forest (C905)', hex: '#0b6623' },
  { name: 'Sapin (CH5536)', hex: '#097969' },
  { name: 'Olive foncé (C936)', hex: '#556B2F' },
  { name: 'Cactus (C953)', hex: '#5b6f55' },
  { name: 'Sage (C930)', hex: '#9DC183' },
  { name: 'Lime (CH5139)', hex: '#32CD32' },

  // Reds / Pinks / Purples
  { name: 'Rouge (CH5116)', hex: '#D70000' },
  { name: 'Bourgogne (C978)', hex: '#800020' },
  { name: 'Wine (CH8264)', hex: '#722F37' },
  { name: 'Framboise (CH5193)', hex: '#E30B5C' },
  { name: 'Fuschia (CH5169)', hex: '#FF00FF' },
  { name: 'Mauve (CH5153)', hex: '#E0B0FF' },
  { name: 'Plum (CH1732)', hex: '#DDA0DD' },

  // Yellows / Oranges / Browns
  { name: 'Gold (C918)', hex: '#FFD700' },
  { name: 'Vieil Or (CH1418)', hex: '#CFB53B' },
  { name: 'Orange Brulé (CH8265)', hex: '#CC5500' },
  { name: 'Brique (C972)', hex: '#CB4154' },
  { name: 'Chocolat (C964)', hex: '#7B3F00' },
  { name: 'Amber (C995)', hex: '#FFBF00' },
  { name: 'Honey (CH5212)', hex: '#EB9605' },
];

const TZITZIT_TYPES = [
  { id: 'white', name: 'Standard White', description: 'All white strings' },
  { id: 'techelet', name: 'Techelet (Blue)', description: 'White with blue thread' },
  { id: 'ashkenazi', name: 'Ashkenazi Knot', description: '7-8-11-13 windings' },
  { id: 'sephardic', name: 'Sephardic Knot', description: '10-5-6-5 windings' }
];

// State
let state = {
  baseColor: COLORS[1], // Default Blanchi
  stripeColor: COLORS[8], // Default Marine
  tzitzitType: TZITZIT_TYPES[0]
};

// Elements
const canvas = document.getElementById('tallitCanvas');
const ctx = canvas.getContext('2d');
const baseColorPicker = document.getElementById('baseColorPicker');
const stripeColorPicker = document.getElementById('stripeColorPicker');
const tzitzitSelector = document.getElementById('tzitzitSelector');
const downloadBtn = document.getElementById('downloadBtn');
const designSummary = document.getElementById('designSummary');


// Initialization
function init() {
  renderControls();
  renderCanvas();
  updateSummary();

  // Resize canvas responsively (basic implementation)
  // window.addEventListener('resize', renderCanvas); 
}

// Rendering Logic
function renderCanvas() {
  // Clear Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = canvas.width;
  const h = canvas.height;
  const padding = 50;

  // Tallit Dimensions (simulated)
  const tWidth = w - (padding * 2);
  const tHeight = h - (padding * 2);
  const startX = padding;
  const startY = padding;

  // 1. Draw Tallit Base (The Cloth)
  ctx.fillStyle = state.baseColor.hex;
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 10;
  ctx.fillRect(startX, startY, tWidth, tHeight);

  // Reset Shadow
  ctx.shadowColor = 'transparent';

  // 1b. Texture Overlay (Simple Noise/Weave simulation)
  drawTexture(startX, startY, tWidth, tHeight);

  // 2. Draw Stripes
  // "Fixed stripe pattern" as mentioned by user. 
  // We'll simulate a classic pattern: thicker bands with thinner lines.
  drawStripePattern(startX, startY, tWidth, tHeight);

  // 3. Draw Atara (Neckband) - Optional visualization
  drawAtara(startX, startY, tWidth);

  // 4. Draw Tzitzit (Corners)
  drawTzitzitColors(startX, startY, tWidth, tHeight);
}

function drawTexture(x, y, w, h) {
  // Very subtle pattern to mimic fabric
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  for (let i = 0; i < w; i += 2) {
    ctx.fillRect(x + i, y, 1, h);
  }
  for (let j = 0; j < h; j += 2) {
    ctx.fillRect(x, y + j, w, 1);
  }
}

function drawStripePattern(x, y, w, h) {
  ctx.fillStyle = state.stripeColor.hex;

  // Stripe configuration (relative positions from ends)
  // Classic Tallit often has stripes near the ends.

  const stripeGroupWidth = w * 0.15; // 15% of width for stripes

  // Draw stripes on Left Side
  drawStripesAt(x + (w * 0.1), y, stripeGroupWidth, h);

  // Draw stripes on Right Side
  drawStripesAt(x + w - (w * 0.1) - stripeGroupWidth, y, stripeGroupWidth, h);
}

function drawStripesAt(startX, startY, groupWidth, h) {
  // Pattern: Thick, space, Thin, space, Thin, space, Thin, space, Thick
  const numStripes = 5;
  const gap = groupWidth / 9; // spacing unit

  // Stripe 1 (Thick)
  ctx.fillRect(startX, startY, gap * 2, h);

  // Stripe 2 (Thin)
  ctx.fillRect(startX + (gap * 3), startY, gap, h);

  // Stripe 3 (Thin)
  ctx.fillRect(startX + (gap * 5), startY, gap, h);

  // Stripe 4 (Thick)
  ctx.fillRect(startX + (gap * 7), startY, gap * 2, h);
}

function drawAtara(x, y, w) {
  // Top center neckband
  const ataraWidth = w * 0.4;
  const ataraHeight = 40;
  const ataraX = x + (w / 2) - (ataraWidth / 2);

  // Draw simplified Atara with possibly different texture or embroidery hint
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; // Just a highlight
  ctx.fillRect(ataraX, y, ataraWidth, ataraHeight);

  // Border
  ctx.strokeStyle = state.stripeColor.hex;
  ctx.lineWidth = 1;
  ctx.strokeRect(ataraX, y, ataraWidth, ataraHeight);
}

function drawTzitzitColors(x, y, w, h) {
  // Draw simplified strings at 4 corners
  const stringColor = state.tzitzitType.id === 'techelet' ? '#1a4a8a' : '#EFEFEF'; // Simplified logic
  const secondaryColor = '#EFEFEF'; // White string

  const corners = [
    { x: x + 10, y: y + h - 10 }, // Bottom Left
    { x: x + w - 10, y: y + h - 10 }, // Bottom Right
    { x: x + 10, y: y + 10 }, // Top Left
    { x: x + w - 10, y: y + 10 }  // Top Right
  ];

  // For Top corners, strings usually hang down, so we adjust.
  // Actually, on a flat spread, they come out locally. We'll simplify.

  corners.forEach(corner => {
    drawSingleTzitzit(corner.x, corner.y, stringColor, secondaryColor);
  });
}

function drawSingleTzitzit(cx, cy, mainColor, secColor) {
  ctx.beginPath();
  ctx.strokeStyle = '#ddd'; // Hole reinforcement
  ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw Strings hanging down
  ctx.lineWidth = 2;
  const length = 60;

  // Simulate multiple strings
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    // Determine color based on index and type
    ctx.strokeStyle = (state.tzitzitType.id === 'techelet' && i === 0) ? mainColor : secColor;

    // Add some waviness
    ctx.moveTo(cx, cy);
    ctx.bezierCurveTo(cx - 5 + (i * 3), cy + 20, cx + 5 - (i * 3), cy + 40, cx + (i * 2) - 2, cy + length + (i * 5));
    ctx.stroke();
  }

  // Draw "Knot" hint
  ctx.fillStyle = secColor;
  ctx.fillRect(cx - 3, cy + 5, 6, 12);
}

// UI Rendering
function renderControls() {
  // 1. Base Color
  baseColorPicker.innerHTML = COLORS.map(c => `
    <div class="color-swatch ${state.baseColor.name === c.name ? 'selected' : ''}" 
         style="background-color: ${c.hex}"
         title="${c.name}"
         data-type="base"
         data-name="${c.name}">
    </div>
  `).join('');

  // 2. Stripe Color
  stripeColorPicker.innerHTML = COLORS.map(c => `
    <div class="color-swatch ${state.stripeColor.name === c.name ? 'selected' : ''}" 
         style="background-color: ${c.hex}"
         title="${c.name}"
         data-type="stripe"
         data-name="${c.name}">
    </div>
  `).join('');

  // 3. Tzitzit Type
  tzitzitSelector.innerHTML = TZITZIT_TYPES.map(t => `
    <div class="tzitzit-option ${state.tzitzitType.id === t.id ? 'selected' : ''}"
         data-id="${t.id}">
       <div style="font-weight: bold;">${t.name}</div>
       <div style="font-size: 0.8rem; opacity: 0.7;">${t.description}</div>
    </div>
  `).join('');

  attachListeners();
}

function attachListeners() {
  // Color Pickers
  document.querySelectorAll('.color-swatch').forEach(el => {
    el.addEventListener('click', (e) => {
      const type = e.target.dataset.type;
      const name = e.target.dataset.name;
      const color = COLORS.find(c => c.name === name);

      if (type === 'base') state.baseColor = color;
      if (type === 'stripe') state.stripeColor = color;

      renderControls(); // Re-render to update selection UI
      renderCanvas();   // Update Canvas
      updateSummary();
    });
  });

  // Tzitzit Selector
  document.querySelectorAll('.tzitzit-option').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      state.tzitzitType = TZITZIT_TYPES.find(t => t.id === id);

      renderControls();
      renderCanvas();
      updateSummary();
    });
  });
}

function updateSummary() {
  designSummary.innerHTML = `
        <strong>Base:</strong> ${state.baseColor.name} <br>
        <strong>Stripes:</strong> ${state.stripeColor.name} <br>
        <strong>Style:</strong> ${state.tzitzitType.name}
    `;
}

// Download Action
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `My-Tallit-Design-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
});

// Run
init();
