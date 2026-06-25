/**
 * SkillNest V4 — Three.js Cinematic Scene
 * Reference: Aniviox meditation UI — deep nebula + glowing ring portal
 *
 * BG:   Volumetric blue/teal nebula particles + drifting light streaks
 * Hero: Massive glowing neon ring (like the reference) + particle sphere core
 *       + orbiting light dots + depth-layered particles
 */

(function () {
  'use strict';

  const MOBILE = window.innerWidth < 768;

  /* ═══════════════════════════════════════
     BACKGROUND — Blue / Teal Nebula
  ═══════════════════════════════════════ */
  let bgR, bgS, bgC, bgClock;
  let bgParticles, bgStreaks, bgNebula;

  function initBg() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !window.THREE) return;

    bgClock = new THREE.Clock();
    bgS = new THREE.Scene();
    bgC = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 200);
    bgC.position.z = 6;

    bgR = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    bgR.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    bgR.setSize(innerWidth, innerHeight);
    bgR.setClearColor(0x000000, 0);

    /* Star/dust particles */
    const N = MOBILE ? 700 : 1600;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const sz  = new Float32Array(N);

    // Blue-teal-cyan palette — vibrant, premium, cool-toned
    const pal = [
      [0.12, 0.25, 0.69],  // deep blue
      [0.15, 0.39, 0.92],  // core blue
      [0.22, 0.74, 0.97],  // sky blue
      [0.13, 0.83, 0.93],  // cyan
      [0.18, 0.83, 0.75],  // teal
      [0.96, 0.44, 0.71],  // rose spark (rare accent)
    ];

    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 36;
      pos[i*3+1] = (Math.random() - 0.5) * 28;
      pos[i*3+2] = (Math.random() - 0.5) * 20;
      const c = pal[Math.floor(Math.random() * pal.length)];
      col[i*3] = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
      sz[i] = Math.random() * 1.8 + 0.5;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sz, 1));

    bgParticles = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.025, vertexColors: true,
      transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    bgS.add(bgParticles);

    /* Nebula glow volumes — soft additive spheres */
    [
      { color: 0x1E3A8A, pos: [-4, 2, -8],  r: 4.5, op: 0.018 },  // deep navy blue
      { color: 0x2563EB, pos: [5, -2, -10], r: 5,   op: 0.014 },  // vivid blue
      { color: 0x0EA5E9, pos: [0, -4, -6],  r: 3.5, op: 0.012 },  // sky blue
      { color: 0x0D9488, pos: [3, 4, -9],   r: 3,   op: 0.010 },  // deep teal
    ].forEach(({ color, pos, r, op }) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 12, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      m.position.set(...pos);
      bgS.add(m);
    });

    window.addEventListener('resize', () => {
      bgC.aspect = innerWidth / innerHeight;
      bgC.updateProjectionMatrix();
      bgR.setSize(innerWidth, innerHeight);
    });

    (function loop() {
      requestAnimationFrame(loop);
      const t = bgClock.getElapsedTime();
      if (bgParticles) {
        bgParticles.rotation.y = t * 0.009 + mx * 0.035;
        bgParticles.rotation.x = t * 0.005 + my * 0.02;
      }
      bgR.render(bgS, bgC);
    })();
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth  - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });

  /* ═══════════════════════════════════════
     HERO — Glowing Neon Ring Portal
     (matching the reference image exactly)
  ═══════════════════════════════════════ */
  let hR, hS, hC, hClock;
  let mainRing, innerRing, outerRing;
  let coreSphere, coreGlow;
  let orbitDots = [];
  let heroParticles;
  let hMouseX = 0, hMouseY = 0;

  function initHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.THREE) return;

    hClock = new THREE.Clock();
    hS = new THREE.Scene();
    const w = canvas.clientWidth  || 520;
    const h = canvas.clientHeight || 520;
    hC = new THREE.PerspectiveCamera(48, w / h, 0.1, 100);
    hC.position.set(0, 0, 7);

    hR = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    hR.setPixelRatio(Math.min(devicePixelRatio, 2));
    hR.setSize(w, h);
    hR.setClearColor(0x000000, 0);

    /* ── LIGHTS ── */
    hS.add(new THREE.AmbientLight(0x001029, 2));

    const addLight = (color, intensity, dist, x, y, z) => {
      const l = new THREE.PointLight(color, intensity, dist);
      l.position.set(x, y, z);
      hS.add(l);
      return l;
    };
    addLight(0x2563EB, 5, 15,  2,  2, 4);   // core blue
    addLight(0x22D3EE, 4, 12, -2, -1, 4);   // cyan
    addLight(0x2DD4BF, 2.5, 10, 0, -3, 3);  // teal
    addLight(0x6366F1, 2, 10,  3, -2, 2);   // indigo

    /* ── MAIN GLOW RING (like reference) ── */
    // Thick glowing torus — the hero centerpiece
    const ringGeo = new THREE.TorusGeometry(2.1, 0.038, 20, 180);

    // Multi-layer ring for bloom-like glow effect
    const ringColors = [
      { color: 0x38BDF8, op: 0.95, scale: 1.000 },  // core bright sky blue
      { color: 0x2563EB, op: 0.55, scale: 1.012 },  // outer blue glow
      { color: 0x22D3EE, op: 0.30, scale: 1.025 },  // cyan halo
      { color: 0xffffff, op: 0.15, scale: 0.990 },  // inner white
    ];

    const ringGroup = new THREE.Group();
    ringColors.forEach(({ color, op, scale }) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(2.1 * scale, 0.044, 20, 180),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      ringGroup.add(m);
    });

    // Tilt ring like in reference (slight angle)
    ringGroup.rotation.x = 0.18;
    ringGroup.rotation.y = -0.08;
    mainRing = ringGroup;
    hS.add(mainRing);

    /* ── INNER RING ── */
    innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.5, 0.018, 12, 120),
      new THREE.MeshBasicMaterial({ color: 0x6366F1, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    innerRing.rotation.x = -0.3;
    innerRing.rotation.z = 0.1;
    hS.add(innerRing);

    /* ── OUTER SUBTLE RING ── */
    outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.75, 0.012, 8, 140),
      new THREE.MeshBasicMaterial({ color: 0x2563EB, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    outerRing.rotation.x = 0.25;
    outerRing.rotation.y = 0.1;
    hS.add(outerRing);

    /* ── CORE SPHERE (center glow) ── */
    const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
    coreSphere = new THREE.Mesh(coreGeo, new THREE.MeshPhongMaterial({
      color: 0x0B2A6B,
      emissive: 0x2563EB,
      emissiveIntensity: 1.2,
      transparent: true, opacity: 0.9,
      shininess: 120,
    }));
    hS.add(coreSphere);

    // Outer glow layers
    [
      { r: 0.72, color: 0x2563EB, op: 0.25 },
      { r: 0.95, color: 0x0B2A6B, op: 0.12 },
      { r: 1.25, color: 0x0A1740, op: 0.06 },
    ].forEach(({ r, color, op }) => {
      hS.add(new THREE.Mesh(
        new THREE.SphereGeometry(r, 20, 20),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })
      ));
    });

    /* ── ORBITING GLOW DOTS (like the light particles in reference) ── */
    const dotCount = MOBILE ? 6 : 10;
    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      const radius = 2.1 + (Math.random() - 0.5) * 0.3;
      const dotColors = [0x38BDF8, 0x22D3EE, 0x2DD4BF, 0x6366F1, 0xFCD34D];
      const color = dotColors[i % dotColors.length];

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 8, 8),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })
      );

      // Glow halo around each dot
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending })
      );
      dot.add(glow);

      dot.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.25, Math.sin(angle) * radius);
      dot.userData = { baseAngle: angle, radius, speed: 0.25 + Math.random() * 0.35, tiltY: (Math.random() - 0.5) * 0.4 };
      orbitDots.push(dot);
      hS.add(dot);
    }

    /* ── FLOATING PARTICLES around ring ── */
    const pCount = MOBILE ? 200 : 450;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    const heroPal = [
      new THREE.Color('#38BDF8'),
      new THREE.Color('#22D3EE'),
      new THREE.Color('#F472B6'),
      new THREE.Color('#6366F1'),
      new THREE.Color('#2DD4BF'),
    ];

    for (let i = 0; i < pCount; i++) {
      const r = 1.8 + Math.random() * 1.8;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      pPos[i*3+1] = r * Math.sin(ph) * Math.sin(th) * 0.6; // flatten slightly
      pPos[i*3+2] = r * Math.cos(ph);
      const c = heroPal[Math.floor(Math.random() * heroPal.length)];
      pCol[i*3] = c.r; pCol[i*3+1] = c.g; pCol[i*3+2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
    heroParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.04, vertexColors: true,
      transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }));
    hS.add(heroParticles);

    /* ── LIGHT STREAK LINES (subtle depth lines) ── */
    for (let i = 0; i < (MOBILE ? 3 : 6); i++) {
      const pts = [];
      const angle = (i / 6) * Math.PI * 2;
      const r = 2.1;
      pts.push(new THREE.Vector3(Math.cos(angle)*r * 0.3, Math.sin(angle)*r * 0.2, 0));
      pts.push(new THREE.Vector3(Math.cos(angle)*r * 1.1, Math.sin(angle)*r * 0.5, Math.sin(angle) * 0.5));
      const lgeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lmat = new THREE.LineBasicMaterial({
        color: [0x38BDF8, 0x22D3EE, 0x2DD4BF][i % 3],
        transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending,
      });
      hS.add(new THREE.Line(lgeo, lmat));
    }

    window.addEventListener('mousemove', e => {
      hMouseX = (e.clientX / innerWidth  - 0.5) * 2;
      hMouseY = (e.clientY / innerHeight - 0.5) * 2;
    });
    window.addEventListener('resize', () => {
      const c = document.getElementById('hero-canvas');
      if (!c) return;
      const w = c.clientWidth, h = c.clientHeight;
      hC.aspect = w / h;
      hC.updateProjectionMatrix();
      hR.setSize(w, h);
    });

    (function loop() {
      requestAnimationFrame(loop);
      const t = hClock.getElapsedTime();

      // Main ring — slow tilt rotation + mouse parallax
      if (mainRing) {
        mainRing.rotation.z = t * 0.08;
        mainRing.rotation.x = 0.18 + hMouseY * 0.10;
        mainRing.rotation.y = -0.08 + hMouseX * 0.10;
      }
      if (innerRing) {
        innerRing.rotation.z = -t * 0.14;
        innerRing.rotation.x = -0.3 + hMouseY * 0.06;
      }
      if (outerRing) {
        outerRing.rotation.z = t * 0.05;
        outerRing.rotation.x = 0.25 - hMouseY * 0.04;
      }

      // Core pulses
      if (coreSphere) {
        const s = 1 + Math.sin(t * 1.4) * 0.06;
        coreSphere.scale.setScalar(s);
        coreSphere.material.emissiveIntensity = 1.1 + Math.sin(t * 1.8) * 0.4;
      }

      // Orbiting dots
      orbitDots.forEach(dot => {
        const { baseAngle, radius, speed, tiltY } = dot.userData;
        const a = baseAngle + t * speed;
        dot.position.set(
          Math.cos(a) * radius,
          Math.sin(a) * radius * 0.25 + tiltY,
          Math.sin(a) * radius * 0.85
        );
        dot.material.opacity = 0.7 + Math.sin(t * 2 + baseAngle) * 0.25;
      });

      // Particles drift
      if (heroParticles) {
        heroParticles.rotation.y = t * 0.06;
        heroParticles.rotation.x = t * 0.03 + hMouseY * 0.05;
      }

      // Camera parallax (subtle, like reference)
      hC.position.x = hMouseX * 0.22;
      hC.position.y = -hMouseY * 0.16;
      hC.lookAt(0, 0, 0);

      hR.render(hS, hC);
    })();
  }

  /* ── INIT ── */
  function wait(cb, n) {
    if (window.THREE) { cb(); return; }
    if ((n||0) > 25) return;
    setTimeout(() => wait(cb, (n||0)+1), 150);
  }

  window.addEventListener('load', () => wait(() => { initBg(); initHero(); }));
})();
