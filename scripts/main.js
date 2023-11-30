let bikeListBlock = document.getElementById('bike-list-block');
let sendApplicationBlock = document.getElementById('send-application-block');

let lang = "en";

let bikeList = null;
let cityList = null;

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
});
