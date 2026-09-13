# Smartline · Fase 1 — Marketing + Medición

Demo comercial interactiva de **ByteNova** para **Smartline**.

Muestra, de forma visual y sin tecnicismos, cómo un Orquestador IA y cinco agentes
(Estrategia, Contenido, Distribución, Analítica y Optimización) reciben un objetivo
comercial, preparan y distribuyen campañas en **Meta Ads, LinkedIn Ads y TikTok Ads**,
reciben los resultados, los comparan y generan una recomendación que Smartline ve en
un panel ejecutivo.

> **DEMO / SIMULACIÓN.** Las conexiones con Meta, LinkedIn y TikTok y todas las métricas
> son simuladas y representan el funcionamiento conceptual de la solución. No se usan
> cuentas publicitarias, presupuestos, credenciales ni datos reales.

## Qué incluye

- Pantalla de inicio con las marcas y acceso directo a la demostración.
- Sección **¿Cómo funciona?** con 8 pasos interactivos.
- Sección **Agentes IA**: orquestador + tarjetas de cada agente con su función y ejemplo.
- Sección **Plataformas**: ciclo ByteNova → Campaña → Plataforma → Publicación → Resultados → ByteNova, con interfaz simulada de cada plataforma.
- **Demostración interactiva** (`Ejecutar demostración` / `Reiniciar demostración`): diagrama de flujo animado con puntos de datos, etapas, cambio de estado de agentes (Esperando → Procesando → Completado) y de plataformas (Conectando → Conectado → Publicando → Publicado → Recibiendo datos).
- **Dashboard** ejecutivo: KPIs, gráficos por plataforma, evolución de 14 días, tabla comparativa y recomendación.
- Secciones **¿Qué obtiene Smartline?**, **Antes vs. después** y **Alcance de la Fase 1**.

## Instalación

No hay dependencias ni proceso de build: es HTML, CSS y JavaScript puro.

```bash
git clone https://github.com/DuvanP11/Examples_Desarrollos.git
cd Examples_Desarrollos/smartline-fase-1
```

## Ejecutar localmente

Cualquier servidor estático sirve. Con Python (viene en macOS/Linux):

```bash
python3 -m http.server 8080
```

y abrir <http://localhost:8080>.

Alternativas: `npx serve .` (si tienes Node) o la extensión *Live Server* de VS Code.
Abrir `index.html` directamente con doble clic también funciona en la mayoría de navegadores.

## Build

No se necesita. Los archivos de la carpeta se publican tal cual.

## Desplegar en Vercel

1. Entrar en [vercel.com](https://vercel.com) → **Add New → Project**.
2. Importar el repositorio `DuvanP11/Examples_Desarrollos`.
3. En **Root Directory** elegir `smartline-fase-1`.
4. Framework Preset: **Other**. Sin comando de build ni carpeta de salida.
5. **Deploy**.

También funciona desplegando el repositorio completo: la raíz redirige a `/smartline-fase-1/`.

No se necesitan variables de entorno. Si en una fase futura se conectaran las plataformas reales,
se documentarían aquí como placeholders (por ejemplo `META_ADS_TOKEN`, `LINKEDIN_ADS_TOKEN`,
`TIKTOK_ADS_TOKEN`); **esta demo no las usa ni las incluye**.

## Estructura

```
smartline-fase-1/
├── index.html              # toda la página (secciones, textos, iconos SVG)
├── vercel.json             # configuración mínima para Vercel
└── assets/
    ├── css/styles.css      # estilos y responsive
    ├── js/config.js        # agentes, plataformas, métricas simuladas y tiempos
    ├── js/app.js           # renderizado, animaciones, secuencia de la demo, gráficos
    └── img/
        ├── bytenova.png    # logo ByteNova con transparencia (el que usa la web)
        ├── smartline.png   # logo Smartline con transparencia (el que usa la web)
        ├── bytenova.jpeg   # original entregado, sin modificar (referencia)
        └── smartline.jpeg  # original entregado, sin modificar (referencia)
```

## Personalizar la demo

Todo lo que se muestra sale de `assets/js/config.js`:

- **Agentes**: añadir o quitar entradas en `agents`; las tarjetas, el orquestador y las listas
  de estado se generan automáticamente. Si se añade un agente, incluirlo en `orchestrator.primary`
  (o en `orchestrator.secondary`) para que aparezca en el diagrama.
- **Plataformas y métricas**: editar `platforms` (presupuesto, alcance, impresiones, clics,
  prospectos, conversiones y prospectos diarios). CTR, coste por prospecto y coste por conversión
  se calculan solos, y los textos de recomendación se adaptan a los datos.
- **Duración de la animación**: ajustar `duration` de cada etapa en `stages`.

## Recursos visuales

Los logos están en `assets/img/`. Los originales entregados (`smartline.jpeg`, `bytenova.jpeg`)
traían un tablero de "transparencia" pintado dentro del JPEG, así que la web usa `smartline.png` y
`bytenova.png`: los mismos logos con ese fondo eliminado y transparencia real, sin alterar colores
ni proporciones. Los JPEG se conservan como referencia. La tipografía **Inter** se carga desde Google Fonts (con alternativa del
sistema si no hay conexión); no hay otros recursos externos.

## Compatibilidad

Navegadores modernos (Chrome, Edge, Safari, Firefox) en escritorio, tablet y móvil.
Respeta la preferencia del sistema *reducir movimiento*.
