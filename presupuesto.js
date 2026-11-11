/* =========================================================
   FORMULARIO DE PRESUPUESTO de las páginas de servicio y del blog
   Igual que el de la portada: prepara el mensaje y lo abre
   en el correo o en WhatsApp. No envía nada a ningún servidor.
   ========================================================= */
(function () {
  const EMAIL = 'hitogrowth@gmail.com';
  const WHATSAPP = '34696596161';
  const form = document.querySelector('[data-pp-form]');
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field, message) {
    const error = document.getElementById('e-' + field.id.replace('f-', ''));
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
  }

  function validate() {
    const email = form.email.value.trim();
    const checks = [
      [form.nombre, form.nombre.value.trim() ? '' : 'Escribe tu nombre para saber a quién responder.'],
      [form.email, !email ? 'Escribe tu email para poder contestarte.'
        : EMAIL_RE.test(email) ? '' : 'Este email no parece completo. Revisa que tenga @ y dominio, por ejemplo nombre@empresa.com.'],
      [form.mensaje, form.mensaje.value.trim() ? '' : 'Cuéntanos en una frase qué necesitas.'],
      [form.privacidad, form.privacidad.checked ? '' : 'Necesitamos que aceptes la política de privacidad para poder responderte.']
    ];
    let first = null;
    checks.forEach(([field, msg]) => { setError(field, msg); if (msg && !first) first = field; });
    return first;
  }

  form.querySelectorAll('input, textarea').forEach((field) => {
    const clear = () => { if (field.getAttribute('aria-invalid') === 'true') setError(field, ''); };
    field.addEventListener('input', clear);
    field.addEventListener('change', clear);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    const invalid = validate();
    if (invalid) { invalid.focus(); return; }
    const d = {
      nombre: form.nombre.value.trim(), empresa: form.empresa.value.trim(),
      email: form.email.value.trim(), telefono: form.telefono.value.trim(),
      mensaje: form.mensaje.value.trim()
    };
    const opt = form.servicio.options[form.servicio.selectedIndex];
    const servicio = form.servicio.value ? opt.textContent.trim() : 'quiero consejo sobre qué necesito';
    const text = [
      `Hola, soy ${d.nombre}${d.empresa ? ` de ${d.empresa}` : ''}.`,
      `Me interesa: ${servicio}.`, '', d.mensaje, '',
      `Email: ${d.email}`, d.telefono ? `Teléfono: ${d.telefono}` : '',
      `(Enviado desde ${location.pathname})`
    ].join('\n').replace(/\n{3,}/g, '\n\n').trim();
    const via = (e.submitter && e.submitter.value) || 'email';
    if (via === 'whatsapp') {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      status.textContent = 'Listo: se ha abierto WhatsApp con tu mensaje preparado. Solo tienes que pulsar enviar.';
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Solicitud de presupuesto · ${d.empresa || d.nombre}`)}&body=${encodeURIComponent(text)}`;
      status.textContent = `Listo: se ha abierto tu programa de correo con el mensaje preparado. Si no se abre, escríbenos a ${EMAIL}.`;
    }
  });

  /* El torii se dibuja y el travesaño del formulario aparece al llegar a la sección */
  const els = document.querySelectorAll('[data-pp-torii], #presupuesto .contact__gate');
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  document.documentElement.classList.add('can-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  els.forEach((el) => io.observe(el));
})();
