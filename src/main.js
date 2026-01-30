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
  stripePattern: [], // Array of { width: number, color: Object, type: 'stripe'|'space', id: number }
  activeStripeId: null, // ID of currently selected stripe
  tzitzitType: TZITZIT_TYPES[0]
};

// Elements
const canvas = document.getElementById('tallitCanvas');
const ctx = canvas.getContext('2d');
// const baseColorPicker = document.getElementById('baseColorPicker'); // Removed
const stripeColorPicker = document.getElementById('stripeColorPicker');
const stripeStack = document.getElementById('stripeStack');
const zoneUsageEl = document.getElementById('zoneUsage');
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
  // Dimensions in inches
  const TALLIT_LENGTH = 60;
  const STRIPE_START_OFFSET = 10;

  // Calculate Scale (Pixels Per Inch)
  // Assuming full canvas width represents the 60 inches of the Tallit
  const ppi = w / TALLIT_LENGTH;

  const startPixelLeft = x + (STRIPE_START_OFFSET * ppi);
  const startPixelRight = x + w - (STRIPE_START_OFFSET * ppi);

  // Draw Left Side (from 10" inwards)
  let currentPos = startPixelLeft;

  state.stripePattern.forEach(item => {
    const widthPx = item.width * ppi;

    if (item.type === 'stripe') {
      ctx.fillStyle = item.color.hex;
      ctx.fillRect(currentPos, y, widthPx, h);
    }
    // If 'space', we just skip (transparent), or draw base color if needed? 
    // Actually, background is baseColor, so spaces are just empty.

    currentPos += widthPx;
  });

  // Draw Right Side (Mirror Image)
  // We start from right edge (minus offset) and move INWARDS (to the left)
  // But since we draw rectangles from top-left, we calculate X for each stripe based on reversed order.

  let currentPosRight = startPixelRight;

  // We mirror the pattern structure. The "First" stripe added (Outer) touches the Offset line.
  state.stripePattern.forEach(item => {
    const widthPx = item.width * ppi;

    // Move "back" by the width of this stripe to find its top-left X
    currentPosRight -= widthPx;

    if (item.type === 'stripe') {
      ctx.fillStyle = item.color.hex;
      ctx.fillRect(currentPosRight, y, widthPx, h);
    }

    // Loop continues, moving further left (inwards)
  });
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
  ctx.strokeStyle = state.stripeColors[0].hex; // match first stripe
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
// UI Rendering
// UI Rendering
function renderControls() {
  // 1. Zone Usage Logic
  const currentUsage = state.stripePattern.reduce((acc, item) => acc + item.width, 0);
  zoneUsageEl.innerHTML = `${currentUsage.toFixed(2)}"`;
  zoneUsageEl.style.color = currentUsage > 10 ? '#ff6b6b' : 'inherit';

  // 2. Render Stripe Stack
  if (state.stripePattern.length === 0) {
    stripeStack.innerHTML = '<div class="empty-state">No stripes added yet.</div>';
  } else {
    stripeStack.innerHTML = state.stripePattern.map((item, index) => {
      const isStripe = item.type === 'stripe';
      const label = `${item.width}" ${isStripe ? 'Stripe' : 'Space'}`;
      const colorHex = isStripe ? item.color.hex : 'transparent';
      const border = isStripe ? 'none' : '1px dashed #555';
      const isActive = item.id === state.activeStripeId;

      return `
        <div class="stripe-item ${isActive ? 'active' : ''}" data-id="${item.id}">
           <div style="display:flex; align-items:center;">
             <div class="preview-swatch" style="background-color: ${colorHex}; border: ${border}"></div>
             <span class="info">${label}</span>
           </div>
           <span class="delete-btn" data-delete-id="${item.id}" title="Remove">✕</span>
        </div>
      `;
    }).join('');
  }


  // 2b. Stripe Color Picker
  // Now simply acts as "Apply Color to Active Stripe"
  stripeColorPicker.innerHTML = COLORS.map(c => `
    <div class="color-swatch" 
         style="background-color: ${c.hex}"
         title="${c.name}"
         data-type="stripe-color"
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
  // Add Stripe/Space Buttons
  document.querySelectorAll('.btn-add-stripe').forEach(btn => {
    btn.onclick = () => addStripeItem(parseFloat(btn.dataset.size), 'stripe');
  });

  document.querySelectorAll('.btn-add-space').forEach(btn => {
    btn.onclick = () => addStripeItem(parseFloat(btn.dataset.size), 'space');
  });

  // Stack Interactions (Select / Delete)
  const items = document.querySelectorAll('.stripe-item');
  items.forEach(el => {
    el.addEventListener('click', (e) => {
      // Check if delete button was clicked
      if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.deleteId);
        removeStripeItem(id);
        e.stopPropagation(); // prevent selection
        return;
      }

      // Otherwise select
      const id = parseInt(el.dataset.id);
      const item = state.stripePattern.find(i => i.id === id);
      if (item && item.type === 'stripe') {
        state.activeStripeId = id;
        renderControls();
      }
    });
  });


  // Color Pickers
  document.querySelectorAll('.color-swatch').forEach(el => {
    el.addEventListener('click', (e) => {
      const type = e.target.dataset.type;
      const name = e.target.dataset.name;
      const color = COLORS.find(c => c.name === name);

      if (type === 'stripe-color' && state.activeStripeId !== null) {
        // Find the active item
        const item = state.stripePattern.find(i => i.id === state.activeStripeId);
        if (item && item.type === 'stripe') {
          item.color = color;
        }
      }

      renderControls(); // Re-render to show updated color on the bar
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

// Logic Helpers
function addStripeItem(size, type) {
  const currentUsage = state.stripePattern.reduce((acc, item) => acc + item.width, 0);

  if (currentUsage + size > 10.01) { // .01 for float margin
    alert("Pattern limit reached! The stripe zone spans 10 inches.");
    return;
  }

  const newItem = {
    id: Date.now(),
    width: size,
    type: type,
    color: type === 'stripe' ? COLORS[8] : null // Default Blue for stripes
  };

  state.stripePattern.push(newItem);

  // Auto-select if it's a stripe
  if (type === 'stripe') {
    state.activeStripeId = newItem.id;
  }

  renderControls();
  renderCanvas();
  updateSummary();
}

function removeStripeItem(id) {
  state.stripePattern = state.stripePattern.filter(i => i.id !== id);
  if (state.activeStripeId === id) state.activeStripeId = null;

  renderControls();
  renderCanvas();
  updateSummary();
}

function updateSummary() {
  designSummary.innerHTML = `
        <strong>Base:</strong> ${state.baseColor.name} <br>
        <strong>Stripes:</strong> Custom Pattern <br>
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
