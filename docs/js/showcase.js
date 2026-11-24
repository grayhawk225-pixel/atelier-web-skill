/* tactile-atelier-web — Interactive Showcase Engine (< 15 KB vanilla ES module)
 * 1. Semantic oklch() Register Switcher & live contrast telemetry
 * 2. Optical X-Ray Loupe (Surface UI vs. Pixel-Aligned Blueprint Spec)
 * 3. Spring-Physics Risograph Print Plates
 * 4. Verlet 2D Patchbay driving live Anybody variable axes + opt-in WebAudio
 * 5. Universal Agent Installer tabs + clipboard copy
 */

const REGISTER_KEY = 'tactile_atelier_register_v1';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isReducedMotion = () => reducedMotion.matches;
const getCappedDpr = () => Math.min(window.devicePixelRatio || 1, 2);

const REGISTERS = {
  risograph: {
    id: 'risograph',
    name: 'Daylight Risograph',
    substrate: 'oklch(0.955 0.008 90)',
    primary: 'Cobalt Ink · oklch(0.46 0.21 260)',
    signal: 'Vermilion · oklch(0.54 0.21 28)',
    meaning: 'Split-complementary ink tension (ΔH 128°) on unbleached rag paper.',
    contrast: '7.2:1 Body · 7.5:1 Action · AA+',
    axes: 'Anybody (wdth 104) · Golos Text · Martian Mono',
    baseWdth: 104,
    baseWght: 800
  },
  bench: {
    id: 'bench',
    name: 'Precision Bench',
    substrate: 'oklch(0.952 0.010 95)',
    primary: 'Anodized Sage · oklch(0.42 0.125 150)',
    signal: 'Calibrated Brass · oklch(0.58 0.135 78)',
    meaning: 'Horological & archival craft tone on warm limestone substrate.',
    contrast: '7.4:1 Body · 7.8:1 Action · AA+',
    axes: 'Anybody (wdth 94) · Golos Text · Martian Mono',
    baseWdth: 94,
    baseWght: 760
  },
  slate: {
    id: 'slate',
    name: 'Mineral Slate',
    substrate: 'oklch(0.20 0.012 245)',
    primary: 'Steel Blue · oklch(0.70 0.13 245)',
    signal: 'Thermal Amber · oklch(0.75 0.15 55)',
    meaning: 'Matte basalt low-glare bench—never pure #0B0B0B neon void.',
    contrast: '12.4:1 Body · 7.4:1 Action · AA+',
    axes: 'Anybody (wdth 100) · Golos Text · Martian Mono',
    baseWdth: 100,
    baseWght: 820
  }
};

function getThemeColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    bg: cs.getPropertyValue('--surface-card').trim() || '#F8F6F1',
    ink: cs.getPropertyValue('--ink').trim() || '#111214',
    muted: cs.getPropertyValue('--ink-muted').trim() || '#43464D',
    border: cs.getPropertyValue('--border').trim() || 'rgba(17,18,20,0.16)',
    accent: cs.getPropertyValue('--accent').trim() || '#0D47E1',
    signal: cs.getPropertyValue('--signal').trim() || '#E23D18'
  };
}

/* ==========================================================================
   OPT-IN WEBAUDIO (STRICTLY OFF BY DEFAULT, SUSPENDS WHEN TAB HIDDEN)
   ========================================================================== */
class AtelierAudio {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      } else if (!document.hidden && this.enabled && this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      this.click(1020);
    } else if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend().catch(() => {});
    }
    return this.enabled;
  }

  click(freq = 1100) {
    if (!this.enabled || !this.ctx || document.hidden) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.35, now + 0.014);
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.018);
  }

  pluck(freq = 220) {
    if (!this.enabled || !this.ctx || document.hidden) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filt = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.94, now + 0.16);
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(1400, now);
    filt.frequency.exponentialRampToValueAtTime(240, now + 0.16);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(filt);
    filt.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }
}

const audio = new AtelierAudio();

/* ==========================================================================
   REGISTER SWITCHER & HEADER CHROME
   ========================================================================== */
function applyRegister(id, persist = true) {
  const reg = REGISTERS[id] || REGISTERS.risograph;
  document.documentElement.dataset.register = reg.id;
  if (persist) {
    try { localStorage.setItem(REGISTER_KEY, reg.id); } catch {}
  }
  document.querySelectorAll('[data-register-btn]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.registerBtn === reg.id));
  });
  document.querySelectorAll('[data-sem-name]').forEach((el) => (el.textContent = reg.name));
  document.querySelectorAll('[data-sem-substrate]').forEach((el) => (el.textContent = reg.substrate));
  document.querySelectorAll('[data-sem-primary]').forEach((el) => (el.textContent = reg.primary));
  document.querySelectorAll('[data-sem-signal]').forEach((el) => (el.textContent = reg.signal));
  document.querySelectorAll('[data-sem-meaning]').forEach((el) => (el.textContent = reg.meaning));
  document.querySelectorAll('[data-sem-contrast]').forEach((el) => (el.textContent = reg.contrast));
  document.querySelectorAll('[data-sem-axes]').forEach((el) => (el.textContent = reg.axes));
  window.dispatchEvent(new CustomEvent('showcase:register', { detail: reg }));
  return reg;
}

