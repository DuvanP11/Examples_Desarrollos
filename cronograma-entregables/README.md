# Cronograma de entregables · ByteNova → Smartline

Cronograma tipo Gantt, **de demostración y configurable**, con los entregables del proyecto por
fases: lo ya entregado (Fase 0), los tres entregables de la **Fase 1 – Marketing + Medición** y
bloques de plantilla para las fases siguientes.

## Qué muestra

- **Indicadores**: entregables, completados, en curso, pendientes, atrasados, avance global y
  días para cerrar la fase activa.
- **Línea de tiempo (Gantt)** por fase y entregable, con barra de avance dentro de cada
  entregable, escala por días o semanas y una línea roja con la **fecha de referencia**.
- **Detalle por fase**: tarjetas con descripción, fechas, responsable, criterio de aceptación,
  barra de avance, lista de tareas marcables y enlace al entregable cuando existe.

Los estados se calculan solos a partir del avance y de la fecha de referencia:
`Completado` (100 %), `Atrasado` (fecha fin superada sin llegar a 100 %), `En curso`,
`Pendiente` y `Por definir` (fases o entregables marcados como plantilla).

## Cómo se configura

**Opción 1 — desde la página** (se guarda en el navegador):

- **Modo edición** → editar o eliminar fases y entregables, añadir nuevos (`+ Fase`,
  `+ Entregable`), añadir tareas con su dependencia (por ejemplo, "Smartline").
- Marcar tareas en las tarjetas: el avance del entregable se recalcula con las tareas hechas.
- **Exportar JSON** para guardar o compartir el cronograma; **Importar JSON** para cargarlo en
  otro navegador; **Restablecer** vuelve al archivo de datos.

**Opción 2 — en el archivo `assets/js/datos.js`** (fuente de la plantilla que ve todo el mundo):
cada fase es un bloque con `id`, `nombre`, `color`, `inicio`, `fin`, `descripcion` y su lista de
`entregables` (`nombre`, `descripcion`, `inicio`, `fin`, `responsable`, `avance`, `criterio`,
`enlace`, `tareas`). Para una fase futura sin alcance aún, `porDefinir: true`.
Para copiar a `datos.js` lo editado en la página, exporte el JSON y pegue su contenido en
`window.CRONOGRAMA = { … }`.

## Presentación

- **Fecha de referencia**: cambia el "hoy" para mostrar cómo se vería el cronograma en cualquier
  fecha; **Hoy** vuelve a la fecha real.
- **Simular avance**: recorre el calendario día a día desde el inicio y muestra el avance que
  tendría cada entregable si se cumpliera en su fecha (no modifica los datos guardados).
- Filtros por fase (chips) para enfocar la vista.

## Ejecutar y desplegar

Sin dependencias ni build:

```bash
cd cronograma-entregables
python3 -m http.server 8080
```

Vercel: **Add New → Project** → importar `DuvanP11/Examples_Desarrollos` → **Root Directory**
`cronograma-entregables` → preset *Other* → **Deploy**. Si el repositorio completo ya está
desplegado, queda en `/cronograma-entregables/`.

Los enlaces "Ver entregable" de la Fase 0 apuntan a `../smartline-fase-1/` y
`../contrato-servicios/`; si el cronograma se despliega como proyecto independiente, cámbielos por
las URL públicas de cada proyecto en `datos.js` (o desde el modo edición).
