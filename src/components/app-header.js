const regionData = {
  "chorotega": {
    "label": "Región Chorotega",
    "color_fill": "#5a8a2e",
    "color_title": "#2d4a14",
    "provinces": ["CR-G"],
    "destinos": [
      {
        "name": "Playa Virador",
        "tipo": "b-oculta",
        "badge": "Joya Oculta",
        "costo": "Gratuito",
        "desc": "Arena blanca, Península de Papagayo"
      },
      {
        "name": "Playa Prieta",
        "tipo": "b-oculta",
        "badge": "Joya Oculta",
        "costo": "Gratuito",
        "desc": "Playa pequeña y tranquila"
      },
      {
        "name": "Catarata Llanos de Cortés",
        "tipo": "b-clasico",
        "badge": "Clásico Imperdible",
        "costo": "Aporte voluntario",
        "desc": "Icónica catarata comunitaria"
      },
      {
        "name": "Centro de Rescate Las Pumas",
        "tipo": "b-fuera",
        "badge": "Fuera del Circuito",
        "costo": "~₡3.000",
        "desc": "170+ animales, 27 especies"
      },
      {
        "name": "P.N. Rincón de la Vieja",
        "tipo": "b-clasico",
        "badge": "Clásico Imperdible",
        "costo": "~$18",
        "desc": "Senderos volcánicos y pailas"
      }
    ]
  },
  "huetar_norte": {
    "label": "Región Huetar Norte",
    "color_fill": "#8ab83a",
    "color_title": "#4a6e1a",
    "provinces": ["CR-A"],
    "destinos": [
      {
        "name": "Río Celeste — Volcán Tenorio",
        "tipo": "b-reciente",
        "badge": "Recién Descubierto",
        "costo": "~₡6.000",
        "desc": "Aguas turquesas de origen volcánico"
      },
      {
        "name": "Rescate Wildlife Center",
        "tipo": "b-clasico",
        "badge": "Clásico Imperdible",
        "costo": "Precio accesible",
        "desc": "650+ especies, Zoo Ave"
      }
    ]
  },
  "central": {
    "label": "Región Central",
    "color_fill": "#c49a6c",
    "color_title": "#6b4f28",
    "provinces": ["CR-H", "CR-SJ", "CR-C"],
    "destinos": [
      {
        "name": "Valle de Orosi",
        "tipo": "b-oculta",
        "badge": "Joya Oculta",
        "costo": "Gratuito",
        "desc": "Ruinas coloniales y embalse Cachí"
      },
      {
        "name": "San Gerardo de Dota",
        "tipo": "b-fuera",
        "badge": "Fuera del Circuito",
        "costo": "Gratuito",
        "desc": "Bosque nuboso y avistamiento del quetzal"
      }
    ]
  },
  "pacifico_central": {
    "label": "Región Pacífico Central",
    "color_fill": "#a07040",
    "color_title": "#5a3a18",
    "provinces": ["CR-P"],
    "destinos": [
      {
        "name": "Catarata de Montezuma",
        "tipo": "b-oculta",
        "badge": "Joya Oculta",
        "costo": "Gratuito",
        "desc": "30 min caminando desde Montezuma"
      },
      {
        "name": "Playa Dominical",
        "tipo": "b-reciente",
        "badge": "Recién Descubierto",
        "costo": "Gratuito",
        "desc": "Playa de surf, ambiente joven"
      },
      {
        "name": "P.N. Marino Ballena",
        "tipo": "b-clasico",
        "badge": "Clásico Imperdible",
        "costo": "~₡3.000",
        "desc": "Cola de ballena, ballenas jorobadas"
      },
      {
        "name": "Alturas Wildlife Sanctuary",
        "tipo": "b-oculta",
        "badge": "Joya Oculta",
        "costo": "~$20",
        "desc": "Santuario cerca de Uvita"
      }
    ]
  },
  "huetar_atlantica": {
    "label": "Región Huetar Atlántica",
    "color_fill": "#3aa0d8",
    "color_title": "#1a5a80",
    "provinces": ["CR-L"],
    "destinos": [
      {
        "name": "Parque Nacional Cahuita",
        "tipo": "b-clasico",
        "badge": "Clásico Imperdible",
        "costo": "Donación voluntaria",
        "desc": "Playa, arrecife de coral, sendero costero"
      },
      {
        "name": "Punta Uva y Manzanillo",
        "tipo": "b-oculta",
        "badge": "Joya Oculta",
        "costo": "Gratuito",
        "desc": "Playa virgen y sendero natural"
      },
      {
        "name": "Tortuguero",
        "tipo": "b-fuera",
        "badge": "Fuera del Circuito",
        "costo": "~₡3.000",
        "desc": "Canales navegables y anidación de tortugas"
      }
    ]
  }
};

// ── Tooltip ──────────────────────────────────────────────────────────────────

function buildTooltip(region) {
  const d = regionData[region];
  let html = `<div class="tt-region-label" style="color:${d.color_title}">${d.label}</div>`;
  html += `<div class="tt-title" style="color:${d.color_title}">Destinos turísticos</div>`;
  d.destinos.forEach(dest => {
    html += `<div class="dest">
      <span class="badge ${dest.tipo}">${dest.badge}</span>
      <div>
        <div class="dest-name">${dest.name}</div>
        <div class="dest-info">${dest.costo} · ${dest.desc}</div>
      </div>
    </div>`;
  });
  return html;
}

function posTooltip(tip, e) {
  const tw = tip.offsetWidth || 300;
  const th = tip.offsetHeight || 180;
  let x = e.clientX + 18;
  let y = e.clientY - 16;
  if (x + tw > window.innerWidth - 12) x = e.clientX - tw - 18;
  if (y + th > window.innerHeight - 12) y = window.innerHeight - th - 12;
  if (y < 8) y = 8;
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
}

// ── Init ─────────────────────────────────────────────────────────────────────

function initMap() {
  const tip = document.getElementById('tooltip');

  document.querySelectorAll('.province[data-region]').forEach(el => {
    const region = el.dataset.region;

    el.addEventListener('mouseenter', e => {
      tip.innerHTML = buildTooltip(region);
      tip.classList.add('show');
      posTooltip(tip, e);
    });
    el.addEventListener('mousemove', e => posTooltip(tip, e));
    el.addEventListener('mouseleave', () => tip.classList.remove('show'));
  });
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}