/* =====================================================================
   ByteNova → Smartline · Demo Fase 1
   Lógica de la demostración: renderizado desde config.js, diagrama de
   flujo animado, secuencia "Ejecutar demostración", dashboard y navegación.
   Sin dependencias externas.
   ===================================================================== */
(function () {
  'use strict';

  const CFG = window.DEMO_CONFIG;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- formato de números (es-CO) ------------------------- */
  const fmtNum = (n) => Math.round(n).toLocaleString('es-CO');
  const fmtCOP = (n) => '$' + fmtNum(n);
  const fmtPct = (n) => n.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';

  /* ---------- métricas derivadas --------------------------------- */
  function derive(p) {
    const m = p.metrics;
    return {
      ...m,
      ctr: (m.clicks / m.impressions) * 100,
      cpl: m.budget / m.leads,
      cpa: m.budget / m.conversions,
      convRate: (m.conversions / m.leads) * 100
    };
  }
  const PLATFORMS = CFG.platforms.map((p) => ({ ...p, d: derive(p) }));
  const TOTAL = (() => {
    const t = { budget: 0, reach: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0 };
    PLATFORMS.forEach((p) => Object.keys(t).forEach((k) => (t[k] += p.metrics[k])));
    t.ctr = (t.clicks / t.impressions) * 100;
    t.cpl = t.budget / t.leads;
    t.cpa = t.budget / t.conversions;
    return t;
  })();
  const BEST = {
    cpl: PLATFORMS.reduce((a, b) => (a.d.cpl < b.d.cpl ? a : b)),
    leads: PLATFORMS.reduce((a, b) => (a.d.leads > b.d.leads ? a : b)),
    reach: PLATFORMS.reduce((a, b) => (a.d.reach > b.d.reach ? a : b)),
    convRate: PLATFORMS.reduce((a, b) => (a.d.convRate > b.d.convRate ? a : b))
  };

  const INSIGHTS = [
    `${BEST.cpl.short} está generando más prospectos con menor coste (${fmtCOP(BEST.cpl.d.cpl)} por prospecto).`,
    `${BEST.convRate.short} presenta menor volumen pero mayor interés profesional (${fmtPct(BEST.convRate.d.convRate)} de los prospectos se convierten).`,
    `${BEST.reach.short} presenta mayor alcance (${fmtNum(BEST.reach.d.reach)} personas) pero menor conversión.`
  ];
  const RECOMMENDATION = `Redistribuir parte del presupuesto hacia la campaña con mejor coste por prospecto (${BEST.cpl.name}) y mantener ${BEST.convRate.short} como canal de prospectos de alta calidad.`;

  /* ---------- utilidades ----------------------------------------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else node.setAttribute(k, v);
    });
    (children || []).forEach((c) => c && node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return node;
  }
  function svgEl(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }
  const icon = (name, cls) => `<svg class="ico ${cls || ''}"><use href="#i-${name}"/></svg>`;
  const platformIcon = (id) => icon(id);

  /* Contador animado: de 0 al valor final. */
  function countTo(node, target, ms, format) {
    if (reduceMotion || ms <= 0) { node.textContent = format(target); return Promise.resolve(); }
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / ms);
        const e = 1 - Math.pow(1 - t, 3);
        node.textContent = format(target * e);
        if (t < 1) requestAnimationFrame(tick); else resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  /* =================================================================
     1. RENDERIZADO DESDE LA CONFIGURACIÓN
     ================================================================= */

  function renderAgentList(ul, withMeta) {
    ul.innerHTML = '';
    CFG.agents.forEach((a) => {
      ul.appendChild(el('li', { 'data-agent-row': a.id }, [
        el('span', { html: icon(a.icon) }),
        el('span', { class: 'minilist__body' }, [
          el('span', { class: 'minilist__name', text: a.short }),
          withMeta ? el('span', { class: 'minilist__meta', 'data-agent-meta': a.id, text: '' }) : null
        ]),
        el('span', { class: 'badge', 'data-agent-badge': a.id, 'data-state': 'waiting', text: CFG.agentStates.waiting })
      ]));
    });
  }

  function renderPlatformList(ul) {
    ul.innerHTML = '';
    PLATFORMS.forEach((p) => {
      ul.appendChild(el('li', {}, [
        el('span', { html: platformIcon(p.id), style: `color:${p.color}` }),
        el('span', { class: 'minilist__body' }, [
          el('span', { class: 'minilist__name', text: p.name }),
          el('span', { class: 'minilist__meta', 'data-platform-meta': p.id, text: '' })
        ]),
        el('span', { class: 'badge', 'data-platform-badge': p.id, 'data-state': 'idle', text: CFG.platformStates.idle })
      ]));
    });
  }

  function renderOrchestra() {
    const root = $('#orchestra');
    const O = CFG.orchestrator;
    const byId = Object.fromEntries(CFG.agents.map((a) => [a.id, a]));
    root.innerHTML = '';
    root.appendChild(el('div', { class: 'orch-node', id: 'orchNode' }, [
      el('strong', { html: `${icon('cpu')} ${O.name}` }),
      el('small', { text: O.description })
    ]));
    root.appendChild(el('div', { class: 'orch-trunk' }));
    root.appendChild(el('div', { class: 'orch-bus', style: `width: calc(min(100%, 880px) * ${(O.primary.length - 1) / O.primary.length})` }));
    const row = el('div', { class: 'orch-row' });
    O.primary.forEach((id) => {
      const a = byId[id];
      const col = el('div', { class: 'orch-col' });
      col.appendChild(el('div', { class: 'orch-trunk' }));
      col.appendChild(el('div', { class: 'orch-leaf', 'data-agent-leaf': a.id, 'data-state': 'waiting', html: `${icon(a.icon)} ${a.short}` }));
      (O.secondary[id] || []).forEach((subId) => {
        const s = byId[subId];
        col.appendChild(el('div', { class: 'orch-trunk' }));
        col.appendChild(el('div', { class: 'orch-leaf', 'data-agent-leaf': s.id, 'data-state': 'waiting', html: `${icon(s.icon)} ${s.short}` }));
      });
      row.appendChild(col);
    });
    root.appendChild(row);
  }

  function renderAgentGrid() {
    const grid = $('#agentGrid');
    grid.innerHTML = '';
    CFG.agents.forEach((a, i) => {
      const dl = el('dl');
      a.output.rows.forEach(([k, v]) => { dl.appendChild(el('dt', { text: k })); dl.appendChild(el('dd', { text: v })); });
      grid.appendChild(el('article', { class: 'agent-card', 'data-agent-card': a.id, 'data-state': 'waiting' }, [
        el('div', { class: 'agent-card__top' }, [
          el('span', { class: 'agent-card__num', text: `Agente ${i + 1}` }),
          el('span', { class: 'badge', 'data-agent-badge': a.id, 'data-state': 'waiting', text: CFG.agentStates.waiting })
        ]),
        el('div', { class: 'agent-card__head' }, [
          el('div', { class: 'agent-card__icon', html: icon(a.icon) }),
          el('h3', { text: a.name })
        ]),
        el('p', { class: 'agent-card__role', text: a.role }),
        el('div', { class: 'agent-card__out' }, [
          el('h4', { text: a.output.title }),
          dl,
          el('span', { class: 'tag tag--muted agent-card__tag', text: 'Ejemplo simulado' })
        ])
      ]));
    });
    const words = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
    $('#agentCountText').textContent = words[CFG.agents.length] || String(CFG.agents.length);
  }

  const CYCLE_STEPS = (p) => ['ByteNova prepara la campaña', 'Campaña lista', `${p.name} la recibe`, 'Publicación', 'Resultados', 'Vuelven a ByteNova'];

  function renderPlatforms() {
    const grid = $('#platformGrid');
    grid.innerHTML = '';
    PLATFORMS.forEach((p) => {
      const cycle = el('ol', { class: 'cycle', 'data-cycle': p.id });
      CYCLE_STEPS(p).forEach((s, i) => cycle.appendChild(el('li', { class: 'cycle__item' + (i === 5 ? ' cycle__item--loop' : ''), style: `--c:${p.color}` }, [el('i'), s])));
      const cells = [
        ['Presupuesto', 'budget', fmtCOP], ['Impresiones', 'impressions', fmtNum], ['Clics', 'clicks', fmtNum],
        ['CTR', 'ctr', fmtPct], ['Prospectos', 'leads', fmtNum], ['Coste por prospecto', 'cpl', fmtCOP]
      ];
      const mock = el('div', { class: 'mockui' }, [
        el('div', { class: 'mockui__bar', html: `<i></i><i></i><i></i> Administrador de campañas <span>Interfaz simulada</span>` }),
        el('div', { class: 'mockui__campaign' }, [
          el('strong', { text: p.campaign }),
          el('small', { text: `${p.objective} · ${p.format}` }),
          el('div', {}, [el('span', { class: 'mockui__status is-active', 'data-mock-status': p.id, text: 'Estado: Publicado' })])
        ]),
        el('div', { class: 'mockui__grid' }, cells.map(([label, key, fmt]) => el('div', { class: 'mockui__cell' }, [
          el('span', { text: label }),
          el('b', { 'data-mock': `${p.id}:${key}`, text: fmt(p.d[key]) })
        ]))),
        el('div', { class: 'mockui__foot', text: 'Datos de demostración' })
      ]);
      grid.appendChild(el('article', { class: 'platform-card', 'data-platform-card': p.id }, [
        el('div', { class: 'platform-card__head', style: `background:${p.color}` }, [
          el('span', { html: platformIcon(p.id) }),
          el('strong', { text: p.name }),
          el('span', { class: 'badge', 'data-platform-badge': p.id, 'data-state': 'idle', text: CFG.platformStates.idle })
        ]),
        el('div', { class: 'platform-card__body' }, [cycle, mock])
      ]));
    });
  }

  function renderStages() {
    const ol = $('#stageList');
    ol.innerHTML = '';
    CFG.stages.forEach((s) => {
      ol.appendChild(el('li', { 'data-stage': s.id }, [
        el('i', { html: `<span>${s.id}</span>${icon('check')}` }),
        el('span', { text: s.label })
      ]));
      if (s.id === 4) {
        ol.appendChild(el('div', { class: 'stages__sub', 'data-stage-sub': 4 },
          PLATFORMS.map((p) => el('span', { 'data-pub-check': p.id, text: p.short.toUpperCase() }))));
      }
    });
  }

  function renderKpis() {
    const box = $('#kpis');
    box.innerHTML = '';
    const items = [
      ['Inversión total', 'budget', fmtCOP, 'suma de las tres plataformas'],
      ['Prospectos generados', 'leads', fmtNum, 'contactos interesados'],
      ['Coste por prospecto', 'cpl', fmtCOP, 'promedio del periodo'],
      ['Clics', 'clicks', fmtNum, 'personas que abrieron el anuncio'],
      ['CTR', 'ctr', fmtPct, 'clics ÷ impresiones'],
      ['Conversiones', 'conversions', fmtNum, 'matrículas atribuidas']
    ];
    items.forEach(([label, key, fmt, hint]) => {
      box.appendChild(el('div', { class: 'kpi' }, [
        el('span', { class: 'kpi__label', text: label }),
        el('span', { class: 'kpi__value', 'data-kpi': key, 'data-fmt': key, text: fmt(0) }),
        el('span', { class: 'kpi__hint', text: hint })
      ]));
    });
  }
  const KPI_FMT = { budget: fmtCOP, leads: fmtNum, cpl: fmtCOP, clicks: fmtNum, ctr: fmtPct, conversions: fmtNum };

  function renderTable(fill) {
    const tb = $('#cmpTable tbody');
    tb.innerHTML = '';
    const cell = (v, best) => el('td', { class: best ? 'is-best' : '', text: v });
    PLATFORMS.forEach((p) => {
      const d = p.d;
      const tr = el('tr', {}, [
        el('td', { html: `<span style="background:${p.color}"></span>${p.name}` }),
        cell(fill ? fmtCOP(d.budget) : '—'),
        cell(fill ? fmtNum(d.reach) : '—', fill && p === BEST.reach),
        cell(fill ? fmtNum(d.impressions) : '—'),
        cell(fill ? fmtNum(d.clicks) : '—'),
        cell(fill ? fmtPct(d.ctr) : '—'),
        cell(fill ? fmtNum(d.leads) : '—', fill && p === BEST.leads),
        cell(fill ? fmtCOP(d.cpl) : '—', fill && p === BEST.cpl),
        cell(fill ? fmtNum(d.conversions) : '—'),
        cell(fill ? fmtCOP(d.cpa) : '—')
      ]);
      tb.appendChild(tr);
    });
    tb.appendChild(el('tr', { class: 'is-total' }, [
      el('td', { text: 'Total' }),
      cell(fill ? fmtCOP(TOTAL.budget) : '—'), cell(fill ? fmtNum(TOTAL.reach) : '—'), cell(fill ? fmtNum(TOTAL.impressions) : '—'),
      cell(fill ? fmtNum(TOTAL.clicks) : '—'), cell(fill ? fmtPct(TOTAL.ctr) : '—'), cell(fill ? fmtNum(TOTAL.leads) : '—'),
      cell(fill ? fmtCOP(TOTAL.cpl) : '—'), cell(fill ? fmtNum(TOTAL.conversions) : '—'), cell(fill ? fmtCOP(TOTAL.cpa) : '—')
    ]));
  }

  function renderInsights(ul, animated) {
    ul.innerHTML = '';
    if (animated) return;
    INSIGHTS.forEach((t) => ul.appendChild(el('li', { html: `${icon('spark')}<span>${t}</span>` })));
  }

  /* =================================================================
     2. ESTADOS (agentes, plataformas, nodos del diagrama)
     ================================================================= */
  function setAgent(id, state) {
    $$(`[data-agent-badge="${id}"]`).forEach((b) => { b.dataset.state = state; b.textContent = CFG.agentStates[state]; });
    $$(`[data-agent-card="${id}"], [data-agent-leaf="${id}"]`).forEach((n) => (n.dataset.state = state));
  }
  function setAgentMeta(id, text) { $$(`[data-agent-meta="${id}"]`).forEach((n) => (n.textContent = text)); }
  function setPlatform(id, state) {
    $$(`[data-platform-badge="${id}"]`).forEach((b) => { b.dataset.state = state; b.textContent = CFG.platformStates[state]; });
  }
  function setPlatformMeta(id, text) { $$(`[data-platform-meta="${id}"]`).forEach((n) => (n.textContent = text)); }
  function setCycle(id, index, mode) {
    $$(`[data-cycle="${id}"] .cycle__item`).forEach((li, i) => {
      li.classList.toggle('is-on', mode !== 'clear' && i === index);
      li.classList.toggle('is-done', mode === 'progress' && i < index);
    });
  }
  function setMockStatus(id, text, active) {
    $$(`[data-mock-status="${id}"]`).forEach((n) => { n.textContent = 'Estado: ' + text; n.classList.toggle('is-active', !!active); });
  }
  function setMockValues(p, zero) {
    const map = { budget: fmtCOP, impressions: fmtNum, clicks: fmtNum, ctr: fmtPct, leads: fmtNum, cpl: fmtCOP };
    Object.entries(map).forEach(([k, f]) => $$(`[data-mock="${p.id}:${k}"]`).forEach((n) => (n.textContent = zero ? f(0) : f(p.d[k]))));
  }
  function setOrch(on) { const n = $('#orchNode'); if (n) n.classList.toggle('is-on', on); }
  function setLive(on) { $$('[data-live]').forEach((d) => d.classList.toggle('is-on', on)); }
  function setHeroStage(text) { $('#heroStage').textContent = text; }
  function setStatus(text, cls) {
    const s = $('#demoStatus');
    s.textContent = text; s.className = 'demo-controls__status' + (cls ? ' ' + cls : '');
  }
  function setStage(id) {
    $$('#stageList li').forEach((li) => {
      const n = Number(li.dataset.stage);
      li.classList.toggle('is-active', n === id);
      li.classList.toggle('is-done', n < id);
    });
    const st = CFG.stages.find((s) => s.id === id);
    if (st) setHeroStage(st.label);
  }
  function completeStages() { $$('#stageList li').forEach((li) => { li.classList.remove('is-active'); li.classList.add('is-done'); }); }
  function setPubCheck(id, ok) { $$(`[data-pub-check="${id}"]`).forEach((n) => { n.classList.toggle('is-ok', ok); n.textContent = id.toUpperCase() + (ok ? ' ✓' : ''); }); }

  /* =================================================================
     3. DIAGRAMA DE FLUJO (SVG)
     ================================================================= */
  const flow = { svg: null, nodes: {}, edges: {}, W: 0, dots: new Set() };

  function buildFlow() {
    const wrap = $('#flowWrap');
    const cw = wrap.clientWidth || 760;
    const W = cw < 560 ? 360 : 760;
    if (flow.W === W && flow.svg) return;
    flow.W = W;
    wrap.innerHTML = '';
    flow.nodes = {}; flow.edges = {};

    const H = 50, NW = W < 500 ? 210 : 230, BW = W < 500 ? 230 : 260;
    const cx = W / 2;
    const PW = Math.min(200, Math.floor((W - 12) / PLATFORMS.length) - 6);
    const rowY = { sl: 8, obj: 92, orq: 176, plat: 286, res: 396, ana: 480, opt: 564, rec: 648, sl2: 732 };
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${rowY.sl2 + H + 8}`, class: W < 500 ? 'flow--compact' : '', role: 'img', 'aria-label': 'Diagrama del flujo: Smartline, objetivo, orquestador, plataformas, resultados, analítica, optimización, recomendación, Smartline' });

    const edgesG = svgEl('g'); const nodesG = svgEl('g'); const dotsG = svgEl('g');
    svg.appendChild(edgesG); svg.appendChild(nodesG); svg.appendChild(dotsG);

    function node(id, label, status, x, y, w, cls) {
      const g = svgEl('g', { class: 'fnode ' + (cls || ''), 'data-node': id, 'data-state': 'idle' });
      const rx = x - w / 2;
      const pulse = svgEl('rect', { class: 'fnode__pulse', x: rx, y, width: w, height: H, rx: 10, style: `transform-origin:${x}px ${y + H / 2}px` });
      const rect = svgEl('rect', { x: rx, y, width: w, height: H, rx: 10 });
      const t = svgEl('text', { x, y: y + 21, 'text-anchor': 'middle' }); t.textContent = label;
      const s = svgEl('text', { class: 'fnode__status', x, y: y + 38, 'text-anchor': 'middle' }); s.textContent = status;
      g.appendChild(pulse); g.appendChild(rect); g.appendChild(t); g.appendChild(s);
      nodesG.appendChild(g);
      flow.nodes[id] = { g, status: s, x, y, w, top: [x, y], bottom: [x, y + H] };
      return flow.nodes[id];
    }
    function edge(id, d, cls) {
      const p = svgEl('path', { class: 'fedge ' + (cls || ''), d, 'data-edge': id });
      edgesG.appendChild(p); flow.edges[id] = p; return p;
    }

    node('sl', 'SMARTLINE', 'Define el objetivo', cx, rowY.sl, BW, 'fnode--brand');
    node('obj', 'Objetivo comercial', 'En espera', cx, rowY.obj, NW);
    node('orq', 'Orquestador IA', 'En espera', cx, rowY.orq, NW);
    PLATFORMS.forEach((p, i) => {
      const x = (W / PLATFORMS.length) * (i + 0.5);
      node(p.id, p.name, CFG.platformStates.idle, x, rowY.plat, PW, 'fnode--platform');
    });
    node('res', 'Resultados', 'En espera', cx, rowY.res, NW);
    node('ana', 'Analítica IA', 'En espera', cx, rowY.ana, NW);
    node('opt', 'Optimización IA', 'En espera', cx, rowY.opt, NW);
    node('rec', 'Recomendación', 'En espera', cx, rowY.rec, NW);
    node('sl2', 'SMARTLINE', 'Recibe la recomendación', cx, rowY.sl2, BW, 'fnode--brand');

    const vline = (a, b) => `M${a[0]},${a[1]} L${b[0]},${b[1]}`;
    const N = flow.nodes;
    edge('e1', vline(N.sl.bottom, N.obj.top));
    edge('e2', vline(N.obj.bottom, N.orq.top));
    const busDown = N.orq.bottom[1] + 30;
    PLATFORMS.forEach((p) => {
      const n = N[p.id];
      edge('out:' + p.id, `M${N.orq.bottom[0]},${N.orq.bottom[1]} L${N.orq.bottom[0]},${busDown} L${n.x},${busDown} L${n.x},${n.y}`);
    });
    const busUp = N.res.top[1] - 30;
    PLATFORMS.forEach((p) => {
      const n = N[p.id];
      edge('in:' + p.id, `M${n.x},${n.y + H} L${n.x},${busUp} L${N.res.x},${busUp} L${N.res.x},${N.res.y}`);
    });
    edge('e5', vline(N.res.bottom, N.ana.top));
    edge('e6', vline(N.ana.bottom, N.opt.top));
    edge('e7', vline(N.opt.bottom, N.rec.top));
    edge('e8', vline(N.rec.bottom, N.sl2.top));

    flow.svg = svg; flow.dotsG = dotsG;
    wrap.appendChild(svg);
    restoreFlowState();
  }

  const flowState = {}; // id -> {state, status}
  function setNode(id, state, status) {
    flowState[id] = { state, status };
    const n = flow.nodes[id];
    if (!n) return;
    n.g.dataset.state = state;
    if (status !== undefined) n.status.textContent = status;
  }
  function setEdge(id, cls) {
    flowState['edge:' + id] = cls;
    const e = flow.edges[id];
    if (!e) return;
    e.classList.remove('is-on', 'is-done');
    if (cls) e.classList.add(cls);
  }
  function restoreFlowState() {
    Object.entries(flowState).forEach(([k, v]) => {
      if (k.startsWith('edge:')) setEdge(k.slice(5), v); else setNode(k, v.state, v.status);
    });
  }
  function clearFlow() {
    Object.keys(flowState).forEach((k) => delete flowState[k]);
    Object.keys(flow.nodes).forEach((id) => {
      const base = { sl: 'Define el objetivo', sl2: 'Recibe la recomendación' };
      const p = PLATFORMS.find((x) => x.id === id);
      setNode(id, 'idle', p ? CFG.platformStates.idle : (base[id] || 'En espera'));
    });
    Object.keys(flow.edges).forEach((id) => setEdge(id, ''));
    flow.dots.forEach((d) => d.cancel());
  }

  /* Puntos de datos que viajan por una línea. Devuelve una promesa que se
     resuelve cuando el último punto llega al final. */
  function travel(edgeId, opts) {
    const o = Object.assign({ n: 3, dur: 700, gap: 180, r: 5, cls: '' }, opts || {});
    const path = flow.edges[edgeId];
    if (!path) return sleep(o.dur + o.gap * (o.n - 1));
    const len = path.getTotalLength();
    return new Promise((resolve) => {
      let finished = 0, cancelled = false;
      const handle = { cancel() { cancelled = true; } };
      flow.dots.add(handle);
      const done = () => { flow.dots.delete(handle); resolve(); };
      if (reduceMotion) { setTimeout(done, 50); return; }
      for (let i = 0; i < o.n; i++) {
        const c = svgEl('circle', { class: 'fdot ' + o.cls, r: o.r, cx: -20, cy: -20 });
        flow.dotsG.appendChild(c);
        const start = performance.now() + i * o.gap;
        const step = (now) => {
          if (cancelled) { c.remove(); return; }
          const t = (now - start) / o.dur;
          if (t < 0) { requestAnimationFrame(step); return; }
          const pt = path.getPointAtLength(Math.min(1, t) * len);
          c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
          if (t < 1) requestAnimationFrame(step);
          else { c.remove(); if (++finished === o.n) done(); }
        };
        requestAnimationFrame(step);
      }
    });
  }

  /* =================================================================
     4. GRÁFICOS DEL DASHBOARD (SVG, sin librerías)
     ================================================================= */
  const tip = el('div', { class: 'chart-tip' });
  document.body.appendChild(tip);
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.classList.add('is-on');
    const pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
    let left = x + pad, top = y + pad;
    if (left + w > window.innerWidth - 8) left = x - w - pad;
    if (top + h > window.innerHeight - 8) top = y - h - pad;
    tip.style.left = left + 'px'; tip.style.top = top + 'px';
  }
  function hideTip() { tip.classList.remove('is-on'); }

  function barChart(card, opts) {
    const box = $('.chart', card);
    box.innerHTML = '';
    const W = Math.max(200, box.clientWidth), H = 190;
    const padL = 8, padR = 8, padT = 26, padB = 26;
    const items = opts.items;
    const max = Math.max(...items.map((i) => i.value)) * 1.12;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const slot = plotW / items.length, bw = Math.min(64, slot * 0.55);
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H });
    const grid = svgEl('g', { class: 'grid' });
    [0, .5, 1].forEach((f) => {
      const y = padT + plotH - plotH * f;
      grid.appendChild(svgEl('line', { x1: padL, x2: W - padR, y1: y, y2: y }));
    });
    svg.appendChild(grid);
    const axis = svgEl('g', { class: 'axis' });
    items.forEach((it, i) => {
      const x = padL + slot * i + slot / 2;
      const h = (it.value / max) * plotH;
      const y = padT + plotH - h;
      const r = 4;
      const d = `M${x - bw / 2},${padT + plotH} V${y + r} a${r},${r} 0 0 1 ${r},-${r} H${x + bw / 2 - r} a${r},${r} 0 0 1 ${r},${r} V${padT + plotH} Z`;
      const bar = svgEl('path', { class: 'bar-rect', d, fill: it.color, style: `transform-origin:${x}px ${padT + plotH}px; transform: scale(1, ${opts.animate ? 0.001 : 1})` });
      svg.appendChild(bar);
      const lbl = svgEl('text', { class: 'bar-label', x, y: y - 7, 'text-anchor': 'middle' });
      lbl.textContent = opts.format(it.value);
      svg.appendChild(lbl);
      const cat = svgEl('text', { x, y: H - 8, 'text-anchor': 'middle' }); cat.textContent = it.label; axis.appendChild(cat);
      const hit = svgEl('rect', { class: 'hit', x: padL + slot * i, y: padT, width: slot, height: plotH });
      hit.addEventListener('mousemove', (e) => showTip(`<b>${it.label}</b>${opts.title}: ${opts.format(it.value)}<br><small>Datos simulados</small>`, e.clientX, e.clientY));
      hit.addEventListener('mouseleave', hideTip);
      svg.appendChild(hit);
      if (opts.animate) requestAnimationFrame(() => requestAnimationFrame(() => (bar.style.transform = 'scale(1,1)')));
    });
    svg.appendChild(axis);
    box.appendChild(svg);
  }

  function lineChart(card, opts) {
    const box = $('.chart', card);
    box.innerHTML = '';
    const W = Math.max(280, box.clientWidth), H = 220;
    const padL = 28, padR = 70, padT = 14, padB = 28;
    const labels = opts.labels, series = opts.series;
    const n = labels.length;
    const max = Math.max(...series.flatMap((s) => s.values)) * 1.15;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const X = (i) => padL + (plotW * i) / (n - 1);
    const Y = (v) => padT + plotH - (v / max) * plotH;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H });
    const grid = svgEl('g', { class: 'grid' });
    const axis = svgEl('g', { class: 'axis' });
    [0, .5, 1].forEach((f) => {
      const y = padT + plotH - plotH * f;
      grid.appendChild(svgEl('line', { x1: padL, x2: W - padR, y1: y, y2: y }));
      const t = svgEl('text', { x: padL - 6, y: y + 4, 'text-anchor': 'end' }); t.textContent = Math.round(max * f); axis.appendChild(t);
    });
    const every = W < 480 ? 3 : (W < 700 ? 2 : 1);
    labels.forEach((l, i) => {
      const isLast = i === n - 1;
      if (!isLast && (i % every !== 0 || n - 1 - i < every)) return;
      const t = svgEl('text', { x: X(i), y: H - 8, 'text-anchor': 'middle' }); t.textContent = l; axis.appendChild(t);
    });
    svg.appendChild(grid); svg.appendChild(axis);
    const hover = svgEl('line', { class: 'hover-line', y1: padT, y2: padT + plotH, x1: 0, x2: 0 });
    svg.appendChild(hover);
    const dotsBySeries = [];
    series.forEach((s) => {
      const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${X(i)},${Y(v)}`).join(' ');
      const path = svgEl('path', { class: 'series-line', d, stroke: s.color });
      svg.appendChild(path);
      if (opts.animate && !reduceMotion) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1)';
        requestAnimationFrame(() => requestAnimationFrame(() => (path.style.strokeDashoffset = 0)));
      }
      const end = svgEl('text', { class: 'bar-label', x: X(n - 1) + 8, y: Y(s.values[n - 1]) + 4 }); end.textContent = s.name; svg.appendChild(end);
      const dots = s.values.map((v, i) => {
        const c = svgEl('circle', { class: 'series-dot', cx: X(i), cy: Y(v), r: 4, fill: s.color, style: 'opacity:0; transition: opacity .15s' });
        svg.appendChild(c); return c;
      });
      dotsBySeries.push(dots);
    });
    const hit = svgEl('rect', { class: 'hit', x: padL, y: padT, width: plotW, height: plotH });
    hit.addEventListener('mousemove', (e) => {
      const r = svg.getBoundingClientRect();
      const sx = (e.clientX - r.left) * (W / r.width);
      const i = Math.max(0, Math.min(n - 1, Math.round(((sx - padL) / plotW) * (n - 1))));
      hover.setAttribute('x1', X(i)); hover.setAttribute('x2', X(i)); hover.style.opacity = 1;
      dotsBySeries.forEach((dots) => dots.forEach((c, j) => (c.style.opacity = j === i ? 1 : 0)));
      const rows = series.map((s) => `<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${s.color};margin-right:6px"></span>${s.name}: ${s.values[i]} prospectos`).join('<br>');
      showTip(`<b>Día ${i + 1}</b>${rows}<br><small>Datos simulados</small>`, e.clientX, e.clientY);
    });
    hit.addEventListener('mouseleave', () => { hover.style.opacity = 0; dotsBySeries.forEach((d) => d.forEach((c) => (c.style.opacity = 0))); hideTip(); });
    svg.appendChild(hit);
    box.appendChild(svg);
    let legend = $('.chart-legend', card);
    if (!legend) { legend = el('div', { class: 'chart-legend' }); card.appendChild(legend); }
    legend.innerHTML = series.map((s) => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join('') + '<span class="tag tag--muted">Datos simulados</span>';
  }

  function buildCharts(animate) {
    const P = PLATFORMS;
    barChart($('#chartBudget'), { title: 'Inversión', format: fmtCOP, animate, items: P.map((p) => ({ label: p.short, value: p.d.budget, color: p.color })) });
    barChart($('#chartLeads'), { title: 'Prospectos', format: fmtNum, animate, items: P.map((p) => ({ label: p.short, value: p.d.leads, color: p.color })) });
    barChart($('#chartCpl'), { title: 'Coste por prospecto', format: fmtCOP, animate, items: P.map((p) => ({ label: p.short, value: p.d.cpl, color: p.color })) });
    barChart($('#chartConv'), { title: 'Conversiones', format: fmtNum, animate, items: P.map((p) => ({ label: p.short, value: p.d.conversions, color: p.color })) });
    lineChart($('#chartTrend'), { labels: CFG.days, animate, series: P.map((p) => ({ name: p.short, color: p.color, values: p.daily })) });
  }

  /* =================================================================
     5. DASHBOARD
     ================================================================= */
  let dashboardFilled = false;
  function fillDashboard(animate) {
    dashboardFilled = true;
    const dash = $('#dashboard');
    $('#dashEmpty').hidden = true;
    dash.classList.remove('is-empty');
    $$('[data-kpi]').forEach((n) => countTo(n, TOTAL[n.dataset.kpi], animate ? 1200 : 0, KPI_FMT[n.dataset.kpi]));
    buildCharts(animate);
    renderTable(true);
    renderInsights($('#dashInsights'), false);
    $('#dashRecommendation').textContent = RECOMMENDATION;
  }
  function emptyDashboard() {
    dashboardFilled = false;
    const dash = $('#dashboard');
    $('#dashEmpty').hidden = false;
    dash.classList.add('is-empty');
    $$('[data-kpi]').forEach((n) => (n.textContent = KPI_FMT[n.dataset.kpi](0)));
    buildCharts(false); // gráficos con datos (desenfocados) para que el panel no quede vacío
    renderTable(false);
    renderInsights($('#dashInsights'), false);
    $('#dashRecommendation').textContent = 'Ejecuta la demostración para ver la recomendación.';
  }

  /* =================================================================
     6. SECUENCIA DE LA DEMOSTRACIÓN
     ================================================================= */
  const demo = { running: false, token: 0, idleTimer: null };
  const dur = (id) => CFG.stages.find((s) => s.id === id).duration;

  function resetAll() {
    demo.token++;
    demo.running = false;
    CFG.agents.forEach((a) => { setAgent(a.id, 'waiting'); setAgentMeta(a.id, ''); });
    PLATFORMS.forEach((p) => { setPlatform(p.id, 'idle'); setPlatformMeta(p.id, ''); setCycle(p.id, -1, 'clear'); setMockStatus(p.id, 'Publicado', true); setMockValues(p, false); setPubCheck(p.id, false); });
    setOrch(false); setLive(false);
    setStage(0); setHeroStage('En espera del objetivo comercial');
    setStatus('Listo para ejecutar', '');
    $('#demoOutput').hidden = true;
    renderInsights($('#demoInsights'), true);
    clearFlow();
    emptyDashboard();
    $('#btnRun').disabled = false;
    startIdleCycle();
  }

  /* En reposo, las tarjetas de plataforma muestran el ciclo en bucle. */
  function startIdleCycle() {
    stopIdleCycle();
    if (reduceMotion) return;
    let i = 0;
    demo.idleTimer = setInterval(() => {
      PLATFORMS.forEach((p) => setCycle(p.id, i % 6, 'idle'));
      i++;
    }, 750);
  }
  function stopIdleCycle() { if (demo.idleTimer) { clearInterval(demo.idleTimer); demo.idleTimer = null; } }

  async function runDemo() {
    if (demo.running) return;
    resetAll();
    stopIdleCycle();
    demo.running = true;
    const token = demo.token;
    const alive = () => demo.token === token;
    const wait = async (ms) => { await sleep(ms); if (!alive()) throw new Error('cancelled'); };
    $('#btnRun').disabled = true;
    setLive(true); setOrch(true);
    setStatus('Ejecutando demostración…', 'is-running');

    try {
      /* ETAPA 1 · Analizando objetivo */
      setStage(1);
      setNode('sl', 'active', 'Enviando objetivo'); setEdge('e1', 'is-on');
      await travel('e1', { n: 2, dur: 450, gap: 150 }); if (!alive()) return;
      setNode('sl', 'done', 'Objetivo enviado'); setEdge('e1', 'is-done');
      setNode('obj', 'active', 'Promocionar cursos'); setEdge('e2', 'is-on');
      await travel('e2', { n: 2, dur: 450, gap: 150 }); if (!alive()) return;
      setNode('obj', 'done', 'Recibido'); setEdge('e2', 'is-done');
      setNode('orq', 'active', 'Analizando objetivo');
      setAgent('estrategia', 'processing'); setAgentMeta('estrategia', 'Definiendo público y campaña');
      await wait(dur(1) - 1000);
      setAgent('estrategia', 'done'); setAgentMeta('estrategia', 'Público y campaña definidos');

      /* ETAPA 2 · Preparando campaña */
      setStage(2);
      setNode('orq', 'active', 'Preparando campaña');
      setAgent('contenido', 'processing'); setAgentMeta('contenido', 'Redactando anuncio');
      await wait(dur(2));
      setAgent('contenido', 'done'); setAgentMeta('contenido', 'Anuncio propuesto');

      /* ETAPA 3 · Contenido aprobado */
      setStage(3);
      setNode('orq', 'active', 'Contenido aprobado');
      await wait(dur(3));

      /* ETAPA 4 · Distribuyendo campaña */
      setStage(4);
      setNode('orq', 'active', 'Distribuyendo campaña');
      setAgent('distribucion', 'processing'); setAgentMeta('distribucion', 'Enviando a 3 plataformas');
      PLATFORMS.forEach((p) => { setMockValues(p, true); setMockStatus(p.id, 'En borrador', false); });
      const dist = PLATFORMS.map(async (p, i) => {
        await wait(i * 220);
        setPlatform(p.id, 'connecting'); setNode(p.id, 'active', 'Conectando'); setCycle(p.id, 0, 'progress');
        await wait(420);
        setPlatform(p.id, 'connected'); setNode(p.id, 'active', 'Conectado'); setCycle(p.id, 1, 'progress');
        await wait(260);
        setPlatform(p.id, 'publishing'); setNode(p.id, 'active', 'Publicando'); setEdge('out:' + p.id, 'is-on'); setCycle(p.id, 2, 'progress');
        setMockStatus(p.id, 'En revisión', false);
        await travel('out:' + p.id, { n: 3, dur: 650, gap: 160 }); if (!alive()) return;
        setPlatform(p.id, 'published'); setNode(p.id, 'done', 'Publicado'); setEdge('out:' + p.id, 'is-done'); setCycle(p.id, 3, 'progress');
        setMockStatus(p.id, 'Publicado', true); setPubCheck(p.id, true);
        setMockValues(p, true);
        $$(`[data-mock="${p.id}:budget"]`).forEach((n) => (n.textContent = fmtCOP(p.d.budget)));
      });
      await Promise.all(dist); if (!alive()) return;
      await wait(Math.max(0, dur(4) - 2100));
      setAgent('distribucion', 'done'); setAgentMeta('distribucion', 'Publicado en 3 plataformas');
      setNode('orq', 'done', 'Campaña distribuida');

      /* ETAPA 5 · Recibiendo resultados */
      setStage(5);
      setNode('res', 'active', 'Recibiendo datos');
      const recv = PLATFORMS.map(async (p, i) => {
        await wait(i * 180);
        setPlatform(p.id, 'receiving'); setNode(p.id, 'active', 'Recibiendo datos'); setEdge('in:' + p.id, 'is-on'); setCycle(p.id, 4, 'progress');
        const t = dur(5) - 900;
        const counters = [
          ['impressions', fmtNum], ['clicks', fmtNum], ['ctr', fmtPct], ['leads', fmtNum], ['cpl', fmtCOP]
        ].map(([k, f]) => Promise.all($$(`[data-mock="${p.id}:${k}"]`).map((n) => countTo(n, p.d[k], t, f))));
        const metaNode = $$(`[data-platform-meta="${p.id}"]`);
        counters.push(Promise.all(metaNode.map((n) => countTo(n, p.d.leads, t, (v) => fmtNum(v) + ' prospectos'))));
        await Promise.all([travel('in:' + p.id, { n: 5, dur: 700, gap: 260 }), ...counters]); if (!alive()) return;
        setPlatform(p.id, 'done'); setNode(p.id, 'done', 'Datos recibidos'); setEdge('in:' + p.id, 'is-done'); setCycle(p.id, 5, 'progress');
      });
      await Promise.all(recv); if (!alive()) return;
      setNode('res', 'done', `${fmtNum(TOTAL.leads)} prospectos`);

      /* ETAPA 6 · Analizando rendimiento */
      setStage(6);
      setAgent('analitica', 'processing'); setAgentMeta('analitica', 'Comparando plataformas');
      setEdge('e5', 'is-on');
      await travel('e5', { n: 3, dur: 450, gap: 150 }); if (!alive()) return;
      setEdge('e5', 'is-done'); setNode('ana', 'active', 'Analizando');
      await wait(dur(6) - 750);
      setAgent('analitica', 'done'); setAgentMeta('analitica', 'Métricas consolidadas');
      setNode('ana', 'done', 'Análisis completo');

      /* ETAPA 7 · Generando recomendación */
      setStage(7);
      setAgent('optimizacion', 'processing'); setAgentMeta('optimizacion', 'Buscando oportunidades');
      setEdge('e6', 'is-on');
      await travel('e6', { n: 3, dur: 450, gap: 150 }); if (!alive()) return;
      setEdge('e6', 'is-done'); setNode('opt', 'active', 'Optimizando');
      const out = $('#demoOutput'); out.hidden = false;
      const ul = $('#demoInsights'); ul.innerHTML = '';
      for (const t of INSIGHTS) {
        ul.appendChild(el('li', { class: 'is-new', html: `${icon('spark')}<span>${t}</span>` }));
        await wait(320);
      }
      $('#demoRecommendation').textContent = RECOMMENDATION;
      setEdge('e7', 'is-on');
      await travel('e7', { n: 3, dur: 450, gap: 150 }); if (!alive()) return;
      setEdge('e7', 'is-done'); setNode('opt', 'done', 'Optimización recomendada'); setNode('rec', 'active', 'Generada');
      await wait(Math.max(0, dur(7) - 750 - 320 * INSIGHTS.length - 450));
      setAgent('optimizacion', 'done'); setAgentMeta('optimizacion', 'Recomendación lista');

      /* ETAPA 8 · Campaña procesada */
      setStage(8);
      setNode('rec', 'done', 'Redistribuir presupuesto'); setEdge('e8', 'is-on');
      await travel('e8', { n: 3, dur: 500, gap: 160, cls: 'fdot--return' }); if (!alive()) return;
      setEdge('e8', 'is-done'); setNode('sl2', 'done', 'Recomendación recibida');
      setOrch(false);
      completeStages();
      setStatus('Campaña procesada · resultados disponibles', 'is-done');
      setHeroStage('Campaña procesada');
      fillDashboard(true);
      await wait(dur(8));
      $('#resultados').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    } catch (e) {
      if (e.message !== 'cancelled') console.error(e);
      return;
    } finally {
      if (alive()) { demo.running = false; $('#btnRun').disabled = false; setLive(false); }
    }
  }

  /* =================================================================
     7. "CÓMO FUNCIONA" — STEPPER
     ================================================================= */
  function initStepper() {
    const steps = $$('#stepperPanels .step');
    const nav = $('#stepperNav');
    let current = 0;
    steps.forEach((s, i) => {
      const li = el('li');
      const b = el('button', { type: 'button', html: `<i>${i + 1}</i><b>${$('h3', s).textContent}</b>` });
      b.addEventListener('click', () => go(i));
      li.appendChild(b); nav.appendChild(li);
    });
    const buttons = $$('button', nav);
    function go(i) {
      current = (i + steps.length) % steps.length;
      steps.forEach((s, j) => s.classList.toggle('is-active', j === current));
      buttons.forEach((b, j) => b.classList.toggle('is-active', j === current));
      $('#stepCounter').textContent = `Paso ${current + 1} de ${steps.length}`;
    }
    $('#stepPrev').addEventListener('click', () => go(current - 1));
    $('#stepNext').addEventListener('click', () => go(current + 1));
    $('#stepper').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(current + 1);
      if (e.key === 'ArrowLeft') go(current - 1);
    });
    go(0);
  }

  /* =================================================================
     8. NAVEGACIÓN
     ================================================================= */
  function initNav() {
    const toggle = $('#navToggle'), links = $('#navLinks');
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', links).forEach((a) => a.addEventListener('click', () => { links.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }));

    const map = {};
    $$('a', links).forEach((a) => (map[a.getAttribute('href').slice(1)] = a));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$('a', links).forEach((a) => a.classList.remove('is-active'));
        const a = map[en.target.id]; if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach((id) => { const s = document.getElementById(id); if (s) obs.observe(s); });
  }

  /* =================================================================
     9. ARRANQUE
     ================================================================= */
  function init() {
    renderAgentList($('#heroAgentList'), false);
    renderAgentList($('#demoAgentList'), true);
    renderPlatformList($('#demoPlatformList'));
    renderOrchestra();
    renderAgentGrid();
    renderPlatforms();
    renderStages();
    renderKpis();
    buildFlow();
    initStepper();
    initNav();
    resetAll();

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      if (btn.dataset.action === 'run') {
        $('#demostracion').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        runDemo();
      } else if (btn.dataset.action === 'reset') {
        resetAll();
      }
    });

    let rt = null;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { buildFlow(); buildCharts(false); }, 180);
    });
    window.addEventListener('scroll', hideTip, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