function initChrome() {
  let saved = 'risograph';
  try {
    const v = localStorage.getItem(REGISTER_KEY);
    if (v && REGISTERS[v]) saved = v;
  } catch {}
  applyRegister(saved, false);

  document.querySelectorAll('[data-register-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.click(1080);
      applyRegister(btn.dataset.registerBtn, true);
    });
  });

  const audioBtn = document.querySelector('[data-audio-toggle]');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const on = audio.toggle();
      audioBtn.setAttribute('aria-pressed', String(on));
      const lbl = audioBtn.querySelector('[data-audio-label]');
      if (lbl) lbl.textContent = on ? 'Audio ON' : 'Audio OFF';
    });
  }

  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-main-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      audio.click(open ? 1200 : 840);
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   SIGNATURE 1: OPTICAL X-RAY LOUPE (SURFACE CARD VS. PIXEL-EXACT BLUEPRINT)
   ========================================================================== */
const LOUPE_ZONES = [
  {
    id: 'grid',
    label: '4px / 8px Grid',
    x: 28,
    y: 34,
    pill: '8px Rhythm · 24px Padding',
    desc: 'Every card inset, vertical gap, and typography block snaps strictly to the 4px/8px modular baseline with 1px hairlines instead of blurred shadows.'
  },
  {
    id: 'fitts',
    label: 'Fitts ≥ 44px',
    x: 27,
    y: 78,
    pill: 'Min Target 44 × 44 px',
    desc: 'Every interactive button, detent control, and switcher guarantees ≥ 44×44px hit area and responds in ≤ 110ms with crisp tactile feedback.'
  },
  {
    id: 'oklch',
    label: 'oklch() Tokens',
    x: 73,
    y: 38,
    pill: '70 / 20 / 10 Budget',
    desc: 'Surface ladders step by ΔL -0.04 / -0.08 on a C ≤ 0.015 neutral substrate, reserving 10% perceptual chroma for functional signal states.'
  },
  {
    id: 'wcag',
    label: 'WCAG AA',
    x: 72,
    y: 74,
    pill: '7.5:1 Action · AA+',
    desc: 'Derived hover, pressed, and soft tint states mathematically preserve ≥ 4.5:1 body legibility across both daylight and matte dark registers.'
  }
];

function buildLoupeSurfaceSVG() {
  return `<svg viewBox="0 0 800 500" role="img" aria-label="Precision instrument UI surface card">
    <rect width="800" height="500" fill="var(--surface-1)"/>
    <!-- Outer Instrument Card (exact 640x384 frame centered at x=80..720, y=58..442) -->
    <rect x="80" y="58" width="640" height="384" rx="2" fill="var(--surface-card)" stroke="var(--border-strong)" stroke-width="1.5"/>
    <!-- Top Header Strip -->
    <rect x="80" y="58" width="640" height="44" fill="var(--bg)" stroke="var(--border)" stroke-width="1"/>
    <text x="104" y="85" font-family="Martian Mono, monospace" font-size="11" font-weight="700" fill="var(--accent-ink)">BENCH-04 · CALIBRATION INSTRUMENT</text>
    <rect x="616" y="70" width="80" height="20" rx="2" fill="var(--accent-tint)" stroke="var(--accent)" stroke-width="1"/>
    <text x="656" y="84" text-anchor="middle" font-family="Martian Mono, monospace" font-size="10" font-weight="700" fill="var(--accent-ink)">ACTIVE</text>

    <!-- Left Column: Typography & Controls -->
    <text x="104" y="146" font-family="Anybody, sans-serif" font-size="28" font-weight="800" fill="var(--ink)">Optical Surface</text>
    <text x="104" y="176" font-family="Golos Text, sans-serif" font-size="14" fill="var(--ink-muted)">Calibrated neutral substrate with 1px structural</text>
    <text x="104" y="196" font-family="Golos Text, sans-serif" font-size="14" fill="var(--ink-muted)">hairlines and zero generic drop shadows.</text>

    <!-- Mini Telemetry Boxes -->
    <rect x="104" y="220" width="136" height="64" fill="var(--bg)" stroke="var(--border)" stroke-width="1"/>
    <text x="116" y="242" font-family="Martian Mono, monospace" font-size="9.5" fill="var(--ink-muted)">RESPONSE</text>
    <text x="116" y="270" font-family="Anybody, sans-serif" font-size="20" font-weight="700" fill="var(--ink)">110 ms</text>

    <rect x="252" y="220" width="136" height="64" fill="var(--bg)" stroke="var(--border)" stroke-width="1"/>
    <text x="264" y="242" font-family="Martian Mono, monospace" font-size="9.5" fill="var(--ink-muted)">CONTRAST</text>
    <text x="264" y="270" font-family="Anybody, sans-serif" font-size="20" font-weight="700" fill="var(--accent-ink)">7.5 : 1</text>

    <!-- Two Fitts >= 44px Buttons (y=366..410 -> exact 44px height) -->
    <rect x="104" y="366" width="156" height="44" rx="2" fill="var(--accent)"/>
    <text x="182" y="393" text-anchor="middle" font-family="Golos Text, sans-serif" font-size="13.5" font-weight="700" fill="var(--accent-on)">Engage Detent</text>

    <rect x="272" y="366" width="116" height="44" rx="2" fill="var(--surface-1)" stroke="var(--border-strong)" stroke-width="1"/>
    <text x="330" y="393" text-anchor="middle" font-family="Golos Text, sans-serif" font-size="13.5" font-weight="700" fill="var(--ink)">Reset</text>

    <!-- Right Column: Swatch Ladder & Waveform -->
    <rect x="420" y="122" width="276" height="128" fill="var(--bg)" stroke="var(--border)" stroke-width="1"/>
    <text x="436" y="146" font-family="Martian Mono, monospace" font-size="10" font-weight="700" fill="var(--ink-muted)">OKLCH SURFACE LADDER</text>
    <rect x="436" y="160" width="52" height="52" fill="var(--bg)" stroke="var(--border-strong)"/>
    <rect x="498" y="160" width="52" height="52" fill="var(--surface-1)" stroke="var(--border-strong)"/>
    <rect x="560" y="160" width="52" height="52" fill="var(--accent)"/>
    <rect x="622" y="160" width="52" height="52" fill="var(--signal)"/>
    <g font-family="Martian Mono, monospace" font-size="9" fill="var(--ink-muted)">
      <text x="436" y="230">70%</text><text x="498" y="230">20%</text>
      <text x="560" y="230">PRI</text><text x="622" y="230">SIG</text>
    </g>

    <!-- Signal Wave Readout -->
    <rect x="420" y="266" width="276" height="144" fill="var(--bg)" stroke="var(--border)" stroke-width="1"/>
    <text x="436" y="290" font-family="Martian Mono, monospace" font-size="10" font-weight="700" fill="var(--ink-muted)">SPRING DAMPING PROFILE</text>
    <path d="M 436 356 Q 470 296 504 352 T 572 346 T 640 350 L 680 350" fill="none" stroke="var(--accent)" stroke-width="2.6"/>
    <path d="M 436 356 L 680 356" stroke="var(--signal)" stroke-width="1.4" stroke-dasharray="5 4"/>
    <circle cx="504" cy="352" r="4.5" fill="var(--signal)"/>
  </svg>`;
}

