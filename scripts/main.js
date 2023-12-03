let bikeListBlock = document.getElementById('bike-list-block');
let sendApplicationBlock = document.getElementById('send-application-block');

let lang = "en";

let bikesList = null;
let citiesList = null;
let translations = null;

let nameOk = false;
let phoneOk = false;
let emailOk = false;
let commentOk = false;

let application = {
    name: null,
    phone: null,
    email: null,
    city: 1,
    comment: null,
    bikeId: 1,
    timestamp: null
};

fetch('./resources/translations.json')
    .then(response => response.json())
    .then(data => {
        translations = data;
    })
    .catch(error => {
        console.error('Error to getting data: ', error);
    });

function scrollToApplicationBlock() {
    let applicationBlock = document.getElementById('send-application-block');
    let blockPosition = applicationBlock.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
        top: blockPosition,
        behavior: 'smooth'
    });
}

function scrollToBikesListBlock() {
    let bikeListBlock = document.getElementById('bike-list-block');
    let blockPosition = bikeListBlock.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
        top: blockPosition - 115,
        behavior: 'smooth'
    });
}

function setRandomBackgroundImage() {
    let randomNumber = Math.floor(Math.random() * 7) + 1;
    let imagePath = './web-ui/media/cover-image' + randomNumber + '.png';
    document.body.style.backgroundImage = 'url("' + imagePath + '")';
}

document.getElementById('to-application-btn').addEventListener('click', function() {
    scrollToApplicationBlock();
});

document.getElementById('to-bike-list-btn').addEventListener('click', function() {
    scrollToBikesListBlock();
});


document.getElementById('language-dropdown').addEventListener('change', function() {
    lang = this.value;
    console.log('Language changed to: ' + lang);

    document.getElementById('to-bike-list-btn').textContent = translations[lang].bikeListButton;
    document.getElementById('to-application-btn').textContent = translations[lang].applicationButton;

    displayBikes();
});

document.addEventListener('DOMContentLoaded', function() {
    setRandomBackgroundImage();
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

function displayBikes(retryCount = 0) {
    if (!bikesList || !bikesList.length || !citiesList || !citiesList.length) {
        if (retryCount < 3) {
            setTimeout(() => displayBikes(retryCount + 1), 200);
            return;
        } else {
            displayNoBikes();
            return;
        }
    }

    if(!translations) {
        if (retryCount < 3) {
            setTimeout(() => displayBikes(retryCount + 1), 200);
            return;
        } else {
            displayNoBikes();
            return;
        }
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
                    <h2 class="bike-name">${bikeName}</h2>
                    <p class="bike-rental">${translations[lang].rentalText}: <span class="rental-price">${bike.rental}</span></p> <!-- Цена аренды -->
                    <p class="bike-comment">${bikeComment}</p>
                </div>
                
                <div class="control">
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
            const cityId = this.closest('.bike-announcement').querySelector('.city-dropdown').value;

            application.city = cityId;
            application.bikeId = bikeId;

            console.log('City changed to: ' + cityId);
            console.log('Bike changed to: ' + bikeId);

            displayApplication();
        });
    });


    const applyButtons = bikeListBlock.querySelectorAll('.apply-button');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bikeId = this.closest('.bike-announcement').getAttribute('data-bike-id');
            const cityId = this.closest('.bike-announcement').querySelector('.city-dropdown').value;

            application.city = cityId;
            application.bikeId = bikeId;

            console.log('City changed to: ' + cityId);
            console.log('Bike changed to: ' + bikeId);

            displayApplication();
            scrollToApplicationBlock();
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

    sendApplicationBlock.innerHTML = ``;
}

