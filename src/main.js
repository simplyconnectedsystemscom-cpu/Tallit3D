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
// State
let state = {
  baseColor: COLORS[1], // Default Blanchi
  stripePattern: [],
  activeStripeId: null,
  tzitzitType: TZITZIT_TYPES[0],
  isBackView: false // New state for flipping
};

// ... elements ...
const flipViewBtn = document.getElementById('flipViewBtn');
const canvas = document.getElementById('tallitCanvas');
const ctx = canvas.getContext('2d');
const zoneUsageEl = document.getElementById('zoneUsage');
const stripeStack = document.getElementById('stripeStack');
const stripeColorPicker = document.getElementById('stripeColorPicker');
const tzitzitSelector = document.getElementById('tzitzitSelector');
const downloadBtn = document.getElementById('downloadBtn');

// Rendering Logic
// Rendering Logic
function renderCanvas() {
  const w = canvas.width;
  const h = canvas.height;

  console.log(`renderCanvas running. View: ${state.isBackView ? 'BACK' : 'FRONT'}, Size: ${w}x${h}`);

  // Clear entire canvas
  ctx.clearRect(0, 0, w, h);

  const padding = 50;
  const tWidth = w - (padding * 2);
  const tHeight = h - (padding * 2);
  const startX = padding;
  const startY = padding;

  if (tWidth <= 0 || tHeight <= 0) {
    console.error("Invalid dimensions for Tallit:", tWidth, tHeight);
    return;
  }

  try {
    // 1. Draw Tallit Base
    const baseHex = (state.baseColor && state.baseColor.hex) ? state.baseColor.hex : '#FFFFFF';
    console.log("Drawing Base with color:", baseHex);

    ctx.save(); // Save context state
    ctx.fillStyle = baseHex;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 10;
    ctx.fillRect(startX, startY, tWidth, tHeight);
    ctx.restore(); // Restore to remove shadow settings

    // 1b. Texture
    drawTexture(startX, startY, tWidth, tHeight);

    // 2. Draw Stripes
    drawStripePattern(startX, startY, tWidth, tHeight);

    if (!state.isBackView) {
      // FRONT VIEW
      drawAtara(startX, startY, tWidth);
      drawTzitzitColors(startX, startY, tWidth, tHeight);
    } else {
      // BACK VIEW
      console.log('Drawing Kanafim (Corners)...');
      drawKanafim(startX, startY, tWidth, tHeight);
    }

    // 5. Edges Fringes
    drawFringes(startX, startY, tWidth, tHeight);

  } catch (e) {
    console.error('CRITICAL ERROR in renderCanvas:', e);
    // Draw visual error indicator on canvas
    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';
    ctx.fillText('Rendering Error: ' + e.message, 50, 50);
  }
}

