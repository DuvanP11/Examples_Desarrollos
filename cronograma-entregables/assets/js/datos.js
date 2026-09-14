/* =====================================================================
   DATOS DEL CRONOGRAMA — ByteNova → Smartline
   ---------------------------------------------------------------------
   Fuente única del cronograma. Todo lo que se ve en la página sale de
   aquí. También puede editarse desde la propia página (modo edición),
   exportarse a JSON e importarse de nuevo.

   · Fechas en formato AAAA-MM-DD.
   · avance: 0 a 100. El estado se calcula solo a partir del avance y
     de las fechas frente a la "fecha de referencia" (hoy, por defecto):
       completado  → avance 100
       atrasado    → fecha fin pasada y avance < 100
       en curso    → ya empezó y avance < 100
       pendiente   → aún no empieza
       por definir → fase/entregable marcado con "porDefinir: true"
   · Para añadir una fase o un entregable basta con copiar un bloque.
   ===================================================================== */

window.CRONOGRAMA = {
  proyecto: {
    nombre: 'Automatización de marketing con agentes de IA',
    cliente: 'Smartline',
    proveedor: 'ByteNova',
    descripcion: 'Cronograma de entregables por fases. Las fechas y avances son de demostración y pueden ajustarse desde esta página o en el archivo de datos.',
    /* Fecha de referencia por defecto ("hoy"). Déjala vacía para usar la fecha real del equipo. */
    fechaReferencia: ''
  },

  fases: [
    {
      id: 'f0',
      nombre: 'Fase 0 · Preparación comercial',
      color: '#5B6B82',
      inicio: '2026-09-01',
      fin: '2026-09-13',
      descripcion: 'Trabajo previo a la firma: propuesta, demostración del concepto y modelo de contrato.',
      entregables: [
        {
          id: 'f0-e1',
          nombre: 'Propuesta comercial y técnica',
          descripcion: 'Documento de propuesta con las fases del servicio, alcance de la Fase 1 y condiciones comerciales.',
          inicio: '2026-09-01', fin: '2026-09-08',
          responsable: 'ByteNova',
          avance: 100,
          criterio: 'Propuesta presentada a Smartline.',
          tareas: [
            { nombre: 'Levantamiento de necesidades', hecho: true },
            { nombre: 'Definición de fases y alcance', hecho: true },
            { nombre: 'Presentación a Smartline', hecho: true }
          ]
        },
        {
          id: 'f0-e2',
          nombre: 'Demo interactiva de la Fase 1',
          descripcion: 'Aplicación web que muestra el flujo completo: objetivo → orquestador IA → agentes → Meta / LinkedIn / TikTok → resultados → recomendación.',
          inicio: '2026-09-08', fin: '2026-09-13',
          responsable: 'ByteNova',
          avance: 100,
          criterio: 'Demo publicada y navegable; ejecución completa de la simulación sin errores.',
          enlace: '../smartline-fase-1/',
          tareas: [
            { nombre: 'Diseño de la experiencia y agentes', hecho: true },
            { nombre: 'Animación del flujo y dashboard simulado', hecho: true },
            { nombre: 'Publicación en Vercel', hecho: true }
          ]
        },
        {
          id: 'f0-e3',
          nombre: 'Modelo de contrato de prestación de servicios',
          descripcion: 'Contrato editable (Word/PDF) entre los contratistas y Smartline, con página para completar y firmar.',
          inicio: '2026-09-11', fin: '2026-09-13',
          responsable: 'ByteNova',
          avance: 100,
          criterio: 'Documento revisado por las partes y listo para revisión legal.',
          enlace: '../contrato-servicios/',
          tareas: [
            { nombre: 'Redacción de cláusulas', hecho: true },
            { nombre: 'Página de edición y firma', hecho: true },
            { nombre: 'Revisión por abogado', hecho: false }
          ]
        }
      ]
    },

    {
      id: 'f1',
      nombre: 'Fase 1 · Marketing + Medición',
      color: '#1F5FD6',
      inicio: '2026-09-14',
      fin: '2026-09-25',
      descripcion: 'Implementación en dos semanas: estrategia y contenido, publicación multicanal con captura centralizada de resultados, y dashboard con primera recomendación.',
      entregables: [
        {
          id: 'f1-e1',
          nombre: 'E1 · Diseño de la solución y contenido de campaña',
          descripcion: 'Estrategia (objetivo, público, mensaje), propuesta de anuncios por plataforma, definición del tablero de métricas y verificación de accesos a las cuentas publicitarias.',
          inicio: '2026-09-14', fin: '2026-09-18',
          responsable: 'ByteNova · aprueba Smartline',
          avance: 0,
          criterio: 'Smartline aprueba por escrito la estrategia y al menos un anuncio por plataforma; lista de accesos verificada y firmada.',
          tareas: [
            { nombre: 'Entrega de accesos por Smartline (día 2)', hecho: false, dependeDe: 'Smartline' },
            { nombre: 'Documento de estrategia', hecho: false },
            { nombre: 'Anuncios para Meta, LinkedIn y TikTok', hecho: false },
            { nombre: 'Definición del tablero de métricas', hecho: false },
            { nombre: 'Aprobación escrita de Smartline', hecho: false, dependeDe: 'Smartline' }
          ]
        },
        {
          id: 'f1-e2',
          nombre: 'E2 · Publicación y captura centralizada de resultados',
          descripcion: 'Campañas publicadas en las tres plataformas con el contenido aprobado, flujo automatizado que recoge las métricas a diario y registro centralizado de prospectos.',
          inicio: '2026-09-19', fin: '2026-09-23',
          responsable: 'ByteNova',
          avance: 0,
          criterio: 'Campañas activas en cada plataforma; métricas de 3 días consecutivos coinciden con las de la plataforma (±5 %); prospecto de prueba llega al registro.',
          tareas: [
            { nombre: 'Configuración de campañas en Meta Ads', hecho: false },
            { nombre: 'Configuración de campañas en LinkedIn Ads', hecho: false },
            { nombre: 'Configuración de campañas en TikTok Ads', hecho: false },
            { nombre: 'Flujo automatizado de recolección de métricas', hecho: false },
            { nombre: 'Registro centralizado de prospectos', hecho: false },
            { nombre: 'Prueba de extremo a extremo con Smartline', hecho: false, dependeDe: 'Smartline' }
          ]
        },
        {
          id: 'f1-e3',
          nombre: 'E3 · Dashboard ejecutivo, informe de optimización y entrega',
          descripcion: 'Dashboard con comparación entre plataformas y evolución diaria, primer informe de optimización (preliminar), manual de uso, capacitación y entrega de accesos.',
          inicio: '2026-09-23', fin: '2026-09-25',
          responsable: 'ByteNova · acepta Smartline',
          avance: 0,
          criterio: 'Dashboard con datos reales; informe y manual entregados; capacitación realizada; acta de aceptación firmada.',
          tareas: [
            { nombre: 'Dashboard ejecutivo con datos reales', hecho: false },
            { nombre: 'Primer informe de optimización', hecho: false },
            { nombre: 'Manual de uso y capacitación (1 h)', hecho: false },
            { nombre: 'Acta de aceptación final', hecho: false, dependeDe: 'Smartline' }
          ]
        }
      ]
    },

    {
      id: 'f2',
      nombre: 'Fase 2 · Por definir',
      color: '#3E9BD9',
      inicio: '2026-10-05',
      fin: '2026-10-23',
      porDefinir: true,
      descripcion: 'Alcance, entregables y fechas pendientes de acordar con Smartline. Este bloque sirve como plantilla: cámbiale el nombre, las fechas y añade sus entregables.',
      entregables: [
        {
          id: 'f2-e1',
          nombre: 'Entregable por definir',
          descripcion: 'Descripción pendiente.',
          inicio: '2026-10-05', fin: '2026-10-23',
          responsable: 'Por definir',
          avance: 0,
          porDefinir: true,
          criterio: 'Por definir.',
          tareas: []
        }
      ]
    },

    {
      id: 'f3',
      nombre: 'Fase 3 · Por definir',
      color: '#7C6FD6',
      inicio: '2026-11-02',
      fin: '2026-11-20',
      porDefinir: true,
      descripcion: 'Alcance pendiente de acordar.',
      entregables: []
    },

    {
      id: 'f4',
      nombre: 'Fase 4 · Por definir',
      color: '#2A9D8F',
      inicio: '2026-11-30',
      fin: '2026-12-18',
      porDefinir: true,
      descripcion: 'Alcance pendiente de acordar.',
      entregables: []
    }
  ]
};
