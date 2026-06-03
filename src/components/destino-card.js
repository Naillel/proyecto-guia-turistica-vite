/**
 * <destino-card>
 * Tarjeta resumen de un destino turístico.
 * Atributos observados: destino-id, nombre, imagen, region
 * Emite CustomEvent('destino-selected') con { id } al hacer clic.
 * Estilos completamente encapsulados con Shadow DOM.
 */
class DestinoCard extends HTMLElement {
  // ── Atributos observados ────────────────────────────────────────────────
  static get observedAttributes() {
    return ['destino-id', 'nombre', 'imagen', 'region'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // ── Ciclo de vida ───────────────────────────────────────────────────────
  connectedCallback() {
    this._render();
    this._bindEvents();
  }

  attributeChangedCallback() {
    // Re-renderizar si el elemento ya está en el DOM
    if (this.shadowRoot.innerHTML !== '') {
      this._render();
      this._bindEvents();
    }
  }

  // ── Getters de atributos ────────────────────────────────────────────────
  get destinoId() { return this.getAttribute('destino-id') || ''; }
  get nombre()    { return this.getAttribute('nombre')     || 'Sin nombre'; }
  get imagen()    { return this.getAttribute('imagen')     || ''; }
  get region()    { return this.getAttribute('region')     || ''; }

  // ── Render ──────────────────────────────────────────────────────────────
  _render() {
    // Mapeo de región a color de acento
    const regionColors = {
      'Chorotega':         { bg: '#e8f5e3', badge: '#5a8a2e', text: '#2d4a14' },
      'Huetar Norte':      { bg: '#edf5e0', badge: '#8ab83a', text: '#4a6e1a' },
      'Central':           { bg: '#f5ede0', badge: '#c49a6c', text: '#6b4f28' },
      'Pacifico Central':  { bg: '#f0e8dc', badge: '#a07040', text: '#5a3a18' },
      'Huetar Caribe':     { bg: '#e0f3fa', badge: '#3aa0d8', text: '#1a5a80' },
      'Huetar Atlantica':  { bg: '#e0f3fa', badge: '#3aa0d8', text: '#1a5a80' },
    };
      'Huetar Caribe':     { bg: '#e0f3fa', badge: '#3aa0d8', text: '#1a5a80' },    };
    const color = regionColors[this.region] || { bg: '#f0f0f0', badge: '#666', text: '#333' };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          cursor: pointer;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1),
                      box-shadow 0.22s ease;
          font-family: 'Georgia', 'Times New Roman', serif;
          -webkit-tap-highlight-color: transparent;
        }
        :host(:hover) {
          transform: translateY(-5px) scale(1.01);
          box-shadow: 0 12px 32px rgba(0,0,0,0.14);
        }
        :host(:active) {
          transform: translateY(-2px) scale(0.99);
        }

        .card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: ${color.bg};
        }
        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        :host(:hover) .card-img-wrap img {
          transform: scale(1.06);
        }
        .card-img-wrap .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 45%,
            rgba(0,0,0,0.45) 100%
          );
          pointer-events: none;
        }
        /* Imagen de respaldo si no carga */
        .card-img-wrap .img-fallback {
          display: none;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: ${color.badge};
          background: ${color.bg};
        }

        .card-body {
          padding: 14px 16px 16px;
          background: #fff;
        }
        .region-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 99px;
          background: ${color.bg};
          color: ${color.text};
          border: 1px solid ${color.badge}44;
          margin-bottom: 7px;
        }
        .card-nombre {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .card-cta {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 10px;
          font-size: 12px;
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: ${color.badge};
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .card-cta svg {
          transition: transform 0.2s ease;
        }
        :host(:hover) .card-cta svg {
          transform: translateX(4px);
        }
      </style>

      <div class="card-img-wrap" role="img" aria-label="Imagen de ${this.nombre}">
        ${this.imagen
          ? `<img src="${this.imagen}" alt="${this.nombre}" loading="lazy"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''
        }
        <div class="img-fallback" style="${!this.imagen ? 'display:flex' : ''}">🌿</div>
        <div class="overlay"></div>
      </div>

      <div class="card-body">
        <span class="region-badge">${this.region || 'Costa Rica'}</span>
        <p class="card-nombre">${this.nombre}</p>
        <div class="card-cta">
          Ver destino
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    `;
  }

  // ── Eventos ─────────────────────────────────────────────────────────────
  _bindEvents() {
    this.shadowRoot.host.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('destino-selected', {
        bubbles: true,
        composed: true,          // Atraviesa el Shadow DOM
        detail: { id: this.destinoId }
      }));
    });

    // Accesibilidad: activar con teclado
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'button');
    this.setAttribute('aria-label', `Ver destino: ${this.nombre}`);
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }
}

customElements.define('destino-card', DestinoCard);