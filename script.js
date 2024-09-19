let userLat, userLng, map, userMarker;

const locations = [
    { name: 'Australia', lat: -25.2744, lng: 133.7751 },
    { name: 'Japan', lat: 36.2048, lng: 138.2529 },
    { name: 'America', lat: 37.0902, lng: -95.7129 },
    { name: 'Malaysia', lat: 4.2105, lng: 101.9758 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'England', lat: 51.5074, lng: -0.1278 },
    { name: 'Undip', lat: -7.049000, lng: 110.438004 }, 
    { name: 'Unnes', lat: -7.048722, lng: 110.389639 }, 
    { name: 'Unimus', lat: -7.0217608, lng: 110.4618645 }, 
    { name: 'Udinus', lat: -6.9826794, lng: 110.4090606 }, 
    { name: 'Polines', lat: -7.0521006, lng: 110.4353347 }, 
    { name: 'Poltekkes Semarang', lat: -7.0545115, lng: 110.4283584 } 
];


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

    calculateDistances();

    addLocationMarkers();   
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

function calculateDistances() {
    const locationList = document.getElementById('location-list');
    locationList.innerHTML = '';

    locations.forEach(location => {
        const distanceKm = haversineDistance(userLat, userLng, location.lat, location.lng);
        const distanceMeters = distanceKm * 1000;
        const li = document.createElement('li');
        li.textContent = `${location.name}: ${distanceKm.toFixed(2)} km (${distanceMeters.toFixed(0)} meters)`;
        locationList.appendChild(li);
    });
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}


function addLocationMarkers() {
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`${location.name}`).openPopup();
    });
}