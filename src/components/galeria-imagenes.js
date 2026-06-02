
/**
 * <galeria-imagenes>
 * Galería con navegación anterior/siguiente entre fotos de un destino.
 * Atributo observado: imagenes (array JSON serializado con las rutas)
 * Controles de navegación estilizados y encapsulados con Shadow DOM.
 *
 * Uso:
 *   <galeria-imagenes imagenes='["img1.jpg","img2.jpg"]'></galeria-imagenes>
 */
class GaleriaImagenes extends HTMLElement {
  static get observedAttributes() {
    return ['imagenes'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._index = 0;     // Índice actual
    this._imgs  = [];    // Array de rutas
  }

  // ── Ciclo de vida ───────────────────────────────────────────────────────
  connectedCallback() {
    this._parseImagenes();
    this._render();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'imagenes' && oldVal !== newVal) {
      this._index = 0;
      this._parseImagenes();
      if (this.shadowRoot.innerHTML !== '') {
        this._render();
        this._bindEvents();
      }
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  _parseImagenes() {
    try {
      const raw = this.getAttribute('imagenes') || '[]';
      this._imgs = JSON.parse(raw);
    } catch {
      this._imgs = [];
    }
    // Asegurar que sea array
    if (!Array.isArray(this._imgs)) this._imgs = [];
  }

  _prev() {
    this._index = (this._index - 1 + this._imgs.length) % this._imgs.length;
    this._updateSlide();
  }

  _next() {
    this._index = (this._index + 1) % this._imgs.length;
    this._updateSlide();
  }

  // Actualiza imagen y contador sin re-renderizar todo
  _updateSlide() {
    const img     = this.shadowRoot.querySelector('.gal-img');
    const counter = this.shadowRoot.querySelector('.counter');
    const dots    = this.shadowRoot.querySelectorAll('.dot');

    if (img) {
      img.classList.add('fade-out');
      setTimeout(() => {
        img.src = this._imgs[this._index] || '';
        img.alt = `Foto ${this._index + 1}`;
        img.classList.remove('fade-out');
      }, 180);
    }
    if (counter) {
      counter.textContent = `${this._index + 1} / ${this._imgs.length}`;
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === this._index));
  }

  // ── Render ──────────────────────────────────────────────────────────────
  _render() {
    const total   = this._imgs.length;
    const src     = this._imgs[this._index] || '';
    const hasMany = total > 1;

    // Generar dots de navegación
    const dotsHtml = this._imgs.map((_, i) =>
      `<button class="dot${i === this._index ? ' active' : ''}"
               aria-label="Ir a foto ${i + 1}"
               data-index="${i}"></button>`
    ).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: #111;
          font-family: 'Segoe UI', system-ui, sans-serif;
          user-select: none;
        }

        /* ── Imagen ── */
        .gal-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #1a1a1a;
          overflow: hidden;
        }
        .gal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: opacity 0.18s ease;
        }
        .gal-img.fade-out {
          opacity: 0;
        }

        /* ── Botones de nav ── */
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: background 0.18s ease, transform 0.18s ease;
          z-index: 2;
          padding: 0;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.32);
          transform: translateY(-50%) scale(1.1);
        }
        .nav-btn:active {
          transform: translateY(-50%) scale(0.96);
        }
        .nav-btn.prev { left: 10px; }
        .nav-btn.next { right: 10px; }
        .nav-btn svg  { pointer-events: none; }

        /* ── Contador ── */
        .counter {
          position: absolute;
          top: 10px;
          right: 12px;
          background: rgba(0,0,0,0.45);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 99px;
          letter-spacing: 0.05em;
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        /* ── Dots ── */
        .dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 2;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .dot.active {
          background: #fff;
          transform: scale(1.35);
        }

        /* ── Sin imágenes ── */
        .empty-state {
          width: 100%;
          aspect-ratio: 16 / 9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #555;
          font-size: 13px;
          background: #1a1a1a;
        }
        .empty-state svg { opacity: 0.3; }
      </style>

      ${total === 0
        ? `<div class="empty-state" role="img" aria-label="Sin imágenes">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5">
               <rect x="3" y="3" width="18" height="18" rx="2"/>
               <circle cx="8.5" cy="8.5" r="1.5"/>
               <polyline points="21,15 16,10 5,21"/>
             </svg>
             Sin imágenes disponibles
           </div>`
        : `<div class="gal-img-wrap">
             <img class="gal-img" src="${src}" alt="Foto ${this._index + 1}"
                  loading="lazy">
             ${total > 1 ? `<span class="counter">${this._index + 1} / ${total}</span>` : ''}
             ${hasMany
               ? `<button class="nav-btn prev" aria-label="Foto anterior">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5"
                         stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="15,18 9,12 15,6"/>
                    </svg>
                  </button>
                  <button class="nav-btn next" aria-label="Foto siguiente">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5"
                         stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9,18 15,12 9,6"/>
                    </svg>
                  </button>
                  <div class="dots">${dotsHtml}</div>`
               : ''
             }
           </div>`
      }
    `;
  }

  // ── Eventos ─────────────────────────────────────────────────────────────
  _bindEvents() {
    const prev = this.shadowRoot.querySelector('.nav-btn.prev');
    const next = this.shadowRoot.querySelector('.nav-btn.next');

    if (prev) prev.addEventListener('click', () => this._prev());
    if (next) next.addEventListener('click', () => this._next());

    // Dots
    this.shadowRoot.querySelectorAll('.dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        this._index = parseInt(dot.dataset.index, 10);
        this._updateSlide();
      });
    });

    // Swipe táctil
    let startX = 0;
    const wrap = this.shadowRoot.querySelector('.gal-img-wrap');
    if (wrap) {
      wrap.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      wrap.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? this._next() : this._prev();
        }
      }, { passive: true });
    }

    // Teclado (cuando el componente tiene foco)
    this.setAttribute('tabindex', '0');
    this.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); this._prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this._next(); }
    });
  }
}

customElements.define('galeria-imagenes', GaleriaImagenes);