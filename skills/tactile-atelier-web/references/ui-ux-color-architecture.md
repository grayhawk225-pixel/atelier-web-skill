# Web UI/UX Architecture & Color Semiotics

Apply these architectural and chromatic rules on every project alongside [anti-convergence-audit.md](./anti-convergence-audit.md) so structure, usability, and color meaning amplify each other instead of fighting for attention.

## 1. Web UI/UX Architecture

### Information Architecture (IA) & Cognitive Load
- **Hick's Law & Progressive Disclosure:** Keep primary navigation and immediate toolbars to 3–6 crisp choices. Move secondary configuration (unit converters, export panels, advanced filters) into structured drawers, dialogs, or dedicated sub-bands rather than dumping every control above the fold.
- **Reading Patterns (F & Z):**
  - Use **Z-pattern** on showcase/lab hero views: brand/telemetry anchor (top-left) -> mode/nav controls (top-right) -> main optical/product stage (center-right) -> primary action + verified key metrics (bottom-left).
  - Use **F-pattern** on archives, catalogs, and technical tables: crisp left-aligned titles, tabular columns, scannable tags, and sticky summary rail.
- **Gestalt Grouping & Figure-Ground:** Group related controls with tight internal spacing (`8–12px`) and generous inter-block separation (`24–48px`). Separate interactive surfaces from the substrate with clean 1px hairlines or calibrated tonal steps rather than blurred drop shadows.

### Spatial Grid & Atypical Typographic Architecture
- **Baseline Rhythm:** Snap all spacing, padding, and gaps to a `4px / 8px` modular grid (`4, 8, 12, 16, 24, 32, 48, 64, 96`).
- **Reject Generic Font Defaults:** Never leave typography on plain system fallbacks (`Helvetica`, `Arial`, `system-ui`) or converge on overused template pairings (`Inter`, `Roboto`, `Space Grotesk`, `Poppins`, `Montserrat`, `Fraunces`, `Instrument Serif`, `Playfair Display`).
- **Three-Voice Typographic System:**
  1. **Expressive Display Voice:** Commit to an original, characterful display typeface with strong silhouette or variable axes (`wdth`, `wght`, `opsz`, `slnt`) — sculptural wide grotesques, ink-trapped neo-grotesques, condensed athletic/technical faces, or reverse-contrast editorial cuts — aligned with the subject's materiality (`clamp()`, tight line-height `0.95–1.08`, tracking `-0.02em` to `-0.03em`).
  2. **Uncommon Readable Body Voice:** Pair display headings with a crisp, distinctive body face (`15–17px`, line-height `1.45–1.6`, max `62ch`) with verified multilingual/diacritic coverage (`latin` + `latin-ext` when needed).
  3. **Calibrated Telemetry Mono:** Use a sharp engineered monospace with `font-variant-numeric: tabular-nums` (`11–13px`, uppercase tracking `0.06em`) for rulers, spec tables, and live instrument deltas.
- **Variable Axis Kinetics & Self-Hosting:** Prefer self-hosted `.woff2` (`@font-face` with `font-display: swap`) so custom faces render reliably offline and without CDN flicker. When modulating variable axes (`wght`, `wdth`) on pointer/instrument interactions, keep container widths locked or reserve space to prevent layout shift.
- **Fitts's Law & Explicit Affordance:** Keep every clickable/tappable target `>= 44×44px`. Every draggable, pluckable, or inspectable area must show visible signifiers (reticle, tension handles, cursor hint, keyboard preset buttons) and respond within `<= 110ms`.

---

## 2. Color Semiotics (Meaning & Brand Alignment)

Never pick an accent color purely for decoration. Tie hue, saturation (`C`), and lightness (`L`) directly to the subject's intent:

