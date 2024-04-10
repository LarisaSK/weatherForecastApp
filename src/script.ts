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
        alert("Please enter a city."); // Display error if no city is entered
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
            alert('Failed to fetch weather data. Please try again.');
        });
}


getWeather();

function displayWeather(data: any): void {
    const cityNameDiv = document.getElementById("cityNameDiv") as HTMLElement;
    const temperatureDiv = document.getElementById("temperatureDiv") as HTMLElement;
    const descriptionDiv = document.getElementById("descriptionDiv") as HTMLElement;
    const timeDiv = document.getElementById("timeDiv") as HTMLElement;
    const weatherIcon = document.getElementById("weatherIcon") as HTMLImageElement;
    const humiditySection = document.getElementById("humiditySection") as HTMLElement;
    const windSpeedSection = document.getElementById("windSpeedSection") as HTMLElement;
    const cloudCoverageSection = document.getElementById("cloudCoverageSection") as HTMLElement;

    // Clear previous weather information
    cityNameDiv.innerHTML = '';
    temperatureDiv.innerHTML = '';
    descriptionDiv.innerHTML = '';
    timeDiv.innerHTML = '';
    humiditySection.innerHTML = '';
    windSpeedSection.innerHTML = '';
    cloudCoverageSection.innerHTML = '';

    if (data.cod === '404') {
        descriptionDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert Kelvin to Celsius
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = Math.round(data.wind.speed); // Round to whole number
        const cloudCoverage = data.clouds.all;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Create HTML content
        const cityHTML = `<h2>${cityName}</h2>`;
        const temperatureHTML = `<p>${temperature}°C</p>`;
        const descriptionHTML = `<p>${description}</p>`;
        const humidityHTML = `
            <span class="airInfoDetail material-icons">water_drop</span>
            <span class="airInfoDetail">${humidity}%</span>
            <div class="airInfoDetail">Humidity</div>`;
        
        const windSpeedHTML = `
            <span class="airInfoDetail material-icons">air</span>
            <span class="airInfoDetail">${windSpeed} m/s</span>
            <div class="airInfoDetail">Wind speed</div>`;
        
        const cloudCoverageHTML = `
            <span class="airInfoDetail material-icons">cloud</span>
            <span class="airInfoDetail">${cloudCoverage}%</span>
            <div class="airInfoDetail">Cloud coverage</div>`;

        // Update the HTML elements with the weather information
        cityNameDiv.innerHTML = cityHTML;
        temperatureDiv.innerHTML = temperatureHTML;
        descriptionDiv.innerHTML = descriptionHTML;
        humiditySection.innerHTML = humidityHTML;
        windSpeedSection.innerHTML = windSpeedHTML;
        cloudCoverageSection.innerHTML = cloudCoverageHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

       
    }
}

