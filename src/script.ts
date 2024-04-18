import './styles.scss';

let fullForecastData: any = null; //to store full forecast data globally

// Function to toggle the navigation menu
function toggleNavMenu(): void {
    const navbar = document.getElementById('navbar') as HTMLElement;
    const navMenuIcon = document.getElementById('navMenuIcon') as HTMLElement;
    const navCloseIcon = document.getElementById('navCloseIcon') as HTMLElement;

    // Add event listeners to both the menu toggle button and the close button
    navMenuIcon.addEventListener('click', () => {
        navbar.classList.toggle('open');
    });
    navCloseIcon.addEventListener('click', () => {
        navbar.classList.toggle('open');
    });
}

// Call the function to initialize the menu toggle functionality
toggleNavMenu();

function getWeather(): void {
    const apiKey = "d33f0ce7a09838a09d8022ab1acae3d1";
    const city = (document.getElementById("idInput") as HTMLInputElement).value;
    const errorMessageDiv = document.getElementById("error-message") as HTMLElement;
    const inputField = document.getElementById("idInput") as HTMLInputElement;

    // Clear any previous error message and reset input field border
    errorMessageDiv.style.display = 'none';
    inputField.style.border = '1px solid #ccc';

    if (!city) {
        displayErrorMessage("Please enter a city."); // Display error if no city is entered
        return;
    }
    
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(currentWeatherData => {
            if (currentWeatherData.cod !== 200) {
                throw new Error(currentWeatherData.message);
            }

            console.log("Current Weather Data:", currentWeatherData); // Log the API response
            

            // Fetch forecast data
            return fetch(forecastUrl).then(response => response.json())
                .then(forecastData => {
                    if (forecastData.cod !== "200") {
                        throw new Error(forecastData.message);
                    }

                    console.log("Forecast Data:", forecastData); // Log the API response
                    fullForecastData = forecastData; // Store forecast data globally
                });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            displayErrorMessage('Failed to fetch weather data. Please try again.');
        });
}

function loadFetchedWeatherData(data: any): void {
    if (data.cod === '404') {
        document.getElementById("descriptionDiv")!.innerHTML = `<p>${data.message}</p>`;
    } else {
        const weatherData = {
            temperature: Math.round(data.main.temp - 273.15),
            iconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed),
            cloudCoverage: data.clouds.all,
            cityName: data.name
        };

        renderWeatherElements(weatherData);
        showImage();
    }
}

function showImage(): void {
    const weatherIcon = document.getElementById("weatherIcon") as HTMLImageElement;
    weatherIcon.style.display = "inline-block";
}

// Only display weather when the searchBtn is clicked while the btn has class btn_active
let btn = document.getElementById("idBtn") as HTMLButtonElement;
let input = document.getElementById("idInput") as HTMLInputElement;
btn.addEventListener("click", function() {
    this.classList.toggle("btn_active");
    input.classList.toggle("input_active");

    if (!this.classList.contains("btn_active")) {
        getWeather();
    } else {
        input.focus();
        input.value = '';
    }
});

function displayErrorMessage(message: string): void {
    const errorMessageDiv = document.getElementById("error-message") as HTMLElement;

    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

function renderWeatherElements(data: any): void {
    const elementsConfig = [
        { id: "cityNameDiv", content: `<h2>${data.cityName}</h2>` },
        { id: "temperatureDiv", content: `<p>${data.temperature}°C</p>` },
        { id: "descriptionDiv", content: `<p>${data.description}</p>` },
        { id: "timeDiv", content: `<p>Time: ${data.time}</p>` },
        { id: "humiditySection", content: `
            <span class="airInfoDetail material-icons">water_drop</span>
            <span class="airInfoDetail">${data.humidity}%</span>
            <div class="airInfoDetail">Humidity</div>` },
        { id: "windSpeedSection", content: `
            <span class="airInfoDetail material-icons">air</span>
            <span class="airInfoDetail">${data.windSpeed} m/s</span>
            <div class="airInfoDetail">Wind speed</div>` },
        { id: "cloudCoverageSection", content: `
            <span class="airInfoDetail material-icons">cloud</span>
            <span class="airInfoDetail">${data.cloudCoverage}%</span>
            <div class="airInfoDetail">Cloud coverage</div>` }
    ];

    // Update innerHTML for each element
    elementsConfig.forEach(({ id, content }) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = content;
        }
    });

    // Update the weather icon separately
    const weatherIcon = document.getElementById("weatherIcon") as HTMLImageElement;
    if (weatherIcon) {
        weatherIcon.src = data.iconUrl;
        weatherIcon.alt = data.description;
    }
}
//Function to set up click event for navigation
function setUpNavClickEvents(): void {
    const forecastDays = document.querySelectorAll('.forecastDays');

    forecastDays.forEach((dayElement, index) => {
        dayElement.addEventListener('click', () => {
            // Remove 'active' class from all forecast days
            forecastDays.forEach(day => day.classList.remove('active'));

            // Add 'active' class to the clicked day
            dayElement.classList.add('active');
        });
    });
}