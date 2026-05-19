# Cuestionario Piscinas · Aetheria

Cuestionario técnico interactivo para que el productor Sr Wolf rellene las specs de las 5 piscinas del proyecto HBO. Permite que la generación de cada vídeo (Lebrija, Utera, San Martín, Jerez, Rota) salga clavada a la primera sin tener que adivinar materiales, posiciones de skimmers o tipos de escalera.

**Stack:** HTML/CSS/JS estático, hosteado en GitHub Pages, backend de formularios vía **FormSubmit.co** (sin DB ni servidor propio).

---

## 🚀 Deploy en GitHub Pages (paso a paso)

### 1. Guardar el logo de Aetheria

Coloca el archivo `logo-aetheria.png` (PNG con fondo blanco está bien, ideal PNG con transparencia) en la carpeta:

```
aetheria-piscinas-form/assets/logo-aetheria.png
```

### 2. Crear el repositorio en GitHub

Opción A — Manual (más rápido):

1. Ve a https://github.com/new
2. **Repository name:** `aetheria-piscinas-form`
3. **Visibility:** Public (necesario para GitHub Pages free)
4. **NO** marques "Add a README" ni "Add .gitignore" (ya los tenemos)
5. Click **Create repository**

Opción B — Con `gh` CLI (si lo tienes instalado):

```bash
gh repo create aetheria-piscinas-form --public --source . --remote origin
```

### 3. Push del código

Abre PowerShell o Git Bash en la carpeta del proyecto:

```bash
cd "C:\Users\ivanj\Desktop\Programas Clientes\aetheria-piscinas-form"
git init
git add .
git commit -m "feat: initial pool questionnaire form"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/aetheria-piscinas-form.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` con tu usuario de GitHub (probablemente `aetheriaagency` o el que uses para los proyectos de Aetheria).

### 4. Activar GitHub Pages

1. En el repo de GitHub → **Settings** → **Pages** (menú lateral izquierdo)
2. **Source:** Deploy from a branch
3. **Branch:** `main` · `/(root)` · **Save**
4. Espera 1-2 minutos hasta que aparezca el banner verde con la URL pública:

```
https://TU_USUARIO.github.io/aetheria-piscinas-form/
```

### 5. Activar FormSubmit (UN SOLO PASO requerido)

FormSubmit es gratis y no requiere registro. La PRIMERA vez que el formulario se envíe a `info@aetheriaagency.es`:

1. FormSubmit te enviará un email pidiendo confirmar la dirección
2. Abre ese email y haz click en el enlace "Confirm your email"
3. A partir de ese momento, todos los envíos llegarán automáticamente sin intervención

> 💡 Tip: para probarlo desde tu lado, abre la URL en el navegador, rellena un campo y dale a Enviar. Te llegará el email de confirmación.

### 6. (Opcional) Custom domain

Si quieres usar `aetheriaagency.es/piscinas` o similar, en **Settings → Pages → Custom domain** añade el dominio y configura el DNS en tu proveedor (CNAME → `TU_USUARIO.github.io`).

---

## 📁 Estructura del proyecto

```
aetheria-piscinas-form/
├── index.html          → Formulario principal con 5 tabs (1 por piscina)
├── thanks.html         → Página de confirmación tras enviar
├── style.css           → Estilos light theme con paleta violeta/cyan
├── script.js           → Lógica: tabs, autosave (localStorage), validación
├── assets/
│   └── logo-aetheria.png  → Logo (lo añades tú)
└── README.md           → Este archivo
```

## ✨ Funcionalidades

- **5 tabs** (Lebrija · Utera · San Martín · Jerez · Rota) — el productor cambia entre piscinas
- **7 secciones colapsables** por piscina: Forma, Playa, Escalera/Banco, Elementos técnicos, Acabados, Sistema constructivo, Fotos
- **Autosave con localStorage** → si cierra el navegador, recupera los datos al volver
- **Indicador de progreso** por tab (◔ ◑ ◕ ✓)
- **Upload de fotos múltiples** (JPG, PNG, PDF) por piscina
- **Validación de tipos** (números donde toca, etc.)
- **Submit via FormSubmit.co** → email a `info@aetheriaagency.es` con todas las respuestas en tabla + fotos adjuntas
- **Auto-response al productor** confirmándole que recibimos
- **Responsive móvil** — funciona perfecto desde el teléfono
- **Branding Aetheria** — paleta violeta/cyan inspirada en el logo

## 🛠️ Mantenimiento

- Para añadir/quitar piscinas: edita el array `POOLS` en `script.js`
- Para añadir/quitar preguntas: edita el `<template id="poolSectionTemplate">` en `index.html`
- Para cambiar el email destino: edita `action="https://formsubmit.co/EMAIL"` en `index.html`
- Los datos en localStorage se guardan bajo la key `aetheria-piscinas-form-v1`

## 📤 Cómo se reciben las respuestas

Cuando el productor pulsa "Enviar", FormSubmit:

1. Procesa las respuestas (todas las piscinas en un solo envío)
2. Las formatea en tabla legible
3. Adjunta todas las fotos subidas
4. Envía a `info@aetheriaagency.es` con asunto: **🏊 Nuevo cuestionario piscinas — Aetheria**
5. Envía al productor un email de confirmación automática

Asunto del email: `🏊 Nuevo cuestionario piscinas — Aetheria`

---

**Aetheria** · Producción Sr Wolf · HBO · 2026
