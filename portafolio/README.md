# Portafolio · Duvan Perilla / ByteNova

Resumen interactivo del trabajo de Duvan Perilla: experiencia en **Picap** (portal de monitoreo y
prevención de fraude, agente de voz, procesos automáticos) y **proyectos personales** públicos en
GitHub, con la misma identidad visual de las demos ByteNova → Smartline.

## Secciones

- **Inicio**: perfil, contadores animados y flujo "cómo trabajo".
- **Qué hago**: cuatro pilares (fraude y BI, automatización, agentes de IA, apps).
- **Picap**: pestañas por proyecto; el portal muestra sus módulos en tarjetas desplegables y el
  agente de voz un flujo animado con resultados antes/después.
- **Proyectos personales**: tarjetas con filtros por categoría, enlace al código y a la demo
  publicada cuando existe.
- **Stack** y **contacto**.

## Cómo se edita

Todo el contenido está en `assets/js/datos.js` (perfil, pilares, proyectos de Picap y sus módulos,
lista de repositorios con categorías y enlaces, stack). No hay que tocar el HTML.
Para retirar la mención "presentado a Smartline", vacía `perfil.presentadoA`.

Repositorios incluidos: los públicos de [github.com/DuvanP11](https://github.com/DuvanP11),
excepto VocalIA (y su API), DuvanP11.github.io, Nova (asistente local) y Nova Memoria.

## Ejecutar y desplegar

Sin dependencias ni build:

```bash
git clone https://github.com/DuvanP11/Portafolio.git
cd Portafolio
python3 -m http.server 8080
```

Vercel: **Add New → Project** → importar `DuvanP11/Portafolio` → preset *Other*, sin build ni
Root Directory → **Deploy**. Cada `git push` a `main` redespliega.
