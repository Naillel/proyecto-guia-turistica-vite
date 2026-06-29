/**
 * <audio-guia>
 * Reproductor de audio personalizado con controles de play/pause
 * y barra de progreso. Usa <audio> nativo dentro del Shadow DOM.
 *
 * Atributos observados:
 *   src   — ruta del archivo de audio
 *   label — texto descriptivo del audio
 *
 * Uso:
 *   <audio-guia src="assets/audio/RioCeleste-Guia.mp3" label="Guía de Río Celeste"></audio-guia>
 */
class AudioGuia extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'label'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._playing  = false;
    this._duration = 0;
    this._current  = 0;
  }

  // ── Ciclo de vida ───────────────────────────────────────────────────────
  connectedCallback() {
    this._render();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (this.shadowRoot.innerHTML !== '') {
      if (name === 'src') {
        // Actualizar fuente sin re-renderizar completo
        const audio = this.shadowRoot.querySelector('audio');
        if (audio) {
          audio.src = newVal;
          audio.load();
          this._playing = false;
          this._updatePlayBtn();
        }
      } else {
        // Para label solo actualizar el texto
        const lbl = this.shadowRoot.querySelector('.ag-label');
        if (lbl) lbl.textContent = newVal;
      }
    }
  }

  disconnectedCallback() {
    // Pausar al desmontar para evitar audio huérfano
    const audio = this.shadowRoot.querySelector('audio');
    if (audio) audio.pause();
  }

  // ── Helpers de formato ──────────────────────────────────────────────────
  _fmt(secs) {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Render ──────────────────────────────────────────────────────────────
  _render() {
    const src   = this.getAttribute('src')   || '';
    const label = this.getAttribute('label') || 'Audio guía';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .ag-wrap {
          background: linear-gradient(135deg, #465852 0%, #5d8879 100%);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.18);
        }
        /* ── Encabezado ── */
        .ag-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ag-icon {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(90,200,90,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e0dbc9;
        }
        .ag-label {
          font-size: 13px;
          font-weight: 600;
          color: #d4edd4;
          line-height: 1.3;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ag-status {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #d1e0d1;
        }
        .ag-status.playing { color: #95df95; }
        /* ── Controles ── */
        .ag-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ag-play-btn {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #eaa638;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: background 0.18s ease, transform 0.15s ease;
          padding: 0;
        }
        .ag-play-btn:hover  { background: #6fa336; transform: scale(1.07); }
        .ag-play-btn:active { transform: scale(0.96); }
        .ag-play-btn svg    { pointer-events: none; }
        /* ── Barra de progreso ── */
        .ag-progress-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ag-progress-track {
          position: relative;
          height: 5px;
          border-radius: 99px;
          background: rgba(255,255,255,0.12);
          cursor: pointer;
          overflow: hidden;
        }
        .ag-progress-fill {
          height: 100%;
          border-radius: 99px;
          background: #7dd87d;
          width: 0%;
          transition: width 0.25s linear;
          pointer-events: none;
        }
        .ag-times {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          font-variant-numeric: tabular-nums;
        }
        /* ── Volumen ── */
        .ag-volume-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ag-vol-icon { color: #5a8a5a; flex-shrink: 0; }
        input[type="range"].ag-volume {
          -webkit-appearance: none;
          appearance: none;
          width: 64px;
          height: 4px;
          border-radius: 99px;
          background: rgba(255,255,255,0.12);
          outline: none;
          cursor: pointer;
        }
        input[type="range"].ag-volume::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #7dd87d;
          cursor: pointer;
        }
        input[type="range"].ag-volume::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #7dd87d;
          border: none;
          cursor: pointer;
        }
        /* Sin src */
        .ag-no-src {
          text-align: center;
          padding: 12px;
          color: #5a8a5a;
          font-size: 12px;
        }
      </style>

      <div class="ag-wrap">
        ${!src
          ? `<div class="ag-no-src">🎵 Sin audio disponible para este destino</div>`
          : `
          <div class="ag-header">
            <div class="ag-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
              </svg>
            </div>
            <span class="ag-label">${label}</span>
            <span class="ag-status" aria-live="polite">Parado</span>
          </div>

          <div class="ag-controls">
            <button class="ag-play-btn" aria-label="Reproducir audio">
              <svg class="icon-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
              <svg class="icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="display:none">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            </button>

            <div class="ag-progress-wrap">
              <div class="ag-progress-track" role="slider"
                   aria-label="Progreso del audio"
                   aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                <div class="ag-progress-fill"></div>
              </div>
              <div class="ag-times">
                <span class="time-current">0:00</span>
                <span class="time-total">0:00</span>
              </div>
            </div>

            <div class="ag-volume-wrap" title="Volumen">
              <span class="ag-vol-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/>
                  <path d="M15.54,8.46a5,5,0,0,1,0,7.07"/>
                  <path d="M19.07,4.93a10,10,0,0,1,0,14.14"/>
                </svg>
              </span>
              <input type="range" class="ag-volume"
                     min="0" max="1" step="0.05" value="1"
                     aria-label="Volumen">
            </div>
          </div>

          <audio preload="metadata" src="${src}"></audio>
        `}
      </div>
    `;
  }

  // ── Eventos ─────────────────────────────────────────────────────────────
  _bindEvents() {
    const audio     = this.shadowRoot.querySelector('audio');
    const playBtn   = this.shadowRoot.querySelector('.ag-play-btn');
    const track     = this.shadowRoot.querySelector('.ag-progress-track');
    const fill      = this.shadowRoot.querySelector('.ag-progress-fill');
    const timeCur   = this.shadowRoot.querySelector('.time-current');
    const timeTotal = this.shadowRoot.querySelector('.time-total');
    const status    = this.shadowRoot.querySelector('.ag-status');
    const volSlider = this.shadowRoot.querySelector('.ag-volume');

    if (!audio || !playBtn) return;

    // Play / Pause
    playBtn.addEventListener('click', () => {
      if (this._playing) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    });

    // Estado: reproduciendo
    audio.addEventListener('play', () => {
      this._playing = true;
      this._updatePlayBtn();
      if (status) {
        status.textContent = 'Reproduciendo';
        status.classList.add('playing');
      }
    });

    // Estado: pausado / terminado
    const onStop = () => {
      this._playing = false;
      this._updatePlayBtn();
      if (status) {
        status.textContent = audio.ended ? 'Finalizado' : 'Parado';
        status.classList.remove('playing');
      }
    };
    audio.addEventListener('pause', onStop);
    audio.addEventListener('ended', onStop);

    // Duración cargada
    audio.addEventListener('loadedmetadata', () => {
      this._duration = audio.duration;
      if (timeTotal) timeTotal.textContent = this._fmt(this._duration);
    });

    // Progreso
    audio.addEventListener('timeupdate', () => {
      this._current = audio.currentTime;
      const pct = this._duration ? (this._current / this._duration) * 100 : 0;
      if (fill)    fill.style.width = `${pct}%`;
      if (track)   track.setAttribute('aria-valuenow', Math.round(pct));
      if (timeCur) timeCur.textContent = this._fmt(this._current);
    });

    // Seek: clic en la barra
    if (track) {
      track.addEventListener('click', (e) => {
        const rect  = track.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = ratio * (audio.duration || 0);
      });
    }

    // Volumen
    if (volSlider) {
      volSlider.addEventListener('input', () => {
        audio.volume = parseFloat(volSlider.value);
      });
    }
  }

  // Actualiza íconos de play/pause
  _updatePlayBtn() {
    const iconPlay  = this.shadowRoot.querySelector('.icon-play');
    const iconPause = this.shadowRoot.querySelector('.icon-pause');
    const btn       = this.shadowRoot.querySelector('.ag-play-btn');

    if (!iconPlay || !iconPause) return;
    iconPlay.style.display  = this._playing ? 'none' : '';
    iconPause.style.display = this._playing ? ''     : 'none';
    if (btn) btn.setAttribute('aria-label',
      this._playing ? 'Pausar audio' : 'Reproducir audio');
  }
}

customElements.define('audio-guia', AudioGuia);