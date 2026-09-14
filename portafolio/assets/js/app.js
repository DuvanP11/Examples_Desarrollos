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
    $$('#heroStats [data-count]').forEach((n) => {
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
  const fmtNum = (v) => (typeof v === 'number' ? v.toLocaleString('es-CO') : esc(v));
  function screenHtml(sc) {
    let body = '';
    if (sc.kpis) body += `<div class="scr__kpis">${sc.kpis.map(([l, v]) => `<div class="scr__kpi"><span>${esc(l)}</span><b ${typeof v === 'number' ? `data-count="${v}"` : ''}>${typeof v === 'number' ? '0' : esc(v)}</b></div>`).join('')}</div>`;
    if (sc.barras) {
      const max = Math.max(...sc.barras.items.map((i) => i[1]));
      body += `<div class="scr__block"><h5>${esc(sc.barras.titulo)}</h5><div class="scr__bars">${sc.barras.items.map(([l, v]) => `<div class="scr__bar"><span>${esc(l)}</span><div class="scr__track"><i style="--w:${Math.round((v / max) * 100)}%"></i></div><b>${fmtNum(v)}</b></div>`).join('')}</div></div>`;
    }
    if (sc.tabla) body += `<div class="scr__block"><h5>${esc(sc.tabla.titulo)}</h5><table class="scr__table"><thead><tr>${sc.tabla.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${sc.tabla.rows.map((r) => `<tr>${r.map((c) => `<td class="${/✓/.test(c) ? 'is-ok' : (/⚠|No cumple|Rechazada/.test(c) ? 'is-bad' : '')}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (sc.timeline) body += `<div class="scr__block"><h5>${esc(sc.timeline.titulo)}</h5><ol class="scr__tl">${sc.timeline.items.map(([t, x]) => `<li><time>${esc(t)}</time><span>${esc(x)}</span></li>`).join('')}</ol></div>`;
    return `<div class="screen"><div class="screen__bar"><i></i><i></i><i></i><span>${esc(sc.titulo)}</span><em>Simulación · datos ficticios</em></div><div class="screen__body">${body}</div></div>`;
  }
  const reglasHtml = (reglas) => `<div class="rules"><h4>Reglas que se aplicaron</h4><ol>${reglas.map(([t, x]) => `<li><div><b>${esc(t)}</b><span>${esc(x)}</span></div></li>`).join('')}</ol></div>`;

  function renderPicap() {
    const P = D.picap;
    $('#picapTitulo').textContent = `${P.empresa} · ${P.rol}`;
    $('#picapIntro').textContent = P.intro;
    $('#picapTabs').innerHTML = P.proyectos.map((p, i) => `<button class="tab" role="tab" type="button" aria-selected="${i === 0}" data-tab="${p.id}">${p.nombre}</button>`).join('');
    $('#picapPanels').innerHTML = P.proyectos.map((p, i) => {
      let body = '';
      if (p.modulos) {
        body += `<div class="modsel" data-modsel>${p.modulos.map((m, j) => `<button type="button" class="modsel__btn" aria-pressed="${j === 0}" data-mod="${j}">${esc(m.nombre)}</button>`).join('')}</div>`;
        body += p.modulos.map((m, j) => `<div class="modview ${j === 0 ? 'is-active' : ''}" data-modview="${j}"><div class="modview__grid">${screenHtml(m.pantalla)}<div class="modview__side"><h4>Qué resuelve</h4><p>${esc(m.resuelve)}</p>${reglasHtml(m.reglas)}</div></div></div>`).join('');
      } else {
        body += `<div class="modview__grid">${screenHtml(p.pantalla)}<div class="modview__side">${reglasHtml(p.reglas)}</div></div>`;
      }
      if (p.flujo) body += `<div class="pipeline" data-pipeline>${p.flujo.map((f, j) => `<div class="pipeline__step"><i>${j + 1}</i>${esc(f)}</div>${j < p.flujo.length - 1 ? `<span class="pipeline__arrow">${icon('arrow')}</span>` : ''}`).join('')}</div>`;
      if (p.resultados) body += `<div class="results">${p.resultados.map((r) => `<div class="result"><span class="result__label">${esc(r.label)}</span><div class="result__vals"><span class="result__antes">${esc(r.antes)}</span>${icon('arrow')}<span class="result__despues">${esc(r.despues)}</span></div></div>`).join('')}</div>`;
      if (p.nota) body += `<p class="pp__nota">${esc(p.nota)}</p>`;
      const links = p.repo ? `<div class="pp__links"><a class="btn btn--ghost btn--sm" href="${esc(p.repo)}" target="_blank" rel="noopener">${icon('github')} Ver repositorio</a></div>` : '';
      return `<div class="tabpanel ${i === 0 ? 'is-active' : ''}" data-panel="${p.id}"><div class="pp">
        <div class="pp__head"><h3>${esc(p.nombre)}</h3><div class="pp__stack">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div></div>
        <p class="pp__resumen">${esc(p.resumen)}</p>${body}${links}</div></div>`;
    }).join('');
    if (P.construccion) $('#picapBuild').innerHTML = `<span class="build__label">Cómo se construyó cada módulo</span><div class="build__steps">${P.construccion.map((c, i) => `<span class="build__step"><i>${i + 1}</i>${esc(c)}</span>`).join('<span class="build__arrow">→</span>')}</div>`;
    $('#picapTabs').addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]'); if (!t) return;
      $$('[data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b === t)));
      $$('[data-panel]').forEach((p) => p.classList.toggle('is-active', p.dataset.panel === t.dataset.tab));
      const panel = $(`[data-panel="${t.dataset.tab}"]`);
      const pipe = $('[data-pipeline]', panel); if (pipe) animatePipeline(pipe);
      animateScreen($('.modview.is-active, .modview__grid', panel));
    });
    $('#picapPanels').addEventListener('click', (e) => {
      const b = e.target.closest('[data-mod]'); if (!b) return;
      const panel = b.closest('.tabpanel');
      $$('[data-mod]', panel).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      $$('[data-modview]', panel).forEach((v) => v.classList.toggle('is-active', v.dataset.modview === b.dataset.mod));
      animateScreen($(`[data-modview="${b.dataset.mod}"]`, panel));
    });
  }
  function animateScreen(root) {
    if (!root) return;
    $$('.scr__track i', root).forEach((i) => { i.style.width = '0%'; requestAnimationFrame(() => requestAnimationFrame(() => (i.style.width = ''))); });
    $$('[data-count]', root).forEach((n) => {
      const target = Number(n.dataset.count);
      if (reduce) { n.textContent = target.toLocaleString('es-CO'); return; }
      const start = performance.now(), dur = 900;
      const tick = (now) => { const t = Math.min(1, (now - start) / dur); n.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString('es-CO'); if (t < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    $$('.scr__tl li', root).forEach((li, i) => { li.classList.remove('is-in'); setTimeout(() => li.classList.add('is-in'), 120 + i * 160); });
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
      <div class="project__links"><a class="btn btn--ghost" href="${repoUrl(p.repo)}" target="_blank" rel="noopener">${icon('github')} Código</a>${p.demo ? `<a class="btn btn--primary" href="${esc(p.demo)}" target="_blank" rel="noopener">${icon('link')} Ver en línea</a>` : ''}${p.doc ? `<a class="btn btn--ghost" href="${esc(p.doc)}" target="_blank" rel="noopener">${icon('link')} ${esc(p.docLabel || 'Ver documento')}</a>` : ''}</div>
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
    const scrObs = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { animateScreen(en.target); scrObs.unobserve(en.target); } }), { threshold: .25 });
    $$('.tabpanel.is-active .modview.is-active, .tabpanel.is-active > .pp > .modview__grid').forEach((p) => scrObs.observe(p));
  }

  renderHero(); renderPilares(); renderPicap(); renderProyectos(); renderStack(); renderContacto();
  initReveal();
  $$('.hero .reveal').forEach((el) => el.classList.add('is-in'));
  animateCounters();
  loopFlow();
})();
