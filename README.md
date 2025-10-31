# WEB_PROGRAMMING — Example frontend

This repository contains a simple static frontend (HTML/CSS/JS) that demonstrates how to fetch data from an API and render results in the browser.

## Main files
- `index.html` — main page with a section that displays API data and a "Reload" button.
- `style.css` — custom styles.
- `script.js` — logic to fetch data, show loading/success/error status and render items.

## Run locally
1. Open PowerShell in the project folder and open the page in your default browser:

```powershell
cd C:\Users\BryanS\Desktop\Programación_Web\WEB_PROGRAMMING
ii .\index.html
```

2. The page will automatically fetch example data (JSONPlaceholder). Click the "Reload" button to fetch again.

## Dynamic / varying data on reload
- For the example JSONPlaceholder endpoint, the client builds a URL with a random `_start` value on each reload so you get different posts each time (the script requests 8 posts per fetch by default).
- If you want to use your own backend that supports pagination, you can provide placeholders in the `API_URL` inside `script.js`. Example:

```js
// template example — script will replace {start} and {limit} automatically
const API_URL = 'https://api.example.com/items?_start={start}&_limit={limit}';
```

The client will replace `{start}` with a random number and `{limit}` with the configured limit. If you provide a normal URL (no placeholders), the script will use it as-is.

## Customize the fetch
- Open `script.js` and edit these constants:

```js
const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // example
const DEFAULT_LIMIT = 8; // items per request for the example
const TOTAL_AVAILABLE = 100; // used only for the example to compute random start
```

## Mapping response fields
- The renderer uses `title` and `body` by default. If your API uses other fields (e.g. `name` / `description`), `renderItems` will try to adapt, but you can edit `renderItems` to map exact fields.

## CORS notes
- If your backend runs on a different origin, the browser will enforce CORS. Make sure your server responds with the appropriate CORS headers, for example:

```
Access-Control-Allow-Origin: *
```

or configure a safer, restricted origin.

## Reload button behavior
- The reload button disables itself while a request is in progress (text changes to "Cargando...") and re-enables when the request completes. For the example endpoint the client also randomizes which items are requested, so content changes on each reload.

## Troubleshooting
- If nothing changes when reloading, open the browser console (F12) to check network errors or CORS problems.
- If images don't appear, verify the image files exist or change the `src` paths in `index.html`.

If you want the reload button to trigger other behaviors (search, pagination controls, filters), tell me how you'd like the UI to look and I'll implement it.
# WEB_PROGRAMMING — Frontend de ejemplo

Este repositorio contiene una página estática (HTML/CSS/JS) que muestra cómo consumir una API desde el frontend y renderizar resultados.

Archivos principales
- `index.html` — página principal con una sección para mostrar datos desde la API y un botón "Recargar".
- `style.css` — estilos personalizados.
- `script.js` — lógica para obtener datos desde una API, mostrar estados (cargando/éxito/error) y renderizar los elementos.

Cómo ejecutar
1. Abre PowerShell en la carpeta del proyecto:

```powershell
cd C:\Users\BryanS\Desktop\Programación_Web\WEB_PROGRAMMING
ii .\index.html
```

2. La página cargará automáticamente datos desde el endpoint de prueba (JSONPlaceholder). Usa el botón "Recargar" para volver a obtener datos.

Configurar tu propio backend
- Edita `script.js` y cambia la constante `API_URL` por la URL de tu endpoint:

```js
const API_URL = 'https://mi-backend.example.com/api/items';
```

- El script espera JSON. Por defecto mapeará `title` y `body` para mostrar el título y la descripción. Si tu API usa otros campos (por ejemplo `name` / `description`), el script intenta adaptarse, pero puedes personalizar `renderItems`.

Notas sobre CORS
- Si tu backend está en otro dominio o puerto distinto al de tu archivo local, el navegador puede bloquear la petición por política CORS. Asegúrate de que el servidor incluya la cabecera:

```
Access-Control-Allow-Origin: *
```

o, preferiblemente, restringe a los orígenes que necesites.

Comportamiento del botón "Recargar"
- Al pulsar "Recargar" el botón se deshabilita y su texto cambia a "Cargando..." hasta que la petición finaliza. Para mejorar la percepción, los items se mezclan aleatoriamente al mostrarse, de modo que la recarga presente distinto orden cada vez.

Problemas comunes
- Si no ves cambios al recargar, revisa la consola del navegador (F12) para errores de red o CORS.
- Si no aparecen imágenes, verifica que `imagen1.jpg` y `imagen2.jpg` existan en la carpeta o reemplázalas por rutas válidas.

Si quieres que el botón haga otra cosa (paginación, búsqueda u ordenamientos), dime cómo quieres los parámetros y lo implemento.
