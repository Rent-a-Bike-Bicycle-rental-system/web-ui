document.addEventListener('DOMContentLoaded', function() {
    setRandomBackgroundImage();
});

function setRandomBackgroundImage() {
    let randomNumber = Math.floor(Math.random() * 7) + 1;
    let imagePath = './media/cover-image' + randomNumber + '.png';
    document.body.style.backgroundImage = 'url("' + imagePath + '")';
}

document.addEventListener('DOMContentLoaded', function() {
    let signInButton = document.querySelector('.sign-in-button');

    signInButton.addEventListener('click', function() {
        let login = document.getElementById('login').value;
        let password = document.getElementById('password').value;

        if (!login || !password) {
            console.log("Login or password field is empty")
            showAlert("Login or password field is empty", ["slide-up", "slide-down"]);
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/admin/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let token = xhr.responseText;
                document.cookie = "sessionToken=" + token + "; path=/";
                window.location.href = './../admin.html';
            } else if (xhr.readyState === 4) {
                console.log("Login failed")

                showAlert("Login failed", ["slide-up", "slide-down"]);
                // here
            }
        };
        xhr.send(JSON.stringify({login: login, password: password}));
    });
});

function getCookie(name) {
    let cookieArray = document.cookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name + '=') == 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return "";
}

function checkCookie() {
    let sessionToken = getCookie("sessionToken");
    if (sessionToken != "") {
        console.log("Session Token: " + sessionToken);
    } else {
        console.log("No session token found");
    }
}

function showAlert(message, animations) {
    const alertElement = document.querySelector('.alert');

    // Set the message text
    alertElement.textContent = message;

    // Remove any previous animation classes
    alertElement.classList.remove(...animations);

    // Show the alert
    alertElement.style.display = 'block';

    // Apply the specified animations
    alertElement.classList.add(...animations);

    // Hide the alert after a delay (you can adjust the delay as needed)
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 3000); // 3000 milliseconds (3 seconds) in this example
}