function drawKanafim(x, y, w, h) {
  try {
    // Draw 4 corner reinforcements (Kanafim)
    const TALLIT_HEIGHT_INCHES = 45;
    const ppi = h / TALLIT_HEIGHT_INCHES;
    const KANAF_SIZE_INCHES = 4.5;
    const size = KANAF_SIZE_INCHES * ppi;

    const corners = [
      { x: x, y: y }, // Top Left
      { x: x + w - size, y: y }, // Top Right
      { x: x, y: y + h - size }, // Bottom Left
      { x: x + w - size, y: y + h - size } // Bottom Right
    ];

    corners.forEach(corner => {
      // Draw Patch (White square)
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 5;
      ctx.fillRect(corner.x, corner.y, size, size);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Stitching/Border
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1;
      ctx.strokeRect(corner.x, corner.y, size, size);

      // Holes Logic
      const holeRadius = 4;

      // Determine relative position based on which corner
      // Center point for holes relative to "Outer Tip" of the Kanaf
      // For Top-Left (x,y), offset is positive. For Bottom-Right, offset negative.

      // We want holes INWARDS from the corner tip.
      // Offset amounts:
      const offset1 = 20;
      const offset2 = 45;

      // Calculate px, py for outer hole
      let px = (corner.x === x) ? x + offset1 : x + w - offset1;
      let py = (corner.y === y) ? y + offset1 : y + h - offset1;

      // Calculate px2, py2 for inner hole
      let px2 = (corner.x === x) ? x + offset2 : x + w - offset2;
      let py2 = (corner.y === y) ? y + offset1 : y + h - offset1;
      // Note: y stays same for horizontal alignment relative to corner? 
      // Or diagonals? Let's stick to horizontal alignment relative to top/bottom edge for simplicity shown in weave. 

      // Draw Holes
      [{ cx: px, cy: py }, { cx: px2, cy: py2 }].forEach(hole => {
        ctx.beginPath();
        ctx.arc(hole.cx, hole.cy, holeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.strokeStyle = '#DDD';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw Tzitzit Strings
      drawTzitzitFromHoles(px, py, px2, py2);
    });
  } catch (e) {
    console.error("Error in drawKanafim:", e);
  }
}

// Tzitzit Drawing Logic
function drawTzitzitFromHoles(x, y, x2, y2) {
  try {
    // 1. Draw the "Bridge" loop between holes (Back View)
    ctx.beginPath();
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // 2. Draw the Hanging Tzitzit (emerging from outer hole x,y)
    // Determine style
    const typeId = state.tzitzitType.id;

    if (typeId === 'ashkenazi') {
      drawAshkenaziTzitzit(x, y);
    } else if (typeId === 'sephardic') {
      drawSephardicTzitzit(x, y);
    } else if (typeId === 'techelet') {
      drawAshkenaziTzitzit(x, y, true); // Re-use Ashkenazi structure with Blue thread
    } else {
      // Standard / Default
      drawAshkenaziTzitzit(x, y, false);
    }

  } catch (e) {
    console.error("Error in drawTzitzitFromHoles:", e);
  }
}

function drawAshkenaziTzitzit(x, y, hasBlue = false) {
  // Pattern: 7 - 8 - 11 - 13 (Ashkenazi)
  // Structure: Double Knot -> Windings -> Double Knot ...
  const segmentLength = 8; // Pixel length per winding section
  const knotSize = 4;
  let currentY = y;
  const mainColor = '#FDFDFD'; // White string
  const blueColor = '#1a4a8a'; // Techelet

  // Draw simplified hanging strings (Core)
  const totalLength = 120; // px
  // Draw loose strings first (underneath the knots)
  drawLooseStrings(x, y + 45, totalLength - 45, hasBlue);

  // Draw The Gedil (Wound Section)
  // 5 Knots, 4 Spaces
  const pattern = [7, 8, 11, 13];

  // Initial Knot (at hole)
  drawKnot(x, currentY, knotSize, mainColor);
  currentY += knotSize;

  pattern.forEach((count, idx) => {
    // windings
    const windingHeight = count * 0.8; // Approximate height based on count

    // Draw Winding Block
    ctx.fillStyle = hasBlue && idx % 2 !== 0 ? blueColor : mainColor; // Alternating for visual effect if blue? 
    // Actually Techelet pattern is specific. For visualization, we'll keep it simple:
    // If hasBlue, make the windings striped blue/white

    if (hasBlue) {
      drawStripedWinding(x - 2, currentY, 4, windingHeight, mainColor, blueColor);
    } else {
      ctx.fillStyle = mainColor;
      ctx.fillRect(x - 2, currentY, 4, windingHeight);
      // Add texture lines
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 0.5;
      for (let w = 0; w < windingHeight; w += 2) {
        ctx.beginPath(); ctx.moveTo(x - 2, currentY + w); ctx.lineTo(x + 2, currentY + w); ctx.stroke();
      }
    }

    currentY += windingHeight;

    // Knot
    drawKnot(x, currentY, knotSize, mainColor);
    currentY += knotSize;
  });
}

function drawSephardicTzitzit(x, y) {
  // Pattern: 10 - 5 - 6 - 5
  // Each winding (Chulya) is distinct.
  // Using similar loop to Ashkenazi but different counts
  const knotSize = 4;
  let currentY = y;
  const mainColor = '#FDFDFD';

  const totalLength = 120;
  drawLooseStrings(x, y + 40, totalLength - 40, false);

  const pattern = [10, 5, 6, 5];

  drawKnot(x, currentY, knotSize, mainColor);
  currentY += knotSize;

  pattern.forEach(count => {
    const windingHeight = count * 0.8;

    // Draw Winding (Chulya)
    // Sephardic often has a ridge or specific loop.
    ctx.fillStyle = mainColor;
    ctx.fillRect(x - 2, currentY, 4, windingHeight);

    // Ridge texture
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 1;
    // Draw diagonal ridges
    for (let w = 0; w < windingHeight; w += 3) {
      ctx.beginPath(); ctx.moveTo(x - 2, currentY + w); ctx.lineTo(x + 2, currentY + w + 2); ctx.stroke();
    }

    currentY += windingHeight;

    drawKnot(x, currentY, knotSize, mainColor);
    currentY += knotSize;
  });
}

function drawKnot(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y + size / 2, size / 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#CCC';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawStripedWinding(x, y, w, h, c1, c2) {
  for (let i = 0; i < h; i += 2) {
    ctx.fillStyle = (i % 4 === 0) ? c2 : c1;
    ctx.fillRect(x, y + i, w, 2);
  }
}

function drawLooseStrings(x, y, length, hasBlue) {
  // 8 strings hanging
  const spread = 8;
  const stringColor = '#F0F0F0';
  const blueString = '#1a4a8a';

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    // If hasBlue, 1 or 2 strings are blue
    const isBlue = hasBlue && (i === 0 || i === 7);
    ctx.strokeStyle = isBlue ? blueString : stringColor;
    ctx.lineWidth = 1.5;

    // Natural curve randomness
    const randomOffset = (Math.random() - 0.5) * 5;
    const endX = x + (i - 3.5) * spread * 0.5 + randomOffset;

    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y + length / 2, endX, y + length * 0.8, endX, y + length);
    ctx.stroke();
  }
}

// ... existing texture/stripe/atara/tzitzit functions ...

// UI Rendering
// ...

// Listener for Flip Button
if (flipViewBtn) {
  flipViewBtn.addEventListener('click', () => {
    state.isBackView = !state.isBackView;
    flipViewBtn.innerText = state.isBackView ? "Turn Over (Front Side)" : "Turn Over (Back Side)";
    renderCanvas();
  });
}

// ... existing listeners ...





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
  const STRIPE_START_OFFSET = 5;

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
  // Try to match first stripe color, otherwise default to a neutral grey
  const firstStripe = state.stripePattern.find(s => s.type === 'stripe');
  ctx.strokeStyle = firstStripe ? firstStripe.color.hex : '#888';
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
  zoneUsageEl.innerHTML = `${currentUsage.toFixed(2)}" / 12"`;
  zoneUsageEl.style.color = currentUsage > 12 ? '#ff6b6b' : 'inherit';

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
    btn.onclick = () => addStripeItem(parseFloat(btn.dataset.size), parseInt(btn.dataset.threads), 'stripe');
  });

  document.querySelectorAll('.btn-add-space').forEach(btn => {
    btn.onclick = () => addStripeItem(parseFloat(btn.dataset.size), parseInt(btn.dataset.threads), 'space');
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
function addStripeItem(size, threads, type) {
  const currentUsage = state.stripePattern.reduce((acc, item) => acc + item.width, 0);

  if (currentUsage + size > 12.01) { // .01 for float margin
    alert("Pattern limit reached! The stripe zone spans 12 inches.");
    return;
  }

  const newItem = {
    id: Date.now(),
    width: size,
    threads: threads,
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

// Weaving Calculation
function calculateWeavingPattern() {
  // Dimensions
  const TALLIT_WIDTH_INCHES = 60;
  const TALLIT_HEIGHT_INCHES = 45;

  const totalStripesWidth = state.stripePattern.reduce((acc, item) => acc + item.width, 0);

  // Calculate total threads
  let totalThreads = 0;
  state.stripePattern.forEach(item => {
    // Use stored threads if available, or calculate (1 thread = 3/8" / 4 = 0.09375")
    const t = item.threads || Math.round(item.width / 0.09375);
    totalThreads += t;
  });

  return {
    width: TALLIT_WIDTH_INCHES,
    height: TALLIT_HEIGHT_INCHES,
    totalPatternWidth: totalStripesWidth.toFixed(2),
    threadCount: `${totalThreads} Threads`
  };
}

// Helper to get thread counts by color
function getThreadCountsByColor() {
  const colorCounts = new Map();
  state.stripePattern.forEach(item => {
    if (item.type === 'stripe') {
      const colorName = item.color.name;
      const t = item.threads || Math.round(item.width / 0.09375);

      if (!colorCounts.has(colorName)) {
        colorCounts.set(colorName, { color: item.color, count: 0 });
      }
      colorCounts.get(colorName).count += t;
    }
  });
  return Array.from(colorCounts.values());
}

function updateSummary() {
  try {
    const el = document.getElementById('designSummary');
    if (!el) {
      console.error('designSummary element not found!');
      return;
    }

    const weavingData = calculateWeavingPattern();
    const threadCounts = getThreadCountsByColor();

    console.log('Updating summary:', weavingData, threadCounts);

    let colorsHtml = '';
    if (threadCounts.length > 0) {
      colorsHtml = `
        <div style="margin-top: 0.5rem;">
          <strong>Thread Counts by Color:</strong>
          <div style="margin-top: 0.3rem; display: flex; flex-direction: column; gap: 0.3rem;">
            ${threadCounts.map(item => `
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <div style="width: 14px; height: 14px; background-color: ${item.color.hex}; border: 1px solid #666; border-radius: 50%;"></div>
                <small style="opacity: 0.9;">${item.color.name} — <strong>${item.count} Threads</strong></small>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      colorsHtml = `<small style="opacity: 0.5; display: block; margin-top: 0.5rem;">No stripes added yet.</small>`;
    }

    el.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
              <strong>Base:</strong> ${state.baseColor.name} <br>
              <strong>Style:</strong> ${state.tzitzitType.name} <br>
              <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 0.5rem 0;">
              <strong>Proportions:</strong> <br>
              <small>Landscape (${weavingData.width}" x ${weavingData.height}")</small><br>
              <small>Pattern Width: ${weavingData.totalPatternWidth}"</small><br>
            </div>
            <div>
               ${colorsHtml}
               <div style="margin-top: 1rem;">
                  <strong>Total Threads:</strong> <br>
                  <small>${weavingData.threadCount}</small>
               </div>
            </div>
          </div>
      `;
  } catch (e) {
    console.error("Error in updateSummary:", e);
  }
}

// Expose for debugging
window.updateSummary = updateSummary;
window.state = state;

// Download Action
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `My-Tallit-Design-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();

  // Also open in new tab for immediate viewing
  const newTab = window.open();
  if (newTab) {
    newTab.document.write('<img src="' + link.href + '" style="max-width:100%"/>');
    newTab.document.title = "Tallit Design Preview";
  }
});


function drawFringes(x, y, w, h) {
  console.log('drawFringes called', { x, y, w, h });
  // Config
  const FRINGE_LENGTH_INCHES = 3;
  const FRINGE_SPACING_INCHES = 1;
  const CORNER_OFFSET_INCHES = 4.5;
  const TALLIT_HEIGHT_INCHES = 45; // Fixed for Landscape

  const ppi = h / TALLIT_HEIGHT_INCHES;

  const fringeLenPx = FRINGE_LENGTH_INCHES * ppi;
  const offsetPx = CORNER_OFFSET_INCHES * ppi;
  const spacingPx = FRINGE_SPACING_INCHES * ppi;

  const startFringeY = y + offsetPx;
  const endFringeY = y + h - offsetPx;

  // Helper to draw a single twisted strand
  function drawTwistedStrand(sx, sy, ex, ey) {
    // 1. Black Shadow / Outline (Thicker)
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5; // Slightly thicker
    ctx.stroke();

    // 2. White Main Body
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 3. Twist Texture (High Contrast Black Diagonals)
    const dx = ex - sx;
    const dy = ey - sy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const twistSpacing = 10; // Looser twist to match user preference

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.strokeStyle = '#000000'; // Black for maximum contrast
    ctx.lineWidth = 1;

    // Draw diagonals
    for (let i = 2; i < len - 2; i += twistSpacing) {
      ctx.moveTo(i, -1.5);
      ctx.lineTo(i + 2, 1.5);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Draw Fringes Loop
  for (let fy = startFringeY; fy <= endFringeY; fy += spacingPx) {
    // Left Side
    drawTwistedStrand(x, fy, x - fringeLenPx, fy);

    // Right Side
    drawTwistedStrand(x + w, fy, x + w + fringeLenPx, fy);
  }
}


function init() {
  console.log('Initializing Tallit Designer...');
  renderControls();
  renderCanvas();
  updateSummary();
}

// Run
init();
