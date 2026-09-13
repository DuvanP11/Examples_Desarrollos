/* =====================================================================
   CONFIGURACIÓN DE LA DEMO — ByteNova → Smartline · Fase 1
   ---------------------------------------------------------------------
   Todo lo que se muestra en la demostración sale de este archivo:
   agentes, plataformas, campañas de ejemplo y métricas simuladas.

   · Para cambiar la cantidad de agentes, añade o quita entradas en
     DEMO_CONFIG.agents. La interfaz (tarjetas, orquestador, estados)
     se genera automáticamente a partir de esta lista.
   · Todas las cifras son DATOS DE DEMOSTRACIÓN, no resultados reales.
   ===================================================================== */

window.DEMO_CONFIG = {

  brand: {
    developer: 'ByteNova',
    client: 'Smartline',
    phase: 'Fase 1 · Marketing + Medición'
  },

  /* ---------- Agentes de IA -------------------------------------- */
  agents: [
    {
      id: 'estrategia',
      name: 'Agente de Estrategia',
      short: 'Estrategia',
      icon: 'target',
      role: 'Analiza el objetivo comercial y define qué se quiere conseguir con la publicidad.',
      output: {
        title: 'Propuesta estratégica',
        rows: [
          ['Objetivo', 'Generar nuevos prospectos interesados en los cursos de Smartline'],
          ['Público objetivo', 'Profesionales de 25 a 45 años que buscan actualizar sus habilidades'],
          ['Campaña recomendada', 'Captación de prospectos · Curso Data Analytics'],
          ['Enfoque', 'Mensaje profesional y orientado al crecimiento laboral']
        ]
      }
    },
    {
      id: 'contenido',
      name: 'Agente de Contenido',
      short: 'Contenido',
      icon: 'pen',
      role: 'Propone textos, mensajes y conceptos para los anuncios.',
      output: {
        title: 'Propuesta de anuncio',
        rows: [
          ['Título', 'Descubre nuevas habilidades y potencia tu perfil profesional'],
          ['Texto', 'Aprende Data Analytics con acompañamiento de expertos y aplica lo aprendido desde la primera semana.'],
          ['Llamado a la acción', 'Quiero más información'],
          ['Público objetivo', 'Profesionales que buscan actualizarse'],
          ['Curso promocionado', 'Curso Data Analytics']
        ]
      }
    },
    {
      id: 'distribucion',
      name: 'Agente de Distribución',
      short: 'Distribución',
      icon: 'send',
      role: 'Coordina en qué plataformas se publica la campaña y confirma su publicación.',
      output: {
        title: 'Plan de distribución',
        rows: [
          ['Meta Ads', 'Campaña de prospectos · presupuesto asignado'],
          ['LinkedIn Ads', 'Campaña de prospectos · público profesional'],
          ['TikTok Ads', 'Campaña de alcance · formato vídeo corto']
        ]
      }
    },
    {
      id: 'analitica',
      name: 'Agente de Analítica',
      short: 'Analítica',
      icon: 'chart',
      role: 'Recopila y organiza los resultados de las campañas en las tres plataformas.',
      output: {
        title: 'Métricas que consolida',
        rows: [
          ['Alcance e impresiones', 'Cuántas personas vieron el anuncio y cuántas veces'],
          ['Clics y CTR', 'Cuántas personas se interesaron y en qué proporción'],
          ['Prospectos y coste por prospecto', 'Cuántos contactos se generaron y cuánto costó cada uno'],
          ['Inversión, conversiones y coste por conversión', 'Cuánto se invirtió y cuánto costó cada matrícula']
        ]
      }
    },
    {
      id: 'optimizacion',
      name: 'Agente de Optimización',
      short: 'Optimización',
      icon: 'spark',
      role: 'Compara los resultados y propone ajustes para mejorar la siguiente campaña.',
      output: {
        title: 'Recomendación generada',
        rows: [
          ['Hallazgo', 'Meta está generando más prospectos con menor coste'],
          ['Hallazgo', 'LinkedIn presenta menor volumen pero mayor interés profesional'],
          ['Hallazgo', 'TikTok presenta mayor alcance pero menor conversión'],
          ['Recomendación', 'Redistribuir parte del presupuesto hacia la campaña con mejor coste por prospecto']
        ]
      }
    }
  ],

  /* Agentes que dependen del orquestador de forma directa (fila 1) y
     agente que se alimenta de la analítica (fila 2), para el diagrama. */
  orchestrator: {
    name: 'Orquestador IA',
    description: 'Coordina las tareas, reparte el trabajo entre los agentes y mantiene el flujo de principio a fin.',
    primary: ['estrategia', 'contenido', 'distribucion', 'analitica'],
    secondary: { analitica: ['optimizacion'] }
  },

  /* ---------- Plataformas publicitarias -------------------------- */
  platforms: [
    {
      id: 'meta',
      name: 'Meta Ads',
      short: 'Meta',
      color: '#2F80ED',
      campaign: 'Curso Data Analytics',
      objective: 'Captación de prospectos',
      format: 'Imagen + formulario de contacto',
      metrics: {
        budget: 500000, reach: 18900, impressions: 24850, clicks: 1240,
        leads: 87, conversions: 12
      },
      // prospectos por día (14 días) — suma = leads
      daily: [3, 4, 5, 6, 6, 7, 7, 8, 7, 8, 7, 7, 6, 6]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Ads',
      short: 'LinkedIn',
      color: '#0E3B66',
      campaign: 'Especialización profesional en Data Analytics',
      objective: 'Captación de prospectos',
      format: 'Contenido patrocinado + formulario',
      metrics: {
        budget: 450000, reach: 7200, impressions: 9600, clicks: 384,
        leads: 41, conversions: 9
      },
      daily: [1, 2, 2, 3, 3, 3, 4, 4, 3, 4, 3, 3, 3, 3]
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads',
      short: 'TikTok',
      color: '#1B1B1F',
      campaign: 'Aprende Data Analytics en 8 semanas',
      objective: 'Alcance + tráfico',
      format: 'Vídeo corto vertical',
      metrics: {
        budget: 350000, reach: 33500, impressions: 41200, clicks: 1030,
        leads: 38, conversions: 4
      },
      daily: [4, 4, 3, 3, 3, 3, 3, 2, 3, 2, 2, 2, 2, 2]
    }
  ],

  /* Etiquetas de fecha para la evolución (14 días) */
  days: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14'],

  /* ---------- Etapas de la demostración -------------------------- */
  /* Duraciones en milisegundos. Se pueden ajustar sin tocar app.js. */
  stages: [
    { id: 1, label: 'Analizando objetivo...',     duration: 1500 },
    { id: 2, label: 'Preparando campaña...',      duration: 1500 },
    { id: 3, label: 'Contenido aprobado',         duration: 900  },
    { id: 4, label: 'Distribuyendo campaña...',   duration: 2600 },
    { id: 5, label: 'Recibiendo resultados...',   duration: 2600 },
    { id: 6, label: 'Analizando rendimiento...',  duration: 1600 },
    { id: 7, label: 'Generando recomendación...', duration: 1700 },
    { id: 8, label: 'Campaña procesada',          duration: 900  }
  ],

  /* ---------- Textos de estado --------------------------------- */
  agentStates: {
    waiting:    'Esperando',
    processing: 'Procesando',
    done:       'Completado'
  },
  platformStates: {
    idle:       'Conexión simulada',
    connecting: 'Conectando',
    connected:  'Conectado',
    publishing: 'Publicando',
    published:  'Publicado',
    receiving:  'Recibiendo datos',
    done:       'Datos recibidos'
  }
};
