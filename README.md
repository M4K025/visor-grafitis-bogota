# Visor de Grafitis — Bogotá 🟣

Mapa interactivo de grafitis destacados de Bogotá con OpenStreetMap + Leaflet.
Interfaz redondeada, tipografía sobria (Inter), morado como color principal, modo oscuro y fotos reales.

## Ver local
```powershell
npx serve .
```

## Despliegue en GitHub Pages
1. Crea un repo en GitHub (ej: `grafitis-bogota`)
2. Luego ejecuta:
```powershell
git add .
git commit -m "Visor grafitis Bogota: modo oscuro + fotos + mapa"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/grafitis-bogota.git
git push -u origin main
```
3. En GitHub: Settings → Pages → Deploy from branch → `main` / `/ (root)` → Save.
4. Tu sitio quedará en `https://TU-USUARIO.github.io/grafitis-bogota/`

## Cambiar fotos por las tuyas
Edita `data/grafitis.json`, campo `foto` de cada punto:
- URL externa, o
- Ruta local: guarda tus fotos en `fotos/mi-mural.jpg` y pon `"foto": "fotos/mi-mural.jpg"`.

## Estructura
`index.html`, `styles.css`, `app.js`, `data/grafitis.json`, `openspec.md`