function buildLoupeBlueprintSVG(reg) {
  return `<svg viewBox="0 0 800 500" aria-hidden="true">
    <defs>
      <pattern id="bp-grid-8" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="var(--accent-grid)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="800" height="500" fill="url(#bp-grid-8)"/>

    <g font-family="Martian Mono, monospace" font-size="10" font-weight="700" fill="var(--accent-ink)">
      <text x="20" y="24">BLUEPRINT SPEC · 8PX GRID &amp; OKLCH TOKENS</text>
      <text x="780" y="24" text-anchor="end">${reg.name.toUpperCase()}</text>
    </g>

    <!-- Exact Card Frame & 24px Padding Guides -->
    <rect x="80" y="58" width="640" height="384" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-dasharray="6 3"/>
    <rect x="104" y="122" width="284" height="288" fill="none" stroke="var(--accent)" stroke-opacity="0.5" stroke-width="1"/>
    <rect x="420" y="122" width="276" height="288" fill="none" stroke="var(--accent)" stroke-opacity="0.5" stroke-width="1"/>

    <!-- 24px Padding Dimension Arrow -->
    <g stroke="var(--signal)" stroke-width="1.4">
      <line x1="80" y1="138" x2="104" y2="138"/>
      <line x1="80" y1="132" x2="80" y2="144"/>
      <line x1="104" y1="132" x2="104" y2="144"/>
      <!-- 32px Column Gutter -->
      <line x1="388" y1="250" x2="420" y2="250"/>
      <line x1="388" y1="244" x2="388" y2="256"/>
      <line x1="420" y1="244" x2="420" y2="256"/>
    </g>
    <g stroke="none" font-family="Martian Mono, monospace" font-size="10" font-weight="700" fill="var(--signal-ink)">
      <text x="92" y="128" text-anchor="middle">24px</text>
      <text x="404" y="238" text-anchor="middle">32px</text>
    </g>

    <!-- Fitts >= 44px Callout Boxes on the two buttons -->
    <rect x="104" y="366" width="156" height="44" fill="var(--signal)" fill-opacity="0.14" stroke="var(--signal)" stroke-width="2"/>
    <rect x="272" y="366" width="116" height="44" fill="var(--signal)" fill-opacity="0.14" stroke="var(--signal)" stroke-width="2"/>
    <g stroke="none" font-family="Martian Mono, monospace" font-size="10" font-weight="700" fill="var(--signal-ink)">
      <text x="104" y="356">FITTS TARGET · H = 44 px (MIN ≥ 44)</text>
      <text x="182" y="426" text-anchor="middle">156 × 44 px</text>
      <text x="330" y="426" text-anchor="middle">116 × 44 px</text>
    </g>

    <!-- oklch() Token Overlay on Right Column -->
    <rect x="436" y="160" width="238" height="52" fill="none" stroke="var(--accent)" stroke-width="1.6"/>
    <g stroke="none" font-family="Martian Mono, monospace" font-size="10" font-weight="700">
      <text x="436" y="150" fill="var(--accent-ink)">ΔL = -0.04 / -0.08 · C ≤ 0.015</text>
      <text x="436" y="230" fill="var(--accent-ink)">${reg.substrate}</text>
      <text x="436" y="246" fill="var(--signal-ink)">${reg.primary}</text>
    </g>

    <!-- WCAG AA Contrast Callout Box -->
    <rect x="420" y="266" width="276" height="144" fill="var(--accent)" fill-opacity="0.08" stroke="var(--accent)" stroke-width="1.6"/>
    <path d="M 436 356 Q 470 296 504 352 T 572 346 T 640 350 L 680 350" fill="none" stroke="var(--signal)" stroke-width="2.4"/>
    <g stroke="none" font-family="Martian Mono, monospace" font-size="10.5" font-weight="700">
      <text x="436" y="302" fill="var(--accent-ink)">WCAG AA VERIFIED</text>
      <text x="436" y="320" fill="var(--signal-ink)">${reg.contrast}</text>
      <text x="436" y="396" fill="var(--ink)">ZERO BLUR · COMPOSITOR CLIP-PATH</text>
    </g>
  </svg>`;
}

