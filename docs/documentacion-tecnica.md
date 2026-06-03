# Documentación técnica — Guía Turística Multimedia de Costa Rica

IF7102 Multimedios · UCR · I Ciclo 2026

Este documento describe la arquitectura de Web Components, los Custom Events
que comunican a los componentes y las decisiones de diseño del proyecto.
(Fuente del PDF de entrega; exportar a PDF para la entrega final.)

---

## 1. Diagrama de componentes

```
index.html  (orquestador / módulo principal)
│
├── <app-header>                  Barra de navegación + menú de regiones
│
├── <main>
│   ├── #cards-container
│   │   └── <destino-card> × N    Generadas dinámicamente desde destinos.json
│   │
│   ├── Sandbox (demostración de componentes aislados)
│   │   ├── <galeria-imagenes>
│   │   └── <audio-guia>
│   │
│   └── Mapa SVG interactivo (tooltip por región)
│
└── #overlay (modal)
    └── <destino-detalle>         Composición de:
        ├── <galeria-imagenes>    galería del destino
        └── <audio-guia>          audioguía del destino
```

Relación de **composición** (un componente usa a otro internamente):

```
<destino-detalle> ──contiene──▶ <galeria-imagenes>
                  ──contiene──▶ <audio-guia>
```

Todos los componentes encapsulan su estructura y estilos con **Shadow DOM**
(`attachShadow({ mode: 'open' })`), por lo que su CSS no se filtra ni es
afectado por los estilos globales de la página.

---

## 2. Custom Events entre componentes

La comunicación es **desacoplada**: los componentes emiten eventos que viajan
por el DOM (`bubbles: true, composed: true` para cruzar el límite del Shadow
DOM) y `index.html` actúa como coordinador que los escucha.

| Evento             | Lo emite             | Lo escucha   | `detail`        | Efecto                                            |
|--------------------|----------------------|--------------|-----------------|---------------------------------------------------|
| `region-selected`  | `<app-header>`       | `index.html` | `{ region }`    | Filtra el grid de tarjetas por región.            |
| `destino-selected` | `<destino-card>`     | `index.html` | `{ id }`        | Abre el modal `<destino-detalle>` con ese destino.|
| `detalle-cerrado`  | `<destino-detalle>`  | `index.html` | —               | Cierra el modal.                                  |

### Flujo de interacción

```
Usuario clic en región
   └─▶ <app-header> dispatchEvent('region-selected', { region })
          └─▶ index.html filtra appState.destinos y re-renderiza el grid

Usuario clic en una tarjeta
   └─▶ <destino-card> dispatchEvent('destino-selected', { id })
          └─▶ index.html busca el destino y hace detalle.destino = {...}
                 └─▶ <destino-detalle> renderiza y compone
                       <galeria-imagenes> + <audio-guia>

Usuario cierra el modal (botón ✕ / Esc / clic en el fondo)
   └─▶ <destino-detalle> dispatchEvent('detalle-cerrado')
          └─▶ index.html oculta el overlay
```

---

## 3. Atributos y propiedades observadas

| Componente           | Atributos observados              | Propiedad JS    | Notas                                                  |
|----------------------|-----------------------------------|-----------------|--------------------------------------------------------|
| `<app-header>`       | `active-region`                   | `regiones`      | `active-region` resalta el botón activo; `regiones` recibe la lista derivada del JSON. |
| `<destino-card>`     | `destino-id`, `nombre`, `imagen`, `region` | —      | Reacciona a cambios de atributo re-renderizando.       |
| `<destino-detalle>`  | —                                 | `destino`       | Recibe el objeto completo por propiedad (incluye arrays). |
| `<galeria-imagenes>` | `imagenes`                        | —               | Array JSON serializado con las rutas.                  |
| `<audio-guia>`       | `src`, `label`                    | —               | Usa `<audio>` nativo dentro del Shadow DOM.            |

---

## 4. Datos

- Los destinos se cargan dinámicamente desde
  [`src/data/destinos.json`](../src/data/destinos.json) con `fetch()`; **no**
  están escritos en el HTML.
- El menú de regiones de `<app-header>` se deriva del propio JSON
  (`[...new Set(destinos.map(d => d.region))]`) para mantener una **fuente única
  de datos**.
- Estructura de cada destino: `id`, `nombre`, `region`, `descripcion`,
  `imagen_portada`, `galeria[]`, `audio`, `video`, `actividades[]`, `lat`, `lng`.

---

## 5. Decisiones de diseño

1. **Web Components nativos, sin frameworks.** Cumple el requisito del curso y
   mantiene la app dependiente solo de APIs del navegador.
2. **Shadow DOM en todos los componentes.** Encapsula estilos y evita colisiones
   de CSS entre componentes y con la página.
3. **Comunicación por Custom Events** (`composed: true`) en lugar de llamadas
   directas: los componentes no se conocen entre sí, solo emiten/escuchan
   eventos. Esto reduce el acoplamiento.
4. **Composición de componentes:** `<destino-detalle>` reutiliza
   `<galeria-imagenes>` y `<audio-guia>` en vez de duplicar esa lógica.
5. **Separación de responsabilidades:** `global.css` (reset + variables +
   tipografía) ↔ `styles.css` (secciones de la página) ↔ Shadow DOM (estilo de
   cada componente).
6. **Accesibilidad básica:** textos `alt` en imágenes, `aria-label` en
   controles, navegación por teclado (Enter/Espacio en tarjetas, flechas en la
   galería, Esc para cerrar el modal) y `role`/`aria-*` en el modal y el tooltip.
7. **Degradación elegante:** si una imagen o un audio no carga, el componente
   muestra un estado de respaldo en lugar de romperse.
8. **Diseño responsivo:** grid fluido de tarjetas y *media queries* para móvil.

---

## 6. Pendientes conocidos (para la entrega final)

- Asignar fotografías propias/libres a los destinos que aún no tienen imagen
  (Quebrada Gata, Manzanillo, Parque Los Quetzales, Sanatorio Durán, Ecomuseo
  Abangares, Las Pumas) y registrarlas en `CREDITOS.md`.
- Integrar video por destino (campo `video` del JSON) y, opcionalmente, el
  componente de bono `<video-destino>`.
- Completar `CREDITOS.md` con fuente y licencia de cada recurso.
