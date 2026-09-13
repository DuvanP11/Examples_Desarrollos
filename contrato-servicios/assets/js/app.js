/* =====================================================================
   Editor del contrato: renderizado, campos, firmas, guardado local,
   exportación a Word y PDF.
   ===================================================================== */
(function () {
  'use strict';

  const C = window.CONTRATO;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const STORE_KEY = 'contrato-servicios-v1';
  const SIG_KEY = 'contrato-servicios-firmas-v1';
  const doc = $('#doc');

  /* ---------- utilidades ----------------------------------------- */
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* Texto que se exporta cuando el campo queda vacío. */
  function outText(label) {
    const clean = label.replace(/\[●\]/g, '●');
    if (/^\s*$/.test(clean)) return '[   ]';
    if (clean === clean.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(clean)) return '[' + clean + ']';
    if (clean.length <= 14) return '[●]';
    return '[● ' + clean + ']';
  }

  /* Convierte **negrita** y [[campos]] en HTML. */
  function inline(text, opts) {
    opts = opts || {};
    let html = '';
    const re = /\[\[([^\]]*)\]\]|\*\*(.+?)\*\*/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      html += esc(text.slice(last, m.index));
      if (m[1] !== undefined) {
        const label = m[1].trim();
        const out = opts.table ? (label ? '[●]' : '[   ]') : outText(label);
        html += `<span class="f" contenteditable="true" data-ph="${esc(label)}" data-out="${esc(out)}"></span>`;
      } else {
        html += `<strong>${esc(m[2])}</strong>`;
      }
      last = re.lastIndex;
    }
    html += esc(text.slice(last));
    return html;
  }

  /* ---------- renderizado de la plantilla ------------------------- */
  function render() {
    let h = `<h1 class="doc-title">${esc(C.title)}</h1><p class="doc-subtitle">${esc(C.subtitle)}</p>`;
    C.blocks.forEach((b) => {
      switch (b.t) {
        case 'h2': h += `<h2>${esc(b.text)}</h2>`; break;
        case 'h3': h += `<h3>${esc(b.text)}</h3>`; break;
        case 'p': h += `<p${b.cls ? ` class="${b.cls}"` : ''}>${inline(b.text)}</p>`; break;
        case 'note': h += `<p class="note">${inline(b.text)}</p>`; break;
        case 'ul': h += `<ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`; break;
        case 'pagebreak': h += `<div class="pagebreak" contenteditable="false"></div>`; break;
        case 'table':
          h += `<table class="${b.cls || ''}">`;
          if (b.head) h += `<thead><tr>${b.head.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>`;
          h += `<tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c, { table: true })}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
          break;
        case 'sign':
          h += `<div class="sign-grid" contenteditable="false">`;
          b.signers.forEach((s) => {
            h += `<div class="sign-box" data-signer="${s.id}">
              <div class="sign-box__role">${esc(s.role)}</div>
              <div class="sign-pad" data-pad="${s.id}">
                <canvas width="900" height="360" aria-label="Área de firma: ${esc(s.role)}"></canvas>
                <div class="sign-pad__hint">Firme aquí con el ratón o el dedo</div>
                <div class="sign-pad__label">Firma</div>
                <div class="sign-pad__tools no-print">
                  <button type="button" data-clear="${s.id}">Limpiar</button>
                  <label>Cargar imagen de firma<input type="file" accept="image/*" data-upload="${s.id}"></label>
                </div>
              </div>
              <div class="sign-fields">
                ${s.fields.map(([k, ph]) => `<div><span>${esc(k)}:</span><span class="f" contenteditable="true" data-ph="${esc(ph)}" data-out="[●]"></span></div>`).join('')}
              </div>
            </div>`;
          });
          h += `</div>`;
          break;
      }
    });
    doc.innerHTML = h;
  }

  /* ---------- firmas ---------------------------------------------- */
  const pads = {};
  function initPads() {
    $$('.sign-pad', doc).forEach((pad) => {
      const id = pad.dataset.pad;
      const canvas = $('canvas', pad);
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#111';
      let drawing = false, last = null;
      const pos = (e) => {
        const r = canvas.getBoundingClientRect();
        return { x: (e.clientX - r.left) * (canvas.width / r.width), y: (e.clientY - r.top) * (canvas.height / r.height) };
      };
      canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault(); drawing = true; last = pos(e); canvas.setPointerCapture(e.pointerId);
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(last.x + 0.1, last.y + 0.1); ctx.stroke();
        pad.classList.add('has-ink');
      });
      canvas.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        const p = pos(e);
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p;
      });
      const end = () => { if (drawing) { drawing = false; saveSignatures(); } };
      canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end); canvas.addEventListener('pointerleave', end);
      pads[id] = { canvas, ctx, pad };
    });
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-clear]');
      if (b) { clearPad(b.dataset.clear); saveSignatures(); }
    });
    doc.addEventListener('change', (e) => {
      const inp = e.target.closest('[data-upload]');
      if (!inp || !inp.files[0]) return;
      const id = inp.dataset.upload;
      const img = new Image();
      img.onload = () => {
        const { canvas, ctx, pad } = pads[id];
        clearPad(id);
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;
        const w = img.width * scale, hgt = img.height * scale;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - hgt) / 2, w, hgt);
        pad.classList.add('has-ink'); saveSignatures();
      };
      img.src = URL.createObjectURL(inp.files[0]);
      inp.value = '';
    });
  }
  function clearPad(id) {
    const { canvas, ctx, pad } = pads[id];
    ctx.clearRect(0, 0, canvas.width, canvas.height); pad.classList.remove('has-ink');
  }
  function padHasInk(id) { return pads[id].pad.classList.contains('has-ink'); }
  function signatureData(id) { return padHasInk(id) ? pads[id].canvas.toDataURL('image/png') : null; }
  function saveSignatures() {
    try {
      const data = {}; Object.keys(pads).forEach((id) => { const d = signatureData(id); if (d) data[id] = d; });
      localStorage.setItem(SIG_KEY, JSON.stringify(data));
    } catch (e) { /* almacenamiento no disponible */ }
  }
  function restoreSignatures() {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(SIG_KEY) || '{}'); } catch (e) { return; }
    Object.entries(data).forEach(([id, url]) => {
      if (!pads[id]) return;
      const img = new Image();
      img.onload = () => { pads[id].ctx.drawImage(img, 0, 0); pads[id].pad.classList.add('has-ink'); };
      img.src = url;
    });
  }

  /* ---------- campos y guardado ---------------------------------- */
  function refreshFields() {
    let pending = 0;
    $$('.f', doc).forEach((f) => {
      if (f.textContent.trim() === '' && f.innerHTML !== '') f.innerHTML = ''; // limpia <br> residuales
      const filled = f.textContent.trim() !== '';
      f.classList.toggle('is-filled', filled);
      if (!filled) pending++;
    });
    $('#pendingCount').textContent = pending ? `${pending} campos [●] por completar` : 'Todos los campos completados';
  }
  let saveTimer = null;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      refreshFields();
      try {
        localStorage.setItem(STORE_KEY, doc.innerHTML);
        const t = new Date();
        $('#saveStatus').textContent = 'Guardado en este navegador · ' + t.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        $('#saveStatus').textContent = 'No se pudo guardar en este navegador';
      }
    }, 400);
  }
  function restoreDocument() {
    let saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* nada */ }
    if (saved && saved.includes('sign-grid')) { doc.innerHTML = saved; return true; }
    return false;
  }
  function resetTemplate() {
    if (!confirm('Se restablecerá la plantilla original y se borrarán los datos y firmas guardados en este navegador. ¿Continuar?')) return;
    try { localStorage.removeItem(STORE_KEY); localStorage.removeItem(SIG_KEY); } catch (e) { /* nada */ }
    render(); initPads(); refreshFields();
    $('#saveStatus').textContent = 'Plantilla restablecida';
    toast('Plantilla restablecida');
  }

  /* Evita que Enter dentro de un campo cree párrafos nuevos. */
  doc.addEventListener('keydown', (e) => {
    const f = e.target.closest && e.target.closest('.f');
    if (f && e.key === 'Enter' && !f.closest('.campo-largo')) { e.preventDefault(); }
  });
  doc.addEventListener('paste', (e) => {
    if (!e.target.closest || !e.target.closest('[contenteditable="true"]')) return;
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });
  doc.addEventListener('input', scheduleSave);

  /* ---------- exportación ----------------------------------------- */
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(t._h); t._h = setTimeout(() => (t.hidden = true), 2600);
  }
  async function downloadDocx() {
    const btn = $('#btnDocx'); btn.disabled = true; btn.textContent = 'Generando…';
    try {
      const sigs = {}; Object.keys(pads).forEach((id) => { const d = signatureData(id); if (d) sigs[id] = d; });
      const blob = await window.buildDocx(doc, { title: C.title, headerText: C.headerText, signatures: sigs });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = C.fileBase + '.docx';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast('Word descargado');
    } catch (e) {
      console.error(e); toast('No se pudo generar el Word: ' + e.message);
    } finally { btn.disabled = false; btn.textContent = 'Descargar Word (.docx)'; }
  }
  function exportPdf() {
    refreshFields();
    doc.blur();
    const prevTitle = document.title;
    document.title = C.fileBase; // nombre sugerido del PDF
    window.print();
    setTimeout(() => (document.title = prevTitle), 1000);
  }

  /* Usado por la generación automática de los archivos de plantilla. */
  window.buildDocxBase64 = async function () {
    const blob = await window.buildDocx(doc, { title: C.title, headerText: C.headerText, signatures: {} });
    const buf = await blob.arrayBuffer();
    let s = ''; const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  };

  /* ---------- arranque -------------------------------------------- */
  function init() {
    if (!restoreDocument()) render();
    initPads();
    restoreSignatures();
    refreshFields();
    $('#btnDocx').addEventListener('click', downloadDocx);
    $('#btnPdf').addEventListener('click', exportPdf);
    $('#btnReset').addEventListener('click', resetTemplate);
    $('#btnFree').addEventListener('click', () => {
      const on = doc.getAttribute('contenteditable') !== 'true';
      doc.setAttribute('contenteditable', on ? 'true' : 'false');
      doc.classList.toggle('is-free', on);
      const b = $('#btnFree'); b.setAttribute('aria-pressed', String(on)); b.classList.toggle('btn--on', on);
      toast(on ? 'Edición libre activada: puede corregir cualquier párrafo' : 'Edición libre desactivada');
    });
    $('#btnFirmas').addEventListener('click', () => $('.sign-grid', doc).scrollIntoView({ behavior: 'smooth', block: 'start' }));
    $('#hintClose').addEventListener('click', () => { $('#hint').hidden = true; try { localStorage.setItem('contrato-hint', '1'); } catch (e) { /* nada */ } });
    try { if (localStorage.getItem('contrato-hint')) $('#hint').hidden = true; } catch (e) { /* nada */ }
    document.querySelectorAll('[data-mobile]').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.mobile;
      if (a === 'docx') downloadDocx(); else if (a === 'pdf') exportPdf(); else $('#btnFirmas').click();
    }));
    window.addEventListener('beforeprint', refreshFields);
  }
  init();
})();