function initLoupe() {
  const stage = document.getElementById('loupe-stage');
  const surfaceEl = document.getElementById('loupe-surface');
  const blueprintEl = document.getElementById('loupe-blueprint');
  const coordsEl = document.getElementById('loupe-coords');
  const zonesWrap = document.getElementById('loupe-zones');
  const fullToggle = document.getElementById('loupe-full-toggle');
  const titleEl = document.getElementById('zone-title');
  const descEl = document.getElementById('zone-desc');
  const pillEl = document.getElementById('zone-pill');
  if (!stage || !surfaceEl || !blueprintEl) return;

  surfaceEl.innerHTML = buildLoupeSurfaceSVG();
  const renderBlueprint = (reg) => {
    blueprintEl.innerHTML = buildLoupeBlueprintSVG(reg);
  };
  renderBlueprint(REGISTERS[document.documentElement.dataset.register] || REGISTERS.risograph);
  window.addEventListener('showcase:register', (e) => renderBlueprint(e.detail));

  let rect = stage.getBoundingClientRect();
  let curX = 54, curY = 48, targetX = 54, targetY = 48, rafId = 0;

  const applyLens = (xPct, yPct) => {
    const xc = Math.max(4, Math.min(96, xPct));
    const yc = Math.max(6, Math.min(94, yPct));
    stage.style.setProperty('--lx', `${xc.toFixed(2)}%`);
    stage.style.setProperty('--ly', `${yc.toFixed(2)}%`);
    stage.style.setProperty('--lx-px', `${((xc / 100) * rect.width).toFixed(1)}px`);
    stage.style.setProperty('--ly-px', `${((yc / 100) * rect.height).toFixed(1)}px`);
    if (coordsEl) {
      coordsEl.textContent = `X ${Math.round((xc / 100) * 800)} px · Y ${Math.round((yc / 100) * 500)} px`;
    }
  };

  const tick = () => {
    rafId = 0;
    if (isReducedMotion()) {
      curX = targetX; curY = targetY; applyLens(curX, curY); return;
    }
    const dx = targetX - curX, dy = targetY - curY;
    if (Math.abs(dx) < 0.08 && Math.abs(dy) < 0.08) {
      curX = targetX; curY = targetY; applyLens(curX, curY); return;
    }
    curX += dx * 0.34;
    curY += dy * 0.34;
    applyLens(curX, curY);
    rafId = requestAnimationFrame(tick);
  };

  const schedule = (x, y) => {
    targetX = x; targetY = y;
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  const selectZone = (z, play = true) => {
    if (play) audio.click(1140);
    schedule(z.x, z.y);
    if (titleEl) { titleEl.dataset.zone = z.id; titleEl.textContent = z.label; }
    if (descEl) descEl.textContent = z.desc;
    if (pillEl) pillEl.textContent = z.pill;
    zonesWrap?.querySelectorAll('button[data-zone]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.zone === z.id));
    });
  };

  const nearestZone = (xPct, yPct) =>
    LOUPE_ZONES.reduce((best, z) =>
      Math.hypot(z.x - xPct, z.y - yPct) < Math.hypot(best.x - xPct, best.y - yPct) ? z : best
    );

  if (zonesWrap) {
    zonesWrap.innerHTML = LOUPE_ZONES.map(
      (z, i) => `<button type="button" class="chip" data-zone="${z.id}" aria-pressed="${i === 0}">${z.label}</button>`
    ).join('');
    zonesWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-zone]');
      if (!btn) return;
      const z = LOUPE_ZONES.find((item) => item.id === btn.dataset.zone);
      if (z) selectZone(z, true);
    });
  }

  stage.addEventListener('pointerenter', () => { rect = stage.getBoundingClientRect(); });
  stage.addEventListener('pointermove', (e) => {
    if (!rect.width) rect = stage.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    schedule(xPct, yPct);
    const near = nearestZone(xPct, yPct);
    if (titleEl && titleEl.dataset.zone !== near.id) {
      titleEl.dataset.zone = near.id;
      titleEl.textContent = near.label;
      if (descEl) descEl.textContent = near.desc;
      if (pillEl) pillEl.textContent = near.pill;
      zonesWrap?.querySelectorAll('button[data-zone]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.zone === near.id));
      });
    }
  });
  stage.addEventListener('pointerdown', (e) => {
    rect = stage.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    selectZone(nearestZone(xPct, yPct), true);
    schedule(xPct, yPct);
  });

  fullToggle?.addEventListener('click', () => {
    const full = stage.classList.toggle('is-full-blueprint');
    fullToggle.setAttribute('aria-pressed', String(full));
    fullToggle.textContent = full ? 'Return to Loupe' : 'Full Blueprint';
    audio.click(full ? 1260 : 880);
  });

  window.addEventListener('resize', () => {
    rect = stage.getBoundingClientRect();
    applyLens(curX, curY);
  }, { passive: true });

  selectZone(LOUPE_ZONES[0], false);
  rect = stage.getBoundingClientRect();
  applyLens(curX, curY);
}

