/* =========================================================
   TUS DATOS DE CONTACTO
   Cambia estos tres valores por los tuyos. Se actualizan solos
   en toda la web: botones, formulario y asistente.
   ========================================================= */
const CONFIG = {
  email: 'hitogrowth@gmail.com',
  whatsapp: '34696596161',          // prefijo del país + número, sin espacios ni "+"
  whatsappTexto: '+34 696 59 61 61', // cómo se muestra el número en la web

  // Enlaces a tus páginas legales. Déjalos vacíos ('') mientras no las tengas.
  privacidadUrl: '',
  avisoLegalUrl: ''
};

/* =========================================================
   TUS SERVICIOS (los usa el asistente y el formulario)
   ========================================================= */
const SERVICES = [
  {
    id: 'web',
    name: 'Desarrollo y diseño web',
    answer: 'Diseñamos y desarrollamos tu página web: profesional, rápida y perfecta en el móvil, con textos claros y formas sencillas de que tus clientes te contacten.',
    keywords: ['web', 'pagina', 'sitio', 'landing', 'tienda online', 'diseno', 'dominio']
  },
  {
    id: 'consultoria',
    name: 'Consultoría y estrategia digital',
    answer: 'Revisamos la presencia digital de tu negocio y definimos una estrategia clara: qué canales usar, qué mensajes trabajar y qué pasos dar primero.',
    keywords: ['consultor', 'estrategia', 'plan', 'asesor', 'diagnostico', 'marketing']
  },
  {
    id: 'publicidad',
    name: 'Publicidad digital',
    answer: 'Creamos y gestionamos campañas de publicidad digital en buscadores y redes sociales para atraer a las personas que buscan lo que ofreces.',
    keywords: ['publicidad', 'anuncio', 'ads', 'google', 'campana', 'promocion']
  },
  {
    id: 'redes',
    name: 'Contenido en redes sociales',
    answer: 'Te ayudamos con el contenido de tus redes sociales: planificación, ideas, textos y publicaciones con la imagen de tu marca.',
    keywords: ['redes', 'instagram', 'facebook', 'tiktok', 'linkedin', 'contenido', 'social', 'post', 'publicaciones']
  },
  {
    id: 'ia',
    name: 'IA para tu negocio',
    answer: 'Te ayudamos a usar la inteligencia artificial en tu negocio: automatizar tareas repetitivas, mejorar la atención a tus clientes o crear asistentes como este.',
    keywords: ['ia', 'ai', 'inteligencia', 'artificial', 'automatiz', 'chatbot', 'bot', 'gpt']
  }
];

/* =========================================================
   A partir de aquí no hace falta tocar nada
   ========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (n) => Math.min(1, Math.max(0, n));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const serviceName = (id) => (SERVICES.find((s) => s.id === id) || {}).name || '';

const mailtoLink = (subject, body) =>
  `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
const whatsappLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/* ---------- Datos de contacto en la página ---------- */
$$('[data-email-link]').forEach((a) => { a.href = `mailto:${CONFIG.email}`; });
$$('[data-email-text]').forEach((el) => { el.textContent = CONFIG.email; });
$$('[data-whatsapp-link]').forEach((a) => {
  a.href = whatsappLink('Hola, me gustaría información sobre los servicios de HitoGrowth.');
  a.target = '_blank';
  a.rel = 'noopener';
});
$$('[data-whatsapp-text]').forEach((el) => { el.textContent = CONFIG.whatsappTexto; });
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* ---------- Enlaces legales: solo aparecen si hay dirección ---------- */
$$('[data-legal]').forEach((a) => {
  const url = CONFIG[`${a.dataset.legal}Url`];
  if (url) {
    a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false;
  } else if (a.hasAttribute('data-legal-hide')) {
    a.remove();
  } else {
    a.replaceWith(document.createTextNode(a.textContent));
  }
});

/* ---------- Menú ---------- */
const nav = $('[data-nav]');
const menu = $('#menu');
const menuToggle = $('[data-menu-toggle]');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  $('.sr-only', menuToggle).textContent = open ? 'Cerrar menú' : 'Abrir menú';
  document.body.classList.toggle('menu-open', open);
}
menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
$$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuToggle.focus(); }
});
window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

/* ---------- Menú: marcar la sección en la que estás ---------- */
(function scrollSpy() {
  if (!('IntersectionObserver' in window)) return;
  const links = $$('.nav__links a[href^="#"]:not(.btn)');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));
})();

