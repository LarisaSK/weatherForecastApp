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
            loadFetchedWeatherData(currentWeatherData);

            // Fetch forecast data
            return fetch(forecastUrl).then(response => response.json())
                .then(forecastData => {
                    if (forecastData.cod !== "200") {
                        throw new Error(forecastData.message);
                    }

                    console.log("Forecast Data:", forecastData); // Log the API response
                    fullForecastData = forecastData; // Store forecast data globally
                    updateDatesInNav(); // Update dates after fetching data
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
            time: getLocalTime(new Date(), data.timezone).toLocaleTimeString(),
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

function displayHourlyForecast(hourlyData: any, selectedDate: Date, timezoneOffset: number, currentWeatherData: any): void {
    const hourlyForecastSection = document.getElementById("hourlyForecastSection") as HTMLElement;
    hourlyForecastSection.innerHTML = ''; // Clear previous forecast data

    const now = new Date(); // Get the current date and time
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const isToday = now.toISOString().split('T')[0] === selectedDateString;

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

function updateDatesInNav(): void {
    const forecastDays = document.querySelectorAll('.forecastDays');
    const today = new Date();

    for (let i = 0; i < forecastDays.length; i++) {
        const date = today;
        date.setDate(today.getDate() + i);

        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayDate = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

        (forecastDays[i] as HTMLElement).innerText = `${dayName} ${dayDate}`;
    }
}

// Function to calculate the local time in the city based on the user's local time and the city's timezone offset
function getLocalTime(date: Date, cityTimezoneOffset: number): Date {
    // Get user's local time offset in minutes and convert it to seconds
    const userTimezoneOffset = date.getTimezoneOffset() * 60;

    // Calculate the difference between the user's local time and the city's time
    const timeDifference = cityTimezoneOffset - userTimezoneOffset;

    // Calculate the city's local time by adjusting the user's local time
    const cityTime = new Date(date.getTime() + (timeDifference * 1000));

    return cityTime;
}

function reverseGeocode(latitude: number, longitude: number): void {
    const apiKey = "d33f0ce7a09838a09d8022ab1acae3d1";
    const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

    fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const city = data[0].name;
                (document.getElementById("idInput") as HTMLInputElement).value = city; // Update the input field with the city name
                getWeather(); // Fetch weather for the detected city
            } else {
                displayErrorMessage("Could not determine city from your location. Please enter your city manually.");            }
        })
        .catch(error => {
            console.error("Error during reverse geocoding:", error);
            displayErrorMessage("Failed to get city name from your location. Please enter your city manually.");        });
}


function getUserLocation(): void {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            reverseGeocode(latitude, longitude);
        }, error => {
            console.error("Error getting location:", error);
            displayErrorMessage("Unable to retrieve your location. Please enter your city manually.");
        });
    } else {
        displayErrorMessage("Geolocation is not supported by your browser. Please enter your city manually.");
    }
}


// Initialize functions on page load
function init(): void {
    getUserLocation();
    updateDatesInNav();
    setUpNavClickEvents();
}


init();


