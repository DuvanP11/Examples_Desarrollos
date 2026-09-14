# Examples_Desarrollos

Repositorio de desarrollos y demostraciones de **ByteNova**. Cada carpeta es un proyecto
independiente, estático y autocontenido (sin build), listo para desplegarse en Vercel.

| Carpeta | Descripción |
|---------|-------------|
| [`smartline-fase-1/`](smartline-fase-1/) | Demo comercial interactiva **Fase 1 – Marketing + Medición** para Smartline: agentes de IA que planifican, crean, distribuyen y miden campañas en Meta, LinkedIn y TikTok (simulación). |
| [`contrato-servicios/`](contrato-servicios/) | **Contrato de prestación de servicios** (personas naturales ↔ empresa, Colombia): página para editar, firmar y descargar en Word o PDF. Incluye los archivos `.docx` y `.pdf` en `plantilla/`. |
| [`cronograma-entregables/`](cronograma-entregables/) | **Cronograma de entregables** por fases (Gantt): lo entregado a la fecha, los entregables de la Fase 1 y plantillas para fases siguientes. Configurable desde la página o desde `datos.js`. |
| [`portafolio/`](portafolio/) | **Portafolio de Duvan Perilla / ByteNova**: resumen interactivo del trabajo en Picap y de los proyectos personales publicados en GitHub. |

La raíz del repositorio (`index.html`) muestra un índice con enlaces a cada proyecto.

## Despliegue en Vercel

Opción A — un proyecto por carpeta (recomendado):

1. **Add New → Project → Import** este repositorio.
2. En **Root Directory** elegir la carpeta (`smartline-fase-1`, `contrato-servicios`, `cronograma-entregables` o `portafolio`).
3. Framework Preset: **Other**, sin comando de build. **Deploy**.

Opción B — todo el repositorio en un solo proyecto: sin cambiar el Root Directory, cada proyecto
queda en su ruta (`/smartline-fase-1/`, `/contrato-servicios/`, `/cronograma-entregables/`, `/portafolio/`) y la raíz muestra el índice.
