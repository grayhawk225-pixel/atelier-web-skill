# Anti-Convergence Audit

Existing GitHub web skills (`frontend-design`, `ui-ux-pro-max`, `awwwards-3d`, `awwwards-ui-design`, `awwwards`) reliably steer away from basic SaaS templates, yet repeatedly converge onto a **second predictable mold**. Reject these tells unless the user explicitly asks for them:

## 1. Patterns to Reject by Default

| Category | Predictable GitHub Skill Default | Replacement Direction |
|---|---|---|
| **Scroll** | `Lenis` damped at `0.06–0.1` + `GSAP ScrollTrigger` pin-scrubbing on every section | Native browser scroll + CSS `animation-timeline: view()` + direct pointer/click state shifts |
| **3D / Shader** | Dark void `#050510` + `Three.js` glass orb / particle globe + `UnrealBloomPass` | Lightweight Canvas 2D / SVG `<feDisplacementMap>` / GLSL 2D field (< 15 KB) integrated into typography |
| **Motion Feel** | Uniform `power4.out` slow-motion fade-slide-up reveals on every block | Crisp mechanical detents (80–160 ms), spring physics, or tactile drag inertia |
| **Palette & Type** | Cream `#F4F1EA` + high-contrast serif + terracotta, OR `#0B0B0B` + acid green/neon violet | High-key archival paper + spot inks (`multiply`), matte ceramic/instrument tones, or mineral monochrome |
| **Layout Chrome** | Hero + 3 equal cards, Bento tilt grid, corner nav + decorative `01 / 02 / 03`, trailing ring cursor, `→` on every CTA, preloader % curtain | Asymmetric specimen sheets, optical inspection canvases, stacked movable layers, real functional telemetry |

## 2. Measurable Quality Floor

Before shipping any generated site or visual prototype:
1. **3-Second Clarity:** Subject, primary action, and interactive cue are unmistakable above the fold without a 3-second preloader.
2. **Contrast:** Text and controls meet WCAG AA (`>= 4.5:1` body, `>= 3:1` display/UI).
3. **Zero Layout Thrashing:** Never read `getBoundingClientRect()` inside `mousemove`/`scroll` without caching; write transforms (`translate3d`, `scale`) or Canvas draws inside `requestAnimationFrame`.
4. **Native Cursor Preserved:** Never hide the OS pointer (`cursor: none`); augment affordances directly on interactive surfaces instead.
