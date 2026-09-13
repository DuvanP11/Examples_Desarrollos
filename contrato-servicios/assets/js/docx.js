/* =====================================================================
   Generador de Word (.docx) a partir del documento en pantalla.
   Escribe WordprocessingML directamente y lo empaqueta con JSZip.
   window.buildDocx(docElement, { title, headerText, signatures }) → Blob
   ===================================================================== */
(function () {
  'use strict';

  const FONT = 'Arial';
  const SZ = 21;          // 10.5 pt (medias unidades de punto)
  const CONTENT_W = 9360; // 6,5 in en dxa (Carta 8,5 in − márgenes de 1 in)

  const x = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- runs ---------------------------------------------- */
  function run(text, o) {
    o = o || {};
    if (text === '' || text === undefined) return '';
    const pr = [
      `<w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}"/>`,
      o.b ? '<w:b/><w:bCs/>' : '',
      o.i ? '<w:i/><w:iCs/>' : '',
      o.color ? `<w:color w:val="${o.color}"/>` : '',
      `<w:sz w:val="${o.sz || SZ}"/><w:szCs w:val="${o.sz || SZ}"/>`
    ].join('');
    return `<w:r><w:rPr>${pr}</w:rPr><w:t xml:space="preserve">${x(text)}</w:t></w:r>`;
  }
  const br = () => '<w:r><w:br/></w:r>';

  /* Convierte los nodos en línea de un elemento en runs. */
  function runsOf(node, o) {
    o = o || {};
    let out = '';
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) { out += run(n.nodeValue.replace(/\s+/g, ' '), o); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (n.classList.contains('no-print')) return;
      if (tag === 'BR') { out += br(); return; }
      if (n.classList.contains('f')) {
        const txt = n.textContent.replace(/\s+/g, ' ').trim();
        out += txt ? run(txt, o) : run(n.dataset.out || '[●]', Object.assign({}, o, { b: true }));
        return;
      }
      if (tag === 'STRONG' || tag === 'B') { out += runsOf(n, Object.assign({}, o, { b: true })); return; }
      if (tag === 'EM' || tag === 'I') { out += runsOf(n, Object.assign({}, o, { i: true })); return; }
      out += runsOf(n, o);
    });
    return out;
  }

  /* ---------- párrafos ------------------------------------------ */
  function para(inner, p) {
    p = p || {};
    const pr = [
      p.style ? `<w:pStyle w:val="${p.style}"/>` : '',
      p.keepNext ? '<w:keepNext/>' : '',
      p.keepLines ? '<w:keepLines/>' : '',
      p.pageBreakBefore ? '<w:pageBreakBefore/>' : '',
      p.numId ? `<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${p.numId}"/></w:numPr>` : '',
      p.border ? '<w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="9AA6B5"/><w:left w:val="single" w:sz="4" w:space="4" w:color="9AA6B5"/><w:bottom w:val="single" w:sz="4" w:space="4" w:color="9AA6B5"/><w:right w:val="single" w:sz="4" w:space="4" w:color="9AA6B5"/></w:pBdr>' : '',
      p.shade ? `<w:shd w:val="clear" w:color="auto" w:fill="${p.shade}"/>` : '',
      `<w:spacing w:before="${p.before || 0}" w:after="${p.after === undefined ? 120 : p.after}" w:line="${p.line || 264}" w:lineRule="auto"/>`,
      p.ind ? `<w:ind w:left="${p.ind}"/>` : '',
      `<w:jc w:val="${p.jc || 'both'}"/>`
    ].join('');
    return `<w:p><w:pPr>${pr}</w:pPr>${inner}</w:p>`;
  }

  /* ---------- tablas -------------------------------------------- */
  function cell(inner, o) {
    o = o || {};
    const pr = [
      `<w:tcW w:w="${o.w}" w:type="dxa"/>`,
      o.span ? `<w:gridSpan w:val="${o.span}"/>` : '',
      o.noBorders ? '<w:tcBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/></w:tcBorders>' : '',
      o.shade ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.shade}"/>` : '',
      '<w:tcMar><w:top w:w="60" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tcMar>',
      '<w:vAlign w:val="top"/>'
    ].join('');
    return `<w:tc><w:tcPr>${pr}</w:tcPr>${inner || para('')}</w:tc>`;
  }
  function table(rowsXml, widths, o) {
    o = o || {};
    const borders = o.noBorders
      ? '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'
      : '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="9AA6B5"/><w:left w:val="single" w:sz="4" w:color="9AA6B5"/><w:bottom w:val="single" w:sz="4" w:color="9AA6B5"/><w:right w:val="single" w:sz="4" w:color="9AA6B5"/><w:insideH w:val="single" w:sz="4" w:color="9AA6B5"/><w:insideV w:val="single" w:sz="4" w:color="9AA6B5"/></w:tblBorders>';
    return `<w:tbl><w:tblPr><w:tblW w:w="${CONTENT_W}" w:type="dxa"/>${borders}<w:tblLayout w:type="fixed"/><w:tblLook w:val="04A0"/></w:tblPr>`
      + `<w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${rowsXml}</w:tbl>`
      + para('', { after: 120 });
  }
  function row(cellsXml, o) {
    o = o || {};
    return `<w:tr><w:trPr><w:cantSplit/>${o.header ? '<w:tblHeader/>' : ''}</w:trPr>${cellsXml}</w:tr>`;
  }

  /* Anchos de columna según la clase de la tabla (proporciones de la página). */
  function columnWidths(tbl, n) {
    const cls = tbl.className || '';
    let pct;
    if (cls.includes('datos')) pct = n === 2 ? [38, 62] : [16, 28, 30, 26];
    else if (cls.includes('entregables')) pct = [6, 22, 30, 16, 26];
    else if (cls.includes('pagos')) pct = [28, 18, 34, 20];
    else if (cls.includes('opciones')) pct = [8, 27, 65];
    else if (cls.includes('anexos')) pct = [28, 52, 20];
    else pct = Array(n).fill(100 / n);
    return pct.map((p) => Math.round((CONTENT_W * p) / 100));
  }

  function tableFromDom(tbl) {
    const trs = Array.from(tbl.querySelectorAll('tr'));
    if (!trs.length) return '';
    const n = Math.max(...trs.map((tr) => tr.children.length));
    const widths = columnWidths(tbl, n);
    const isDatos = (tbl.className || '').includes('datos') && n === 2;
    const rows = trs.map((tr) => {
      const isHead = tr.parentElement.tagName === 'THEAD';
      const cells = Array.from(tr.children).map((td, i) => {
        const shade = isHead ? 'EEF2F7' : (isDatos && i === 0 ? 'F7F9FC' : null);
        const bold = isHead || (isDatos && i === 0) || td.style.fontWeight === 'bold';
        const inner = para(runsOf(td, { b: bold, sz: isHead ? 18 : 19 }), { jc: 'left', after: 0, line: 252 });
        return cell(inner, { w: widths[i], shade });
      }).join('');
      return row(cells, { header: isHead });
    }).join('');
    return table(rows, widths);
  }

  /* ---------- imágenes (firmas) --------------------------------- */
  function imageXml(rId, id, cx, cy) {
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Firma ${id}"/>`
      + `<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">`
      + `<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="firma${id}.png"/><pic:cNvPicPr/></pic:nvPicPr>`
      + `<pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>`
      + `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic>`
      + `</a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }

  function signBlock(box, ctx) {
    const id = box.dataset.signer;
    const role = box.querySelector('.sign-box__role').textContent.trim();
    const wL = Math.round(CONTENT_W * 0.44), wR = CONTENT_W - wL;
    let sigPara;
    if (ctx.signatures[id]) {
      const n = ++ctx.imgCount;
      const rId = 'rIdImg' + n;
      ctx.media.push({ name: `firma${n}.png`, data: ctx.signatures[id].split(',')[1], rId });
      // 900×360 px → 6,4 cm × 2,56 cm
      sigPara = para(imageXml(rId, n, 2304000, 921600), { jc: 'left', after: 0 });
    } else {
      sigPara = para(run(' ', {}), { jc: 'left', after: 0, line: 240 }) + para(run(' ', {}), { jc: 'left', after: 0, line: 240 })
        + para(run(' ', {}), { jc: 'left', after: 0, line: 240 }) + para(run(' ', {}), { jc: 'left', after: 0, line: 240 });
    }
    const line = para(run('______________________________', {}), { jc: 'left', after: 0 })
      + para(run('Firma', { sz: 17, color: '4A5261' }), { jc: 'left', after: 0 });
    const fields = Array.from(box.querySelectorAll('.sign-fields > div')).map((d) => {
      const k = d.children[0].textContent.trim();
      const f = d.children[1];
      const val = f.textContent.trim();
      return para(run(k + ' ', { b: true, sz: 19 }) + (val ? run(val, { sz: 19 }) : run('[●]', { b: true, sz: 19 })), { jc: 'left', after: 80, keepNext: true });
    }).join('');
    const rows = row(cell(para(run(role, { b: true, sz: 20 }), { jc: 'left', after: 60, keepNext: true }), { w: CONTENT_W, span: 2, shade: 'EEF2F7' }))
      + row(cell(sigPara + line, { w: wL }) + cell(fields, { w: wR }));
    return table(rows, [wL, wR]);
  }

  /* ---------- recorrido del documento --------------------------- */
  function bodyFromDom(root, ctx) {
    let out = '';
    Array.from(root.children).forEach((el) => {
      if (el.classList.contains('no-print')) return;
      const tag = el.tagName;
      if (tag === 'H1') { out += para(runsOf(el, { b: true, sz: 28 }), { jc: 'center', after: 60, keepNext: true }); return; }
      if (tag === 'P' && el.classList.contains('doc-subtitle')) { out += para(runsOf(el, { i: true, color: '4A5261' }), { jc: 'center', after: 320 }); return; }
      if (tag === 'H2') { out += para(runsOf(el, { b: true, sz: 22 }), { jc: 'left', before: 280, after: 120, keepNext: true, style: 'Heading1' }); return; }
      if (tag === 'H3') { out += para(runsOf(el, { b: true }), { jc: 'left', before: 160, after: 80, keepNext: true, style: 'Heading2' }); return; }
      if (tag === 'P' || tag === 'DIV') {
        if (el.classList.contains('pagebreak')) { out += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'; return; }
        if (el.classList.contains('sign-grid')) { Array.from(el.querySelectorAll('.sign-box')).forEach((b) => (out += signBlock(b, ctx))); return; }
        if (el.classList.contains('note')) { out += para(runsOf(el, { sz: 19, color: '4A5261' }), { border: true, shade: 'F5F7FA', before: 360, after: 120 }); return; }
        if (el.classList.contains('campo-largo')) { out += para(runsOf(el), { border: true, jc: 'left', after: 160, line: 300 }); return; }
        out += para(runsOf(el), { after: el.classList.contains('intro') ? 200 : 120 });
        return;
      }
      if (tag === 'UL' || tag === 'OL') {
        Array.from(el.children).forEach((li) => (out += para(runsOf(li), { numId: 1, after: 60, ind: 0 })));
        out += para('', { after: 60 });
        return;
      }
      if (tag === 'TABLE') { out += tableFromDom(el); return; }
      out += para(runsOf(el));
    });
    return out;
  }

  /* ---------- partes del paquete -------------------------------- */
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
  const XMLH = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

  function stylesXml() {
    return `${XMLH}<w:styles ${NS}>
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}" w:eastAsia="${FONT}"/><w:sz w:val="${SZ}"/><w:szCs w:val="${SZ}"/><w:lang w:val="es-CO"/></w:rPr></w:rPrDefault>
<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="280" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="80"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:bCs/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Header"><w:name w:val="header"/><w:basedOn w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Footer"><w:name w:val="footer"/><w:basedOn w:val="Normal"/></w:style>
<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>
</w:styles>`;
  }
  function numberingXml() {
    return `${XMLH}<w:numbering ${NS}>
