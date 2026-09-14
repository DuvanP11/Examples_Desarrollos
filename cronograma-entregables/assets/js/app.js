/* =====================================================================
   Cronograma de entregables: Gantt, detalle por fase, edición en página,
   simulación de avance, exportación/importación. Sin dependencias.
   ===================================================================== */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const STORE = 'cronograma-entregables-v1';
  const DAY = 86400000;

  /* ---------- fechas ---------------------------------------------- */
  const toDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
  const toISO = (d) => d.toISOString().slice(0, 10);
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const diffDays = (a, b) => Math.round((b - a) / DAY);
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MESES_L = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const fmt = (s) => { const d = toDate(s); return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`; };
  const fmtLong = (s) => { const d = toDate(s); return `${d.getUTCDate()} de ${MESES_L[d.getUTCMonth()].toLowerCase()} de ${d.getUTCFullYear()}`; };
  const todayISO = () => { const n = new Date(); return toISO(new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()))); };
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- estado de la aplicación ------------------------------ */
  const state = {
    data: null,
    ref: null,
    escala: 'semana',
    ocultas: new Set(),
    edit: false,
    simulando: false,
    simTimer: null
  };

  function loadData() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved && Array.isArray(saved.fases)) return saved;
    } catch (e) { /* nada */ }
    return JSON.parse(JSON.stringify(window.CRONOGRAMA));
  }
  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify(state.data)); } catch (e) { /* nada */ }
  }
  const uid = (p) => p + '-' + Math.random().toString(36).slice(2, 7);

  /* ---------- cálculo de avance y estado --------------------------- */
  function avanceReal(e) {
    if (e.tareas && e.tareas.length) return Math.round((e.tareas.filter((t) => t.hecho).length / e.tareas.length) * 100);
    return Math.max(0, Math.min(100, Number(e.avance) || 0));
  }
  function avanceDe(e) {
    const real = avanceReal(e);
    if (!state.simulando || e.porDefinir) return real;
    const ini = toDate(e.inicio), fin = toDate(e.fin), ref = toDate(state.ref);
    const span = Math.max(1, diffDays(ini, fin));
    const t = Math.max(0, Math.min(1, diffDays(ini, ref) / span));
    const sim = ref >= fin ? 100 : Math.round(t * 100);
    return Math.max(real, sim);
  }
  function estadoDe(e) {
    if (e.porDefinir) return 'pordefinir';
    const av = avanceDe(e);
    if (av >= 100) return 'completado';
    const ref = toDate(state.ref);
    if (toDate(e.fin) < ref) return 'atrasado';
    if (toDate(e.inicio) <= ref) return 'encurso';
    return 'pendiente';
  }
  const ESTADO_TXT = { completado: 'Completado', encurso: 'En curso', pendiente: 'Pendiente', atrasado: 'Atrasado', pordefinir: 'Por definir' };
  function avanceFase(f) {
    const es = f.entregables.filter((e) => !e.porDefinir);
    if (!es.length) return 0;
    return Math.round(es.reduce((a, e) => a + avanceDe(e), 0) / es.length);
  }
  function estadoFase(f) {
    if (f.porDefinir && !f.entregables.some((e) => !e.porDefinir)) return 'pordefinir';
    const es = f.entregables.filter((e) => !e.porDefinir).map(estadoDe);
    if (!es.length) return 'pendiente';
    if (es.every((s) => s === 'completado')) return 'completado';
    if (es.includes('atrasado')) return 'atrasado';
    if (es.includes('encurso') || es.includes('completado')) return 'encurso';
    return 'pendiente';
  }
  const fasesVisibles = () => state.data.fases.filter((f) => !state.ocultas.has(f.id));

  /* ---------- cabecera y KPIs -------------------------------------- */
  function renderHead() {
    const p = state.data.proyecto;
    $('#projNombre').textContent = `${p.nombre} · ${p.cliente}`;
    $('#projDesc').textContent = p.descripcion;
  }
  function renderKpis() {
    const es = state.data.fases.flatMap((f) => f.entregables.filter((e) => !e.porDefinir));
    const cnt = (s) => es.filter((e) => estadoDe(e) === s).length;
    const global = es.length ? Math.round(es.reduce((a, e) => a + avanceDe(e), 0) / es.length) : 0;
    const ref = toDate(state.ref);
    const activa = state.data.fases.find((f) => ['encurso', 'atrasado'].includes(estadoFase(f))) || state.data.fases.find((f) => estadoFase(f) === 'pendiente');
    let dias = '—', diasHint = 'sin fase activa';
    if (activa) {
      const d = diffDays(ref, toDate(activa.fin));
      dias = d >= 0 ? String(d) : `${-d}`;
      diasHint = d >= 0 ? `para cerrar ${activa.nombre.split('·')[0].trim()}` : `de retraso en ${activa.nombre.split('·')[0].trim()}`;
    }
    const sim = state.simulando ? ' (simulado)' : '';
    $('#kpis').innerHTML = `
      <div class="kpi"><span class="kpi__label">Entregables</span><span class="kpi__value">${es.length}</span><span class="kpi__hint">definidos en el plan</span></div>
      <div class="kpi kpi--ok"><span class="kpi__label">Completados</span><span class="kpi__value">${cnt('completado')}</span><span class="kpi__hint">aceptados${sim}</span></div>
      <div class="kpi kpi--blue"><span class="kpi__label">En curso</span><span class="kpi__value">${cnt('encurso')}</span><span class="kpi__hint">en ejecución${sim}</span></div>
      <div class="kpi"><span class="kpi__label">Pendientes</span><span class="kpi__value">${cnt('pendiente')}</span><span class="kpi__hint">por iniciar</span></div>
      <div class="kpi ${cnt('atrasado') ? 'kpi--bad' : ''}"><span class="kpi__label">Atrasados</span><span class="kpi__value">${cnt('atrasado')}</span><span class="kpi__hint">fecha fin superada</span></div>
      <div class="kpi"><span class="kpi__label">Avance global</span><span class="kpi__value">${global} %</span><div class="progress ${global === 100 ? 'progress--ok' : ''}"><i style="--w:${global}%"></i></div><span class="kpi__hint">${dias === '—' ? diasHint : dias + ' días ' + diasHint}</span></div>`;
  }

  /* ---------- filtros de fase -------------------------------------- */
  function renderChips() {
    $('#faseChips').innerHTML = state.data.fases.map((f) =>
      `<button type="button" class="chip" data-fase="${f.id}" aria-pressed="${!state.ocultas.has(f.id)}" style="--c:${f.color}"><i></i>${esc(f.nombre.split('·')[0].trim())}</button>`).join('');
  }

  /* ---------- Gantt ------------------------------------------------- */
  function renderGantt() {
    const wrap = $('#ganttWrap');
    const fases = fasesVisibles();
    if (!fases.length) { wrap.innerHTML = '<p class="gantt__empty">No hay fases visibles. Activa alguna en los filtros.</p>'; return; }
    const all = fases.flatMap((f) => [f, ...f.entregables]);
    let min = all.reduce((m, x) => (toDate(x.inicio) < m ? toDate(x.inicio) : m), toDate(all[0].inicio));
    let max = all.reduce((m, x) => (toDate(x.fin) > m ? toDate(x.fin) : m), toDate(all[0].fin));
    const ref = toDate(state.ref);
    if (ref < min) min = ref; if (ref > max) max = ref;
    min = addDays(min, -((min.getUTCDay() + 6) % 7) - 7); // lunes anterior, con una semana de margen
    max = addDays(max, 7 + (6 - (max.getUTCDay() + 6) % 7));
    const nDays = diffDays(min, max) + 1;
    const dayW = state.escala === 'dia' ? 34 : 14;
    wrap.style.setProperty('--day-w', dayW + 'px');
    const left = (s) => diffDays(min, toDate(s)) * dayW;
    const width = (a, b) => (diffDays(toDate(a), toDate(b)) + 1) * dayW - 2;

    // cabecera: meses
    let months = '';
    for (let i = 0; i < nDays;) {
      const d = addDays(min, i);
      const m = d.getUTCMonth(), y = d.getUTCFullYear();
      let span = 0;
      while (i + span < nDays && addDays(min, i + span).getUTCMonth() === m) span++;
      months += `<div class="gcell" style="grid-column: span ${span}">${MESES_L[m]} ${y}</div>`;
      i += span;
    }
    // cabecera: semanas o días
    let sub = '';
    if (state.escala === 'dia') {
      for (let i = 0; i < nDays; i++) {
        const d = addDays(min, i);
        const fin = d.getUTCDay() === 0 || d.getUTCDay() === 6;
        sub += `<div class="gcell ${fin ? 'gcell--fin' : ''}">${d.getUTCDate()}</div>`;
      }
    } else {
      for (let i = 0; i < nDays; i += 7) {
        const d = addDays(min, i);
        sub += `<div class="gcell" style="grid-column: span ${Math.min(7, nDays - i)}">${d.getUTCDate()} ${MESES[d.getUTCMonth()]}</div>`;
      }
    }
    const bg = () => { let s = ''; for (let i = 0; i < nDays; i++) { const d = addDays(min, i); const fin = d.getUTCDay() === 0 || d.getUTCDay() === 6; const r = toISO(d) === state.ref; s += `<div class="gcell ${fin ? 'gcell--fin' : ''} ${r ? 'gcell--ref' : ''}"></div>`; } return s; };

    let labels = `<div class="glabel glabel--head">Fase / entregable</div><div class="glabel glabel--head">&nbsp;</div>`;
    let rows = `<div class="grow grow--head grow--months">${months}</div><div class="grow grow--head">${sub}</div>`;
    fases.forEach((f) => {
      const ef = estadoFase(f), af = avanceFase(f);
      labels += `<div class="glabel glabel--fase" style="--c:${f.color}"><i></i><span class="glabel__name">${esc(f.nombre)}</span><span class="glabel__pct">${ef === 'pordefinir' ? '—' : af + ' %'}</span></div>`;
      const wf = width(f.inicio, f.fin);
      rows += `<div class="grow grow--fase">${bg()}<div class="gbar gbar--fase ${ef === 'pordefinir' ? 'gbar--pordefinir' : ''}" style="left:${left(f.inicio)}px;width:${wf}px;${ef === 'pordefinir' ? '' : `--c:${f.color}`}"><div class="gbar__fill" style="--w:${af}%"></div><span>${wf > 90 ? `${fmt(f.inicio)} → ${fmt(f.fin)}` : ''}</span></div></div>`;
      f.entregables.forEach((e) => {
        const es = estadoDe(e), av = avanceDe(e);
        labels += `<div class="glabel" title="${esc(e.nombre)}"><span class="glabel__name">${esc(e.nombre)}</span><span class="glabel__pct">${es === 'pordefinir' ? '—' : av + ' %'}</span></div>`;
        const we = width(e.inicio, e.fin);
        rows += `<div class="grow">${bg()}<div class="gbar gbar--${es}" data-entregable="${e.id}" style="left:${left(e.inicio)}px;width:${we}px" title="${esc(e.nombre)} · ${fmt(e.inicio)} → ${fmt(e.fin)} · ${ESTADO_TXT[es]}"><div class="gbar__fill" style="--w:${av}%"></div><span>${we > 90 ? `${fmt(e.inicio)} → ${fmt(e.fin)}` : (we > 40 ? av + ' %' : '')}</span></div></div>`;
      });
    });
    const refLeft = diffDays(min, ref) * dayW + dayW / 2;
    wrap.innerHTML = `<div class="gantt"><div class="gantt__labels">${labels}</div><div class="gantt__grid">${rows}<div class="gref" data-label="${fmt(state.ref)}" style="left:${refLeft}px"></div></div></div>`;
    // centrar la vista en la fecha de referencia
    const g = $('.gantt__grid', wrap);
    if (g) wrap.scrollLeft = Math.max(0, refLeft - (wrap.clientWidth - 260) / 2);
  }

  /* ---------- detalle ---------------------------------------------- */
  function renderDetalle() {
    const fases = fasesVisibles();
    $('#detalle').innerHTML = fases.map((f) => {
      const ef = estadoFase(f), af = avanceFase(f);
      const cards = f.entregables.map((e) => {
        const es = estadoDe(e), av = avanceDe(e);
        const tareas = e.tareas && e.tareas.length ? `<ul class="tasks">${e.tareas.map((t, i) => `<li class="${t.hecho ? 'is-done' : ''}"><input type="checkbox" id="t-${e.id}-${i}" data-task="${e.id}:${i}" ${t.hecho ? 'checked' : ''} ${e.porDefinir ? 'disabled' : ''}><label for="t-${e.id}-${i}">${esc(t.nombre)}${t.dependeDe ? `<small>· depende de ${esc(t.dependeDe)}</small>` : ''}</label></li>`).join('')}</ul>` : '';
        return `<article class="card" id="card-${e.id}" style="--c:${f.color}">
          <div class="card__top"><h3>${esc(e.nombre)}</h3><span class="badge badge--${es}">${ESTADO_TXT[es]}</span></div>
          <p class="card__desc">${esc(e.descripcion)}</p>
          <dl class="card__meta">
            <dt>Fechas</dt><dd>${fmtLong(e.inicio)} → ${fmtLong(e.fin)}</dd>
            <dt>Responsable</dt><dd>${esc(e.responsable || '—')}</dd>
            <dt>Aceptación</dt><dd>${esc(e.criterio || '—')}</dd>
          </dl>
          <div class="card__prog"><div class="progress ${es === 'completado' ? 'progress--ok' : es === 'atrasado' ? 'progress--bad' : ''}"><i style="--w:${av}%"></i></div><b>${es === 'pordefinir' ? '—' : av + ' %'}</b></div>
          ${tareas}
          <div class="card__foot">
            ${e.enlace ? `<a class="btn btn--ghost btn--sm" href="${esc(e.enlace)}" target="_blank" rel="noopener"><svg class="ico"><use href="#i-link"/></svg> Ver entregable</a>` : ''}
            ${state.edit ? `<button class="btn btn--ghost btn--sm" type="button" data-edit-e="${e.id}"><svg class="ico"><use href="#i-edit"/></svg> Editar</button><button class="btn btn--ghost btn--sm btn--danger" type="button" data-del-e="${e.id}"><svg class="ico"><use href="#i-trash"/></svg></button>` : ''}
          </div>
        </article>`;
      }).join('');
      return `<section class="fase" id="fase-${f.id}">
        <div class="fase__head" style="--c:${f.color}"><i></i><h2>${esc(f.nombre)}</h2><span class="badge badge--${ef}">${ESTADO_TXT[ef]}</span><span class="fase__dates">${fmtLong(f.inicio)} → ${fmtLong(f.fin)} · ${ef === 'pordefinir' ? 'sin avance' : af + ' % de avance'}</span>
          <div class="fase__actions">${state.edit ? `<button class="btn btn--ghost btn--sm" type="button" data-add-e="${f.id}"><svg class="ico"><use href="#i-plus"/></svg> Entregable</button><button class="btn btn--ghost btn--sm" type="button" data-edit-f="${f.id}"><svg class="ico"><use href="#i-edit"/></svg> Fase</button><button class="btn btn--ghost btn--sm btn--danger" type="button" data-del-f="${f.id}"><svg class="ico"><use href="#i-trash"/></svg></button>` : ''}</div>
        </div>
        <p class="fase__desc">${esc(f.descripcion || '')}</p>
        ${cards ? `<div class="cards">${cards}</div>` : `<div class="empty">Esta fase aún no tiene entregables definidos.${state.edit ? ' Usa «+ Entregable» para añadir uno.' : ''}</div>`}
      </section>`;
    }).join('');
  }

  function renderAll() { renderHead(); renderKpis(); renderChips(); renderGantt(); renderDetalle(); }

  /* ---------- edición: panel lateral ------------------------------- */
  const findE = (id) => { for (const f of state.data.fases) { const e = f.entregables.find((x) => x.id === id); if (e) return { f, e }; } return null; };
  const findF = (id) => state.data.fases.find((f) => f.id === id);

  function openDrawer(title, html, onSubmit) {
    $('#drawerTitle').textContent = title;
    const form = $('#drawerForm'); form.innerHTML = html; form.onsubmit = (ev) => { ev.preventDefault(); onSubmit(new FormData(form), form); };
    $('#drawer').hidden = false;
    const first = $('input, textarea', form); if (first) first.focus();
  }
  const closeDrawer = () => { $('#drawer').hidden = true; };
  const inp = (name, label, val, type, extra) => `<label>${label}<input type="${type || 'text'}" name="${name}" value="${esc(val)}" ${extra || ''}></label>`;

  function formFase(f, isNew) {
    openDrawer(isNew ? 'Nueva fase' : 'Editar fase', `
      ${inp('nombre', 'Nombre', f.nombre, 'text', 'required')}
      <label>Descripción<textarea name="descripcion">${esc(f.descripcion || '')}</textarea></label>
      <div class="row">${inp('inicio', 'Inicio', f.inicio, 'date', 'required')}${inp('fin', 'Fin', f.fin, 'date', 'required')}</div>
      <div class="row">${inp('color', 'Color', f.color || '#1F5FD6', 'color')}<label>Estado<select name="porDefinir"><option value="" ${!f.porDefinir ? 'selected' : ''}>Definida</option><option value="1" ${f.porDefinir ? 'selected' : ''}>Por definir</option></select></label></div>
      <div class="form__actions"><div><button class="btn btn--primary" type="submit">Guardar</button><button class="btn btn--ghost" type="button" data-cancel>Cancelar</button></div></div>`,
      (fd) => {
        if (fd.get('fin') < fd.get('inicio')) { toast('La fecha de fin no puede ser anterior al inicio'); return; }
        Object.assign(f, { nombre: fd.get('nombre').trim(), descripcion: fd.get('descripcion').trim(), inicio: fd.get('inicio'), fin: fd.get('fin'), color: fd.get('color'), porDefinir: !!fd.get('porDefinir') });
        if (isNew) state.data.fases.push(f);
        persist(); closeDrawer(); renderAll(); toast(isNew ? 'Fase añadida' : 'Fase actualizada');
      });
  }

  function formEntregable(f, e, isNew) {
    const tareasHtml = (ts) => ts.map((t, i) => `<div class="form__task"><input type="checkbox" name="t_hecho_${i}" ${t.hecho ? 'checked' : ''} title="Hecha"><input type="text" name="t_nombre_${i}" value="${esc(t.nombre)}" placeholder="Tarea"><input type="text" name="t_dep_${i}" value="${esc(t.dependeDe || '')}" placeholder="Depende de" style="width:110px"><button class="iconbtn" type="button" data-del-task="${i}" aria-label="Quitar"><svg class="ico"><use href="#i-x"/></svg></button></div>`).join('');
    const tareas = (e.tareas || []).map((t) => ({ ...t }));
    const draw = () => {
      openDrawer(isNew ? 'Nuevo entregable' : 'Editar entregable', `
        ${inp('nombre', 'Nombre', e.nombre, 'text', 'required')}
        <label>Descripción<textarea name="descripcion">${esc(e.descripcion || '')}</textarea></label>
        <div class="row">${inp('inicio', 'Inicio', e.inicio, 'date', 'required')}${inp('fin', 'Fin', e.fin, 'date', 'required')}</div>
        ${inp('responsable', 'Responsable', e.responsable || '')}
        <label>Criterio de aceptación<textarea name="criterio">${esc(e.criterio || '')}</textarea></label>
        ${inp('enlace', 'Enlace (opcional)', e.enlace || '', 'url', 'placeholder="https://…"')}
        <div class="row">${inp('avance', 'Avance manual (%)', avanceReal(e), 'number', `min="0" max="100" ${tareas.length ? 'disabled title="Se calcula a partir de las tareas"' : ''}`)}<label>Estado<select name="porDefinir"><option value="" ${!e.porDefinir ? 'selected' : ''}>Definido</option><option value="1" ${e.porDefinir ? 'selected' : ''}>Por definir</option></select></label></div>
        <label>Tareas (el avance se calcula con las tareas marcadas)</label>
        <div class="form__tasks" id="formTasks">${tareasHtml(tareas)}</div>
        <div><button class="btn btn--ghost btn--sm" type="button" data-add-task><svg class="ico"><use href="#i-plus"/></svg> Tarea</button></div>
        <div class="form__actions"><div><button class="btn btn--primary" type="submit">Guardar</button><button class="btn btn--ghost" type="button" data-cancel>Cancelar</button></div></div>`,
        (fd, form) => {
          if (fd.get('fin') < fd.get('inicio')) { toast('La fecha de fin no puede ser anterior al inicio'); return; }
          const ts = [];
          $$('.form__task', form).forEach((row, i) => {
            const nombre = fd.get(`t_nombre_${i}`); if (!nombre || !nombre.trim()) return;
            ts.push({ nombre: nombre.trim(), hecho: !!fd.get(`t_hecho_${i}`), dependeDe: (fd.get(`t_dep_${i}`) || '').trim() || undefined });
          });
          Object.assign(e, { nombre: fd.get('nombre').trim(), descripcion: fd.get('descripcion').trim(), inicio: fd.get('inicio'), fin: fd.get('fin'), responsable: fd.get('responsable').trim(), criterio: fd.get('criterio').trim(), enlace: fd.get('enlace').trim() || undefined, avance: Number(fd.get('avance')) || 0, porDefinir: !!fd.get('porDefinir'), tareas: ts });
          if (isNew) f.entregables.push(e);
          persist(); closeDrawer(); renderAll(); toast(isNew ? 'Entregable añadido' : 'Entregable actualizado');
        });
      const form = $('#drawerForm');
      form.addEventListener('click', (ev) => {
        const add = ev.target.closest('[data-add-task]'); const del = ev.target.closest('[data-del-task]');
        if (add) { syncTasks(form); tareas.push({ nombre: '', hecho: false }); draw(); }
        if (del) { syncTasks(form); tareas.splice(Number(del.dataset.delTask), 1); draw(); }
      });
      const syncTasks = (frm) => { $$('.form__task', frm).forEach((row, i) => { tareas[i] = { nombre: $(`[name="t_nombre_${i}"]`, row).value, hecho: $(`[name="t_hecho_${i}"]`, row).checked, dependeDe: $(`[name="t_dep_${i}"]`, row).value || undefined }; }); };
    };
    draw();
  }

  /* ---------- exportar / importar ---------------------------------- */
  function exportJson() {
    const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cronograma-entregables.json';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    toast('JSON exportado');
  }
  function importJson(file) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || !Array.isArray(d.fases) || !d.proyecto) throw new Error('formato');
        state.data = d; persist(); state.ocultas.clear(); renderAll(); toast('Cronograma importado');
      } catch (e) { toast('El archivo no tiene el formato esperado'); }
    };
    r.readAsText(file);
  }

  /* ---------- simulación ------------------------------------------- */
  function toggleSim() {
    const btn = $('#btnSimular');
    if (state.simulando) {
      clearInterval(state.simTimer); state.simulando = false; btn.textContent = '▶ Simular avance'; btn.setAttribute('aria-pressed', 'false'); renderAll(); return;
    }
    const fases = state.data.fases.filter((f) => !f.porDefinir);
    const maxFin = fases.reduce((m, f) => (f.fin > m ? f.fin : m), fases[0] ? fases[0].fin : state.ref);
    const start = state.data.fases.reduce((m, f) => (f.inicio < m ? f.inicio : m), state.ref);
    state.ref = start; $('#refDate').value = state.ref;
    state.simulando = true; btn.textContent = '■ Detener simulación'; btn.setAttribute('aria-pressed', 'true');
    renderAll();
    state.simTimer = setInterval(() => {
      if (state.ref >= maxFin) { toggleSim(); return; }
      state.ref = toISO(addDays(toDate(state.ref), 1)); $('#refDate').value = state.ref; renderAll();
    }, 350);
  }

  /* ---------- utilidades UI ---------------------------------------- */
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => (t.hidden = true), 2400); }

  /* ---------- eventos ---------------------------------------------- */
  function bind() {
    $('#refDate').addEventListener('change', (e) => { if (e.target.value) { state.ref = e.target.value; renderAll(); } });
    $('#btnHoy').addEventListener('click', () => { state.ref = todayISO(); $('#refDate').value = state.ref; renderAll(); });
    $('#escala').addEventListener('change', (e) => { state.escala = e.target.value; renderGantt(); });
    $('#faseChips').addEventListener('click', (e) => {
      const c = e.target.closest('.chip'); if (!c) return;
      const id = c.dataset.fase; state.ocultas.has(id) ? state.ocultas.delete(id) : state.ocultas.add(id);
      renderChips(); renderGantt(); renderDetalle();
    });
    $('#btnEditar').addEventListener('click', () => {
      state.edit = !state.edit; $('#btnEditar').setAttribute('aria-pressed', String(state.edit)); $('#btnNuevaFase').hidden = !state.edit;
      renderDetalle(); toast(state.edit ? 'Modo edición activado' : 'Modo edición desactivado');
    });
    $('#btnNuevaFase').addEventListener('click', () => formFase({ id: uid('f'), nombre: 'Nueva fase', color: '#1F5FD6', inicio: state.ref, fin: toISO(addDays(toDate(state.ref), 14)), descripcion: '', entregables: [] }, true));
    $('#btnExportar').addEventListener('click', exportJson);
    $('#inputImportar').addEventListener('change', (e) => { if (e.target.files[0]) importJson(e.target.files[0]); e.target.value = ''; });
    $('#btnReset').addEventListener('click', () => {
      if (!confirm('Se restablecerá el cronograma original del archivo de datos y se perderán los cambios hechos en esta página. ¿Continuar?')) return;
      try { localStorage.removeItem(STORE); } catch (e) { /* nada */ }
      state.data = JSON.parse(JSON.stringify(window.CRONOGRAMA)); state.ocultas.clear(); renderAll(); toast('Cronograma restablecido');
    });
    $('#btnSimular').addEventListener('click', toggleSim);
    $('#drawerClose').addEventListener('click', closeDrawer);
    $('#drawer').addEventListener('click', (e) => { if (e.target === $('#drawer') || e.target.closest('[data-cancel]')) closeDrawer(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

    $('#ganttWrap').addEventListener('click', (e) => {
      const bar = e.target.closest('[data-entregable]'); if (!bar) return;
      const r = findE(bar.dataset.entregable); if (!r) return;
      if (state.edit) formEntregable(r.f, r.e, false);
      else { const card = $('#card-' + r.e.id); if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); card.style.outline = '3px solid rgba(31,95,214,.45)'; setTimeout(() => (card.style.outline = ''), 1600); } }
    });
    $('#detalle').addEventListener('change', (e) => {
      const t = e.target.closest('[data-task]'); if (!t) return;
      const [id, i] = t.dataset.task.split(':'); const r = findE(id); if (!r) return;
      r.e.tareas[Number(i)].hecho = t.checked; persist(); renderKpis(); renderGantt(); renderDetalle();
    });
    $('#detalle').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.editE) { const r = findE(b.dataset.editE); if (r) formEntregable(r.f, r.e, false); }
      if (b.dataset.delE) { const r = findE(b.dataset.delE); if (r && confirm(`¿Eliminar "${r.e.nombre}"?`)) { r.f.entregables = r.f.entregables.filter((x) => x !== r.e); persist(); renderAll(); toast('Entregable eliminado'); } }
      if (b.dataset.addE) { const f = findF(b.dataset.addE); if (f) formEntregable(f, { id: uid('e'), nombre: 'Nuevo entregable', descripcion: '', inicio: f.inicio, fin: f.fin, responsable: '', avance: 0, criterio: '', tareas: [] }, true); }
      if (b.dataset.editF) { const f = findF(b.dataset.editF); if (f) formFase(f, false); }
      if (b.dataset.delF) { const f = findF(b.dataset.delF); if (f && confirm(`¿Eliminar la fase "${f.nombre}" y sus entregables?`)) { state.data.fases = state.data.fases.filter((x) => x !== f); persist(); renderAll(); toast('Fase eliminada'); } }
    });
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(renderGantt, 150); });
  }

  /* ---------- arranque --------------------------------------------- */
  function init() {
    state.data = loadData();
    state.ref = state.data.proyecto.fechaReferencia || todayISO();
    $('#refDate').value = state.ref;
    bind();
    renderAll();
  }
  init();
})();
