/* =====================================================================
   DATOS DEL PORTAFOLIO — Duvan Perilla · ByteNova
   Todo el contenido de la página sale de este archivo.
   ===================================================================== */
window.PORTAFOLIO = {
  perfil: {
    nombre: 'Duvan Perilla',
    marca: 'ByteNova',
    titulo: 'Datos, automatización y agentes de IA',
    resumen: 'Analista de datos enfocado en detección de fraude e inteligencia de negocio, con experiencia construyendo automatizaciones y aplicaciones de principio a fin: desde la consulta en la base de datos hasta el tablero que usa la gerencia o la app que instala el usuario.',
    ubicacion: 'Bogotá, Colombia',
    github: 'https://github.com/DuvanP11',
    web: 'https://bytenova-ten.vercel.app',
    presentadoA: 'Smartline',
    pilares: [
      { icon: 'shield', titulo: 'Detección de fraude y BI', texto: 'Modelos de reglas y tableros sobre ClickHouse y Power BI para encontrar evasión, conductas anómalas y pérdidas operativas.' },
      { icon: 'cpu', titulo: 'Automatización de procesos', texto: 'Procesos que corren solos: conciliaciones, validaciones de campañas, alertas y reportes continuos, sin revisión manual.' },
      { icon: 'spark', titulo: 'Agentes de IA', texto: 'Agentes de voz, orquestación de tareas y modelos que corren en el dispositivo o en local, sin depender de servicios de pago.' },
      { icon: 'layers', titulo: 'Apps web y móviles', texto: 'Productos completos y publicados: portales, PWA, apps Android y demos comerciales desplegadas en Vercel.' }
    ]
  },

  /* ---------- Experiencia en Picap ---------------------------------- */
  picap: {
    empresa: 'Picap',
    rol: 'Analista de datos · fraude, monitoreo y automatización',
    intro: 'Plataforma de movilidad y logística. Trabajo sobre la base de datos analítica (ClickHouse) para convertir millones de registros de viajes, pagos y billeteras en decisiones operativas.',
    proyectos: [
      {
        id: 'portal',
        nombre: 'Portal de monitoreo y prevención de fraude',
        stack: ['Ruby on Rails', 'ClickHouse', 'SQL', 'JavaScript', 'Docker', 'ArgoCD'],
        resumen: 'Portal interno con más de veinte módulos que consultan ClickHouse en tiempo real y presentan a operación y gerencia lo que antes se revisaba a mano en hojas de cálculo.',
        modulos: [
          { nombre: 'Evasión de comisiones', texto: 'Clasifica viajes por reglas de tiempo entre eventos y distancia de cancelación al destino; identifica reincidentes y cuantifica la comisión no cobrada.' },
          { nombre: 'Consolidado Cash Out', texto: 'Concilia retiros de billetera contra el estado real de cada transacción, con deduplicación y detección de reembolsos.' },
          { nombre: 'Conducta inapropiada', texto: 'Bandeja de casos con detalle por piloto, tiempos de atención y vista mensual, alimentada por un proceso automático.' },
          { nombre: 'Campañas activas y validador', texto: 'Carga y valida ganadores de campañas contra los servicios reales de cada piloto antes de pagar bonificaciones.' },
          { nombre: 'Recaudos y dispersiones', texto: 'Seguimiento del recaudo contra entrega, comisiones de recaudo y validación de dispersiones a pilotos.' },
          { nombre: 'Estado de cuenta y saldos', texto: 'Estado de cuenta por piloto, alertas de saldos y ganancias con estadísticas de permanencia y retención.' },
          { nombre: 'Auditoría y consulta de datos', texto: 'Búsqueda transversal por usuario, piloto o servicio, exportaciones y registro de auditoría.' },
          { nombre: 'Validación de fotos y facturas', texto: 'Validación de imágenes de campañas y de facturación MinTIC con apoyo de reconocimiento facial.' }
        ]
      },
      {
        id: 'voz',
        nombre: 'Agente de voz para activación de pilotos',
        stack: ['Python', 'Flask', 'Twilio', 'ClickHouse'],
        resumen: 'Sistema de llamadas automáticas que guía a los pilotos nuevos en la carga correcta de sus documentos, para reducir rechazos por calidad y acelerar la activación.',
        flujo: ['ClickHouse identifica pilotos con rechazos', 'Script dispara la campaña de llamadas', 'Twilio ejecuta la llamada', 'Agente conversa según el documento', 'Analítica de resultados'],
        resultados: [
          { antes: '40 %', despues: '10 %', label: 'documentos rechazados' },
          { antes: '5–7 días', despues: '1–2 días', label: 'tiempo de activación' }
        ],
        nota: 'Cifras reportadas en la documentación del proyecto.',
        repo: 'https://github.com/DuvanP11/Voice-agent'
      },
      {
        id: 'batch',
        nombre: 'Procesos automáticos y tableros de gerencia',
        stack: ['Python', 'pandas', 'Flask', 'Power BI'],
        resumen: 'Scripts programados que recorren ClickHouse cada hora, clasifican evasión y conductas, y alimentan tableros ligeros (HTML + API) para que gerencia consulte sin instalar nada.',
        repo: 'https://github.com/DuvanP11/picap-monitoreo'
      }
    ]
  },

  /* ---------- Proyectos personales -------------------------------- */
  categorias: ['Todos', 'IA', 'Datos', 'Móvil', 'Web', 'Automatización'],
  proyectos: [
    {
      nombre: 'Demos comerciales ByteNova',
      repo: 'Examples_Desarrollos',
      cats: ['IA', 'Web', 'Automatización'],
      stack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
      texto: 'Demostración interactiva de marketing con agentes de IA (Fase 1 para Smartline), contrato de servicios editable con firma y exportación a Word/PDF, y cronograma de entregables configurable.',
      demo: 'https://examples-desarrollos.vercel.app',
      destacado: true
    },
    {
      nombre: 'Astrology Nova',
      repo: 'Astrology-Nova',
      cats: ['Móvil'],
      stack: ['Kotlin', 'C', 'WebAssembly', 'Android'],
      texto: 'App Android para mirar el cielo: mapa que sigue al teléfono con sensores, 60.000 estrellas, planetas y constelaciones sin conexión, y modo cámara que superpone el cielo real. APK firmada y publicada.',
      demo: 'https://astrology-nova-ten.vercel.app'
    },
    {
      nombre: 'Copiloto BTC',
      repo: 'Predictor_BCoins',
      cats: ['Datos', 'Web'],
      stack: ['JavaScript', 'IndexedDB', 'Binance API'],
      texto: 'Analiza una operación de Bitcoin antes de entrar: tamaño de posición, stop, y frecuencia histórica de éxito en días con condiciones similares. Todo corre en el navegador; incluye un curso de 17 capítulos.',
      demo: 'https://predictor-b-coins.vercel.app'
    },
    {
      nombre: 'NovaProtect',
      repo: 'NovaProtect',
      cats: ['IA', 'Móvil'],
      stack: ['Kotlin', 'TensorFlow Lite', 'Vosk', 'LightGBM'],
      texto: 'Protección contra llamadas spam y estafas con dos motores en el dispositivo: riesgo por metadatos antes de contestar y análisis acústico para detectar grabadoras. Meta de precisión ≥ 0,98.'
    },
    {
      nombre: 'Portal de empleos Colombia',
      repo: 'Job_Search',
      cats: ['Automatización', 'Web'],
      stack: ['Python', 'Flask', 'Selenium'],
      texto: 'Buscador de empleo que inicia sesión en portales reales para consultar sin bloqueos, con credenciales cifradas y filtros por escolaridad, inglés, contrato y ubicación.',
      demo: 'https://job-search-weld-three.vercel.app'
    },
    {
      nombre: 'Nova Budget',
      repo: 'Nova-Budget',
      cats: ['Web', 'Móvil'],
      stack: ['JavaScript', 'PWA', 'SVG'],
      texto: 'Finanzas personales para móvil: gastos fijos y variables, ahorro obligatorio, alertas de vencimientos y estadísticas. Funciona sin internet, se instala como app y los datos no salen del dispositivo.'
    },
    {
      nombre: 'Aprende Guitarra',
      repo: 'Guitar_Learning_APK',
      cats: ['IA', 'Web'],
      stack: ['JavaScript', 'Web Audio', 'MediaPipe'],
      texto: 'Afinador por micrófono, acordes con cámara que dibuja la mano, lecciones paso a paso y cancionero con acordes sincronizados. Audio y vídeo se procesan en el navegador.'
    },
    {
      nombre: 'Reino del Saber',
      repo: 'Educational_Portal',
      cats: ['Móvil'],
      stack: ['Python', 'Flutter', 'FastAPI'],
      texto: 'Juego educativo para niños de 9 a 11 años: mundos temáticos de matemáticas, XP, racha diaria y panel para profesores. Generador de más de 380 preguntas listo; app en desarrollo.',
      estado: 'En desarrollo'
    },
    {
      nombre: 'Health mini app',
      repo: 'health-miniapp',
      cats: ['Web'],
      stack: ['HTML', 'JavaScript'],
      texto: 'Mini aplicación de entrenamiento físico y mejora de salud.'
    },
    {
      nombre: 'Sitio ByteNova',
      repo: 'bytenova',
      cats: ['Web'],
      stack: ['HTML', 'CSS'],
      texto: 'Sitio de presentación de ByteNova, la marca bajo la que publico automatizaciones y aplicaciones.',
      demo: 'https://bytenova-ten.vercel.app'
    }
  ],

  /* ---------- Stack ---------------------------------------------- */
  stack: [
    { grupo: 'Datos y análisis', items: ['Python', 'pandas', 'SQL', 'ClickHouse', 'Power BI'] },
    { grupo: 'Backend y automatización', items: ['Flask', 'Ruby on Rails', 'FastAPI', 'Selenium', 'Twilio'] },
    { grupo: 'Front y móvil', items: ['HTML · CSS · JavaScript', 'TypeScript', 'PWA', 'Kotlin · Android', 'Flutter'] },
    { grupo: 'IA', items: ['Agentes de voz y orquestación', 'TensorFlow Lite', 'LightGBM', 'Vosk', 'MediaPipe', 'Modelos locales'] },
    { grupo: 'Despliegue', items: ['Vercel', 'Docker', 'GitHub', 'ArgoCD'] }
  ],

  /* ---------- Cómo trabajo (flujo animado) ----------------------- */
  flujo: [
    { titulo: 'Entender el problema', texto: 'Qué decisión se quiere tomar y qué dato la respalda.' },
    { titulo: 'Consultar y validar', texto: 'La consulta se verifica contra la base real antes de mostrarla.' },
    { titulo: 'Automatizar', texto: 'Lo que se repite se convierte en un proceso que corre solo.' },
    { titulo: 'Entregar y medir', texto: 'Tablero, app o agente en producción, con resultados medibles.' }
  ]
};