<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="567" w:hanging="283"/></w:pPr><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}"/></w:rPr></w:lvl></w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`;
  }
  function headerXml(text) {
    return `${XMLH}<w:hdr ${NS}><w:p><w:pPr><w:pStyle w:val="Header"/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="4" w:color="9AA6B5"/></w:pBdr><w:spacing w:after="0"/><w:jc w:val="center"/></w:pPr>${run(text, { sz: 16, color: '666666' })}</w:p></w:hdr>`;
  }
  function footerXml() {
    const fld = (instr) => `<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> ${instr} </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:sz w:val="17"/></w:rPr><w:t>1</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>`;
    return `${XMLH}<w:ftr ${NS}><w:p><w:pPr><w:pStyle w:val="Footer"/><w:spacing w:after="0"/><w:jc w:val="center"/></w:pPr>${run('Página ', { sz: 17, color: '444444' })}${fld('PAGE')}${run(' de ', { sz: 17, color: '444444' })}${fld('NUMPAGES')}</w:p></w:ftr>`;
  }
  function documentXml(body) {
    return `${XMLH}<w:document ${NS}><w:body>${body}
<w:sectPr><w:headerReference w:type="default" r:id="rIdHeader"/><w:footerReference w:type="default" r:id="rIdFooter"/>
<w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/><w:cols w:space="708"/></w:sectPr>
</w:body></w:document>`;
  }
  function relsXml(media) {
    const imgs = media.map((m) => `<Relationship Id="${m.rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${m.name}"/>`).join('');
    return `${XMLH}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
<Relationship Id="rIdNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
<Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
<Relationship Id="rIdHeader" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
<Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
${imgs}</Relationships>`;
  }
  const contentTypes = (hasPng) => `${XMLH}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
${hasPng ? '<Default Extension="png" ContentType="image/png"/>' : ''}
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
  const rootRels = `${XMLH}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
  const settingsXml = `${XMLH}<w:settings ${NS}><w:updateFields w:val="true"/><w:defaultTabStop w:val="708"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`;
  const coreXml = (title) => `${XMLH}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${x(title)}</dc:title><dc:language>es-CO</dc:language><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created></cp:coreProperties>`;
  const appXml = `${XMLH}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Office Word</Application></Properties>`;

  /* ---------- API ------------------------------------------------ */
  window.buildDocx = async function (docEl, opts) {
    if (!window.JSZip) throw new Error('No se pudo cargar el componente de compresión (JSZip).');
    const ctx = { signatures: opts.signatures || {}, media: [], imgCount: 0 };
    const body = bodyFromDom(docEl, ctx);
    const zip = new JSZip();
    zip.file('[Content_Types].xml', contentTypes(ctx.media.length > 0));
    zip.file('_rels/.rels', rootRels);
    zip.file('word/document.xml', documentXml(body));
    zip.file('word/styles.xml', stylesXml());
    zip.file('word/numbering.xml', numberingXml());
    zip.file('word/settings.xml', settingsXml);
    zip.file('word/header1.xml', headerXml(opts.headerText || opts.title));
    zip.file('word/footer1.xml', footerXml());
    zip.file('word/_rels/document.xml.rels', relsXml(ctx.media));
    zip.file('docProps/core.xml', coreXml(opts.title));
    zip.file('docProps/app.xml', appXml);
    ctx.media.forEach((m) => zip.file('word/media/' + m.name, m.data, { base64: true }));
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
  };
})();
