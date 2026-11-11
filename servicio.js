/* =========================================================
   PÁGINAS DE SERVICIO
   - Constelación de partículas con la forma de cada servicio
   - Preguntas frecuentes: la respuesta se abre al pasar el cursor (o al tocar)
   - Aparición suave al hacer scroll y línea del proceso
   ========================================================= */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Formas (dibujadas en un lienzo de 1000 x 900) ---------- */
  function roundRect(c, x, y, w, h, r) {
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function ring(c, x, y, r, t) {
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.arc(x, y, r - t, 0, Math.PI * 2, true); c.fill();
  }
  function line(c, pts, w) {
    c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
    c.stroke();
  }
  function dot(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }

  const SHAPES = {
    // Ventana de navegador con bloques de contenido y cursor
    web(c) {
      c.lineWidth = 34; c.beginPath(); roundRect(c, 110, 150, 780, 560, 40); c.stroke();
      c.fillRect(110, 150, 780, 95);
      dot(c, 175, 198, 16); dot(c, 225, 198, 16); dot(c, 275, 198, 16);
      c.beginPath(); roundRect(c, 180, 310, 280, 230, 22); c.fill();
      line(c, [530, 330, 810, 330], 30); line(c, [530, 400, 760, 400], 30); line(c, [530, 470, 790, 470], 30);
      c.beginPath(); roundRect(c, 530, 560, 190, 70, 35); c.fill();
      c.beginPath(); c.moveTo(700, 560); c.lineTo(700, 840); c.lineTo(760, 785); c.lineTo(805, 880);
      c.lineTo(845, 862); c.lineTo(800, 768); c.lineTo(885, 768); c.closePath(); c.fill();
    },
    // Ruta con nodos hasta la meta (el mismo dibujo que el icono de la portada)
    consultoria(c) {
      // camino alternativo punteado
      c.lineWidth = 14; c.lineCap = 'round';
      for (let x = 194; x < 806; x += 70) line(c, [x, 756, Math.min(x + 30, 806), 756], 14);
      for (let y = 756; y > 144; y -= 70) line(c, [806, y, 806, Math.max(y - 30, 144)], 14);
      // puntos de la cuadrícula
      dot(c, 500, 756, 22); dot(c, 806, 756, 22); dot(c, 806, 450, 22); dot(c, 194, 144, 22);
      // la ruta
      line(c, [194, 756, 194, 450, 500, 450, 500, 144, 806, 144], 36);
      // nodos huecos
      [[194, 450], [500, 450], [500, 144]].forEach((n) => {
        c.save(); c.globalCompositeOperation = 'destination-out'; dot(c, n[0], n[1], 40); c.restore();
        ring(c, n[0], n[1], 52, 22);
      });
      // salida y meta
      dot(c, 194, 756, 62);
      c.save(); c.globalCompositeOperation = 'destination-out'; dot(c, 806, 144, 98); c.restore();
      ring(c, 806, 144, 104, 22); dot(c, 806, 144, 46);
    },
    // Diana con dardo
    publicidad(c) {
      ring(c, 430, 480, 360, 44); ring(c, 430, 480, 250, 44); dot(c, 430, 480, 120);
      line(c, [450, 460, 860, 120], 34);
      c.beginPath(); c.moveTo(860, 120); c.lineTo(980, 100); c.lineTo(925, 175); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(860, 120); c.lineTo(880, 0); c.lineTo(805, 55); c.closePath(); c.fill();
    },
    // Móvil con publicación, corazón y bocadillo
    redes(c) {
      c.lineWidth = 34; c.beginPath(); roundRect(c, 300, 60, 400, 790, 60); c.stroke();
      line(c, [450, 125, 550, 125], 26);
      c.beginPath(); roundRect(c, 360, 190, 280, 230, 24); c.fill();
      line(c, [360, 490, 600, 490], 26); line(c, [360, 560, 540, 560], 26); line(c, [360, 630, 580, 630], 26);
      c.beginPath(); c.moveTo(840, 470);
      c.bezierCurveTo(740, 400, 720, 300, 790, 280); c.bezierCurveTo(820, 272, 838, 290, 840, 315);
      c.bezierCurveTo(842, 290, 860, 272, 890, 280); c.bezierCurveTo(960, 300, 940, 400, 840, 470); c.fill();
      c.beginPath(); roundRect(c, 40, 520, 220, 140, 30); c.fill();
      c.beginPath(); c.moveTo(80, 650); c.lineTo(70, 720); c.lineTo(140, 655); c.fill();
    },
    // Red neuronal: capas de nodos conectadas
    ia(c) {
      const L1 = [[160, 220], [160, 450], [160, 680]];
      const L2 = [[480, 130], [480, 340], [480, 560], [480, 770]];
      const L3 = [[820, 450]];
      c.lineWidth = 12;
      L1.forEach((a) => L2.forEach((b) => line(c, [a[0], a[1], b[0], b[1]], 12)));
      L2.forEach((a) => L3.forEach((b) => line(c, [a[0], a[1], b[0], b[1]], 12)));
      L1.forEach((p) => dot(c, p[0], p[1], 62));
      L2.forEach((p) => dot(c, p[0], p[1], 52));
      ring(c, 820, 450, 120, 40); dot(c, 820, 450, 55);
    }
  };

  /* ---------- Constelación ---------- */
  const canvas = document.querySelector('[data-constellation]');
  const shape = canvas && SHAPES[canvas.dataset.constellation];
  if (canvas && shape) {
    const ctx = canvas.getContext('2d');
    const COLORS = ['#96FCC6', '#96FCC6', '#96FCC6', '#FFFFFF', '#FFFFFF', '#49775E', '#6FB98F', '#C8FFE3'];
    let w = 0, h = 0, parts = [], raf = 0, running = false, start = 0;
    const mouse = { x: -9999, y: -9999 };

    function particle(hx, hy, dust) {
      const a = Math.random() * Math.PI * 2, r = 150 + Math.random() * 400;
      return {
        hx, hy,
        x: reduceMotion ? hx : w / 2 + Math.cos(a) * r,
        y: reduceMotion ? hy : h / 2 + Math.sin(a) * r,
        vx: 0, vy: 0,
        size: dust ? 0.7 + Math.random() * 1.1 : 1.3 + Math.random() * 2.1,
        rot: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.02,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: dust ? 0.2 + Math.random() * 0.3 : 0.55 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
        amp: dust ? 6 : 1 + Math.random() * 1.5,
        delay: Math.random() * 0.5
      };
    }

    function build() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.min(w / 1000, h / 900) * 0.9;
      const ox = (w - 1000 * scale) / 2, oy = (h - 900 * scale) / 2;
      const off = document.createElement('canvas');
      off.width = Math.ceil(w); off.height = Math.ceil(h);
      const oc = off.getContext('2d');
      oc.setTransform(scale, 0, 0, scale, ox, oy);
      oc.fillStyle = oc.strokeStyle = '#fff';
      shape(oc);
      const data = oc.getImageData(0, 0, off.width, off.height).data;
      const target = w < 500 ? 1300 : 2600;
      let filled = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] > 128) filled++;
      const step = Math.max(2, Math.sqrt((filled * 4) / target));
      parts = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const jx = x + (Math.random() - 0.5) * step, jy = y + (Math.random() - 0.5) * step;
          const i = (Math.floor(jy) * off.width + Math.floor(jx)) * 4 + 3;
          if (data[i] > 128) parts.push(particle(jx, jy, false));
        }
      }
      for (let k = 0; k < target * 0.07; k++) parts.push(particle(Math.random() * w, Math.random() * h, true));
    }

    function draw(t) {
      const time = t / 1000;
      const intro = reduceMotion ? 1 : Math.min(1, (t - start) / 1800);
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        const k = Math.min(1, Math.max(0, (intro - p.delay * 0.5) / (1 - p.delay * 0.5)));
        const e = 1 - Math.pow(1 - k, 4);
        const tx = p.hx + Math.cos(time * 0.8 + p.phase) * p.amp;
        const ty = p.hy + Math.sin(time * 0.9 + p.phase) * p.amp;
        // el cursor aparta las partículas; luego vuelven con un muelle suave
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 7000 && intro >= 1) { const f = (7000 - d2) / 7000; p.vx += dx * f * 0.02; p.vy += dy * f * 0.02; }
        if (intro < 1) { p.x += (tx - p.x) * (0.04 + e * 0.2); p.y += (ty - p.y) * (0.04 + e * 0.2); }
        else { p.vx += (tx - p.x) * 0.03; p.vy += (ty - p.y) * 0.03; p.vx *= 0.86; p.vy *= 0.86; p.x += p.vx; p.y += p.vy; }
        p.rot += p.spin;
        ctx.globalAlpha = p.alpha * (0.3 + 0.7 * e);
        ctx.fillStyle = p.color;
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x + Math.cos(p.rot) * s, p.y + Math.sin(p.rot) * s);
        ctx.lineTo(p.x + Math.cos(p.rot + 2.1) * s, p.y + Math.sin(p.rot + 2.1) * s);
        ctx.lineTo(p.x + Math.cos(p.rot + 4.2) * s, p.y + Math.sin(p.rot + 4.2) * s);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(draw);
    }
    function play() { if (!running && !reduceMotion) { running = true; raf = requestAnimationFrame(draw); } }
    function stop() { running = false; cancelAnimationFrame(raf); }

    build();
    start = performance.now();
    if (reduceMotion) draw(start + 5000); else play();

    canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    canvas.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([en]) => (en.isIntersecting ? play() : stop()), { threshold: 0.01 }).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
    let rt, lastW = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth === lastW) return; // en el móvil la barra del navegador cambia la altura: lo ignoramos
      lastW = window.innerWidth;
      clearTimeout(rt);
      rt = setTimeout(() => { build(); start = performance.now() - 5000; if (reduceMotion) draw(start + 5000); }, 200);
    });
  }

  /* ---------- Icono del servicio: se anima al pasar el cursor ---------- */
  const iconBox = document.querySelector('.sv-statement__icon');
  function playIcon() {
    if (!iconBox || reduceMotion || iconBox.dataset.playing) return;
    iconBox.dataset.playing = '1';
    iconBox.classList.remove('play'); void iconBox.offsetWidth; iconBox.classList.add('play');
    setTimeout(() => { delete iconBox.dataset.playing; }, 1100);
  }
  if (iconBox && hoverDevice) {
    let loop;
    const zone = iconBox.closest('.sv-statement');
    zone.addEventListener('pointerenter', () => { playIcon(); clearInterval(loop); loop = setInterval(playIcon, 1800); });
    zone.addEventListener('pointerleave', () => clearInterval(loop));
  }

  /* ---------- Preguntas frecuentes ---------- */
  document.querySelectorAll('[data-faq]').forEach((item) => {
    const btn = item.querySelector('button');
    let pinned = false, hovering = false;
    const update = () => {
      const open = pinned || hovering;
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open);
    };
    // Al tocar o hacer clic se queda abierta (o se cierra si ya lo estaba)
    btn.addEventListener('click', () => { pinned = !pinned; update(); });
    if (hoverDevice) {
      item.addEventListener('pointerenter', () => { hovering = true; update(); });
      item.addEventListener('pointerleave', () => { hovering = false; update(); });
    }
  });

  /* ---------- Aparición al hacer scroll + línea del proceso ---------- */
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-sv-steps]').forEach((el) => el.classList.add('is-in'));
    return;
  }
  document.documentElement.classList.add('can-reveal');
  const items = document.querySelectorAll('[data-sv-reveal], [data-sv-steps]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      if (entry.target.classList.contains('sv-statement__inner') && !hoverDevice) setTimeout(playIcon, 300);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  items.forEach((el, i) => {
    if (el.hasAttribute('data-sv-reveal')) el.style.setProperty('--d', `${(i % 3) * 70}ms`);
    io.observe(el);
  });
})();