/* ---------- Portada: cruzar el torii al hacer scroll ---------- */
const hero = $('[data-hero]');
const heroContent = $('[data-hero-content]');
const heroHint = $('[data-hero-hint]');
let ticking = false;

function updateHero() {
  ticking = false;
  const y = window.scrollY;
  nav.classList.toggle('is-solid', y > 40);
  if (reduceMotion) return;

  const total = hero.offsetHeight - window.innerHeight;
  const p = clamp01((y - hero.offsetTop) / total);
  const s = 1 + Math.pow(p, 2.3) * 12;
  const light = p < 0.38 ? 0 : easeOut(clamp01((p - 0.38) / 0.4)) * 0.96;
  const field = easeOut(clamp01((p - 0.8) / 0.18));

  hero.style.setProperty('--s', s.toFixed(4));
  const fade = clamp01(1 - p * 3.4);
  hero.style.setProperty('--fade', fade.toFixed(3));
  heroContent.style.visibility = heroHint.style.visibility = fade <= 0.02 ? 'hidden' : '';
  hero.style.setProperty('--ty', `${(-p * 90).toFixed(1)}px`);
  hero.style.setProperty('--light', light.toFixed(3));
  hero.style.setProperty('--field', field.toFixed(3));
}
function onScroll() {
  if (!ticking) { ticking = true; requestAnimationFrame(updateHero); }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
updateHero();

/* ---------- Portada: motas de luz ---------- */
(function motes() {
  const canvas = $('[data-motes]');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, dots = [], running = false, raf = 0;

  function seed() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = w < 720 ? 24 : 44;
    dots = Array.from({ length: count }, () => spawn(true));
  }
  function spawn(anywhere) {
    const spread = w < 720 ? 0.34 : 0.26;
    return {
      x: w * (0.5 + (Math.random() - 0.5) * 2 * spread),
      y: anywhere ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 1.8,
      v: 0.12 + Math.random() * 0.38,
      drift: (Math.random() - 0.5) * 0.25,
      phase: Math.random() * Math.PI * 2
    };
  }
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#96FCC6';
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.y -= d.v; d.x += d.drift;
      if (d.y < h * 0.18) dots[i] = spawn(false);
      const life = clamp01((h - d.y) / (h * 0.25)) * clamp01((d.y - h * 0.18) / (h * 0.2));
      ctx.globalAlpha = life * (0.35 + 0.35 * Math.sin(t / 700 + d.phase));
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  seed();
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.02 }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(seed, 200); });
})();

/* ---------- Iconos de servicios: animación al pasar el ratón ----------
   En ordenador se reproduce al entrar con el cursor en el servicio.
   En móvil (sin cursor) se reproduce una vez cuando el servicio aparece. */
const hoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
function playIcon(row) {
  if (reduceMotion || row.dataset.playing) return;
  row.dataset.playing = '1';
  row.classList.remove('play');
  void row.offsetWidth; // reinicia la animación
  row.classList.add('play');
  setTimeout(() => { delete row.dataset.playing; }, 1100);
}
if (hoverDevice) {
  $$('.service').forEach((row) => {
    let loop;
    // Mientras el cursor está encima, la animación se repite con una pausa entre vueltas
    row.addEventListener('pointerenter', () => {
      playIcon(row);
      clearInterval(loop);
      loop = setInterval(() => playIcon(row), 1800);
    });
    row.addEventListener('pointerleave', () => clearInterval(loop));
  });
}

/* ---------- Aparición suave de secciones al hacer scroll ---------- */
(function reveal() {
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  const groups = [
    ['.services .section-head', '.service'],
    ['.about__media', '.about__body'],
    ['.stat'],
    ['.trust .section-title', '.logo'],
    ['.contact__intro', '.contact__gate']
  ];
  const items = [];
  groups.forEach((selectors) => {
    let i = 0;
    selectors.forEach((sel) => $$(sel).forEach((el) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', Math.min(i++, 5));
      items.push(el);
    }));
  });
  document.documentElement.classList.add('can-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-in');
      if (!hoverDevice && el.classList.contains('service')) {
        setTimeout(() => playIcon(el), 150 + Number(el.style.getPropertyValue('--i') || 0) * 70);
      }
      io.unobserve(el);
      // Al terminar, se quita la clase para que el hover vuelva a sus tiempos normales
      setTimeout(() => { el.classList.remove('reveal'); el.style.removeProperty('--i'); }, 1400);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
})();

