/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!***********************!*\
  !*** ./src/script.ts ***!
  \***********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./styles.scss */ "./src/styles.scss");
let fullForecastData = null; //to store full forecast data globally
// Function to fetch current weather and forecast data
function getWeather() {
    const apiKey = "d33f0ce7a09838a09d8022ab1acae3d1";
    const city = document.getElementById("idInput").value;
    const errorMessageDiv = document.getElementById("error-message");
    const inputField = document.getElementById("idInput");
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
            displayHourlyForecast(forecastData, new Date(), forecastData.city.timezone, currentWeatherData); // Pass timezone offset and current weather
        });
    })
        .catch(error => {
        console.error('Error fetching weather data:', error);
        displayErrorMessage('Failed to fetch weather data. Please try again.');
    });
}
function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById("error-message");
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}
// Function to display weather information
function loadFetchedWeatherData(data) {
    if (data.cod === '404') {
        document.getElementById("descriptionDiv").innerHTML = `<p>${data.message}</p>`;
    }
    else {
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
// Function to calculate the local time in the city based on the user's local time and the city's timezone offset
function getLocalTime(date, cityTimezoneOffset) {
    // Get user's local time offset in minutes and convert it to seconds
    const userTimezoneOffset = date.getTimezoneOffset() * 60;
    // Calculate the difference between the user's local time and the city's time
    const timeDifference = cityTimezoneOffset - userTimezoneOffset;
    // Calculate the city's local time by adjusting the user's local time
    const cityTime = new Date(date.getTime() + (timeDifference * 1000));
    return cityTime;
}
function displayHourlyForecast(hourlyData, selectedDate, timezoneOffset, currentWeatherData) {
    const hourlyForecastSection = document.getElementById("hourlyForecastSection");
    hourlyForecastSection.innerHTML = ''; // Clear previous forecast data
    const now = new Date(); // Get the current date and time
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const isToday = now.toISOString().split('T')[0] === selectedDateString;
    let filteredData = [];
    if (isToday) {
        // Use the current weather data for the "Now" section
        const currentWeather = {
            dt: currentWeatherData.dt,
            main: currentWeatherData.main,
            weather: currentWeatherData.weather,
            clouds: currentWeatherData.clouds,
            wind: currentWeatherData.wind
        };
        filteredData.push(currentWeather);
        // Add the forecasts for the next 24 hours in 3-hour intervals
        for (let i = 0; i < 8; i++) { // 8 intervals of 3 hours cover 24 hours
            const targetTime = new Date(now.getTime() + (i + 1) * 3 * 60 * 60 * 1000); // Increment by 3 hours
            // Find the closest time match
            let closestItem = hourlyData.list.reduce((prev, curr) => {
                const prevTimeDiff = Math.abs(new Date(prev.dt * 1000).getTime() - targetTime.getTime());
                const currTimeDiff = Math.abs(new Date(curr.dt * 1000).getTime() - targetTime.getTime());
                return (currTimeDiff < prevTimeDiff ? curr : prev);
            });
            filteredData.push(closestItem);
        }
    }
    else {
        // For other days, retain the original 3-hour interval forecast
        filteredData = hourlyData.list.filter((item) => {
            const itemDate = new Date(item.dt * 1000);
            return itemDate.toISOString().split('T')[0] === selectedDateString;
        });
    }
    // Render the forecast items
    filteredData.forEach((item, index) => {
        const dateTime = new Date(item.dt * 1000);
        const localTime = getLocalTime(dateTime, timezoneOffset); // Adjust for the correct timezone
        const hour = localTime.getHours();
        const minute = localTime.getMinutes();
        const temperature = item.main.temp !== undefined ? Math.round(item.main.temp - 273.15) : '--';
        const iconCode = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const humidity = item.main.humidity !== undefined ? `${item.main.humidity}` : '--';
        const windSpeed = item.wind.speed !== undefined ? `${Math.round(item.wind.speed)}` : '--';
        const cloudCoverage = item.clouds.all !== undefined ? `${item.clouds.all}` : '0%';
        // Label the first item as "Now" and ensure it shows the current time
        const timeLabel = (isToday && index === 0) ? 'Now' : `${hour}:${minute < 10 ? '0' : ''}${minute}`;
        const displayedTime = (isToday && index === 0) ? now.toLocaleTimeString() : `${hour}:${minute < 10 ? '0' : ''}${minute}`;
        const hourlyItemHTML = `
        <div class="hourlyItem" 
             data-temp="${temperature}" 
             tabindex="0"
             data-icon="${iconUrl}" 
             data-humidity="${humidity}" 
             data-wind="${windSpeed}" 
             data-cloud="${cloudCoverage}" 
             data-description="${item.weather[0].description}" 
             data-time="${displayedTime}"> <!-- Use displayedTime here -->
            <span>${timeLabel}</span>
            <img src="${iconUrl}" alt="Hourly weather Icon">
            <span>${temperature}°C</span>
        </div>`;
        hourlyForecastSection.innerHTML += hourlyItemHTML;
    });
    // Set up click events for the hourly items in the forecast section
    setUpHourlyClickEvents();
}
// Setting click events for hourly items to show weather data
function setUpHourlyClickEvents() {
    const hourlyItems = document.querySelectorAll('.hourlyItem');
    hourlyItems.forEach((hourlyElement) => {
        hourlyElement.addEventListener('click', () => {
            // Remove 'active' class from all hourly items
            hourlyItems.forEach(item => item.classList.remove('active'));
            // Add 'active' class to the clicked hourly item
            hourlyElement.classList.add('active');
            // Update the weather display based on the clicked hourly item
            const temperature = hourlyElement.getAttribute('data-temp') || '';
            const iconUrl = hourlyElement.getAttribute('data-icon') || '';
            const humidity = hourlyElement.getAttribute('data-humidity') || '';
            const windSpeed = hourlyElement.getAttribute('data-wind') || '';
            const cloudCoverage = hourlyElement.getAttribute('data-cloud') || '';
            const description = hourlyElement.getAttribute('data-description') || '';
            const time = hourlyElement.getAttribute('data-time') || '';
            const cityName = document.getElementById('cityNameDiv').textContent || '';
            // Update the main weather display
            updateMainWeatherDisplay(temperature, iconUrl, humidity, windSpeed, cloudCoverage, description, time, cityName);
        });
    });
}
// Updating air details section based on clicked hourlyItem
function updateMainWeatherDisplay(temperature, iconUrl, humidity, windSpeed, cloudCoverage, description, time, cityName) {
    const weatherData = {
        temperature,
        iconUrl,
        description,
        humidity,
        windSpeed,
        cloudCoverage,
        time,
        cityName
    };
    renderWeatherElements(weatherData);
}
// Function to update dates in the navigation menu
function updateDatesInNav() {
    const forecastDays = document.querySelectorAll('.forecastDays');
    const today = new Date();
    for (let i = 0; i < forecastDays.length; i++) {
        const date = today;
        date.setDate(today.getDate() + i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayDate = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        forecastDays[i].innerText = `${dayName} ${dayDate}`;
    }
}
// Function to set up click events for navigation items
function setUpNavClickEvents() {
    const forecastDays = document.querySelectorAll('.forecastDays');
    forecastDays.forEach((dayElement, index) => {
        dayElement.addEventListener('click', () => {
            // Remove 'active' class from all forecast days
            forecastDays.forEach(day => day.classList.remove('active'));
            // Add 'active' class to the clicked day
            dayElement.classList.add('active');
            const isToday = index === 0;
            if (isToday) {
                // Force refetch the current weather data for today to ensure it's up-to-date
                getWeather();
            }
            else if (fullForecastData) {
                const selectedDate = new Date();
                selectedDate.setDate(selectedDate.getDate() + index);
                // Display hourly forecast for the selected date
                displayHourlyForecast(fullForecastData, selectedDate, fullForecastData.city.timezone, null);
                const earliestForecast = fullForecastData.list.find((item) => {
                    const itemDate = new Date(item.dt * 1000);
                    return itemDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
                });
                if (earliestForecast) {
                    updateMainWeatherDisplay(Math.round(earliestForecast.main.temp - 273.15).toString(), `http://openweathermap.org/img/wn/${earliestForecast.weather[0].icon}@2x.png`, earliestForecast.main.humidity.toString(), Math.round(earliestForecast.wind.speed).toString(), earliestForecast.clouds.all.toString(), earliestForecast.weather[0].description, new Date(earliestForecast.dt * 1000).toLocaleTimeString(), fullForecastData.city.name);
                }
            }
        });
    });
}
function showImage() {
    const weatherIcon = document.getElementById("weatherIcon");
    weatherIcon.style.display = "inline-block";
}
// Only display weather when the searchBtn is clicked while the btn has class btn_active
let btn = document.getElementById("idBtn");
let input = document.getElementById("idInput");
btn.addEventListener("click", function () {
    this.classList.toggle("btn_active");
    input.classList.toggle("input_active");
    if (!this.classList.contains("btn_active")) {
        getWeather();
    }
    else {
        input.focus();
        input.value = '';
    }
});
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            reverseGeocode(latitude, longitude);
        }, error => {
            console.error("Error getting location:", error);
            alert("Unable to retrieve your location. Please enter your city manually.");
        });
    }
    else {
        alert("Geolocation is not supported by your browser. Please enter your city manually.");
    }
}
function reverseGeocode(latitude, longitude) {
    const apiKey = "d33f0ce7a09838a09d8022ab1acae3d1";
    const reverseGeocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
    fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(data => {
        if (data && data.length > 0) {
            const city = data[0].name;
            document.getElementById("idInput").value = city; // Update the input field with the city name
            getWeather(); // Fetch weather for the detected city
        }
        else {
            displayErrorMessage("Could not determine city from your location. Please enter your city manually.");
        }
    })
        .catch(error => {
        console.error("Error during reverse geocoding:", error);
        displayErrorMessage("Failed to get city name from your location. Please enter your city manually.");
    });
}
function toggleNavMenu() {
    const navbar = document.getElementById('navbar');
    const navMenuIcon = document.getElementById('navMenuIcon');
    const navCloseIcon = document.getElementById('navCloseIcon');
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
// Focus event listener for the hourly items
function focusHourlyItems() {
    const hourlyItems = document.querySelectorAll('.hourlyItem');
    hourlyItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'active' class from all items
            hourlyItems.forEach(item => item.classList.remove('active'));
            // Add 'active' class to the clicked item
            item.classList.add('active');
        });
    });
}
function renderWeatherElements(data) {
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
    const weatherIcon = document.getElementById("weatherIcon");
    if (weatherIcon) {
        weatherIcon.src = data.iconUrl;
        weatherIcon.alt = data.description;
    }
}
// Initialize functions on page load
function init() {
    getUserLocation();
    updateDatesInNav();
    setUpNavClickEvents();
    focusHourlyItems();
}
// Initialize everything on page load
init();

})();

/******/ })()
;
//# sourceMappingURL=script.js.map