/* Portafolio · renderizado desde datos.js, animaciones e interacción. */
(function () {
  'use strict';
  const D = window.PORTAFOLIO;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const icon = (n) => `<svg class="ico"><use href="#i-${n}"/></svg>`;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const repoUrl = (r) => `${D.perfil.github}/${r}`;

  /* ---------- hero -------------------------------------------------- */
  function renderHero() {
    const p = D.perfil;
    $('#heroTag').textContent = p.presentadoA ? `Portafolio · presentado a ${p.presentadoA}` : 'Portafolio';
    $('#heroNombre').textContent = p.nombre;
    $('#heroTitulo').textContent = p.titulo;
    $('#heroResumen').textContent = p.resumen;
    $('#ghTop').href = p.github;
    const modulos = D.picap.proyectos.reduce((a, x) => a + (x.modulos ? x.modulos.length : 0), 0);
    const publicados = D.proyectos.filter((x) => x.demo).length;
    const stats = [
      [D.proyectos.length, 'proyectos públicos'],
      [publicados, 'publicados en línea'],
      [modulos, 'módulos en el portal de Picap']
    ];
    $('#heroStats').innerHTML = stats.map(([v, l]) => `<div class="stat"><span class="stat__value" data-count="${v}">0</span><span class="stat__label">${l}</span></div>`).join('');
    $('#flujo').innerHTML = D.flujo.map((f, i) => `<li class="flow__step"><i>${i + 1}</i><div><strong>${esc(f.titulo)}</strong><span>${esc(f.texto)}</span></div></li>`).join('');
  }
  function animateCounters() {
    $$('[data-count]').forEach((n) => {
      const target = Number(n.dataset.count);
      if (reduce) { n.textContent = target; return; }
      const start = performance.now(), dur = 1100;
      const tick = (now) => { const t = Math.min(1, (now - start) / dur); n.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))); if (t < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }
  function loopFlow() {
    const steps = $$('#flujo .flow__step');
    if (!steps.length || reduce) { steps.forEach((s) => s.classList.add('is-done')); return; }
    let i = 0;
    const step = () => {
      steps.forEach((s, j) => { s.classList.toggle('is-on', j === i); s.classList.toggle('is-done', j < i); });
      i = (i + 1) % (steps.length + 1);
      if (i === 0) { steps.forEach((s) => { s.classList.remove('is-on'); s.classList.add('is-done'); }); setTimeout(step, 1600); return; }
      setTimeout(step, 1300);
    };
    step();
  }

  /* ---------- pilares ----------------------------------------------- */
  function renderPilares() {
    $('#pilares').innerHTML = D.perfil.pilares.map((p, i) => `<article class="pillar reveal" style="transition-delay:${i * 80}ms"><div class="pillar__icon">${icon(p.icon)}</div><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></article>`).join('');
  }

  /* ---------- Picap ------------------------------------------------- */
  function renderPicap() {
    const P = D.picap;
    $('#picapTitulo').textContent = `${P.empresa} · ${P.rol}`;
    $('#picapIntro').textContent = P.intro;
    $('#picapTabs').innerHTML = P.proyectos.map((p, i) => `<button class="tab" role="tab" type="button" aria-selected="${i === 0}" data-tab="${p.id}">${p.nombre}</button>`).join('');
    $('#picapPanels').innerHTML = P.proyectos.map((p, i) => {
      let body = '';
      if (p.modulos) body += `<div class="modules">${p.modulos.map((m) => `<div class="module" tabindex="0"><strong>${esc(m.nombre)}</strong><p>${esc(m.texto)}</p></div>`).join('')}</div>`;
      if (p.flujo) body += `<div class="pipeline" data-pipeline>${p.flujo.map((f, j) => `<div class="pipeline__step"><i>${j + 1}</i>${esc(f)}</div>${j < p.flujo.length - 1 ? `<span class="pipeline__arrow">${icon('arrow')}</span>` : ''}`).join('')}</div>`;
      if (p.resultados) body += `<div class="results">${p.resultados.map((r) => `<div class="result"><span class="result__label">${esc(r.label)}</span><div class="result__vals"><span class="result__antes">${esc(r.antes)}</span>${icon('arrow')}<span class="result__despues">${esc(r.despues)}</span></div></div>`).join('')}</div>`;
      if (p.nota) body += `<p class="pp__nota">${esc(p.nota)}</p>`;
      const links = p.repo ? `<div class="pp__links"><a class="btn btn--ghost btn--sm" href="${esc(p.repo)}" target="_blank" rel="noopener">${icon('github')} Ver repositorio</a></div>` : '';
      return `<div class="tabpanel ${i === 0 ? 'is-active' : ''}" data-panel="${p.id}"><div class="pp">
        <div class="pp__head"><h3>${esc(p.nombre)}</h3><div class="pp__stack">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div></div>
        <p class="pp__resumen">${esc(p.resumen)}</p>${body}${links}</div></div>`;
    }).join('');
    $('#picapTabs').addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]'); if (!t) return;
      $$('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b === t)));
      $$('[data-panel]').forEach((p) => p.classList.toggle('is-active', p.dataset.panel === t.dataset.tab));
      const pipe = $(`[data-panel="${t.dataset.tab}"] [data-pipeline]`); if (pipe) animatePipeline(pipe);
    });
    $('#picapPanels').addEventListener('click', (e) => { const m = e.target.closest('.module'); if (m) m.classList.toggle('is-open'); });
    $('#picapPanels').addEventListener('keydown', (e) => { const m = e.target.closest('.module'); if (m && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); m.classList.toggle('is-open'); } });
    const first = $('#picapPanels .module'); if (first) first.classList.add('is-open');
  }
  function animatePipeline(pipe) {
    const steps = $$('.pipeline__step', pipe);
    if (reduce) { steps.forEach((s) => s.classList.add('is-on')); return; }
    steps.forEach((s) => s.classList.remove('is-on'));
    steps.forEach((s, i) => setTimeout(() => s.classList.add('is-on'), 250 + i * 380));
  }

  /* ---------- proyectos --------------------------------------------- */
  function renderProyectos() {
    $('#filtros').innerHTML = D.categorias.map((c, i) => `<button class="filter" type="button" aria-pressed="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
    $('#proyectosGrid').innerHTML = D.proyectos.map((p, i) => `<article class="project reveal ${p.destacado ? 'project--destacado' : ''}" data-cats="${p.cats.join('|')}" style="transition-delay:${(i % 3) * 70}ms">
      <div class="project__top"><div><h3>${esc(p.nombre)}</h3><span class="project__repo">${esc(p.repo)}</span></div>${p.estado ? `<span class="tag tag--warn">${esc(p.estado)}</span>` : (p.demo ? '<span class="tag tag--ok">Publicado</span>' : '')}</div>
      <p>${esc(p.texto)}</p>
      <div class="project__stack">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
      <div class="project__links"><a class="btn btn--ghost" href="${repoUrl(p.repo)}" target="_blank" rel="noopener">${icon('github')} Código</a>${p.demo ? `<a class="btn btn--primary" href="${esc(p.demo)}" target="_blank" rel="noopener">${icon('link')} Ver en línea</a>` : ''}</div>
    </article>`).join('');
    $('#filtros').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]'); if (!b) return;
      $$('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const cat = b.dataset.cat;
      $$('.project').forEach((card) => {
        const show = cat === 'Todos' || card.dataset.cats.split('|').includes(cat);
        card.classList.toggle('is-hidden', !show);
        if (show) { card.classList.remove('is-in'); requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('is-in'))); }
      });
    });
  }

  /* ---------- stack y contacto -------------------------------------- */
  function renderStack() {
    $('#stackGrid').innerHTML = D.stack.map((g, i) => `<div class="stack__group reveal" style="transition-delay:${i * 70}ms"><h3>${esc(g.grupo)}</h3><div class="stack__items">${g.items.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div></div>`).join('');
  }
  function renderContacto() {
    const p = D.perfil;
    $('#contactoTexto').textContent = `Si quieres ver cualquiera de estos proyectos en detalle o conversar sobre cómo aplicarlo, el código está abierto en GitHub y ${p.marca} publica las demostraciones en línea.`;
    $('#contactoLinks').innerHTML = `<a class="btn btn--primary" href="${p.github}" target="_blank" rel="noopener">${icon('github')} github.com/DuvanP11</a><a class="btn btn--ghost" href="${p.web}" target="_blank" rel="noopener">${icon('link')} Sitio ${esc(p.marca)}</a>`;
    $('#footTexto').textContent = `${p.nombre} · ${p.marca} · ${p.ubicacion}`;
  }

  /* ---------- reveal y navegación ----------------------------------- */
  function initReveal() {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: .12 });
    $$('.reveal').forEach((el) => io.observe(el));
    const secs = ['inicio', 'perfil', 'picap', 'proyectos', 'stack', 'contacto'];
    const nav = new IntersectionObserver((entries) => entries.forEach((en) => { if (!en.isIntersecting) return; $$('#navLinks a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach((id) => { const s = document.getElementById(id); if (s) nav.observe(s); });
    const pipeObs = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { animatePipeline(en.target); pipeObs.unobserve(en.target); } }), { threshold: .3 });
    $$('[data-pipeline]').forEach((p) => pipeObs.observe(p));
  }

  renderHero(); renderPilares(); renderPicap(); renderProyectos(); renderStack(); renderContacto();
  initReveal();
  $$('.hero .reveal').forEach((el) => el.classList.add('is-in'));
  animateCounters();
  loopFlow();
})();
