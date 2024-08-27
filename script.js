let userLat, userLng, map, userMarker;

function requestLocation() {
    document.getElementById('allow-location-btn').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showMap(position) {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;

    map = L.map('map').setView([userLat, userLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    setTimeout(function() {
        map.invalidateSize();
        userMarker = L.marker([userLat, userLng]).addTo(map)
            .bindPopup("You are here!")
            .openPopup();
    }, 100);

    document.getElementById('spinner').style.display = 'none';
    document.getElementById('map').style.display = 'block';
    document.getElementById('locate-btn').style.display = 'block';

    map.invalidateSize();
}

function goToLocation() {
    if (map && userLat !== undefined && userLng !== undefined) {
        map.setView([userLat, userLng], 13);
        userMarker.openPopup();
    }
}

function showError(error) {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('allow-location-btn').style.display = 'block';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("You denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get your location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('allow-location-btn').style.display = 'block';
    document.getElementById('locate-btn').style.display = 'none';
});