const apiURL = './travel_recommendation_api.json';
let travelData = {};

// Cargar los datos al iniciar la página
async function fetchTravelData() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('Error en la solicitud');
        travelData = await response.json();
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

fetchTravelData();

// Referencias a los elementos del DOM
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const heroContent = document.querySelector('.hero-content');

// Función auxiliar para obtener la hora local basada en el nombre del lugar
function getLocalTime(locationName) {
    // Diccionario de zonas horarias. 
    const timeZones = {
        'sydney, australia': 'Australia/Sydney',
        'melbourne, australia': 'Australia/Melbourne',
        'tokyo, japan': 'Asia/Tokyo',
        'kyoto, japan': 'Asia/Tokyo',
        'rio de janeiro, brazil': 'America/Sao_Paulo',
        'são paulo, brazil': 'America/Sao_Paulo',
        'angkor wat, cambodia': 'Asia/Phnom_Penh',
        'taj mahal, india': 'Asia/Kolkata',
        'bora bora, french polynesia': 'Pacific/Tahiti',
        'copacabana beach, brazil': 'America/Sao_Paulo'
    };

    // Buscar si el nombre del destino incluye alguna de las claves del diccionario
    const nameLower = locationName.toLowerCase();
    const key = Object.keys(timeZones).find(k => nameLower.includes(k));

    if (!key) return null; // Si no hay zona horaria mapeada, no devuelve nada

    const timeZone = timeZones[key];
    const options = {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    try {
        return new Date().toLocaleTimeString('en-US', options);
    } catch (error) {
        console.error("Error al formatear la hora: ", error);
        return null;
    }
}

// Lógica principal de búsqueda
searchBtn.addEventListener('click', () => {
    const input = searchInput.value.toLowerCase().trim();
    let results = [];

    if (input === 'playa' || input === 'playas' || input === 'beach' || input === 'beaches') {
        results = travelData.beaches;
    }
    else if (input === 'templo' || input === 'templos' || input === 'temple' || input === 'temples') {
        results = travelData.temples;
    }
    else if (input === 'pais' || input === 'país' || input === 'paises' || input === 'países' || input === 'country' || input === 'countries') {
        travelData.countries.forEach(country => {
            results = results.concat(country.cities);
        });
    }
    else {
        const countryMatch = travelData.countries.find(c => c.name.toLowerCase() === input);
        if (countryMatch) {
            results = countryMatch.cities;
        }
    }

    displayResults(results);
});

// Lógica del botón Limpiar (Clear)
clearBtn.addEventListener('click', () => {
    // Limpia el texto del buscador
    searchInput.value = '';

    // Limpia los resultados de la pantalla
    const container = document.getElementById('resultsWrapper');
    if (container) {
        container.innerHTML = '';
    }

    // Volver a mostrar el contenido principal del Hero
    if (heroContent) {
        heroContent.style.display = 'block';
    }
});

// Función para mostrar los resultados
function displayResults(results) {
    let wrapper = document.getElementById('resultsWrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'resultsWrapper';
        wrapper.className = 'results-wrapper';
        document.querySelector('.hero-section').appendChild(wrapper);
    }

    wrapper.innerHTML = '';

    // Ocultar el contenido principal del Hero para que no estorbe
    if (heroContent) {
        heroContent.style.display = 'none';
    }

    if (results.length === 0) {
        wrapper.innerHTML = '<p class="no-results">No se encontraron recomendaciones.</p>';
        return;
    }

    let htmlContent = `<h2 class="results-title">Search Results</h2>`;
    htmlContent += `<div class="results-grid">`;

    results.forEach(item => {
        // Obtener la hora local utilizando la función auxiliar
        const localTime = getLocalTime(item.name);

        // Crear el fragmento HTML para la hora si se encontró una zona horaria
        const timeHtml = localTime
            ? `<p class="local-time" style="font-weight: bold; color: #555;">Hora local: ${localTime}</p>`
            : '';

        htmlContent += `
            <div class="result-card">
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="result-info">
                    <h3>${item.name}</h3>
                    ${timeHtml}
                    <p>${item.description}</p>
                </div>
            </div>
        `;
    });

    htmlContent += `</div>`;
    wrapper.innerHTML = htmlContent;
}