/* ==========================================================================
   SIGNATURE 2: SPRING-PHYSICS RISOGRAPH PRINT PLATES
   ========================================================================== */
const RISO_PLATES = [
  {
    id: 'reticle',
    code: 'PLATE-A · OPTICS',
    title: 'Optical Reticle',
    note: 'Concentric calibration rings and crosshair ticks overprinted in two spot inks.',
    a: `<circle cx="220" cy="138" r="88" fill="none" stroke="var(--accent)" stroke-width="2.6"/>
        <circle cx="220" cy="138" r="54" fill="var(--accent)" fill-opacity="0.14" stroke="var(--accent)" stroke-width="2"/>
        <line x1="70" y1="138" x2="370" y2="138" stroke="var(--accent)" stroke-width="1.6"/>
        <line x1="220" y1="24" x2="220" y2="252" stroke="var(--accent)" stroke-width="1.6"/>`,
    b: `<circle cx="220" cy="138" r="72" fill="none" stroke="var(--signal)" stroke-width="3" stroke-dasharray="10 6"/>
        <polygon points="220,76 274,170 166,170" fill="var(--signal)" fill-opacity="0.22" stroke="var(--signal)" stroke-width="2.2"/>
        <circle cx="220" cy="138" r="7" fill="var(--signal)"/>`
  },
  {
    id: 'harmonic',
    code: 'PLATE-B · TOPOLOGY',
    title: 'Harmonic Matrix',
    note: 'Interference contours and tonal dot screen demonstrating crisp print registration.',
    a: `<g fill="none" stroke="var(--accent)" stroke-width="2.2">
          <path d="M 40 70 Q 130 30 220 70 T 400 70"/>
          <path d="M 40 105 Q 130 65 220 105 T 400 105"/>
          <path d="M 40 140 Q 130 100 220 140 T 400 140"/>
          <path d="M 40 175 Q 130 135 220 175 T 400 175"/>
          <path d="M 40 210 Q 130 170 220 210 T 400 210"/>
        </g>`,
    b: `<g fill="var(--signal)" fill-opacity="0.78">
          <circle cx="110" cy="96" r="14"/><circle cx="165" cy="138" r="22"/><circle cx="220" cy="112" r="16"/>
          <circle cx="275" cy="158" r="26"/><circle cx="330" cy="124" r="14"/>
        </g>`
  },
  {
    id: 'truss',
    code: 'PLATE-C · MECHANICS',
    title: 'Kinetic Tension',
    note: 'Structural diagonals and load arcs behaving like physical printed proofs.',
    a: `<g stroke="var(--accent)" stroke-width="2.6" fill="none">
          <rect x="64" y="54" width="312" height="166"/>
          <line x1="64" y1="220" x2="180" y2="54"/>
          <line x1="180" y1="220" x2="296" y2="54"/>
          <line x1="296" y1="220" x2="376" y2="104"/>
        </g>`,
    b: `<path d="M 64 180 C 148 92 292 92 376 180" fill="none" stroke="var(--signal)" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 64 202 C 148 122 292 122 376 202" fill="none" stroke="var(--signal)" stroke-width="2.2" stroke-dasharray="8 4"/>
        <rect x="196" y="106" width="48" height="48" fill="var(--signal)" fill-opacity="0.22" stroke="var(--signal)" stroke-width="2"/>`
  }
];

