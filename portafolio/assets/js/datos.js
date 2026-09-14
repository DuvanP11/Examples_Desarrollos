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
  /* Cada módulo trae: qué resuelve, las reglas que se aplicaron y una
     pantalla simulada (datos ficticios) de cómo se ve el resultado.     */
  picap: {
    empresa: 'Picap',
    rol: 'Analista de datos · fraude, monitoreo y automatización',
    intro: 'Plataforma de movilidad y logística. Todo lo que sigue se construyó sobre la base analítica (ClickHouse) y está en producción para operación y gerencia. Las pantallas son simulaciones con datos ficticios que reproducen cómo se ven los módulos reales.',
    construccion: ['Pregunta de negocio', 'Consulta SQL validada contra ClickHouse', 'Reglas de clasificación', 'Módulo en el portal (Rails)', 'Revisión por PR en GitHub', 'Despliegue automático (ArgoCD)'],
    proyectos: [
      {
        id: 'portal',
        nombre: 'Portal de monitoreo y prevención de fraude',
        stack: ['Ruby on Rails', 'ClickHouse', 'SQL', 'JavaScript', 'Docker', 'ArgoCD'],
        resumen: 'Portal interno con más de veinte módulos. Elige uno para ver cómo se ve y qué reglas aplica.',
        modulos: [
          {
            nombre: 'Evasión de comisiones',
            resuelve: 'Detectar viajes en los que el piloto cancela cerca del destino después de completar el recorrido, para no pagar la comisión de la plataforma.',
            reglas: [
              ['Regla de tiempo', 'Más de 5 minutos entre la aceptación del viaje y la cancelación.'],
              ['Regla de cancelación', 'El punto de cancelación queda a 450 m o menos del destino.'],
              ['Sin GPS', 'Si no hay rastro de ubicación, el caso se marca como probable, no confirmado.'],
              ['Veredicto', 'Ambas reglas → EVASIÓN CONFIRMADA (nivel 3). Una sola → PROBABLE (nivel 2). Ninguna → OK.'],
              ['Reincidencia', 'Pilotos con casos confirmados repetidos en 30 días se listan aparte y concentran la mayor parte de la comisión no cobrada.']
            ],
            pantalla: {
              titulo: 'Evasión de comisiones · últimos 30 días',
              kpis: [['Viajes analizados', 48210], ['Confirmadas', 1362], ['Probables', 2905], ['Comisión no cobrada', '$18,4 M']],
              barras: { titulo: 'Casos confirmados por ciudad', items: [['Bogotá', 612], ['Medellín', 318], ['Cali', 224], ['Barranquilla', 128], ['Otras', 80]] },
              tabla: { titulo: 'Reincidentes', head: ['Piloto', 'Casos', 'Nivel', 'Comisión'], rows: [['P-4F21', '14', 'Confirmada', '$412.000'], ['P-9A03', '11', 'Confirmada', '$365.000'], ['P-1C77', '9', 'Confirmada', '$298.000']] }
            }
          },
          {
            nombre: 'Consolidado Cash Out',
            resuelve: 'Conciliar cada retiro de billetera contra la transacción real, para saber cuánto salió, cuánto se reembolsó y qué quedó en diferencia.',
            reglas: [
              ['Cruce por identificador', 'Cada retiro se une a su transacción de billetera por el identificador único, nunca por monto y fecha.'],
              ['Deduplicación obligatoria', 'La réplica trae registros repetidos; se conserva una sola fila por identificador antes de sumar.'],
              ['El signo manda', 'Un cargo y su reembolso tienen el mismo monto con signo contrario; nunca se usa valor absoluto o se inflan las cifras.'],
              ['Mapa de estados', 'El código de estado se traduce a aprobado, pendiente, rechazado o reembolsado; no se filtra ninguno para no perder casos.'],
              ['Diferencia', 'Retiro − transacción ≠ 0 → fila marcada para revisión con el detalle.']
            ],
            pantalla: {
              titulo: 'Consolidado Cash Out · semana',
              kpis: [['Retiros', 12480], ['Conciliados', '99,2 %'], ['Con diferencia', 97], ['Monto en revisión', '$4,1 M']],
              tabla: { titulo: 'Diferencias detectadas', head: ['Retiro', 'Estado', 'Retiro', 'Transacción', 'Dif.'], rows: [['CO-88213', 'Reembolsado', '$120.000', '−$120.000', '$0 ✓'], ['CO-88240', 'Aprobado', '$85.000', '$80.000', '$5.000'], ['CO-88251', 'Pendiente', '$60.000', '—', '$60.000']] }
            }
          },
          {
            nombre: 'Conducta inapropiada',
            resuelve: 'Centralizar los reportes de usuarios sobre pilotos, con detalle por caso, tiempos de atención y vista mensual.',
            reglas: [
              ['Proceso automático', 'Un proceso programado lee los reportes nuevos cada hora y los clasifica por categoría; la bandeja vacía casi siempre significa que el proceso está detenido, no que no hay casos.'],
              ['Tiempo de atención', 'Cada caso mide horas desde el reporte hasta la primera gestión; se resalta si supera 24 h.'],
              ['Estados', 'Nuevo → En gestión → Cerrado, con responsable y fecha en cada cambio.'],
              ['Reincidencia', 'Varios reportes del mismo piloto en el mes se agrupan y suben de prioridad.']
            ],
            pantalla: {
              titulo: 'Conducta inapropiada · bandeja',
              kpis: [['Casos del mes', 214], ['Atendidos < 24 h', '87 %'], ['En gestión', 31], ['Reincidentes', 9]],
              tabla: { titulo: 'Bandeja', head: ['Caso', 'Categoría', 'Piloto', 'Horas', 'Estado'], rows: [['CI-1043', 'Trato al usuario', 'P-2B10', '3 h', 'En gestión'], ['CI-1042', 'Ruta distinta', 'P-7E55', '19 h', 'En gestión'], ['CI-1039', 'Cobro indebido', 'P-4F21', '31 h ⚠', 'Nuevo']] }
            }
          },
          {
            nombre: 'Campañas activas y validador',
            resuelve: 'Verificar que los ganadores de una campaña de bonificación cumplieron realmente las condiciones antes de pagar.',
            reglas: [
              ['Términos cargados', 'Se cargan los términos de cada campaña: meta de servicios, periodo, ciudades y tipo de servicio.'],
              ['Cruce con servicios reales', 'Cada ganador reportado se contrasta con sus servicios completados en el periodo, según la base de datos.'],
              ['Exclusiones', 'No cuentan servicios cancelados, duplicados ni fuera de la ciudad o del periodo.'],
              ['Veredicto', 'Cumple / No cumple, con el número real de servicios y la diferencia frente a la meta.']
            ],
            pantalla: {
              titulo: 'Validador de campañas · “Meta 40 servicios”',
              kpis: [['Ganadores reportados', 320], ['Cumplen', 287], ['No cumplen', 33], ['Bonos retenidos', '$9,9 M']],
              tabla: { titulo: 'Validación', head: ['Piloto', 'Reportado', 'Real', 'Veredicto'], rows: [['P-3A90', '42', '42', 'Cumple ✓'], ['P-6D12', '40', '38', 'No cumple'], ['P-8K04', '45', '31', 'No cumple']] }
            }
          },
          {
            nombre: 'Recaudos y dispersiones',
            resuelve: 'Seguir el dinero del recaudo contra entrega desde el paquete hasta la dispersión al comercio, y detectar diferencias.',
            reglas: [
              ['Por paquete', 'El recaudo se identifica por el paquete entregado, no por el tipo de transacción.'],
              ['Lotes de compensación', 'Los movimientos negativos son lotes de compensación; no se netean contra el recaudo porque lo borrarían.'],
              ['Dispersión validada', 'Cada dispersión se compara con el saldo recaudado del comercio; la diferencia se marca.'],
              ['Comisión de recaudo', 'Se calcula sobre el valor recaudado según el régimen de cada comercio.']
            ],
            pantalla: {
              titulo: 'Recaudos y dispersiones · mes',
              kpis: [['Paquetes con recaudo', 8940], ['Recaudado', '$612 M'], ['Dispersado', '$598 M'], ['Diferencias', 12]],
              barras: { titulo: 'Recaudado vs. dispersado por semana (M)', items: [['Sem 1', 148], ['Sem 2', 155], ['Sem 3', 151], ['Sem 4', 158]] }
            }
          },
          {
            nombre: 'Estado de cuenta y saldos',
            resuelve: 'Ver el estado de cuenta de cada piloto, sus ganancias y permanencia, y recibir alertas de saldos.',
            reglas: [
              ['Saldo de la cuenta', 'El saldo se toma del campo de la cuenta, no se recalcula sumando transacciones (comparten segundo y desempatan mal).'],
              ['Alertas', 'Saldo negativo o por debajo del mínimo → alerta con el piloto y el monto.'],
              ['Ganancias', 'Ingresos por servicio, bonos y descuentos por periodo, exportables.'],
              ['Permanencia', 'Días activos desde el registro y último servicio, para retención.']
            ],
            pantalla: {
              titulo: 'Estado de cuenta · alertas de saldo',
              kpis: [['Pilotos activos', 5120], ['Saldo negativo', 143], ['Bajo mínimo', 388], ['Permanencia media', '214 d']],
              barras: { titulo: 'Pilotos por rango de permanencia', items: [['< 30 d', 820], ['30–90 d', 1150], ['90–180 d', 1300], ['> 180 d', 1850]] }
            }
          },
          {
            nombre: 'Auditoría y consulta de datos',
            resuelve: 'Buscar cualquier usuario, piloto o servicio en un solo lugar y dejar rastro de quién consultó o exportó qué.',
            reglas: [
              ['Búsqueda transversal', 'Un solo campo busca por documento, teléfono, correo o identificador de servicio.'],
              ['Registro de auditoría', 'Cada consulta y cada exportación guarda usuario, fecha, filtros y cantidad de filas.'],
              ['Exportación', 'CSV con las mismas columnas que se ven en pantalla, sin datos ocultos.']
            ],
            pantalla: {
              titulo: 'Auditoría · registro de consultas',
              kpis: [['Consultas hoy', 96], ['Exportaciones', 7], ['Usuarios activos', 12]],
              tabla: { titulo: 'Últimas acciones', head: ['Hora', 'Usuario', 'Acción', 'Filas'], rows: [['10:42', 'ana.r', 'Consulta piloto P-4F21', '1'], ['10:38', 'carlos.m', 'Exportar evasión · Bogotá', '612'], ['10:21', 'ana.r', 'Consulta servicio S-771020', '1']] }
            }
          },
          {
            nombre: 'Validación de fotos y facturas',
            resuelve: 'Comprobar que la foto enviada a una campaña corresponde al piloto registrado y que las facturas cumplen el formato exigido.',
            reglas: [
              ['Comparación facial', 'La foto de la campaña se compara con la del registro; un umbral de similitud decide si coincide.'],
              ['Revisión manual', 'Los casos entre umbrales van a revisión humana, no se rechazan solos.'],
              ['Facturas', 'Se valida formato, consecutivo y datos obligatorios antes de aceptarlas.']
            ],
            pantalla: {
              titulo: 'Validador de fotos · campaña',
              kpis: [['Fotos recibidas', 1840], ['Coinciden', '92 %'], ['A revisión', 108], ['Rechazadas', 39]],
              tabla: { titulo: 'Resultados', head: ['Piloto', 'Similitud', 'Resultado'], rows: [['P-3A90', '0,97', 'Coincide ✓'], ['P-6D12', '0,81', 'Revisión manual'], ['P-8K04', '0,42', 'Rechazada']] }
            }
          }
        ]
      },
      {
        id: 'voz',
        nombre: 'Agente de voz para activación de pilotos',
        stack: ['Python', 'Flask', 'Twilio', 'ClickHouse'],
        resumen: 'Llamadas automáticas que guían al piloto nuevo para cargar bien sus documentos. Así se ve una llamada y estas son las reglas.',
        reglas: [
          ['A quién se llama', 'Solo a pilotos con documentos rechazados en las últimas 48 h, identificados en la base de datos.'],
          ['Cuándo', 'Entre 8:00 y 20:00; máximo dos intentos por piloto y por documento.'],
          ['Qué dice', 'Instrucciones distintas por tipo de documento (licencia, SOAT, cédula, foto), configuradas sin tocar código.'],
          ['Qué se registra', 'Resultado de cada llamada (contestó, escuchó completo, volvió a cargar) para medir el efecto.']
        ],
        flujo: ['ClickHouse identifica pilotos con rechazos', 'Script dispara la campaña de llamadas', 'Twilio ejecuta la llamada', 'Agente conversa según el documento', 'Analítica de resultados'],
        pantalla: {
          titulo: 'Consola de llamadas · campaña del día',
          kpis: [['Llamadas', 412], ['Contestadas', '71 %'], ['Documento recargado', '58 %'], ['Aprobado tras la llamada', '46 %']],
          timeline: { titulo: 'Llamada a P-2B10 · documento: licencia', items: [['09:14:02', 'Llamada iniciada'], ['09:14:09', 'Piloto contesta'], ['09:14:12', '“Tu licencia fue rechazada por foto borrosa. Te explico cómo tomarla…”'], ['09:15:40', 'Instrucciones completas escuchadas'], ['11:02:00', 'Documento cargado de nuevo'], ['11:40:00', 'Documento aprobado ✓']] }
        },
        resultados: [
          { antes: '40 %', despues: '10 %', label: 'documentos rechazados' },
          { antes: '5–7 días', despues: '1–2 días', label: 'tiempo de activación' }
        ],
        nota: 'Cifras reportadas en la documentación del proyecto. La consola es una simulación con datos ficticios.',
        repo: 'https://github.com/DuvanP11/Voice-agent'
      },
      {
        id: 'batch',
        nombre: 'Procesos automáticos y tableros de gerencia',
        stack: ['Python', 'pandas', 'Flask', 'Power BI'],
        resumen: 'Procesos que corren solos cada hora y tableros ligeros para gerencia. Así se ve el registro de ejecución.',
        reglas: [
          ['Frecuencia', 'Cada hora se recorre ClickHouse, se clasifica y se guarda el resultado en memoria.'],
          ['Sin instalación', 'El tablero es un archivo HTML que consulta una API local; gerencia lo abre en el navegador.'],
          ['Filtros', 'Periodo (7 / 15 / 30 días o fechas), nivel de evasión y ciudad, sin recargar la página.'],
          ['Refresco', 'Botón para forzar la consulta cuando se necesita el dato al minuto.']
        ],
        pantalla: {
          titulo: 'Proceso de evasión · registro de ejecución',
          kpis: [['Ejecuciones hoy', 24], ['Última', '11:00'], ['Duración media', '18 s'], ['Filas procesadas', 48210]],
          timeline: { titulo: 'Últimas ejecuciones', items: [['11:00', 'OK · 48.210 filas · 17 s'], ['10:00', 'OK · 47.902 filas · 19 s'], ['09:00', 'OK · 47.611 filas · 18 s'], ['08:00', 'Reintento · ClickHouse ocupado · OK al 2.º intento']] }
        },
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