function displayApplication() {
    sendApplicationBlock.innerHTML = `
        <form id="applicationForm">
            <div class="form-group">
                <label for="name">${translations[lang].nameLabel}</label>
                <input type="text" id="name" name="name" placeholder="${translations[lang].namePlaceholder}" required>
                <span class="error-message" style="display:none;">${translations[lang].invalidName}</span>
            </div>
            <div class="form-group">
                <label for="phone">${translations[lang].phoneLabel}</label>
                <input type="tel" id="phone" name="phone" pattern="^[1-9][0-9]{8}$" placeholder="${translations[lang].phonePlaceholder}" required>
                <span class="error-message" style="display:none;">${translations[lang].invalidPhone}</span>
            </div>
            <div class="form-group">
                <label for="email">${translations[lang].emailLabel}</label>
                <input type="email" id="email" name="email" placeholder="${translations[lang].emailPlaceholder}" required>
                <span class="error-message" style="display:none;">${translations[lang].invalidEmail}</span>
            </div>
            <div class="form-group">
                <label for="city">${translations[lang].cityLabel}</label>
                <select id="city" name="city" required>
                    ${citiesList.map(city => `<option value="${city.id}" ${city.id === Number(application.city) ? 'selected' : ''}>${city.city}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="bike">${translations[lang].bicycleLabel}</label>
                <select id="bike" name="bike" required>
                    ${bikesList.map(bike => `<option value="${bike.id}" ${bike.id === Number(application.bikeId) ? 'selected' : ''}>${bike['name' + lang.charAt(0).toUpperCase() + lang.slice(1)]}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="comment">${translations[lang].commentLabel}</label>
                <textarea id="comment" name="comment" placeholder="${translations[lang].commentPlaceholder}"></textarea>
                <span class="error-message" style="display:none;">${translations[lang].invalidComment}</span>
            </div>
            <input type="hidden" id="bikeId" name="bikeId" value="${application.bikeId}">
            <input type="hidden" id="timestamp" name="timestamp">
            <button type="submit">${translations[lang].applyButton}</button>
        </form>
        
        <div id="alert-success" class="alert alert-success" style="display:none;">
          ${translations[lang].applicationSuccess}
        </div>
        <div id="alert-danger" class="alert alert-danger" style="display:none;">
          ${translations[lang].applicationError}
        </div>
    `;

    document.getElementById('phone').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');

        if (e.target.value.length > 9) {
            e.target.value = e.target.value.slice(0, 9);
        }

        if (e.target.value.startsWith('0')) {
            e.target.value = '';
        }
    });

    document.getElementById('name').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
    });

    document.getElementById('applicationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitApplication();
    });

    document.getElementById('email').addEventListener('input', function() {
        const isValid = validateEmail(this.value);
        emailOk = isValid;
        displayValidationMessage(this, isValid);
    });

    document.getElementById('phone').addEventListener('input', function() {
        const isValid = validatePhone(this.value);
        phoneOk = isValid;
        displayValidationMessage(this, isValid);
    });

    document.getElementById('name').addEventListener('input', function() {
        const isValid = validateName(this.value);
        nameOk = isValid;
        displayValidationMessage(this, isValid);
    });

    document.getElementById('comment').addEventListener('input', function() {
        const isValid = validateComment(this.value);
        commentOk = isValid;
        displayValidationMessage(this, isValid);
    });
}

function displayAlert(message, type) {
    const alertSuccess = document.getElementById('alert-success');
    const alertDanger = document.getElementById('alert-danger');
    if (type === 'success') {
        alertSuccess.textContent = translations[lang].applicationSuccess;
        alertSuccess.style.display = 'block';
        alertDanger.style.display = 'none';
    } else if (type === 'danger') {
        alertDanger.textContent = translations[lang].applicationError + message;
        alertDanger.style.display = 'block';
        alertSuccess.style.display = 'none';
    }

    if (type === 'success') {
        alertSuccess.style.animation = 'slideUp 0.5s ease-out';
    } else {
        alertDanger.style.animation = 'slideUp 0.5s ease-out';
    }

    setTimeout(() => {
        if (type === 'success') {
            alertSuccess.style.animation = 'slideDown 0.5s ease-out';
        } else {
            alertDanger.style.animation = 'slideDown 0.5s ease-out';
        }
        setTimeout(() => {
            alertSuccess.style.display = 'none';
            alertDanger.style.display = 'none';
        }, 500);

        if (type === 'success') {
            sendApplicationBlock.style.animation = 'slideDownApplication 0.5s ease-out';
            scrollToBikesListBlock();

            setTimeout(() => {
                sendApplicationBlock.innerHTML = ``;
            }, 500);
        }
    }, 3000);
}

function submitApplication() {
    if(nameOk && emailOk && phoneOk && commentOk) {
        const applicationData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            city: document.getElementById('city').value,
            comment: document.getElementById('comment').value,
            bikeId: document.getElementById('bikeId').value,
            timestamp: new Date().getTime()
        };

        fetch('http://localhost:8080/send_application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicationData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.text(); // Используйте text вместо json
            })
            .then(data => {
                console.log('Application send: ', data);
                displayAlert('', 'success');
            })
            .catch(error => {
                console.error('Error: ', error);
                displayAlert(error.message, 'danger');
            });
    } else {
        displayAlert("Check the entered data.", 'danger');

        document.querySelectorAll('.error-message').forEach(el => {
            if (el.style.display !== 'none') {
                el.classList.add('error-shake');

                el.addEventListener('animationend', () => {
                    el.classList.remove('error-shake');
                }, {once: true});
            }
        });
    }
}

function validateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
}

function validatePhone(phone) {
    return /^[1-9][0-9]{8}$/.test(phone);
}

function validateName(name) {
    return /^[A-Za-zА-Яа-яЁё\s]+$/.test(name);
}

function validateComment(comment) {
    return comment !== null && comment.trim().length > 0;
}

function displayValidationMessage(inputElement, isValid) {
    const messageElement = inputElement.nextElementSibling;
    if (!isValid) {
        messageElement.style.display = 'block';
    } else {
        messageElement.style.display = 'none';
    }
}
