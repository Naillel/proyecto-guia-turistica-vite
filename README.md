# Guía Turística Multimedia de Costa Rica

Aplicación web interactiva que explora destinos turísticos de Costa Rica,
construida **exclusivamente con Web Components nativos** (Custom Elements v1,
Shadow DOM v1, HTML Templates y ES Modules). No usa frameworks ni librerías
para la interfaz. Integra imágenes, audio y datos estructurados en JSON
cargados dinámicamente con `fetch()`.

Proyecto Final — IF7102 Multimedios · UCR · I Ciclo 2026.

---

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior.
- [pnpm](https://pnpm.io/) (gestor de paquetes usado por el proyecto).

```bash
npm install -g pnpm
```

## Cómo ejecutar (servidor local para los ES Modules)

Los Web Components se cargan como **ES Modules**, por lo que el proyecto debe
servirse desde un servidor HTTP (no abriendo `index.html` con doble clic, que
usa el protocolo `file://` y bloquea los módulos y el `fetch`).

1. Instalar dependencias:

   ```bash
   pnpm install
   ```

2. Levantar el servidor de desarrollo (sirve la carpeta `src/`):

   ```bash
   pnpm dev
   ```

3. Abrir el navegador en la URL que indique la consola
   (por defecto <http://localhost:1234>).

> Alternativa sin pnpm: cualquier servidor estático sobre `src/` funciona, por
> ejemplo `python -m http.server` ejecutado dentro de `src/`, o la extensión
> *Live Server* de VS Code.

## Despliegue

```bash
pnpm deploy   # publica la carpeta src/ en GitHub Pages
```

---

## Estructura del proyecto

```
proyecto-guia-turistica-vite/
├── src/
│   ├── index.html              # Punto de entrada; importa los módulos
│   ├── styles.css              # Presentación de las secciones de la página
│   ├── components/             # Un archivo .js por Custom Element
│   │   ├── app-header.js       # <app-header>      barra de navegación
│   │   ├── destino-card.js     # <destino-card>    tarjeta resumen
│   │   ├── destino-detalle.js  # <destino-detalle> modal de detalle
│   │   ├── galeria-imagenes.js # <galeria-imagenes> carrusel de fotos
│   │   └── audio-guia.js       # <audio-guia>      reproductor de audio
│   ├── css/
│   │   └── global.css          # Estilos globales (reset, variables, tipografía)
│   ├── data/
│   │   └── destinos.json       # Catálogo de destinos
│   └── assets/
│       ├── img/                # Imágenes de los destinos
│       ├── audio/              # Audioguías
│       └── video/              # Video del hero
├── docs/
│   └── documentacion-tecnica.md  # Diagrama de componentes, eventos y diseño
├── CREDITOS.md                 # Fuentes y licencias de los recursos multimedia
└── README.md
```

## Componentes (Custom Elements)

| Elemento             | Rol                                                        |
|----------------------|------------------------------------------------------------|
| `<app-header>`       | Barra de navegación con el menú de regiones.               |
| `<destino-card>`     | Tarjeta resumen de un destino (portada, nombre, región).   |
| `<destino-detalle>`  | Modal completo; integra `<galeria-imagenes>` y `<audio-guia>`. |
| `<galeria-imagenes>` | Galería con navegación anterior/siguiente.                 |
| `<audio-guia>`       | Reproductor de audio con play/pausa y barra de progreso.   |

Los eventos personalizados entre componentes se documentan en
[`docs/documentacion-tecnica.md`](docs/documentacion-tecnica.md).
