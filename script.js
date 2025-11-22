const apiKey = "e8566ad867e4c132ee7e1e2697509e46";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const loader = document.querySelector(".loader");

const errorBox = document.querySelector(".error");
const weatherBox = document.querySelector(".weather");


async function checkWeather(city) {

    if (city.trim() === "") {
        errorBox.style.display = "block";
        errorBox.innerHTML = "Please enter a city name";
        weatherBox.style.display = "none";
        return;
    }

    loader.style.display = "block";
    errorBox.style.display = "none";
    weatherBox.style.display = "none";

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status === 404) {
        errorBox.style.display = "block";
        errorBox.innerHTML = "Invalid City Name";
        loader.style.display = "none";
        return;
    }

    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    document.querySelector(".feels").innerHTML = data.main.feels_like + "°C";
    document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";
    document.querySelector(".visibility").innerHTML = (data.visibility / 1000) + " km";

    document.querySelector(".sunrise").innerHTML =
        new Date(data.sys.sunrise * 1000).toLocaleTimeString();

    document.querySelector(".sunset").innerHTML =
        new Date(data.sys.sunset * 1000).toLocaleTimeString();

    const condition = data.weather[0].main;

    const iconMap = {
        "Clouds": "clouds.png",
        "Clear": "clear.png",
        "Rain": "rain.png",
        "Drizzle": "drizzle.png",
        "Mist": "mist.png",
        "Snow": "snow.png"
    };

    weatherIcon.src = `images/${iconMap[condition] || "clear.png"}`;

    loader.style.display = "none";
    weatherBox.style.display = "block";
}
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});


searchBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});


function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const url =
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            loader.style.display = "block";

            const response = await fetch(url);
            const data = await response.json();

            checkWeather(data.name);
        });
    }
}

document.querySelector(".theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light");

    const btn = document.querySelector(".theme-toggle");
    btn.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});

detectLocation();