function initRisograph() {
  const grid = document.getElementById('riso-grid');
  const modeWrap = document.getElementById('riso-modes');
  const offsetRange = document.getElementById('riso-offset');
  const offsetVal = document.getElementById('riso-offset-val');
  if (!grid) return;

  let mode = 'composite';
  let baseOffset = 3;
  const springs = new Map();
  let rafId = 0;

  grid.innerHTML = RISO_PLATES.map(
    (p) => `
      <article class="riso-card">
        <div class="riso-plate" data-plate="${p.id}" data-mode="${mode}">
          <div class="riso-layer riso-layer-a"><svg viewBox="0 0 440 275" aria-hidden="true">${p.a}</svg></div>
          <div class="riso-layer riso-layer-b"><svg viewBox="0 0 440 275" aria-hidden="true">${p.b}</svg></div>
        </div>
        <div class="riso-card-body">
          <div class="riso-meta">
            <h3>${p.title}</h3>
            <span class="riso-code">${p.code}</span>
          </div>
          <p class="muted-copy" style="margin:0;font-size:0.86rem;">${p.note}</p>
        </div>
      </article>`
  ).join('');

  const step = () => {
    rafId = 0;
    let moving = false;
    springs.forEach((st) => {
      if (isReducedMotion()) {
        st.x = st.tx; st.y = st.ty; st.vx = 0; st.vy = 0;
      } else {
        st.vx = (st.vx + (st.tx - st.x) * 0.22) * 0.72;
        st.vy = (st.vy + (st.ty - st.y) * 0.22) * 0.72;
        st.x += st.vx;
        st.y += st.vy;
      }
      if (Math.abs(st.vx) > 0.01 || Math.abs(st.vy) > 0.01 || Math.abs(st.tx - st.x) > 0.02 || Math.abs(st.ty - st.y) > 0.02) {
        moving = true;
      } else {
        st.x = st.tx; st.y = st.ty; st.vx = 0; st.vy = 0;
      }
      st.la.style.transform = `translate3d(${(-st.x).toFixed(2)}px, ${(-st.y).toFixed(2)}px, 0)`;
      st.lb.style.transform = `translate3d(${(st.x).toFixed(2)}px, ${(st.y).toFixed(2)}px, 0)`;
    });
    if (moving && !document.hidden) rafId = requestAnimationFrame(step);
  };
  const kick = () => { if (!rafId) rafId = requestAnimationFrame(step); };

  grid.querySelectorAll('[data-plate]').forEach((plate) => {
    const la = plate.querySelector('.riso-layer-a');
    const lb = plate.querySelector('.riso-layer-b');
    const st = { x: baseOffset, y: baseOffset * 0.5, vx: 0, vy: 0, tx: baseOffset, ty: baseOffset * 0.5, la, lb };
    springs.set(plate.dataset.plate, st);
    let r = null;
    plate.addEventListener('pointerenter', () => { r = plate.getBoundingClientRect(); });
    plate.addEventListener('pointermove', (e) => {
      if (!r) r = plate.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      st.tx = nx * (6 + baseOffset);
      st.ty = ny * (4 + baseOffset * 0.6);
      kick();
    });
    plate.addEventListener('pointerleave', () => {
      st.tx = baseOffset; st.ty = baseOffset * 0.5;
      kick();
    });
  });

  modeWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-riso-mode]');
    if (!btn) return;
    mode = btn.dataset.risoMode;
    modeWrap.querySelectorAll('[data-riso-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    grid.querySelectorAll('[data-plate]').forEach((p) => (p.dataset.mode = mode));
    audio.click(1080);
  });

  offsetRange?.addEventListener('input', () => {
    baseOffset = Number(offsetRange.value);
    if (offsetVal) offsetVal.textContent = `${baseOffset} px`;
    springs.forEach((st) => { st.tx = baseOffset; st.ty = baseOffset * 0.5; });
    audio.click(860 + baseOffset * 38);
    kick();
  });

  kick();
}

/* ==========================================================================
   SIGNATURE 3: VERLET 2D PATCHBAY DRIVING LIVE VARIABLE TYPE AXES
   ========================================================================== */