/* ---------- Servicios: preseleccionar en el formulario ---------- */
const form = $('[data-contact-form]');
$$('[data-service]').forEach((link) => {
  link.addEventListener('click', () => { form.servicio.value = link.dataset.service; });
});

/* ---------- Formulario de contacto ---------- */
const formStatus = $('[data-form-status]');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError(field, message) {
  const error = $(`#e-${field.id.replace('f-', '')}`);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message || '';
}

function validate() {
  const checks = [
    [form.nombre, form.nombre.value.trim() ? '' : 'Escribe tu nombre para saber a quién responder.'],
    [form.email, !form.email.value.trim()
      ? 'Escribe tu email para poder contestarte.'
      : EMAIL_RE.test(form.email.value.trim()) ? '' : 'Este email no parece completo. Revisa que tenga @ y dominio, por ejemplo nombre@empresa.com.'],
    [form.mensaje, form.mensaje.value.trim() ? '' : 'Cuéntanos en una frase qué necesitas.'],
    [form.privacidad, form.privacidad.checked ? '' : 'Necesitamos que aceptes la política de privacidad para poder responderte.']
  ];
  let firstInvalid = null;
  checks.forEach(([field, message]) => {
    setError(field, message);
    if (message && !firstInvalid) firstInvalid = field;
  });
  return firstInvalid;
}

$$('input, textarea', form).forEach((field) => {
  field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') setError(field, ''); });
  field.addEventListener('change', () => { if (field.getAttribute('aria-invalid') === 'true') setError(field, ''); });
});

function composeMessage({ nombre, empresa, email, telefono, servicio, mensaje }) {
  return [
    `Hola, soy ${nombre}${empresa ? ` de ${empresa}` : ''}.`,
    `Me interesa: ${serviceName(servicio) || 'quiero consejo sobre qué necesito'}.`,
    '',
    mensaje,
    '',
    email ? `Email: ${email}` : '',
    telefono ? `Teléfono: ${telefono}` : ''
  ].join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formStatus.textContent = '';
  const invalid = validate();
  if (invalid) { invalid.focus(); return; }

  const data = {
    nombre: form.nombre.value.trim(),
    empresa: form.empresa.value.trim(),
    email: form.email.value.trim(),
    telefono: form.telefono.value.trim(),
    servicio: form.servicio.value,
    mensaje: form.mensaje.value.trim()
  };
  const text = composeMessage(data);
  const via = (e.submitter && e.submitter.value) || 'email';

  if (via === 'whatsapp') {
    window.open(whatsappLink(text), '_blank', 'noopener');
    formStatus.textContent = 'Listo: se ha abierto WhatsApp con tu mensaje preparado. Solo tienes que pulsar enviar.';
  } else {
    window.location.href = mailtoLink(`Solicitud de presupuesto · ${data.empresa || data.nombre}`, text);
    formStatus.textContent = `Listo: se ha abierto tu programa de correo con el mensaje preparado. Si no se abre, escríbenos a ${CONFIG.email}.`;
  }
});

/* =========================================================
   ASISTENTE (chatbot guiado, sin servidor)
   ========================================================= */
const chat = $('[data-chat]');
const chatToggle = $('[data-chat-toggle]');
const chatLog = $('[data-chat-log]');
const chatChips = $('[data-chat-chips]');
const chatForm = $('[data-chat-form]');
const chatInput = $('[data-chat-input]');
const finePointer = window.matchMedia('(pointer: fine)').matches;

const lead = { step: null, service: '', nombre: '', empresa: '', necesidad: '' };
let started = false;
let queue = Promise.resolve();

function openChat() {
  if (!chat.hidden) return;
  chat.hidden = false;
  document.body.classList.add('chat-open');
  chatToggle.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => requestAnimationFrame(() => chat.classList.add('is-open')));
  if (!started) { started = true; greet(); }
  if (finePointer) setTimeout(() => chatInput.focus(), 150);
  else $('.chat__close', chat).focus({ preventScroll: true });
}
function closeChat() {
  if (chat.hidden) return;
  chat.classList.remove('is-open');
  document.body.classList.remove('chat-open');
  chatToggle.setAttribute('aria-expanded', 'false');
  setTimeout(() => { chat.hidden = true; }, reduceMotion ? 0 : 170);
  chatToggle.focus({ preventScroll: true });
}

