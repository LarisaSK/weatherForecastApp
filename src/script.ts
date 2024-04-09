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

function displayWeather(): void {
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

}
displayWeather();