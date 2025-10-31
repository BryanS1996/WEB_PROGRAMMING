// script.js - consumo de API y renderizado en index.html
// Reemplaza API_URL por la URL de tu backend cuando la tengas.

const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // example base endpoint
const DEFAULT_LIMIT = 8; // number of items to fetch per request (used for example endpoint)
const TOTAL_AVAILABLE = 100; // total items in the example API (JSONPlaceholder has 100 posts)

const statusEl = document.getElementById('api-status');
const listEl = document.getElementById('api-list');
const titleEl = document.getElementById('api-title');
const reloadBtn = document.getElementById('api-reload');

function setReloadEnabled(enabled){
    if(!reloadBtn) return;
    reloadBtn.disabled = !enabled;
    reloadBtn.textContent = enabled ? 'Reload' : 'Loading...';
}

// Mezcla un array (Fisher-Yates) para presentar items en distinto orden cada recarga
function shuffleArray(array){
    const a = array.slice();
    for(let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function randomStart(){
    const maxStart = Math.max(0, TOTAL_AVAILABLE - DEFAULT_LIMIT);
    return Math.floor(Math.random() * (maxStart + 1));
}

function buildUrlForFetch(){
    // If the user provided a template like ?_start={start}&_limit={limit}
    if(API_URL.includes('{start}')){
        return API_URL.replace('{start}', randomStart()).replace('{limit}', DEFAULT_LIMIT);
    }

    // Special handling for the JSONPlaceholder example: compose _start and _limit so each reload returns different items
    if(API_URL.includes('jsonplaceholder.typicode.com')){
        const base = API_URL.split('?')[0];
        const start = randomStart();
        return `${base}?_start=${start}&_limit=${DEFAULT_LIMIT}`;
    }

    // Default: return API_URL as-is (assume backend returns varying results or supports your query params)
    return API_URL;
}

async function fetchData(url){
    showLoading('Loading Data...');
    try{
        const res = await fetch(url);
        if(!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        const data = await res.json();
        showSuccess(`Loaded ${Array.isArray(data)?data.length:1} items`);
        return data;
    }catch(err){
        showError('Error fetching data: ' + err.message);
        console.error(err);
        return null;
    }
}

function showLoading(msg){
    if(statusEl) statusEl.textContent = msg;
}
function showError(msg){
    if(statusEl){ statusEl.textContent = msg; statusEl.style.color = '#b00020'; }
}
function showSuccess(msg){
    if(statusEl){ statusEl.textContent = msg; statusEl.style.color = '#155724'; }
}

function renderItems(items){
    if(!listEl) return;
    listEl.innerHTML = '';
    if(!items || items.length === 0){
        listEl.innerHTML = '<li>No items to display.</li>';
        return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'api-item card';
        li.style.padding = '0.75rem';
        li.style.background = '#fff';
        li.style.borderRadius = '6px';
        li.style.boxShadow = '0 4px 10px rgba(0,0,0,0.04)';

        // Permitir que el backend use campos distintos; tomamos 'title' y 'body' si existen
        const title = item.title || item.name || `Item ${item.id || ''}`;
        const body = item.body || item.description || '';

        li.innerHTML = `<strong style="display:block; margin-bottom:.35rem; color:#222">${escapeHtml(title)}</strong>
                        <div style="color:#444; font-size:.95rem">${escapeHtml(body)}</div>`;

        fragment.appendChild(li);
    })
    listEl.appendChild(fragment);
}

// Pequeña función para evitar inyección de HTML mostrando texto con seguridad
function escapeHtml(str){
    if(!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
}

// Función principal que se ejecuta al cargar la página
async function init(){
    if(!API_URL){
        showError('API URL is not configured. Edit script.js.');
        return;
    }

    // deshabilitar botón mientras se carga
    setReloadEnabled(false);
    try{
        const url = buildUrlForFetch();
        const data = await fetchData(url);
        if(data){
            // si es arreglo, mezclar para variar el orden en cada recarga
            const items = Array.isArray(data) ? shuffleArray(data) : [data];
            renderItems(items);
        }
    } finally {
        // siempre volver a habilitar el botón
        setReloadEnabled(true);
    }
}

// Auto-inicializar cuando el DOM esté listo
if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => {
        // attach click listener to reload button
        if(reloadBtn) reloadBtn.addEventListener('click', init);
        init();
    });
} else {
    if(reloadBtn) reloadBtn.addEventListener('click', init);
    init();
}

// Exponer una función global para permitir recargar desde la consola si quieres
window.reloadApi = init;