chatToggle.addEventListener('click', () => (chat.hidden ? openChat() : closeChat()));
$$('[data-chat-open]').forEach((b) => b.addEventListener('click', openChat));
$('[data-chat-close]').addEventListener('click', closeChat);
chat.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChat(); });

function scrollLog() { chatLog.scrollTop = chatLog.scrollHeight; }

function addMessage(text, who) {
  const el = document.createElement('div');
  el.className = `msg msg--${who}`;
  el.textContent = text;
  chatLog.appendChild(el);
  scrollLog();
}

function setChips(chips = []) {
  chatChips.replaceChildren(...chips.map(({ label, run }) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.addEventListener('click', () => { addMessage(label, 'user'); setChips(); run(); });
    return b;
  }));
}

/* El asistente "escribe" un momento antes de cada mensaje */
function say(messages, chips) {
  const list = Array.isArray(messages) ? messages : [messages];
  setChips();
  queue = queue.then(async () => {
    for (const text of list) {
      const dots = document.createElement('div');
      dots.className = 'typing';
      dots.setAttribute('aria-hidden', 'true');
      dots.innerHTML = '<i></i><i></i><i></i>';
      chatLog.appendChild(dots);
      scrollLog();
      await new Promise((r) => setTimeout(r, reduceMotion ? 120 : Math.min(1100, 380 + text.length * 7)));
      dots.remove();
      addMessage(text, 'bot');
    }
    setChips(chips);
  });
}

/* Botones habituales */
const chipServices = () => SERVICES.map((s) => ({ label: s.name, run: () => showService(s.id) }));
const chipQuote = (serviceId = '') => ({ label: 'Pedir presupuesto', run: () => startLead(serviceId) });
const chipContact = { label: 'Ver formas de contacto', run: () => showContact() };
const chipMenu = { label: 'Ver todos los servicios', run: () => say('Estos son nuestros servicios. ¿Cuál te interesa?', [...chipServices(), chipQuote()]) };

function greet() {
  say(
    ['¡Hola! Soy el asistente de HitoGrowth.', 'Te ayudo a encontrar lo que necesita tu negocio en digital. ¿Qué te interesa?'],
    [...chipServices(), chipQuote(), chipContact]
  );
}

function showService(id) {
  const s = SERVICES.find((x) => x.id === id);
  say(s.answer, [
    { label: 'Pedir presupuesto de esto', run: () => startLead(id) },
    chipMenu,
    { label: 'Hablar por WhatsApp', run: () => openWhatsApp(`Hola, me interesa ${s.name.toLowerCase()} para mi negocio.`) }
  ]);
}

function showContact() {
  say(
    `Puedes escribirnos por WhatsApp al ${CONFIG.whatsappTexto} o por email a ${CONFIG.email}. También puedo ayudarte a preparar tu solicitud ahora mismo.`,
    [
      { label: 'Abrir WhatsApp', run: () => openWhatsApp('Hola, me gustaría información sobre los servicios de HitoGrowth.') },
      { label: 'Escribir un email', run: () => { window.location.href = `mailto:${CONFIG.email}`; say('Se está abriendo tu programa de correo.', [chipMenu]); } },
      chipQuote()
    ]
  );
}

function openWhatsApp(text) {
  window.open(whatsappLink(text), '_blank', 'noopener');
  say('Te he abierto WhatsApp con un mensaje preparado. ¿Te ayudo con algo más?', [chipMenu, chipQuote()]);
}

/* Pedir presupuesto: tres preguntas y lo enviamos */
const cancelLead = { label: 'Cancelar', run: () => { lead.step = null; say('Sin problema. ¿En qué más te ayudo?', [chipMenu, chipContact]); } };

function startLead(serviceId) {
  Object.assign(lead, { step: 'nombre', service: serviceId || '', nombre: '', empresa: '', necesidad: '' });
  const intro = serviceId
    ? `Perfecto, preparamos tu solicitud de ${serviceName(serviceId).toLowerCase()}.`
    : 'Perfecto, preparamos tu solicitud de presupuesto.';
  say([intro, 'Son tres preguntas rápidas. ¿Cómo te llamas?'], [cancelLead]);
}

