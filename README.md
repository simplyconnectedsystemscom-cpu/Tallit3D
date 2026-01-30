# Tallit Designer

A web-based visualizer for designing custom Hand Woven Tallit.
Built for **Leslie's Weaving** to allow customers to select colors and styles.

## Features
- **Visualizer**: 2D Canvas rendering of the Tallit cloth and stripe patterns.
- **Custom Colors**: Integrated **Maurice Brassard & Fils Inc** Chenille color palette.
- **Configurations**:
    - **Warp (Base)**: Fixed to **Blanchi (CH101)** (White).
    - **Weft (Stripes)**: **Individual Stripe Customization**. Select any of the 4 stripes to color them individually. Changes mirror symmetrically to the other side.
    - **Tzitzit**: Select standard, Techelet, or specific knot styles.
- **Export**: Download design as PNG.

## Tech Stack
- **Framework**: Vite + Vanilla JS
- **Styling**: Custom CSS (Glassmorphism, Dark Mode)
- **Deployment**: Static site (ready for GitHub Pages)

## Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Note: Ensure 'base' is commented out in vite.config.js for local dev.

# Build for production
# Uncomment 'base' in vite.config.js before building for GitHub Pages!
npm run build

# Preview production build
npm run preview
```

## structure
- `src/main.js`: Core logic for state and canvas rendering.
- `src/style.css`: Design tokens and component styles.
- `index.html`: Main entry point.
