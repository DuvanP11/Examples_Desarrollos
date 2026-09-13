# Contrato de prestación de servicios · Editor, firma y exportación

Modelo de **acuerdo/contrato de prestación de servicios** entre dos personas naturales
(contratistas) y una empresa (contratante) en Colombia, presentado como una página web donde
el documento se **edita**, se **firma** y se **descarga en Word o PDF** sin instalar nada.

> **Aviso.** Es un modelo de referencia redactado con base en el contexto jurídico y comercial
> colombiano. No constituye asesoría jurídica personalizada: antes de la firma definitiva debe
> revisarlo un abogado colombiano. No contiene datos reales; todos los campos por completar se
> muestran como `[●]`.

## Archivos listos para usar

En [`plantilla/`](plantilla/) están las dos versiones generadas desde la propia página, con
todos los campos vacíos:

| Archivo | Uso |
|---------|-----|
| `Contrato_Prestacion_Servicios_B2B_Colombia.docx` | Word completamente editable (Carta, márgenes de 2,54 cm, Arial, encabezado con el nombre del contrato y pie con "Página X de Y"). |
| `Contrato_Prestacion_Servicios_B2B_Colombia.pdf` | Mismo contenido y formato, paginado (16 páginas), con espacio para firmas manuscritas. |

## Qué hace la página

- **Campos `[●]` editables**: al hacer clic en cualquier campo amarillo se escribe directamente
  sobre el documento. Los que queden vacíos se exportan como `[●]`.
- **Editar texto libre**: botón que permite corregir cualquier párrafo, título o celda.
- **Firmas en pantalla**: tres paneles (representante legal, contratista 1 y contratista 2) para
  firmar con el ratón o el dedo, o cargar una imagen de la firma.
- **Descargar Word (.docx)**: genera el archivo en el navegador con los datos y las firmas
  incluidas.
- **Exportar PDF**: abre el diálogo de impresión del navegador; elija «Guardar como PDF».
  El encabezado y la numeración de páginas se generan automáticamente.
- **Guardado automático**: lo escrito y las firmas se conservan en el navegador (localStorage)
  hasta pulsar «Restablecer plantilla». Nada se envía a ningún servidor.

## Estructura del contrato

1. Partes · 2. Antecedentes · 3. Objeto · 4. Alcance y entregables · 5. Obligaciones de los
contratistas · 6. Obligaciones del contratante · 7. Valor, facturación y forma de pago ·
8. Aceptación de entregables · 9. Cambios de alcance · 10. Incumplimiento y mora ·
11. Suspensión del servicio · 12. Propiedad intelectual · 13. Confidencialidad ·
14. Protección de datos personales · 15. Independencia de las partes · 16. Responsabilidad ·
17. Vigencia y terminación · 18. Fuerza mayor o caso fortuito · 19. Solución de controversias ·
20. Legislación aplicable · 21. Notificaciones · 22. Integridad del acuerdo · 23. Anexos ·
24. Firmas · Nota final.

## Ejecutar localmente

Sin dependencias ni build (HTML, CSS y JavaScript). Se necesita servirla por HTTP para que el
navegador permita las descargas:

```bash
cd contrato-servicios
python3 -m http.server 8080
```

y abrir <http://localhost:8080>. Para generar el Word se carga JSZip desde un CDN público
(`cdnjs.cloudflare.com`); es el único recurso externo.

## Desplegar en Vercel

1. **Add New → Project** e importar `DuvanP11/Examples_Desarrollos`.
2. **Root Directory**: `contrato-servicios`. Framework Preset: **Other**. Sin build.
3. **Deploy**.

Si el repositorio completo ya está desplegado en otro proyecto de Vercel, la página también
queda disponible en la ruta `/contrato-servicios/`.

## Estructura de la carpeta

```
contrato-servicios/
├── index.html            # página (barra de herramientas + documento)
├── vercel.json
├── plantilla/            # Word y PDF generados con los campos vacíos
└── assets/
    ├── css/styles.css    # estilos de pantalla y de impresión (@page, encabezado, numeración)
    └── js/
        ├── contrato.js   # TEXTO DEL CONTRATO (fuente única; edítelo aquí para cambiar la plantilla)
        ├── app.js        # edición, firmas, guardado local, exportación
        └── docx.js       # generador de Word (.docx) sin librerías de terceros
```

Para cambiar el texto de la plantilla basta editar `assets/js/contrato.js`: los campos se
escriben como `[[Etiqueta]]` y la negrita como `**texto**`.

## Navegadores

Chrome, Edge y Safari recientes (escritorio y móvil). La numeración "Página X de Y" del PDF
exportado desde el navegador depende del soporte de `@page` del navegador; en Chrome/Edge
funciona; en otros puede aparecer sin numeración.