function leadAnswer(text) {
  if (lead.step === 'nombre') {
    lead.nombre = text; lead.step = 'empresa';
    say(`Encantado, ${text}. ¿Cómo se llama tu negocio?`, [cancelLead]);
  } else if (lead.step === 'empresa') {
    lead.empresa = text; lead.step = 'necesidad';
    say('¿Qué necesitas? Cuéntalo en una o dos frases.', [cancelLead]);
  } else if (lead.step === 'necesidad') {
    lead.necesidad = text; lead.step = null;
    finishLead();
  }
}

function finishLead() {
  const text = composeMessage({
    nombre: lead.nombre, empresa: lead.empresa, email: '', telefono: '',
    servicio: lead.service, mensaje: lead.necesidad
  });
  say(
    [`Gracias, ${lead.nombre}. Tu solicitud queda así:`, text, '¿Cómo prefieres enviarla?'],
    [
      { label: 'Enviar por WhatsApp', run: () => openWhatsApp(text) },
      { label: 'Enviar por email', run: () => {
        window.location.href = mailtoLink(`Solicitud de presupuesto · ${lead.empresa || lead.nombre}`, text);
        say('Se está abriendo tu programa de correo con el mensaje listo. Solo tienes que enviarlo.', [chipMenu]);
      } },
      { label: 'Completar el formulario', run: () => fillForm() }
    ]
  );
}

function fillForm() {
  form.nombre.value = lead.nombre;
  form.empresa.value = lead.empresa;
  form.mensaje.value = lead.necesidad;
  form.servicio.value = lead.service;
  say('He rellenado el formulario con tus datos. Añade tu email y envíalo.', [chipMenu]);
  setTimeout(() => {
    closeChat();
    $('#contacto').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => form.email.focus({ preventScroll: true }), reduceMotion ? 0 : 700);
  }, reduceMotion ? 300 : 1400);
}

/* Entender lo que escribe el visitante */
const normalize = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
function matches(text, keywords) {
  const words = text.split(/[^a-z0-9ñ]+/);
  return keywords.some((k) => (k.length <= 3 ? words.includes(k) : text.includes(k)));
}

function reply(raw) {
  const text = normalize(raw);
  if (matches(text, ['precio', 'precios', 'cuesta', 'cuanto', 'tarifa', 'tarifas', 'coste', 'presupuesto', 'vale', 'cobras', 'cobrais'])) {
    say('Cada proyecto se presupuesta a medida, según lo que necesite tu negocio. Si quieres, te ayudo a pedir presupuesto ahora.', [chipQuote(), chipMenu]);
    return;
  }
  const found = SERVICES.filter((s) => matches(text, s.keywords));
  if (found.length === 1) { showService(found[0].id); return; }
  if (found.length > 1) {
    say('Eso toca varios de nuestros servicios. ¿Cuál quieres ver primero?',
      found.map((s) => ({ label: s.name, run: () => showService(s.id) })));
    return;
  }
  if (matches(text, ['contacto', 'contactar', 'telefono', 'llamar', 'email', 'correo', 'whatsapp', 'hablar', 'llamada'])) { showContact(); return; }
  if (matches(text, ['quien', 'quienes', 'carlos', 'experiencia', 'trayectoria', 'sobre ti', 'detras'])) {
    say('Detrás de HitoGrowth está Carlos Gutiérrez: 13 años en marketing digital dirigiendo estrategia y publicidad de grandes marcas en agencias como Publicis, T2O y Grupo Ontwice. Ahora aplica ese método a pymes.',
      [{ label: 'Ver sobre mí', run: () => { closeChat(); $('#sobre-mi').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); } }, chipQuote(), chipMenu]);
    return;
  }
  if (matches(text, ['gracias', 'genial', 'perfecto'])) { say('¡A ti! Si necesitas algo más, aquí estoy.', [chipMenu, chipQuote()]); return; }
  if (matches(text, ['hola', 'buenas', 'buenos', 'hey', 'saludos'])) { say('¡Hola! ¿En qué puedo ayudarte?', [...chipServices(), chipQuote()]); return; }
  say('No estoy seguro de haberte entendido. Puedo contarte qué hacemos o ayudarte a pedir presupuesto.', [chipMenu, chipQuote(), chipContact]);
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim().slice(0, 500);
  if (!text) return;
  chatInput.value = '';
  addMessage(text, 'user');
  if (lead.step) leadAnswer(text);
  else reply(text);
});
