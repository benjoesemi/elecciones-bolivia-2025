# Mapa Elecciones 2025 Bolivia — Dominio_Abs + Popups con barras

Esta versión usa tu archivo **`public/data/sql_resultados_2025_100.csv`** con las columnas indicadas.
- Los puntos se colorean por **`Dominio_Abs`** (PDC=verde, LIBRE=rojo, Ninguno=gris).
- El tamaño del punto ≈ `VotoEmitidoReal` del recinto.
- **Resumen nacional** en % considerando `VotosNulos_Ajus` en el denominador (*aproximado como* `max(0, VotoEmitidoReal - sumaPartidos)` si no está explícito).
- **Popups** con gráfico de barras por recinto (**Recharts**).
- Fuente global **Montserrat**.
- Footer con enlaces genéricos a redes sociales.

## Uso
```bash
npm install
npm run dev
npm run build
npm run deploy   # GitHub Pages (ajusta VITE_BASE en .env si publicas en /<repo>/)
```

## Notas sobre el CSV
- Coordenadas: `latitu` y `longitud`.
- Ubicación: `Departamento`, `Municipio`, `Localidad`, `Recinto`.
- Partidos: `AP, ADN, APB_SUMATE, LIBRE, FP, MAS_IPSP, MORENA, UNIDAD, PDC`.
- Dominio: `Dominio_Abs` (texto que contenga "PDC", "LIBRE" o cualquier otro valor).
- Tamaño: `VotoEmitidoReal` (si falta, se usa suma de partidos).
- Para porcentajes nacionales, si existe explícitamente **`VotosNulos_Ajus`**, se puede mapear en `loadCSV` para usar ese valor exacto.
