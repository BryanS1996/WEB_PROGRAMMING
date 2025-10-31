// script.js - consumo de API y renderizado en index.html
// Reemplaza API_URL por la URL de tu backend cuando la tengas.

const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=8'; // ejemplo de prueba

const statusEl = document.getElementById('api-status');
const listEl = document.getElementById('api-list');
const titleEl = document.getElementById('api-title');
const reloadBtn = document.getElementById('api-reload');

function setReloadEnabled(enabled){
    if(!reloadBtn) return;
    reloadBtn.disabled = !enabled;
    reloadBtn.textContent = enabled ? 'Recargar' : 'Cargando...';
}

async function fetchData(url){
    showLoading('Cargando datos...');
    setReloadEnabled(false);
    try{
        const res = await fetch(url);
        if(!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        const data = await res.json();
        showSuccess(`Cargados ${Array.isArray(data)?data.length:1} elementos`);
        return data;
    }catch(err){
        showError('Error al obtener datos: ' + err.message);
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
        listEl.innerHTML = '<li>No hay elementos para mostrar.</li>';
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
        showError('No se ha configurado la URL de la API. Edita script.js.');
        return;
    }

    const data = await fetchData(API_URL);
    if(data) renderItems(data);
    // habilitar botón después de la carga (exitosa o no)
    setReloadEnabled(true);
}

// Auto-inicializar cuando el DOM esté listo
if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Exponer una función global para permitir recargar desde la consola si quieres
window.reloadApi = init;
