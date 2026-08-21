# MeteoRutas

Condiciones de niebla, hielo y temperaturas extremas en tiempo real sobre corredores viales argentinos. Parte del ecosistema Meteoro405 (junto a CAVOK y De Cuestas, Abras y Quebradas).

Es una PWA sin build step: un único archivo HTML con JS vanilla y Leaflet. No requiere Node, npm, ni servidor — corre directo en GitHub Pages.

## Qué usa

- **Mapa**: [Argenmap del IGN](https://www.ign.gob.ar/AreaServicios/Argenmap/Introduccion) (Instituto Geográfico Nacional), vía Leaflet.
- **Ruteo**: [OSRM](http://project-osrm.org/) (servidor demo público, gratis, sin API key).
- **Clima**: [Open-Meteo](https://open-meteo.com/) (gratis, sin API key).
- **Geocoding** (buscador Desde/Hasta): [Nominatim](https://nominatim.org/) (OpenStreetMap, gratis, sin API key).

Ningún servicio requiere backend propio ni credenciales — todo se consulta directo desde el navegador del usuario.

## Cómo publicarlo en GitHub Pages

El archivo ya se llama `index.html`, así que queda listo para publicarse en la raíz del sitio sin renombrar nada.

### Opción A — repositorio propio (recomendado)

1. Creá un repositorio nuevo en GitHub, por ejemplo `meteorutas`.
2. Subí el contenido de esta carpeta tal cual está:
   ```
   git init
   git add .
   git commit -m "MeteoRutas v1"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/meteorutas.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source → Deploy from a branch → main / (root)**.
4. A los pocos minutos el sitio queda publicado en `https://TU-USUARIO.github.io/meteorutas/`.

### Opción B — sumarlo a un repo existente

Si preferís colgarlo de un repo que ya tenés en GitHub Pages en vez de crear uno nuevo, copiá `index.html` a una subcarpeta de ese repo (por ejemplo `/meteorutas/index.html`) y quedará accesible en:
```
https://TU-USUARIO.github.io/TU-REPO/meteorutas/
```

## Notas de despliegue

- **Sin build**: no hay `package.json`, no hay paso de compilación. Lo que subís es lo que se sirve.
- **CDNs externos**: el archivo carga Leaflet y las tipografías (Playfair Display, Source Sans 3, IBM Plex Mono) desde `cdnjs.cloudflare.com` y `fonts.googleapis.com`. Si en algún momento preferís servirlas localmente para evitar dependencias externas, avisame y lo armamos.
- **OSRM demo server**: `router.project-osrm.org` es un servicio público compartido, no pensado para tráfico alto sostenido. Para uso personal/prototipo funciona bien; si en algún momento el proyecto crece, conviene migrar a un servidor OSRM propio o a OpenRouteService con API key.
- **Rutas fijas incluidas**: RN3, RN5, RN7, RN8, RN9. El buscador "Desde / Hasta" permite calcular cualquier otro trayecto sobre la marcha, sin necesidad de agregarlo al código.
- **Compartir por WhatsApp**: el link generado codifica el estado completo en el hash de la URL (`#route=rn9` para rutas fijas, `#route=custom&from=...&to=...` para búsquedas personalizadas), así que abrir un link compartido reconstruye exactamente la misma ruta, incluida una búsqueda Desde/Hasta.

## Analytics (Cloudflare Web Analytics)

El `index.html` ya incluye el script de Cloudflare Web Analytics con un token de ejemplo (`YOUR_CLOUDFLARE_TOKEN`) que no reporta nada hasta que lo reemplaces por el tuyo:

1. Entrá a [dash.cloudflare.com](https://dash.cloudflare.com) → **Web Analytics** → **Add a site**.
2. Pegá la URL de tu sitio (`https://TU-USUARIO.github.io/meteorutas/`) — no hace falta que el dominio esté en Cloudflare, Web Analytics funciona vía JS beacon sin necesidad de mover el DNS.
3. Cloudflare te da un token. Copialo.
4. En `index.html`, buscá `YOUR_CLOUDFLARE_TOKEN` (dentro del `<script>` de Cloudflare, cerca del `</head>`) y reemplazalo por tu token real.
5. Subí el cambio. A los pocos minutos vas a ver datos en el dashboard de Cloudflare — visitas, países, dispositivos, todo sin cookies ni datos personales.

## Compartir por WhatsApp

Al tocar "Compartir", la app arma un mensaje corto invitando a abrir el link (no un informe completo), y acorta la URL con [is.gd](https://is.gd) (gratis, sin key) para que no aparezca el link larguísimo de GitHub Pages. Si `is.gd` no responde por algún motivo, cae de nuevo al link completo sin romper el flujo.

**Sobre el dominio que muestra la vista previa de WhatsApp**: WhatsApp genera automáticamente una tarjeta de vista previa con el dominio del link que se comparte — eso es parte fija de la interfaz de WhatsApp y no se puede ocultar. Con el acortador, ese dominio pasa a ser `is.gd` en vez de `TU-USUARIO.github.io`, que es lo más parecido a "sacarlo" que se puede lograr. Las etiquetas Open Graph (`og:title`, `og:description`, `og:image`) en el `<head>` sí controlan el título y la descripción que aparecen arriba de ese dominio en la tarjeta — **recordá reemplazar `YOUR-USERNAME` en `og:image` por tu usuario real de GitHub una vez publicado el sitio**, o la imagen de la vista previa no va a cargar.

## Estructura

```
meteorutas-repo/
├── index.html          ← la app completa
├── manifest.json        ← metadata PWA (nombre, íconos, colores)
├── service-worker.js    ← habilita "instalar app"; no cachea nada (siempre carga fresco)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

## Instalación como app (PWA)

El botón "Instalar" aparece solo en navegadores Chromium (Chrome, Edge, Samsung Internet) en Android y desktop — es el único ecosistema que dispara el evento `beforeinstallprompt`. En iOS/Safari no existe ese evento; ahí se instala manualmente vía **Compartir → Agregar a pantalla de inicio**, así que el botón se mantiene oculto en ese navegador (no es un bug, es una limitación de Apple).

El service worker (`service-worker.js`) existe únicamente para cumplir el requisito técnico de instalabilidad — **no cachea nada**. Cada carga de la app pide todo de nuevo a la red (mapa, clima, ruteo), así nunca vas a quedar viendo una versión vieja cacheada por error.
