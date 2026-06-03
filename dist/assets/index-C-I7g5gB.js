(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class extends HTMLElement{static get observedAttributes(){return[`active-region`]}constructor(){super(),this.attachShadow({mode:`open`}),this._regiones=[`Todos`,`Huetar Caribe`,`Huetar Norte`,`Central`,`Chorotega`]}set regiones(e){Array.isArray(e)&&e.length&&(this._regiones=[`Todos`,...e],this.shadowRoot.innerHTML!==``&&(this._render(),this._bindEvents()))}get regiones(){return this._regiones}get activeRegion(){return this.getAttribute(`active-region`)||`Todos`}connectedCallback(){this._render(),this._bindEvents()}attributeChangedCallback(e,t,n){e===`active-region`&&t!==n&&this.shadowRoot.innerHTML!==``&&this._updateActive()}_render(){let e=this.activeRegion,t=this._regiones.map(t=>`
      <button class="nav-link${t===e?` active`:``}"
              data-region="${t}"
              aria-pressed="${t===e}">
        ${t}
      </button>
    `).join(``);this.shadowRoot.innerHTML=`
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
          ${t}
        </nav>
      </div>
    `}_bindEvents(){this.shadowRoot.querySelectorAll(`.nav-link`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.region;this.setAttribute(`active-region`,t),this.dispatchEvent(new CustomEvent(`region-selected`,{bubbles:!0,composed:!0,detail:{region:t}}))})})}_updateActive(){let e=this.activeRegion;this.shadowRoot.querySelectorAll(`.nav-link`).forEach(t=>{let n=t.dataset.region===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-pressed`,String(n))})}};customElements.define(`app-header`,e);var t=class extends HTMLElement{static get observedAttributes(){return[`destino-id`,`nombre`,`imagen`,`region`]}constructor(){super(),this.attachShadow({mode:`open`})}connectedCallback(){this._render(),this._bindEvents()}attributeChangedCallback(){this.shadowRoot.innerHTML!==``&&(this._render(),this._bindEvents())}get destinoId(){return this.getAttribute(`destino-id`)||``}get nombre(){return this.getAttribute(`nombre`)||`Sin nombre`}get imagen(){return this.getAttribute(`imagen`)||``}get region(){return this.getAttribute(`region`)||``}_render(){let e={Chorotega:{bg:`#e8f5e3`,badge:`#5a8a2e`,text:`#2d4a14`},"Huetar Norte":{bg:`#edf5e0`,badge:`#8ab83a`,text:`#4a6e1a`},Central:{bg:`#f5ede0`,badge:`#c49a6c`,text:`#6b4f28`},"Pacifico Central":{bg:`#f0e8dc`,badge:`#a07040`,text:`#5a3a18`},"Huetar Caribe":{bg:`#e0f3fa`,badge:`#3aa0d8`,text:`#1a5a80`},"Huetar Atlantica":{bg:`#e0f3fa`,badge:`#3aa0d8`,text:`#1a5a80`}}[this.region]||{bg:`#f0f0f0`,badge:`#666`,text:`#333`};this.shadowRoot.innerHTML=`
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
          background: ${e.bg};
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
          color: ${e.badge};
          background: ${e.bg};
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
          background: ${e.bg};
          color: ${e.text};
          border: 1px solid ${e.badge}44;
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
          color: ${e.badge};
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
        ${this.imagen?`<img src="${this.imagen}" alt="${this.nombre}" loading="lazy"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`:``}
        <div class="img-fallback" style="${this.imagen?``:`display:flex`}">🌿</div>
        <div class="overlay"></div>
      </div>

      <div class="card-body">
        <span class="region-badge">${this.region||`Costa Rica`}</span>
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
    `}_bindEvents(){this.shadowRoot.host.addEventListener(`click`,()=>{this.dispatchEvent(new CustomEvent(`destino-selected`,{bubbles:!0,composed:!0,detail:{id:this.destinoId}}))}),this.setAttribute(`tabindex`,`0`),this.setAttribute(`role`,`button`),this.setAttribute(`aria-label`,`Ver destino: ${this.nombre}`),this.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.click())})}};customElements.define(`destino-card`,t);var n=class extends HTMLElement{static get observedAttributes(){return[`imagenes`]}constructor(){super(),this.attachShadow({mode:`open`}),this._index=0,this._imgs=[]}connectedCallback(){this._parseImagenes(),this._render(),this._bindEvents()}attributeChangedCallback(e,t,n){e===`imagenes`&&t!==n&&(this._index=0,this._parseImagenes(),this.shadowRoot.innerHTML!==``&&(this._render(),this._bindEvents()))}_parseImagenes(){try{let e=this.getAttribute(`imagenes`)||`[]`;this._imgs=JSON.parse(e)}catch{this._imgs=[]}Array.isArray(this._imgs)||(this._imgs=[])}_prev(){this._index=(this._index-1+this._imgs.length)%this._imgs.length,this._updateSlide()}_next(){this._index=(this._index+1)%this._imgs.length,this._updateSlide()}_updateSlide(){let e=this.shadowRoot.querySelector(`.gal-img`),t=this.shadowRoot.querySelector(`.counter`),n=this.shadowRoot.querySelectorAll(`.dot`);e&&(e.classList.add(`fade-out`),setTimeout(()=>{e.style.visibility=`visible`,e.src=this._imgs[this._index]||``,e.alt=`Foto ${this._index+1}`,e.classList.remove(`fade-out`)},180)),t&&(t.textContent=`${this._index+1} / ${this._imgs.length}`),n.forEach((e,t)=>e.classList.toggle(`active`,t===this._index))}_render(){let e=this._imgs.length,t=this._imgs[this._index]||``,n=e>1,r=this._imgs.map((e,t)=>`<button class="dot${t===this._index?` active`:``}"
               aria-label="Ir a foto ${t+1}"
               data-index="${t}"></button>`).join(``);this.shadowRoot.innerHTML=`
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
          aspect-ratio: 4 / 3;
          background: #1a1a1a;
          overflow: hidden;
        }
        .gal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          cursor: zoom-in;
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
          aspect-ratio: 4 / 3;
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

      ${e===0?`<div class="empty-state" role="img" aria-label="Sin imágenes">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="1.5">
               <rect x="3" y="3" width="18" height="18" rx="2"/>
               <circle cx="8.5" cy="8.5" r="1.5"/>
               <polyline points="21,15 16,10 5,21"/>
             </svg>
             Sin imágenes disponibles
           </div>`:`<div class="gal-img-wrap">
             <img class="gal-img" src="${t}" alt="Foto ${this._index+1}"
                  loading="lazy" onerror="this.style.visibility='hidden'">
             ${e>1?`<span class="counter">${this._index+1} / ${e}</span>`:``}
             ${n?`<button class="nav-btn prev" aria-label="Foto anterior">
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
                  <div class="dots">${r}</div>`:``}
           </div>`}
    `}_bindEvents(){let e=this.shadowRoot.querySelector(`.nav-btn.prev`),t=this.shadowRoot.querySelector(`.nav-btn.next`);e&&e.addEventListener(`click`,()=>this._prev()),t&&t.addEventListener(`click`,()=>this._next()),this.shadowRoot.querySelectorAll(`.dot`).forEach(e=>{e.addEventListener(`click`,()=>{this._index=parseInt(e.dataset.index,10),this._updateSlide()})});let n=0,r=this.shadowRoot.querySelector(`.gal-img-wrap`);r&&(r.addEventListener(`touchstart`,e=>{n=e.touches[0].clientX},{passive:!0}),r.addEventListener(`touchend`,e=>{let t=n-e.changedTouches[0].clientX;Math.abs(t)>40&&(t>0?this._next():this._prev())},{passive:!0}));let i=this.shadowRoot.querySelector(`.gal-img`);i&&i.addEventListener(`click`,()=>{a(this._imgs[this._index]||``,`Foto ${this._index+1} ampliada`)}),this.setAttribute(`tabindex`,`0`),this.addEventListener(`keydown`,e=>{e.key===`ArrowLeft`&&(e.preventDefault(),this._prev()),e.key===`ArrowRight`&&(e.preventDefault(),this._next())})}},r=null;function i(){let e=document.createElement(`div`);e.className=`galeria-lightbox`,e.setAttribute(`role`,`dialog`),e.setAttribute(`aria-label`,`Imagen ampliada`),e.style.cssText=`position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.92);padding:24px;cursor:zoom-out;`,e.innerHTML=`<button class="lb-close" aria-label="Cerrar imagen" style="position:fixed;top:16px;right:20px;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#fff;font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button><img class="lb-img" alt="" style="max-width:96vw;max-height:92vh;object-fit:contain;border-radius:8px;box-shadow:0 12px 48px rgba(0,0,0,.6);">`;let t=()=>{e.style.display=`none`};return e.addEventListener(`click`,n=>{(n.target===e||n.target.classList.contains(`lb-close`))&&t()}),document.addEventListener(`keydown`,n=>{n.key===`Escape`&&e.style.display===`flex`&&(n.stopPropagation(),t())},!0),document.body.appendChild(e),e}function a(e,t){if(!e)return;r||=i();let n=r.querySelector(`.lb-img`);n.src=e,n.alt=t,r.style.display=`flex`}customElements.define(`galeria-imagenes`,n);var o=class extends HTMLElement{static get observedAttributes(){return[`src`,`label`]}constructor(){super(),this.attachShadow({mode:`open`}),this._playing=!1,this._duration=0,this._current=0}connectedCallback(){this._render(),this._bindEvents()}attributeChangedCallback(e,t,n){if(t!==n&&this.shadowRoot.innerHTML!==``)if(e===`src`){let e=this.shadowRoot.querySelector(`audio`);e&&(e.src=n,e.load(),this._playing=!1,this._updatePlayBtn())}else{let e=this.shadowRoot.querySelector(`.ag-label`);e&&(e.textContent=n)}}disconnectedCallback(){let e=this.shadowRoot.querySelector(`audio`);e&&e.pause()}_fmt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}_render(){let e=this.getAttribute(`src`)||``,t=this.getAttribute(`label`)||`Audio guía`;this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .ag-wrap {
          background: linear-gradient(135deg, #1a2a1a 0%, #0f1f0f 100%);
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
          color: #7dd87d;
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
          color: #5a8a5a;
        }
        .ag-status.playing { color: #7dd87d; }
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
          background: #5a8a2e;
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
          background: linear-gradient(to right, #7dd87d, #5a8a2e);
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
        ${e?`
          <div class="ag-header">
            <div class="ag-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
              </svg>
            </div>
            <span class="ag-label">${t}</span>
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

          <audio preload="metadata" src="${e}"></audio>
        `:`<div class="ag-no-src">🎵 Sin audio disponible para este destino</div>`}
      </div>
    `}_bindEvents(){let e=this.shadowRoot.querySelector(`audio`),t=this.shadowRoot.querySelector(`.ag-play-btn`),n=this.shadowRoot.querySelector(`.ag-progress-track`),r=this.shadowRoot.querySelector(`.ag-progress-fill`),i=this.shadowRoot.querySelector(`.time-current`),a=this.shadowRoot.querySelector(`.time-total`),o=this.shadowRoot.querySelector(`.ag-status`),s=this.shadowRoot.querySelector(`.ag-volume`);if(!e||!t)return;t.addEventListener(`click`,()=>{this._playing?e.pause():e.play().catch(()=>{})}),e.addEventListener(`play`,()=>{this._playing=!0,this._updatePlayBtn(),o&&(o.textContent=`Reproduciendo`,o.classList.add(`playing`))});let c=()=>{this._playing=!1,this._updatePlayBtn(),o&&(o.textContent=e.ended?`Finalizado`:`Parado`,o.classList.remove(`playing`))};e.addEventListener(`pause`,c),e.addEventListener(`ended`,c),e.addEventListener(`loadedmetadata`,()=>{this._duration=e.duration,a&&(a.textContent=this._fmt(this._duration))}),e.addEventListener(`timeupdate`,()=>{this._current=e.currentTime;let t=this._duration?this._current/this._duration*100:0;r&&(r.style.width=`${t}%`),n&&n.setAttribute(`aria-valuenow`,Math.round(t)),i&&(i.textContent=this._fmt(this._current))}),n&&n.addEventListener(`click`,t=>{let r=n.getBoundingClientRect();e.currentTime=(t.clientX-r.left)/r.width*(e.duration||0)}),s&&s.addEventListener(`input`,()=>{e.volume=parseFloat(s.value)})}_updatePlayBtn(){let e=this.shadowRoot.querySelector(`.icon-play`),t=this.shadowRoot.querySelector(`.icon-pause`),n=this.shadowRoot.querySelector(`.ag-play-btn`);!e||!t||(e.style.display=this._playing?`none`:``,t.style.display=this._playing?``:`none`,n&&n.setAttribute(`aria-label`,this._playing?`Pausar audio`:`Reproducir audio`))}};customElements.define(`audio-guia`,o);var s=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}),this._destino=null}set destino(e){this._destino=e||null,this._render(),this._bindEvents()}get destino(){return this._destino}connectedCallback(){this.shadowRoot.innerHTML||this._render()}_regionShort(e){return{"Huetar Atlantica":`Caribe`,"Huetar Caribe":`Caribe`,"Huetar Norte":`Zona Norte`,Central:`Valle Central`,Chorotega:`Guanacaste`,"Pacifico Central":`Pacífico Central`}[e]||e||`Costa Rica`}_fmtCoord(e,t,n){return e==null||isNaN(e)?`—`:`${Math.abs(e).toFixed(4)}° ${e>=0?t:n}`}_render(){let e=this._destino;if(!e){this.shadowRoot.innerHTML=``;return}let t=Array.isArray(e.galeria)&&e.galeria.length?e.galeria:e.imagen_portada?[e.imagen_portada]:[],n=Array.isArray(e.actividades)?e.actividades:[];this.shadowRoot.innerHTML=`
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
          ${this._regionShort(e.region)}
        </div>

        <h2 class="titulo">${e.nombre||`Destino sin nombre`}</h2>
        <span class="tipo-badge">Destino Imperdible</span>

        <div class="content-grid">
          <!-- Columna izquierda: galería (componente reutilizable) + ubicación -->
          <div class="col-galeria">
            <galeria-imagenes imagenes='${JSON.stringify(t)}'></galeria-imagenes>

            ${e.lat!=null&&e.lng!=null?`
              <div class="ubicacion-box">
                <h4>Ubicación Geográfica</h4>
                <div class="ubicacion-grid">
                  <div>
                    <div class="ub-label">Latitud:</div>
                    <div class="ub-valor">${this._fmtCoord(e.lat,`N`,`S`)}</div>
                  </div>
                  <div>
                    <div class="ub-label">Longitud:</div>
                    <div class="ub-valor">${this._fmtCoord(e.lng,`E`,`W`)}</div>
                  </div>
                </div>
              </div>
            `:``}
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
            <p>${e.descripcion||`Sin descripción disponible.`}</p>

            ${n.length?`
              <h4 class="actividades-titulo">Actividades</h4>
              <ul class="actividades">
                ${n.map(e=>`<li>${e}</li>`).join(``)}
              </ul>
            `:``}
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
          ${e.audio?`<audio-guia src="${e.audio}" label="Guía de ${e.nombre||`destino`}"></audio-guia>`:`<div class="no-audio">Audio guía próximamente disponible.</div>`}
        </div>
      </div>
    `}_bindEvents(){let e=this.shadowRoot.querySelector(`.close-btn`);e&&e.addEventListener(`click`,()=>{this.dispatchEvent(new CustomEvent(`detalle-cerrado`,{bubbles:!0,composed:!0}))})}};customElements.define(`destino-detalle`,s);var c={destinos:[]},l=document.getElementById(`cards-container`),u=document.getElementById(`overlay`),d=document.getElementById(`detalle`),f=document.getElementById(`destinos-count`),p=document.querySelector(`app-header`);async function m(){try{let e=await fetch(`./data/destinos.json`);if(!e.ok)throw Error(`HTTP ${e.status}`);c.destinos=(await e.json()).destinos,p&&(p.regiones=[...new Set(c.destinos.map(e=>e.region))]),f&&(f.textContent=`${c.destinos.length} destinos disponibles`),h(c.destinos)}catch(e){console.error(`Error inicializando la Guía Turística:`,e),l.innerHTML=`
          <div style="grid-column:1/-1;padding:3rem;text-align:center;color:var(--text-muted);">
            <p>⚠️ No se pudieron cargar los destinos en este momento.</p>
            <small style="display:block;margin-top:.5rem;">Revisa la consola para detalles técnicos.</small>
          </div>`}}function h(e){l.innerHTML=``,e.forEach(e=>{let t=document.createElement(`destino-card`);t.setAttribute(`destino-id`,e.id),t.setAttribute(`nombre`,e.nombre),t.setAttribute(`imagen`,e.imagen_portada),t.setAttribute(`region`,e.region),l.appendChild(t)})}document.addEventListener(`destino-selected`,e=>{let{id:t}=e.detail,n=c.destinos.find(e=>e.id===t);n&&(d.destino=n,u.classList.add(`visible`),document.body.style.overflow=`hidden`,u.focus?.())}),document.addEventListener(`region-selected`,e=>{let{region:t}=e.detail,n=t===`Todos`?c.destinos:c.destinos.filter(e=>e.region===t);h(n),f&&(f.textContent=t===`Todos`?`${n.length} destinos disponibles`:`${n.length} destino(s) · ${t}`),document.getElementById(`destinos`)?.scrollIntoView({behavior:`smooth`,block:`start`})});var g=()=>{u.classList.remove(`visible`),document.body.style.overflow=``};document.addEventListener(`detalle-cerrado`,g),u.addEventListener(`click`,e=>{e.target===u&&g()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&u.classList.contains(`visible`)&&g()});var _={chorotega:`Chorotega`,huetar_norte:`Huetar Norte`,central:`Central`,huetar_caribe:`Huetar Caribe`,pacifico_central:`Pacífico Central`,brunca:`Brunca`},v=document.getElementById(`map-drops`),y=null,b=null;function x(){v&&(v.innerHTML=``),y=null,document.querySelectorAll(`.province.selected`).forEach(e=>e.classList.remove(`selected`))}function S(){clearTimeout(b),b=setTimeout(x,240)}function C(){clearTimeout(b)}function w(e,t){if(C(),t===y&&v.childElementCount)return;let n=_[t]||`Región`,r=c.destinos.filter(e=>e.region===n);if(v.innerHTML=``,y=t,document.querySelectorAll(`.province.selected`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),!r.length)return;let i=([...document.querySelectorAll(`.cr-map .region-label`)].find(e=>e.textContent.trim()===n)||e).getBoundingClientRect(),a=i.left+i.width/2,o=i.top+i.height/2,s=(r.length-1)*62;r.forEach((e,t)=>{let n=a-s/2+t*62,r=o-6;n=Math.max(48,Math.min(window.innerWidth-48,n)),r=Math.max(64,Math.min(window.innerHeight-70,r));let i=document.createElement(`div`);i.className=`drop`,i.style.left=n+`px`,i.style.top=r+`px`,i.style.animationDelay=t*80+`ms`,i.dataset.id=e.id,i.setAttribute(`role`,`button`),i.setAttribute(`tabindex`,`0`),i.setAttribute(`aria-label`,`Ver ${e.nombre}`),i.innerHTML=`
          <div class="drop-bubble">
            <img src="${e.imagen_portada}" alt="" onerror="this.style.visibility='hidden'">
          </div>
          <div class="drop-name">${e.nombre}</div>`,i.addEventListener(`mouseenter`,C),i.addEventListener(`mouseleave`,S),i.addEventListener(`click`,()=>T(e.id)),i.addEventListener(`keydown`,t=>{(t.key===`Enter`||t.key===` `)&&(t.preventDefault(),T(e.id))}),v.appendChild(i)})}function T(e){x(),h(c.destinos),p&&p.setAttribute(`active-region`,`Todos`),f&&(f.textContent=`${c.destinos.length} destinos disponibles`);let t=document.querySelector(`destino-card[destino-id="${e}"]`);document.getElementById(`destinos`)?.scrollIntoView({behavior:`smooth`,block:`start`}),t&&(t.classList.add(`flash`),setTimeout(()=>t.classList.remove(`flash`),1700))}function E(){v&&(document.querySelectorAll(`.province[data-region]`).forEach(e=>{e.addEventListener(`mouseenter`,()=>w(e,e.dataset.region)),e.addEventListener(`mouseleave`,S)}),window.addEventListener(`scroll`,x,{passive:!0}))}m(),document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,E):E();