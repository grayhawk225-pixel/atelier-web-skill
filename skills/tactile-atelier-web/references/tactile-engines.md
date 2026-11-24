# Tactile & Kinetic Engines (Zero-Lock-In Web APIs)

Use these lightweight, dependency-free patterns across plain HTML, Astro, React, Svelte, or Vue. Always guard motion loops with `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and cap `devicePixelRatio` at `Math.min(window.devicePixelRatio || 1, 2)`.

## 1. Optical Loupe & Layer X-Ray (Pointer-Driven Reveal)
Reveal an alternate technical/blueprint layer, metadata grid, or spot-ink channel inside a movable circular lens without heavy WebGL:
- **DOM/CSS:** Place two aligned layers (`base` and `blueprint`/`xray`) in a `position: relative` stage. Update `--lx` and `--ly` CSS custom properties inside `requestAnimationFrame` on `pointermove` / drag.
- **Masking:** Apply `clip-path: circle(var(--lr, 110px) at var(--lx) var(--ly))` to the top revealed layer, paired with a crisp vector reticle ring (`pointer-events: none`, `aria-hidden="true"`).
- **Keyboard/Touch Fallback:** Provide a toggle button (`Inspect Layer`) or preset focus buttons that move the lens smoothly to key points of interest.

## 2. Risograph Spot-Ink Overprint & Tactile Paper Grain
Create rich print materiality without image assets:
- **Grain:** Inline `<svg class="sr-only"><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/></filter></svg>` overlaid at low opacity (`0.04–0.07`) with `mix-blend-mode: multiply`.
- **Misregistration Interaction:** Give separate color channels (`--ink-a`, `--ink-b`, e.g., cobalt blue `#1438B8` and vermilion `#E03E1A` on warm archival paper `#F5F2EB`) tiny independent spring offsets driven by drag or pointer tilt (`mix-blend-mode: multiply` turns overlaps into deep plum/black optically).

## 3. Horological & Spring Physics (No Viscous Lerp)
- **Mechanical Detent:** Use short CSS transitions (`110ms cubic-bezier(0.2, 0.9, 0.3, 1)`) with discrete visual/numeric ticks (`tabular-nums`) for switches, dials, and index selectors.
- **Verlet / Spring Solver (Cables & Cards):** Simulate a 2D spring `(pos += vel; vel += (target - pos) * stiffness; vel *= damping)` in `requestAnimationFrame`, stopping the loop automatically when `Math.abs(vel) < 0.01 && Math.abs(target - pos) < 0.01` to keep idle CPU near zero.

## 4. Living Canvas 2D Topographic / Halftone Field
- Draw reactive vector isolines, stochastic dots, or wave interference on a single `<canvas aria-hidden="true">` scaled to `Math.min(dpr, 2)`.
- Use pointer coordinates as a local attractor/repeller or thermal brush with exponential decay so trails heal naturally over 1.5–3 seconds.
- Pause `requestAnimationFrame` via `IntersectionObserver` when the canvas scrolls out of view and on `document.hidden`.

## 5. Gesture-Gated Micro-Audio (Optional)
- Initialize `AudioContext` **only** inside a user click on an explicit sound toggle (OFF by default).
- Synthesize dry tactile transients (filtered 12 ms noise burst for paper/mechanical clicks, or damped Karplus-Strong pluck for strings) at low gain (`0.04–0.08`)—never auto-playing ambient loops.
