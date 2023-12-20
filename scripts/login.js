document.addEventListener('DOMContentLoaded', function() {
    let signInButton = document.querySelector('.sign-in-button');

    signInButton.addEventListener('click', function() {
        let login = document.getElementById('login').value;
        let password = document.getElementById('password').value;

        if (!login || !password) {
            console.log("Login or password field is empty")
            checkCookie();
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/admin/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let token = xhr.responseText;
                document.cookie = "sessionToken=" + token + "; path=/";
                window.location.href = './../admin.html'; // Укажите URL следующей страницы
            } else if (xhr.readyState === 4) {
                console.log("Login failed")
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
