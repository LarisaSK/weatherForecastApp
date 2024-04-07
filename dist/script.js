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
// Function to toggle the navigation menu
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

function getWeather() {
    const apiKey = "d33f0ce7a09838a09d8022ab1acae3d1";
    const city = document.getElementById("idInput").value;
    const errorMessageDiv = document.getElementById("error-message");
    const inputField = document.getElementById("idInput");
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
    })
        .catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    });
}

})();

/******/ })()
;
//# sourceMappingURL=script.js.map