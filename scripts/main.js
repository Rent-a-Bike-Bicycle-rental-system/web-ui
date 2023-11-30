let bikeListBlock = document.getElementById('bike-list-block');
let sendApplicationBlock = document.getElementById('send-application-block');

let lang = "en";

let bikesList = null;
let citiesList = null;

let application = {
    name: null,
    phone: null,
    email: null,
    city: 1,
    comment: null,
    bikeId: 1,
    timestamp: null
};

const translations = {
    en: {
        bikeListButton: "Go to Bike List",
        applicationButton: "Go to Application",
        noBikesMessage: 'Bicycles are currently not available',
        applyButton: 'Send application',
        rentalText: 'Rental'
    },
    pl: {
        bikeListButton: "Przejdź do listy rowerów",
        applicationButton: "Przejdź do wniosku",
        noBikesMessage: 'Obecnie rowery nie są dostępne',
        applyButton: 'Złożyć wniosek',
        rentalText: 'Cena'
    },
    ua: {
        bikeListButton: "Перейти до списку велосипедів",
        applicationButton: "Перейти до заявки",
        noBikesMessage:'Велосипеди зараз недоступні',
        applyButton: 'Подати заявку',
        rentalText: 'Цiна'
    },
    ru: {
        bikeListButton: "Перейти к списку велосипедов",
        applicationButton: "Перейти к заявлению",
        noBikesMessage: 'Велосипеды в данный момент недоступны',
        applyButton: 'Подать заявку',
        rentalText: 'Цена'
    }
};

document.getElementById('to-application-btn').addEventListener('click', function() {
    // Scroll to the send-application-block
    document.getElementById('send-application-block').scrollIntoView();
});

document.getElementById('to-bike-list-btn').addEventListener('click', function() {
    // Scroll to the bike-list-block
    document.getElementById('bike-list-block').scrollIntoView();
});

document.getElementById('language-dropdown').addEventListener('change', function() {
    lang = this.value;
    console.log('Language changed to: ' + lang);

    document.getElementById('to-bike-list-btn').textContent = translations[lang].bikeListButton;
    document.getElementById('to-application-btn').textContent = translations[lang].applicationButton;

    displayBikes();
});

document.addEventListener('DOMContentLoaded', function() {
    fetchCities();
    fetchBikes();
});

function fetchBikes() {
    fetch('http://localhost:8080/get_bikes')
        .then(response => response.json())
        .then(bikes => {
            bikesList = bikes;
            displayBikes();
        })
        .catch(error => {
            console.error(error);
            displayNoBikes();
        });
}

function fetchCities() {
    fetch('http://localhost:8080/get_cities')
        .then(response => response.json())
        .then(cities => {
            citiesList = cities;
        })
        .catch(error => {
            console.error(error);
        });
}

function displayBikes() {
    if (!bikesList || !bikesList.length || !citiesList || !citiesList.length) {
        displayNoBikes();
        return;
    }

    bikeListBlock.innerHTML = bikesList.map(bike => {
        const bikeName = bike['name' + lang.charAt(0).toUpperCase() + lang.slice(1)];
        const bikeComment = bike['comment' + lang.charAt(0).toUpperCase() + lang.slice(1)];
        const applyButton = translations[lang].applyButton;

        return `
            <div class="bike-announcement" data-bike-id="${bike.id}">
                <div class="bike-photos">
                    ${bike.photos.map((photo, index) => `<img src="${photo.photoUrl}" alt="Bike" class="bike-photo" style="${index > 0 ? 'display: none;' : ''}">`).join('')}
                    <button id="prev" onclick="changePhoto(${bike.id}, 'prev')">←</button>
                    <button id="next" onclick="changePhoto(${bike.id}, 'next')">→</button>
                </div>
                <div class="bike-info">
                    <h2>${bikeName}</h2>
                    <p>${translations[lang].rentalText}: ${bike.rental}</p>
                    <p>${bikeComment}</p>
                    <button class="apply-button">${applyButton}</button>
                    <select class="city-dropdown">
                        ${citiesList.map(city => `<option value="${city.id}">${city.city}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;

    }).join('');

    const cityDropdowns = bikeListBlock.querySelectorAll('.city-dropdown');
    cityDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            const bikeId = this.closest('.bike-announcement').getAttribute('data-bike-id');
            application.city = this.value;
            application.bikeId = bikeId;

            console.log('City changed to: ' + this.value);
            console.log('Bike changed to: ' + bikeId);

            displayApplication();
        });
    });

    displayApplication();
}

function changePhoto(bikeId, direction) {
    const bikePhotosDiv = document.querySelector(`.bike-announcement[data-bike-id="${bikeId}"] .bike-photos`);
    const photos = bikePhotosDiv.querySelectorAll('.bike-photo');

    let currentPhotoIndex = Array.from(photos).findIndex(photo => photo.style.display !== 'none');

    if (currentPhotoIndex === -1) {
        currentPhotoIndex = 0;
    }

    photos[currentPhotoIndex].style.display = 'none';

    if (direction === 'next') {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    } else if (direction === 'prev') {
        currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    }

    photos[currentPhotoIndex].style.display = 'block';
}


function displayNoBikes() {
    bikeListBlock.innerHTML = `
        <div class="no-bikes">
            ${translations[lang].noBikesMessage}
        </div>
    `;
}

function displayApplication() {
    sendApplicationBlock.classList.remove('hidden');

    sendApplicationBlock.innerHTML = `
        
    `;
}