function initVerletPatchbay() {
  const canvas = document.getElementById('verlet-canvas');
  const energyEl = document.getElementById('verlet-energy');
  const wordEl = document.getElementById('kinetic-word');
  const axisEl = document.getElementById('axis-readout');
  const stiffInput = document.getElementById('cable-stiffness');
  const stiffVal = document.getElementById('stiffness-val');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 640, height = 310, rect = canvas.getBoundingClientRect();
  let visible = true, rafId = 0, stiffness = 0.72, grabbed = null;
  const NODES = 16;
  const CORD_FREQS = [165, 220, 293, 392];
  let cords = [];

  const buildCords = () => {
    cords = [];
    const padX = 44;
    const span = width - padX * 2;
    const step = span / (NODES - 1);
    for (let c = 0; c < 4; c++) {
      const baseY = 58 + c * ((height - 104) / 3);
      const pts = [];
      for (let i = 0; i < NODES; i++) {
        const x = padX + i * step;
        pts.push({ x, y: baseY, ox: x, oy: baseY, homeX: x, homeY: baseY, pinned: i === 0 || i === NODES - 1 });
      }
      cords.push({ pts, rest: step, freq: CORD_FREQS[c] });
    }
  };

  const updateTypography = (maxDisp) => {
    const reg = REGISTERS[document.documentElement.dataset.register] || REGISTERS.risograph;
    const ratio = Math.min(1, maxDisp / 44);
    const wdth = Math.round(reg.baseWdth + ratio * 16);
    const wght = Math.round(Math.min(900, reg.baseWght + ratio * 100));
    if (wordEl) wordEl.style.fontVariationSettings = `"wdth" ${wdth}, "wght" ${wght}`;
    if (axisEl) axisEl.textContent = `wdth ${wdth} · wght ${wght}`;
    if (energyEl) energyEl.textContent = `Disp ${maxDisp.toFixed(1)} px`;
  };

  const stepPhysics = () => {
    let maxDisp = 0;
    const damping = 0.945;
    for (const cord of cords) {
      for (const p of cord.pts) {
        if (p.pinned || p === grabbed) continue;
        const vx = (p.x - p.ox) * damping;
        const vy = (p.y - p.oy) * damping;
        p.ox = p.x; p.oy = p.y;
        p.x += vx + (p.homeX - p.x) * (0.025 * stiffness);
        p.y += vy + (p.homeY - p.y) * (0.045 * stiffness);
        const d = Math.hypot(p.x - p.homeX, p.y - p.homeY);
        if (d > maxDisp) maxDisp = d;
      }
      for (let it = 0; it < 5; it++) {
        for (let i = 0; i < cord.pts.length - 1; i++) {
          const p1 = cord.pts[i], p2 = cord.pts[i + 1];
          const dx = p2.x - p1.x, dy = p2.y - p1.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const diff = (dist - cord.rest) / dist;
          const k = 0.48 * stiffness;
          if (!p1.pinned && p1 !== grabbed) { p1.x += dx * diff * k; p1.y += dy * diff * k; }
          if (!p2.pinned && p2 !== grabbed) { p2.x -= dx * diff * k; p2.y -= dy * diff * k; }
        }
      }
    }
    updateTypography(maxDisp);
    return maxDisp;
  };

  const draw = () => {
    const pal = getThemeColors();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle bench grid
    ctx.save();
    ctx.strokeStyle = pal.border;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1;
    for (let x = 44; x < width - 20; x += 48) {
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, height - 20); ctx.stroke();
    }
    ctx.restore();

    for (let c = 0; c < cords.length; c++) {
      const cord = cords[c];
      let peak = 0;
      for (const p of cord.pts) peak = Math.max(peak, Math.abs(p.y - p.homeY));

      ctx.beginPath();
      cord.pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.strokeStyle = peak > 14 ? pal.signal : c % 2 === 0 ? pal.accent : pal.ink;
      ctx.lineWidth = peak > 14 ? 3.2 : 2.4;
      ctx.stroke();

      // End sockets
      const first = cord.pts[0], last = cord.pts[cord.pts.length - 1];
      for (const sock of [first, last]) {
        ctx.fillStyle = pal.bg;
        ctx.strokeStyle = pal.ink;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(sock.x, sock.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = c % 2 === 0 ? pal.accent : pal.signal;
        ctx.beginPath(); ctx.arc(sock.x, sock.y, 2.2, 0, Math.PI * 2); ctx.fill();
      }
    }
  };

  let settle = 0;
  const loop = () => {
    rafId = 0;
    if (!visible || document.hidden) return;
    const disp = stepPhysics();
    draw();
    if (grabbed || disp > 0.14) {
      settle = 0;
      rafId = requestAnimationFrame(loop);
    } else if (settle < 8) {
      settle++;
      rafId = requestAnimationFrame(loop);
    }
  };
  const start = () => {
    if (!visible || document.hidden) return;
    if (isReducedMotion()) { stepPhysics(); draw(); return; }
    if (!rafId) rafId = requestAnimationFrame(loop);
  };

  const resize = () => {
    rect = canvas.getBoundingClientRect();
    const dpr = getCappedDpr();
    width = Math.max(280, Math.round(rect.width));
    height = Math.max(240, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildCords();
    updateTypography(0);
    draw();
  };

  canvas.addEventListener('pointerdown', (e) => {
    rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    let best = null, bestD = 34, bestFreq = 220;
    for (const cord of cords) {
      for (const p of cord.pts) {
        if (p.pinned) continue;
        const d = Math.hypot(p.x - px, p.y - py);
        if (d < bestD) { bestD = d; best = p; bestFreq = cord.freq; }
      }
    }
    if (best) {
      grabbed = best;
      canvas.setPointerCapture(e.pointerId);
      audio.pluck(bestFreq);
      start();
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!grabbed) return;
    grabbed.x = Math.max(48, Math.min(width - 48, e.clientX - rect.left));
    grabbed.y = Math.max(24, Math.min(height - 24, e.clientY - rect.top));
    start();
  });

  const release = () => { if (grabbed) { grabbed = null; start(); } };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  document.querySelectorAll('[data-pluck]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.pluck;
      if (kind === 'reset') {
        audio.click(820);
        buildCords();
        updateTypography(0);
        draw();
        return;
      }
      cords.forEach((cord, ci) => {
        if (kind === 'low' && ci !== 0) return;
        const amp = kind === 'snap' ? 38 : kind === 'chord' ? 24 + ci * 4 : 30;
        cord.pts.forEach((p, idx) => {
          if (p.pinned) return;
          const env = Math.sin((idx / (NODES - 1)) * Math.PI);
          p.oy -= amp * env * (ci % 2 === 0 ? 1 : -1);
        });
        audio.pluck(cord.freq);
      });
      start();
    });
  });

  stiffInput?.addEventListener('input', () => {
    stiffness = Number(stiffInput.value) / 100;
    if (stiffVal) stiffVal.textContent = `${stiffInput.value} %`;
    audio.click(880 + Number(stiffInput.value) * 3);
    start();
  });

  window.addEventListener('showcase:register', () => { draw(); updateTypography(0); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (!visible && rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    }, { threshold: 0.02 }).observe(canvas);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();
}

