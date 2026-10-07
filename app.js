// Visor de Grafitis Bogotá — Leaflet + OSM + tiempo real simulado + modo oscuro + fotos
const BOGOTA = [4.6486, -74.0758];
const map = L.map('map').setView(BOGOTA, 12);

const TILES = {
  light: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }],
  dark: ['https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO' }]
};
let tileLayer = L.tileLayer(...TILES.light).addTo(map);

// --- Modo oscuro ---
const themeBtn = document.getElementById('theme');
function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('gb-theme', t); } catch (e) {}
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(...TILES[t]).addTo(map);
}
applyTheme(currentTheme());
themeBtn.onclick = () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');

const state = { datos: [], filtrados: [], localidad: 'Todas', q: '', sel: null, likes: {} };
const $ = (id) => document.getElementById(id);
const list = $('list'), chips = $('chips');

function pinIcon(active) {
  return L.divIcon({ className: '', html: `<div class="pin${active ? ' active' : ''}"><span>✦</span></div>`, iconSize: [34, 34], iconAnchor: [17, 32], popupAnchor: [0, -30] });
}
let markers = [];

function coincide(g) {
  const locOk = state.localidad === 'Todas' || g.localidad === state.localidad;
  const q = state.q.trim().toLowerCase();
  if (!q) return locOk;
  return locOk && [g.titulo, g.autor, g.localidad, g.direccion, ...(g.tags || [])].join(' ').toLowerCase().includes(q);
}

function renderChips() {
  const locs = ['Todas', ...new Set(state.datos.map((g) => g.localidad))];
  chips.innerHTML = '';
  locs.forEach((l) => {
    const b = document.createElement('button');
    b.className = 'chip' + (state.localidad === l ? ' active' : '');
    b.textContent = l;
    b.onclick = () => { state.localidad = l; aplicar(); };
    chips.appendChild(b);
  });
}

function aplicar() {
  state.filtrados = state.datos.filter(coincide);
  $('stat-visible').textContent = state.filtrados.length;
  renderChips();
  renderList();
  dibujarMarcadores();
}

function renderList() {
  list.innerHTML = '';
  if (!state.filtrados.length) { list.innerHTML = '<p style="color:#7b748c;text-align:center">Sin resultados. Prueba otra búsqueda.</p>'; return; }
  state.filtrados.forEach((g) => {
    const btn = document.createElement('button');
    btn.className = 'card' + (state.sel === g.id ? ' selected' : '');
    btn.innerHTML = `<img class="card-thumb" src="${g.foto || ''}" alt="${g.titulo}" loading="lazy" onerror="this.style.display='none'" />
      <h3>${g.titulo}</h3>
      <div class="meta">${g.autor} · ${g.localidad}</div>
      <div class="row"><span class="badge">${g.anio}</span><span class="likes">♥ ${likesDe(g.id)}</span></div>`;
    btn.onclick = () => seleccionar(g.id, true);
    list.appendChild(btn);
  });
}

function likesDe(id) {
  const base = state.datos.find((g) => g.id === id)?.likesBase || 0;
  return base + (state.likes[id] || 0);
}

function dibujarMarcadores() {
  markers.forEach((m) => map.removeLayer(m));
  markers = state.filtrados.map((g) => {
    const m = L.marker([g.lat, g.lng], { icon: pinIcon(state.sel === g.id) })
      .addTo(map)
      .bindPopup(`<img class="popup-photo" src="${g.foto || ''}" alt="" loading="lazy" /><br><b>${g.titulo}</b><br>${g.autor} · ${g.localidad}<br><small>${g.direccion}</small>`);
    m.on('click', () => seleccionar(g.id, false));
    return m;
  });
}

function seleccionar(id, volar) {
  state.sel = id;
  const g = state.datos.find((x) => x.id === id);
  if (!g) return;
  if (volar) map.flyTo([g.lat, g.lng], 15, { duration: 1.1 });
  $('detail').classList.remove('hidden');
  const foto = $('d-foto');
  foto.src = g.foto || ''; foto.alt = g.titulo;
  foto.onerror = () => { foto.style.display = 'none'; };
  foto.style.display = g.foto ? 'block' : 'none';
  $('d-credito').textContent = g.credito || '';
  $('d-titulo').textContent = g.titulo;
  $('d-autor').textContent = g.autor;
  $('d-localidad').textContent = g.localidad;
  $('d-anio').textContent = g.anio;
  $('d-desc').textContent = g.descripcion;
  $('d-dir').textContent = g.direccion;
  $('d-tags').innerHTML = (g.tags || []).map((t) => `<span class="tag">#${t}</span>`).join('');
  actualizarVivo(g);
  $('d-like').classList.toggle('liked', !!state.likes[id]);
  renderList(); dibujarMarcadores();
}

// --- Tiempo real simulado ---
function actualizarVivo(g) {
  const ahora = 3 + Math.floor(Math.random() * 18);
  $('d-now').textContent = ahora + ' personas';
  $('d-likes').textContent = likesDe(g.id);
  $('d-updated').textContent = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(() => {
  $('clock').textContent = new Date().toLocaleTimeString('es-CO');
  if (state.sel) {
    const g = state.datos.find((x) => x.id === state.sel);
    if (g && Math.random() > 0.4) { state.likes[g.id] = (state.likes[g.id] || 0) + (Math.random() > 0.7 ? 1 : 0); actualizarVivo(g); }
  }
}, 3000);

$('search').addEventListener('input', (e) => { state.q = e.target.value; aplicar(); });
$('locate').onclick = () => map.flyTo(BOGOTA, 12, { duration: 1 });
$('detail-close').onclick = () => { $('detail').classList.add('hidden'); state.sel = null; renderList(); dibujarMarcadores(); };
$('d-center').onclick = () => {
  const g = state.datos.find((x) => x.id === state.sel);
  if (g) map.flyTo([g.lat, g.lng], 16, { duration: 1 });
};
$('d-like').onclick = () => {
  if (!state.sel) return;
  state.likes[state.sel] = (state.likes[state.sel] || 0) + 1;
  const g = state.datos.find((x) => x.id === state.sel);
  actualizarVivo(g); renderList();
  $('d-like').classList.add('liked');
};

// Carga de datos
fetch('data/grafitis.json')
  .then((r) => r.json())
  .then((d) => {
    state.datos = d; state.filtrados = d;
    $('stat-total').textContent = d.length;
    $('clock').textContent = new Date().toLocaleTimeString('es-CO');
    aplicar();
  })
  .catch(() => { list.innerHTML = '<p>Error cargando data/grafitis.json. Usa un servidor local: <code>npx serve .</code></p>'; });
