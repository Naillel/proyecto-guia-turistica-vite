/**
 * <destino-detalle>
 * Modal de detalle de un destino turístico.
 * Recibe el objeto destino a través de la propiedad JS `destino`
 * (no por atributo, porque incluye arrays/objetos).
 *
 * Integra internamente los componentes <galeria-imagenes> y <audio-guia>,
 * tal como exige la especificación del proyecto.
 *
 * Emite CustomEvent('detalle-cerrado') cuando el usuario cierra el modal.
 *
 * Uso:
 *   const det = document.querySelector('destino-detalle');
 *   det.destino = { id, nombre, region, descripcion, galeria, audio, ... };
 */
class DestinoDetalle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._destino = null;
  }

  // ── API pública ─────────────────────────────────────────────────────────
  set destino(data) {
    this._destino = data || null;
    this._render();
    this._bindEvents();
  }
  get destino() { return this._destino; }

  connectedCallback() {
    if (!this.shadowRoot.innerHTML) this._render();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  _regionShort(region) {
    const map = {
      'Huetar Atlantica': 'Caribe',
      'Huetar Caribe':    'Caribe',
      'Huetar Norte':     'Zona Norte',
      'Central':          'Valle Central',
      'Chorotega':        'Guanacaste',
      'Pacifico Central': 'Pacífico Central'
    };
    return map[region] || region || 'Costa Rica';
  }

  _fmtCoord(value, posLabel, negLabel) {
    if (value == null || isNaN(value)) return '—';
    const abs = Math.abs(value).toFixed(4);
    return `${abs}° ${value >= 0 ? posLabel : negLabel}`;
  }

  // ── Render ──────────────────────────────────────────────────────────────
  _render() {
    const d = this._destino;
    if (!d) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    // Construir el array de imágenes para <galeria-imagenes>.
    const galeria = Array.isArray(d.galeria) && d.galeria.length
      ? d.galeria
      : (d.imagen_portada ? [d.imagen_portada] : []);
    const actividades = Array.isArray(d.actividades) ? d.actividades : [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', system-ui, sans-serif;
          color: #e8e8e8;
        }

        .modal {
          background: linear-gradient(160deg, #2a2a2a 0%, #1f1f1f 100%);
          border-radius: 18px;
          padding: 28px 30px 26px;
          position: relative;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.06);
        }

        /* ── Botón cerrar ── */
        .close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: none;
          color: #d4d4d4;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.18s ease, transform 0.15s ease;
          font-size: 18px;
          line-height: 1;
        }
        .close-btn:hover { background: rgba(255,255,255,0.16); transform: rotate(90deg); }

        /* ── Encabezado ── */
        .region-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #4ec5b8;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-bottom: 6px;
        }
        .titulo {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 2.1rem;
          font-weight: 600;
          margin: 0 0 10px;
          color: #fff;
          line-height: 1.15;
        }
        .tipo-badge {
          display: inline-block;
          background: #2e7d63;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 99px;
          margin-bottom: 18px;
        }

        /* ── Grid de contenido ── */
        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          align-items: start;   /* evita que la galería se estire (fondo negro) */
          gap: 22px;
          margin-bottom: 18px;
        }

        @media (max-width: 640px) {
          .content-grid { grid-template-columns: 1fr; }
        }

        /* Columna izquierda: galería + ubicación apiladas */
        .col-galeria {
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-width: 0;
        }

        /* La galería se delega al componente <galeria-imagenes> */
        galeria-imagenes {
          border-radius: 12px;
          overflow: hidden;
        }

        /* ── Texto descriptivo ── */
        .desc-bloque h3 {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.15rem;
          color: #fff;
          margin: 0 0 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .desc-bloque h3 svg { color: #d97757; }
        .desc-bloque p {
          font-size: 14px;
          line-height: 1.6;
          color: #c8c8c8;
          margin: 0 0 16px;
        }

        .actividades-titulo {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 1.1rem;
          color: #fff;
          margin: 0 0 8px;
        }
        ul.actividades {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul.actividades li {
          font-size: 13.5px;
          color: #c8c8c8;
          padding: 4px 0 4px 14px;
          position: relative;
          line-height: 1.5;
        }
        ul.actividades li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 13px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #4ec5b8;
        }

        /* ── Ubicación ── */
        .ubicacion-box {
          background: rgba(40,55,55,0.6);
          border: 1px solid rgba(78,197,184,0.18);
          border-radius: 12px;
          padding: 14px 16px;
          margin-top: 0;
        }
        .ubicacion-box h4 {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 14px;
          margin: 0 0 10px;
          color: #fff;
        }
        .ubicacion-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .ubicacion-grid .ub-label {
          font-size: 11px;
          color: #9aa9a9;
          text-transform: none;
          margin-bottom: 2px;
        }
        .ubicacion-grid .ub-valor {
          font-size: 14px;
          color: #4ec5b8;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        /* ── Audio ── */
        .audio-box {
          background: rgba(35,40,35,0.6);
          border: 1px solid rgba(125,216,125,0.18);
          border-radius: 12px;
          padding: 14px 16px 18px;
          margin-top: 18px;
        }
        .audio-box .audio-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 14px;
          color: #fff;
          margin-bottom: 10px;
        }
        .audio-box .audio-title svg { color: #7dd87d; }

        .no-audio {
          font-size: 12px;
          color: #8a8a8a;
          padding: 8px 0;
        }
      </style>

      <div class="modal" role="document">
        <button class="close-btn" aria-label="Cerrar detalle">✕</button>

        <div class="region-tag">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${this._regionShort(d.region)}
        </div>

        <h2 class="titulo">${d.nombre || 'Destino sin nombre'}</h2>
        <span class="tipo-badge">Destino Imperdible</span>

        <div class="content-grid">
          <!-- Columna izquierda: galería (componente reutilizable) + ubicación -->
          <div class="col-galeria">
            <galeria-imagenes imagenes='${JSON.stringify(galeria)}'></galeria-imagenes>

            ${(d.lat != null && d.lng != null) ? `
              <div class="ubicacion-box">
                <h4>Ubicación Geográfica</h4>
                <div class="ubicacion-grid">
                  <div>
                    <div class="ub-label">Latitud:</div>
                    <div class="ub-valor">${this._fmtCoord(d.lat, 'N', 'S')}</div>
                  </div>
                  <div>
                    <div class="ub-label">Longitud:</div>
                    <div class="ub-valor">${this._fmtCoord(d.lng, 'E', 'W')}</div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Descripción y actividades -->
          <div class="desc-bloque">
            <h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"/>
              </svg>
              Descripción
            </h3>
            <p>${d.descripcion || 'Sin descripción disponible.'}</p>

            ${actividades.length ? `
              <h4 class="actividades-titulo">Actividades</h4>
              <ul class="actividades">
                ${actividades.map(a => `<li>${a}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>

        <!-- Audio guía: componente reutilizable <audio-guia> -->
        <div class="audio-box">
          <div class="audio-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
              <path d="M15.54,8.46a5,5,0,0,1,0,7.07"/>
              <path d="M19.07,4.93a10,10,0,0,1,0,14.14"/>
            </svg>
            Audio Guía
          </div>
          ${d.audio
            ? `<audio-guia src="${d.audio}" label="Guía de ${d.nombre || 'destino'}"></audio-guia>`
            : `<div class="no-audio">Audio guía próximamente disponible.</div>`}
        </div>
      </div>
    `;
  }

  // ── Eventos ─────────────────────────────────────────────────────────────
  _bindEvents() {
    const closeBtn = this.shadowRoot.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('detalle-cerrado', {
          bubbles: true,
          composed: true
        }));
      });
    }
  }
}

customElements.define('destino-detalle', DestinoDetalle);