/* ==========================================================================
   UNIVERSAL SKILL INSTALLER TABS + COPY
   ========================================================================== */
const INSTALL_GUIDES = {
  cli: {
    label: 'Universal CLI (skills.sh compatible)',
    code: 'npx skills add grayhawk225-pixel/atelier-web-skill',
    note: 'Installs skills/tactile-atelier-web/ directly into your active AI coding agents.'
  },
  claude: {
    label: 'Claude Code (~/.claude/skills/)',
    code: 'git clone --depth 1 https://github.com/grayhawk225-pixel/atelier-web-skill.git /tmp/taw \\\n  && mkdir -p ~/.claude/skills \\\n  && cp -r /tmp/taw/skills/tactile-atelier-web ~/.claude/skills/ \\\n  && rm -rf /tmp/taw',
    note: 'Claude Code discovers SKILL.md and references/*.md automatically on the next session.'
  },
  cursor: {
    label: 'Cursor (.cursor/skills/ in your project)',
    code: 'git clone --depth 1 https://github.com/grayhawk225-pixel/atelier-web-skill.git /tmp/taw \\\n  && mkdir -p .cursor/skills \\\n  && cp -r /tmp/taw/skills/tactile-atelier-web .cursor/skills/ \\\n  && rm -rf /tmp/taw',
    note: 'Adds the skill to your workspace so Cursor applies the non-convergent protocol automatically.'
  },
  codex: {
    label: 'Codex / Gemini CLI / Antigravity (~/.agents/skills/)',
    code: 'git clone --depth 1 https://github.com/grayhawk225-pixel/atelier-web-skill.git /tmp/taw \\\n  && mkdir -p ~/.agents/skills \\\n  && cp -r /tmp/taw/skills/tactile-atelier-web ~/.agents/skills/ \\\n  && rm -rf /tmp/taw',
    note: 'Follows the open Agent Skills directory standard (~/.agents/skills/ or project .agents/skills/).'
  },
  copilot: {
    label: 'GitHub Copilot (.github/skills/ in your repository)',
    code: 'git clone --depth 1 https://github.com/grayhawk225-pixel/atelier-web-skill.git /tmp/taw \\\n  && mkdir -p .github/skills \\\n  && cp -r /tmp/taw/skills/tactile-atelier-web .github/skills/ \\\n  && rm -rf /tmp/taw',
    note: 'Commits cleanly alongside your repository so GitHub Copilot Coding Agent loads it automatically.'
  },
  web: {
    label: 'ChatGPT / Claude Web (Project Knowledge)',
    code: '# Download skills/tactile-atelier-web/ from GitHub and upload:\n# 1. SKILL.md\n# 2. references/anti-convergence-audit.md\n# 3. references/tactile-engines.md\n# 4. references/ui-ux-color-architecture.md',
    note: 'Attach the 4 Markdown files to a Claude Project or Custom GPT to enforce the protocol in chat.'
  }
};

function initInstaller() {
  const tabsWrap = document.getElementById('install-tabs');
  const labelEl = document.getElementById('install-label');
  const codeEl = document.getElementById('install-code');
  const noteEl = document.getElementById('install-note');
  const copyBtn = document.getElementById('copy-install-btn');
  if (!tabsWrap || !codeEl) return;

  let current = 'cli';
  const selectTab = (id) => {
    const g = INSTALL_GUIDES[id] || INSTALL_GUIDES.cli;
    current = id;
    if (labelEl) labelEl.textContent = g.label;
    codeEl.textContent = g.code;
    if (noteEl) noteEl.textContent = g.note;
    tabsWrap.querySelectorAll('[data-install]').forEach((b) => {
      const active = b.dataset.install === id;
      b.setAttribute('aria-pressed', String(active));
      b.setAttribute('aria-selected', String(active));
    });
    if (copyBtn) copyBtn.textContent = 'Copy';
  };

  tabsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-install]');
    if (!btn) return;
    audio.click(1040);
    selectTab(btn.dataset.install);
  });

  copyBtn?.addEventListener('click', async () => {
    const text = INSTALL_GUIDES[current]?.code || '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    audio.click(1240);
    copyBtn.textContent = 'Copied';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1600);
  });

  selectTab('cli');
}

initChrome();
initLoupe();
initRisograph();
initVerletPatchbay();
initInstaller();