| Domain / Intent | Substrate Polarity | Primary Signal & Meaning | Secondary Accent & Tension |
|---|---|---|---|
| **Sport Engineering & Aero Lab** | Daylight chalk/stone (`L 0.94–0.96`) or matte basalt (`L 0.18–0.22`) | **Cobalt / Track Blue (`H ~255°`)**: aerodynamic trust, precision telemetry, structural grip | **Signal Vermilion (`H ~28°`)**: kinetic force, peak load, thermal alert |
| **Heritage Archive & Print Edition** | Unbleached cotton rag (`L 0.95`, `C 0.012`) | **Deep Carbon / Slate (`C <= 0.02`)**: editorial authority, archival permanence | **Forest (`H ~145°`) or Ochre (`H ~75°`)**: craft lineage, material patina |
| **Outdoor / Bio-Materials** | Mineral limestone or dark peat | **Moss / Sage (`H ~135°`)**: terrain endurance, natural fiber | **Clay / Amber (`H ~50°`)**: thermal warmth, traction marker |
| **Precision Instrument / Horology** | Brushed anodized aluminum (`L 0.89–0.92`) | **Graphite + Calibrated Cobalt or Brass (`C <= 0.12`)**: mechanical calibration | **Ruby / Coral (`H ~22°`)**: zero-point indicator, active detent |

### The 70 / 20 / 10 Chromatic Budget
- **70% Neutral Substrate (`C <= 0.015` in `oklch`):** Preserves visual rest and guarantees **true color fidelity when displaying real product photographs**. Never tint the main photo stage with heavy saturated washes.
- **20% Structural Surfaces & Typography:** Tonal surface steps, hairlines, navigation chrome, and body/heading ink.
- **10% Functional Signal & State:** Reserved strictly for primary actions, active selections, vector overlays, and live telemetry deltas.

---

## 3. Mathematical Color Variations in `oklch()`

Derive every surface, hover state, badge, and secondary chart line systematically from your chosen base tokens using perceptual `oklch(L C H)`:

1. **Tonal Surface Ladder (same `H`, near-zero `C`):**
   - `--bg`: `oklch(0.955 0.008 H_neutral)`
   - `--surface-1` (cards/benches): `oklch(0.915 0.010 H_neutral)` (`ΔL = -0.04`)
   - `--surface-2` (inset wells/rails): `oklch(0.875 0.012 H_neutral)` (`ΔL = -0.08`)
   - `--border` / `--border-strong`: `ΔL = -0.14` / `-0.28`
2. **Interactive State Shifts (from base `--accent: oklch(L C H)`):**
   - **Hover:** Shift lightness toward contrast (`L - 0.05` on light UI, `L + 0.05` on dark UI) and bump chroma `+0.015`.
   - **Pressed / Active:** `L - 0.09` with crisp `1px` inset detent.
   - **Soft Tint / Tag Fill:** `oklch(0.92 0.035 H)` paired with dark ink `oklch(0.32 0.12 H)` — keeps harmony without neon glare.
   - **Muted Hairline / Grid:** `oklch(L C H / 0.22)`.
3. **Cross-Hue Relationships:**
   - **Split-Complementary Tension:** Pair `--primary` at `H` with `--signal` at `H + 135°..155°` (e.g., Cobalt `260°` + Vermilion `28°` — high perceptual separation for dual-channel telemetry and risograph overprints).
   - **Analogous Data Series:** Step secondary chart lines by `H ± 24°` and vary `L` by `±0.08` so color-blind users still distinguish series by luminance.
   - **Colorway-Aware Adaptation (Product Sites):** When switching between real product colorways, update a scoped `--product-accent` token (and its derived tint/border variations) using `oklch()` relative/derived values while keeping global UI chrome neutral and maintaining `>= 4.5:1` WCAG AA contrast on all labels.
4. **Photographic Integration Rule:**
   - Display real product photos inside calibrated studio frames (`background: var(--photo-stage)` neutral stone/white, subtle vignette or hairline coordinates, zero destructive blend filters over the product pixels themselves; reserve `mix-blend-mode: multiply` strictly for vector ink overlays or paper grain).
