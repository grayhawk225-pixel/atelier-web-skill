---
name: tactile-atelier-web
description: Build ultra-aesthetic, deeply interactive websites in an atypical tactile-atelier style that breaks away from both AI slop and generic Awwwards clichés (no Lenis scroll-jacking, neon dark-void blobs, or cream-serif templates). Framework-agnostic using native Web APIs (Canvas 2D, SVG filters, View Transitions, CSS Scroll-Driven Animations, Pointer physics, optional WebAudio). Use when asked for memorable, avant-garde, artistic, or kinetic websites.
example-prompt: Create an interactive, ultra-aesthetic website for an independent sound and typography studio with an atypical tactile aesthetic—no generic dark neon or Lenis scroll clones.
---

# Tactile Atelier Web

Build websites that feel like **manipulable physical instruments, archival print editions, or living optical surfaces** rather than passive scroll-driven slide decks.

## Core Thesis: Escape Both Molds

Most web design skills converge into two predictable templates:
1. **SaaS / AI Slop:** dark purple-blue glows, glassmorphism cards, uniform 3-column feature grids.
2. **Awwwards Monoculture:** `#0B0B0B` void + `Lenis` viscous lerp + `GSAP ScrollTrigger` pin-scrubbing + floating 3D iridescent sphere + trailing ring cursor + preloader counter, OR warm cream (`#F4F1EA`) + serif display + terracotta + `01 / 02 / 03` eyebrows.

Read [references/anti-convergence-audit.md](./references/anti-convergence-audit.md) and [references/ui-ux-color-architecture.md](./references/ui-ux-color-architecture.md) before finalizing any visual plan to eliminate both molds and structure UI/UX and color systems rigorously.

## Workflow

### Phase 1: Establish a Non-Convergent Design Brief
Before writing code, commit to 4 concrete decisions in writing (or `DESIGN.md`):
1. **Materiality (pick outside dark-neon & cream-serif):**
   - *Daylight Risograph & Micro-Optics:* archival rag paper, 2–3 spot inks (`mix-blend-mode: multiply`), subtle SVG `<feTurbulence>` fiber texture, crisp ink bleed.
   - *Precision Instrument Bench:* matte anodized aluminum or ceramic surface, calibrated hairline ticks, mechanical detents, `font-variant-numeric: tabular-nums`.
   - *Mineral / Living Substrate:* high-contrast silver-gelatin or chalk-slate palette where typography reacts to an underlying Canvas/SVG mathematical field.
2. **Motion Regime (ban default `power4.out` + viscous lerp everywhere):**
   - *Horological / Photographic:* crisp 80–160 ms snaps, stepped mechanical detents, zero mushy inertia.
   - *Calibrated Spring / Verlet:* real physical bounce or hanging catenary curves that respond directly to pointer velocity or drag.
   - *Native Scroll-Driven:* CSS `animation-timeline: view()` and View Transitions API on the compositor thread — keep native scroll un-hijacked.
3. **One Signature Instrumental Interaction:**
   Turn the visitor from a passive scroller into an operator. Choose one signature mechanic from [references/tactile-engines.md](./references/tactile-engines.md):
   - Draggable optical loupe / chromatic prism revealing hidden blueprints or layers;
   - Misregistered print plates / movable specimen cards with spring physics;
   - Pluckable Verlet patch cables or rotary encoder dials controlling real state (+ optional gesture-gated WebAudio);
   - Pointer-reactive Canvas 2D topographic / cellular field driving variable font axes (`wght`, `wdth`).
4. **UI/UX Architecture, Color Semiotics & Variations:**
   - Apply [references/ui-ux-color-architecture.md](./references/ui-ux-color-architecture.md): enforce F/Z reading patterns, `4px/8px` modular rhythm, Hick's Law progressive disclosure, and Fitts's Law (`>= 44×44px` targets with clear affordances).
   - Anchor the palette in **color semiotics** (every hue chosen for brand/domain meaning) and the **70 / 20 / 10 chromatic budget** (`70%` low-chroma substrate `C <= 0.015` so real product photography stays true-to-life, `20%` tonal surface ladder + typography, `10%` functional signal).
   - Derive surface ladders, hover/pressed/tint states, and secondary split-complementary or analogous accents mathematically in `oklch()`, verified for WCAG AA contrast (`>= 4.5:1` body, `>= 3:1` large).
   - Original, atypical 3-voice typography (expressive/variable Display + uncommon readable Body + calibrated Telemetry Mono, self-hosted `.woff2` preferred; never generic system fallbacks or overused `Inter`, `Roboto`, `Space Grotesk`, `Poppins`, `Instrument Serif`, `Fraunces`).

### Phase 2: Build Lightweight & Framework-Agnostic
- Prefer a **custom < 15 KB procedural engine** (Canvas 2D, SVG filters, Pointer Events, native CSS `@property`, View Transitions) over heavy `Three.js + EffectComposer + GSAP + Lenis` bundles unless true 3D CAD/product geometry is explicitly required.
- Respect `document.documentElement` theming so every interactive state preserves legibility across the entire viewport.
- If using audio (WebAudio synthesis / tactile clicks), gate it strictly behind an explicit user toggle (`OFF` by default) and pause on `visibilitychange`.

### Phase 3: Design Static & Mobile as First-Class Views
- **Reduced Motion (`prefers-reduced-motion: reduce`):** Never leave an amputated flat page. The static composition must look poster-worthy through typography, negative space, spot-ink layering, and instant state switches.
- **Mobile & Keyboard Parity:** Every spatial canvas, draggable object, or instrument control must have an accessible keyboard/tap equivalent (e.g., direct view switcher, arrow-key step adjustments, >= 44×44 px touch targets) and zero horizontal overflow at `375px`.

## Verification Checklist (Mandatory Before Delivery)

Check every deliverable against these criteria:
- [ ] **Anti-Convergence:** Zero banned clichés from `references/anti-convergence-audit.md` (no purple/acid-green AI glow, no cream+terracotta default, no Lenis scroll-hijacking, no decorative `01/02/03` or trailing cursor).
- [ ] **Real Agency:** At least one tactile, direct-manipulation mechanic changes meaningful visual or informational state.
- [ ] **Performance:** Pointer/animation loops run in `requestAnimationFrame` with `devicePixelRatio` capped at `2`; zero forced synchronous layout inside input handlers; animations pause when off-screen or tab hidden.
- [ ] **Accessibility & Responsive:** Semantic `<button>`/`<a>`/`<h1>–<h3>`, visible `:focus-visible`, decorative canvases marked `aria-hidden="true"`, tested mentally/visually at `375px`, `768px`, and `1440px`.
