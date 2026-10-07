# OpenSpec — Visor de Grafitis Bogotá

## Propósito
Mapa interactivo de grafitis destacados de Bogotá con interfaz amigable, redondeada, tipografía sobria y color principal morado. Información en tiempo real del punto seleccionado.

## Stack
- Frontend estático: `index.html`, `styles.css`, `app.js` (sin build)
- Mapa: Leaflet 1.9.4 + OpenStreetMap tiles (https://tile.openstreetmap.org)
- Datos: `data/grafitis.json` (GeoJSON simplificado)
- Fuente: Inter / system-ui (sobria y simple)

## Requisitos
1. Mapa centrado en Bogotá [4.7110, -74.0721], zoom 12, tiles OSM con atribución.
2. Marcadores morados personalizados (divIcon redondeado), popup redondeado.
3. Panel lateral:
   - Buscador en tiempo real (filtra por título, autor, localidad)
   - Filtro por localidad (chips redondeados)
   - Lista de tarjetas redondeadas, click → `flyTo` + abre detalle
   - Contadores en vivo: total, visibles, localidad seleccionada
4. Panel detalle:
   - Muestra título, autor, localidad, dirección, año, descripción, tags
   - Simulación tiempo real: visitantes ahora, likes, última actividad (actualiza cada 3s)
   - Botones: centrar, me gusta, cerrar
5. Estilo:
   - Color primario morado: `#7c3aed`, oscuro `#5b21b6`, claro `#ede9fe`
   - Bordes redondeados: 16-24px, sombras suaves
   - Tipografía: Inter, system-ui, -apple-system, sans-serif
   - Responsive: panel se vuelve inferior en móvil
6. Sin backend. Todo funciona abriendo `index.html` o con `npx serve`.

## Estructura
```
index.html
styles.css
app.js
data/grafitis.json
openspec.md (este archivo)
```

## Datos
Cada grafiti: id, titulo, autor, localidad, direccion, lat, lng, año, descripcion, tags[], imagen (gradient placeholder), likesBase.
12 puntos reales/inspirados: La Candelaria, Santa Fe, Calle 26, Chapinero, Teusaquillo, Barrios Unidos, etc.

## Verificación
- Abrir index.html → mapa carga, 12 marcadores visibles
- Buscar "cóndor" → filtra a 1
- Click tarjeta → mapa vuela y detalle aparece
- Reloj / visitantes cambia cada 3s sin recargar
