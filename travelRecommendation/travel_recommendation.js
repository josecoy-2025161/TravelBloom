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
        htmlContent += `
            <div class="result-card">
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="result-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
    });

    htmlContent += `</div>`;
    wrapper.innerHTML = htmlContent;
}