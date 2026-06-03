/**
 * <app-header>
 * Barra de navegación principal de la guía turística.
 *
 * Responsabilidades:
 *   - Mostrar el nombre/identidad de la guía.
 *   - Renderizar un menú de regiones.
 *   - Emitir CustomEvent('region-selected') con { region } al hacer clic.
 *   - Resaltar la región activa mediante el atributo observado `active-region`.
 *
 * Estilos completamente encapsulados con Shadow DOM.
 *
 * Uso:
 *   <app-header active-region="Todos"></app-header>
 *
 *   // Opcional: definir las regiones desde el JSON (fuente única de datos)
 *   document.querySelector('app-header').regiones = ['Huetar Caribe', 'Central', ...];
 */
class AppHeader extends HTMLElement {
  // ── Atributos observados ────────────────────────────────────────────────
  static get observedAttributes() {
    return ['active-region'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Regiones por defecto; pueden sobrescribirse con la propiedad `regiones`.
    this._regiones = ['Todos', 'Huetar Caribe', 'Huetar Norte', 'Central', 'Chorotega'];
  }

  // ── API pública ───────────────────────────────────────────────────────────
  /**
   * Define la lista de regiones del menú. Se antepone siempre "Todos".
   * @param {string[]} arr - Nombres de región (idealmente derivados del JSON)
   */
  set regiones(arr) {
    if (Array.isArray(arr) && arr.length) {
      this._regiones = ['Todos', ...arr];
      if (this.shadowRoot.innerHTML !== '') {
        this._render();
        this._bindEvents();
      }
    }
  }
  get regiones() { return this._regiones; }

  get activeRegion() { return this.getAttribute('active-region') || 'Todos'; }

  // ── Ciclo de vida ───────────────────────────────────────────────────────
  connectedCallback() {
    this._render();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'active-region' && oldVal !== newVal && this.shadowRoot.innerHTML !== '') {
      this._updateActive();
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  _render() {
    const activa = this.activeRegion;

    const botones = this._regiones.map(region => `
      <button class="nav-link${region === activa ? ' active' : ''}"
              data-region="${region}"
              aria-pressed="${region === activa}">
        ${region}
      </button>
    `).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          padding: 12px 24px;
          background: rgba(26, 66, 8, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.22);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        /* ── Marca ── */
        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #fff;
          font-weight: 700;
          font-size: 1.02rem;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        .brand .logo {
          font-size: 1.3rem;
          line-height: 1;
        }
        .brand small {
          display: block;
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #a7c98f;
        }

        /* ── Menú de regiones ── */
        nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }
        .nav-link {
          font: inherit;
          font-size: 0.82rem;
          font-weight: 600;
          color: #e4eddc;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 99px;
          padding: 6px 14px;
          cursor: pointer;
          transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }
        .nav-link:focus-visible {
          outline: 2px solid #e8a020;
          outline-offset: 2px;
        }
        .nav-link.active {
          background: #e8a020;
          color: #1a1200;
          border-color: #e8a020;
        }

        @media (max-width: 600px) {
          .bar { padding: 10px 14px; }
          nav { width: 100%; justify-content: flex-start; overflow-x: auto; }
          .nav-link { padding: 6px 11px; font-size: 0.78rem; }
        }
      </style>

      <div class="bar">
        <div class="brand">
          <span class="logo" aria-hidden="true">🌿</span>
          <span>
            Guía Turística CR
            <small>Costa Rica</small>
          </span>
        </div>

        <nav aria-label="Filtrar destinos por región">
          ${botones}
        </nav>
      </div>
    `;
  }

  // ── Eventos ─────────────────────────────────────────────────────────────
  _bindEvents() {
    this.shadowRoot.querySelectorAll('.nav-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const region = btn.dataset.region;
        // Reflejar la selección en el propio atributo observado.
        this.setAttribute('active-region', region);
        // Notificar al resto de la aplicación.
        this.dispatchEvent(new CustomEvent('region-selected', {
          bubbles: true,
          composed: true,        // Atraviesa el Shadow DOM
          detail: { region }
        }));
      });
    });
  }

  // Actualiza el resaltado sin re-renderizar todo el componente.
  _updateActive() {
    const activa = this.activeRegion;
    this.shadowRoot.querySelectorAll('.nav-link').forEach(btn => {
      const esActiva = btn.dataset.region === activa;
      btn.classList.toggle('active', esActiva);
      btn.setAttribute('aria-pressed', String(esActiva));
    });
  }
}

customElements.define('app-header', AppHeader);
