/* 
--- API Calls ---
- API Key: 6d0b8f00a5e89b3778bf56d92924ed24 

- API UNITS
	- Temperature (main.temp)
		- Default: Kelvin
		- Metric: Celsius
		- Imperial: Fahrenheit
	- Wind (wind.speed)
		- Default: meter/sec
		- Metric: meter/sec
		- Imperial: miles/hour
	- Humidity (main.humidity) -> %

- FORECAST API BY COORD
	- `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6d0b8f00a5e89b3778bf56d92924ed24`

- DIRECT GEOCODING
	- Gets the geographical coordinates (lat, lon) by using name of the location (city/area name)
	- The limit parameter in the API call caps how many locations with the same name will be seen in the API response (for instance, London in the UK and London in the US)
	- Guidance: https://openweathermap.org/api/geocoding-api#direct 
	- Template for direct geocoding API call:
		- url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=6d0b8f00a5e89b3778bf56d92924ed24`
		- url: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=6d0b8f00a5e89b3778bf56d92924ed24`,

- 5-Day Forecast Notes
	- Current time is element 0 of the response list array
	- There are 3 hr gaps between readings => every 8th interval = 24hrs => for loop to add 8 to list item 

*/

// --- MY CODE ---
// Global HTML elements
// Header Div
const dateEl = $("#curr-date");
const timeEl = $("#curr-time");

// Column 1 -> Search
const searchDiv = $(".search-div");
const locSearchBar = $("#location-search");
const searchMenu = $("#search-menu");
const historyDiv = $("#history");

// Column 2 -> Results
const todaySection = $("#today");
const todayTitleContainer = $("#today-title-container");
const todayDetailsContainer = $("#today-details");
const forecastSection = $("#forecast");
const forecastItemsRow = $("#forecast-items-row");

// --- Generic Page Functions
// Display and update date and time in header
setInterval(() => {
	dateEl.text(`Date: ${moment().format("ddd DD/MM/YY")}`);
	timeEl.text(`Time: ${moment().format("HH:mm:ss")}`);
}, 1000);

// Default display of London's weather
function defaultWeatherDisplay() {
	$.ajax({
		method: "GET",
		url: `https://api.openweathermap.org/geo/1.0/direct?q=london&limit=1&appid=6d0b8f00a5e89b3778bf56d92924ed24`,
		success: function (result) {
			// Extract data from API response
			let lat = result[0].lat;
			let lon = result[0].lon;
			let locName = result[0].name;
			let countryName = result[0].country;
			let stateName = result[0].state;

			// Feed result into getWeather API (units = metric)
			// Temp = Celsius, Wind = m/s (convert to MPH), Humidity = %
			let queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6d0b8f00a5e89b3778bf56d92924ed24&units=metric`;

			$.ajax({
				method: "GET",
				url: queryURL,
				success: function (result) {
					// --- Current Forecast Data ---
					let currDataObj = result.list[0];
					currDataObj.locName = locName;
					currDataObj.countryName = countryName;
					currDataObj.stateName = stateName;
					displayCurrWeather(currDataObj);

					// --- Five Day Forecast Data ---
					// Array to store weather data objects for 15:00:00 of each day (found in response list array)
					let fiveDayDataArray = [];

					// Extracting the response weather data (list elements) for 15:00:00 of each day
					result.list.forEach((listObjEl) => {
						let timeSlot = listObjEl.dt_txt.match("15:00:00");

						if (timeSlot) {
							fiveDayDataArray.push(listObjEl);
						}
					});
					displayFiveDayWeather(fiveDayDataArray);
				}
			});
		}
	});
}
defaultWeatherDisplay();

// --- Page Interaction Functions ---
function displayFiveDayWeather(fiveDayArray) {
	forecastItemsRow.empty();

	fiveDayArray.forEach((dayDataObj) => {
		// Create forecast day div
		const forecastDayContainer = $("<div>");
		forecastDayContainer.addClass("forecast-day-container");
		// Append forecast day div to HTML forecast row
		forecastItemsRow.append(forecastDayContainer);

		// Forecast day container title div
		const forecastDayContainerTitleDiv = $("<div>");
		forecastDayContainerTitleDiv.addClass("forecast-day-container-title-div");
		// Container Title Date
		const forecastDayDate = $("<h3>");
		forecastDayDate.addClass("forecast-day-date");
		forecastDayDate.text(dayDataObj.dt_txt.substr(0, 10));
		forecastDayContainerTitleDiv.append(forecastDayDate);
		// Container Title Weather icon div + img
		// Create container for icon
		const forecastDayIcon = $("<figure>");
		forecastDayIcon.addClass("forecast-day-weather-icon-container");
		// Create img tag for icon
		const forecastDayWeatherIconImg = $("<img>");
		forecastDayWeatherIconImg.addClass("weather-icon-img");
		forecastDayWeatherIconImg.attr(
			"src",
			`http://openweathermap.org/img/w/${dayDataObj.weather[0].icon}.png`
		);
		// Append weather icon img to the weather icon element
		forecastDayIcon.append(forecastDayWeatherIconImg);
		forecastDayContainerTitleDiv.append(forecastDayIcon);

		// Append title container to forecast row container
		forecastDayContainer.append(forecastDayContainerTitleDiv);

		// --- Forecast Day Weather Details Div ---
		const forecastDayContainerDetailsDiv = $("<div>");
		forecastDayContainerDetailsDiv.addClass(
			"forecast-day-container-details-div"
		);
		forecastDayContainer.append(forecastDayContainerDetailsDiv);

		// Temp (Celsius)
		const forecastDayDetailsTemp = $("<p>");
		forecastDayDetailsTemp.addClass("forecast-day-details-item");
		forecastDayDetailsTemp.text(`Temp: ${dayDataObj.main.temp}°C`);
		forecastDayContainerDetailsDiv.append(forecastDayDetailsTemp);

		// Wind (m/s => convert to MPH) wind.speed
		let windSpeedConv = (dayDataObj.wind.speed * 2.23694).toFixed(2).toString();
		const forecastDayDetailsWind = $("<p>");
		forecastDayDetailsWind.addClass("forecast-day-details-item");
		forecastDayDetailsWind.text(`Wind: ${windSpeedConv}mph`);
		forecastDayContainerDetailsDiv.append(forecastDayDetailsWind);

		// Humidity (%) main.humidity
		const forecastDayDetailsHumidity = $("<p>");
		forecastDayDetailsHumidity.addClass("forecast-day-details-item");
		forecastDayDetailsHumidity.text(`Humidity: ${dayDataObj.main.humidity}%`);
		forecastDayContainerDetailsDiv.append(forecastDayDetailsHumidity);
	});
}

function displayCurrWeather(currDataObj) {
	// Empty section to repopulate
	todayTitleContainer.empty();
	todayDetailsContainer.empty();

	// --- Weather Title Container ---
	// Weather Location
	const todayTitleLoc = $("<span>");
	todayTitleLoc.attr("id", "today-loc");
	todayTitleLoc.text(
		`${currDataObj.locName}, ${currDataObj.stateName}, ${currDataObj.countryName}`
	);
	todayTitleContainer.append(todayTitleLoc);

	// Weather Date
	const todayTitleDate = $("<span>");
	todayTitleDate.attr("id", "today-date");
	todayTitleDate.text(`(${currDataObj.dt_txt.substr(0, 10)})`);
	todayTitleContainer.append(todayTitleDate);

	// Weather icon
	// Create container for icon
	const todayTitleIcon = $("<span>");
	todayTitleIcon.attr("id", "today-weather-icon-container");
	// Create img tag for icon
	const todayWeatherIconImg = $("<img>");
	todayWeatherIconImg.addClass("weather-icon-img");
	todayWeatherIconImg.attr(
		"src",
		`http://openweathermap.org/img/w/${currDataObj.weather[0].icon}.png`
	);
	// Append weather icon img to the weather icon element
	todayTitleIcon.append(todayWeatherIconImg);
	todayTitleContainer.append(todayTitleIcon);

	// --- Weather Details Div ---
	// Temp (Celsius)
	const todayDetailsTemp = $("<p>");
	todayDetailsTemp.attr("id", "today-temp");
	todayDetailsTemp.addClass("today-details-item");
	todayDetailsTemp.text(`Temp: ${currDataObj.main.temp}°C`);
	todayDetailsContainer.append(todayDetailsTemp);

	// Wind (m/s => convert to MPH) wind.speed
	let windSpeedConv = (currDataObj.wind.speed * 2.23694).toFixed(2).toString();
	const todayDetailsWind = $("<p>");
	todayDetailsWind.attr("id", "today-wind");
	todayDetailsWind.addClass("today-details-item");
	todayDetailsWind.text(`Wind: ${windSpeedConv}mph`);
	todayDetailsContainer.append(todayDetailsWind);

	// Humidity (%) main.humidity
	const todayDetailsHumidity = $("<p>");
	todayDetailsHumidity.attr("id", "today-humidity");
	todayDetailsHumidity.addClass("today-details-item");
	todayDetailsHumidity.text(`Humidity: ${currDataObj.main.humidity}%`);
	todayDetailsContainer.append(todayDetailsHumidity);
}

// Callback ftn for searchMenuItem click
function getWeather(params) {
	// Clean up search div
	searchMenu.empty();
	locSearchBar.val("");
	searchMenu.css("display", "none");

	// Extract location geocode API details
	let locObject = JSON.parse(params.attr("data-loc-object"));
	// console.log(locObject);

	// Get weather data via lon & lat API call
	let lat = locObject.lat;
	let lon = locObject.lon;
	// Units = metric => Temp = Celsius, Wind = m/s (convert to MPH), Humidity = %
	let queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=6d0b8f00a5e89b3778bf56d92924ed24&units=metric`;

	$.ajax({
		method: "GET",
		url: queryURL,
		success: function (result) {
			// --- Current Forecast Data ---
			let currDataObj = result.list[0];
			currDataObj.locName = locObject.locName;
			currDataObj.countryName = locObject.countryName;
			currDataObj.stateName = locObject.stateName;
			// Feed Object into displayCurrWeather
			displayCurrWeather(currDataObj);

			// --- Five Day Forecast Data ---
			// Array to store weather data objects for 15:00:00 of each day (found in response list array)
			let fiveDayDataArray = [];

			// Extracting the response weather data (list elements) for 15:00:00 of each day
			result.list.forEach((listObjEl) => {
				let timeSlot = listObjEl.dt_txt.match("15:00:00");

				if (timeSlot) {
					listObjEl.locName = locObject.locName;
					listObjEl.countryName = locObject.countryName;
					listObjEl.stateName = locObject.stateName;
					fiveDayDataArray.push(listObjEl);
				}
			});
			displayFiveDayWeather(fiveDayDataArray);
		}
		// API error handler
		// error: function () {
		// }
	});
}

// Ftn to render localStorage savedSearches
function renderSavedSearches() {
	historyDiv.empty();

	let savedLocationsArray = [];

	if (localStorage.getItem("savedLocations") !== null) {
		savedLocationsArray = JSON.parse(localStorage.getItem("savedLocations"));
	}

	savedLocationsArray.forEach(function (locObject) {
		// let locLat = locObject.lat;
		// let locLon = locObject.lon;
		let locName = locObject.locName;
		let countryName = locObject.countryName;
		let stateName = locObject.stateName;

		// Populate historyDiv
		// Create a button
		let historyItem = $("<button>");
		historyItem.text(`${locName}, ${stateName}, ${countryName}`);
		historyItem.addClass("btn-danger saved-search");

		// Add locObject as a data attribute as a string
		historyItem.attr("data-loc-object", JSON.stringify(locObject));

		// Append item to the searchMenu
		historyDiv.append(historyItem);

		// Add click event listener to history item
		historyItem.on("click", function () {
			getWeather(historyItem);
		});
	});
}

// Callback ftn for searchMenuItem click to populate saved searches column
function saveSearch(params) {
	let locObject = JSON.parse(params.attr("data-loc-object"));

	let locLat = locObject.lat;
	let locLon = locObject.lon;
	let locName = locObject.locName;
	let countryName = locObject.countryName;
	let stateName = locObject.stateName;

	// // Populate historyDiv
	// // Create a button
	// let historyItem = $("<button>");
	// historyItem.text(`${locName}, ${stateName}, ${countryName}`);
	// historyItem.addClass("btn-danger saved-search");

	// // Add locObject as a data attribute as a string
	// historyItem.attr("data-loc-object", JSON.stringify(locObject));

	// // Append item to the searchMenu
	// historyDiv.append(historyItem);

	// // Add click event listener to history item
	// historyItem.on("click", function () {
	// 	getWeather(historyItem);
	// });

	// localStorage
	// Checking if localStorage is populated and retrieve data if so
	let savedLocationsArray = [];

	if (localStorage.getItem("savedLocations") !== null) {
		savedLocationsArray = JSON.parse(localStorage.getItem("savedLocations"));
	}

	// Push actor object to savedLocationsArray only if it doesn't exist
	let searchTest = savedLocationsArray.find(
		(loc) => loc.lat == locLat && loc.lon == locLon
	);

	if (!searchTest) {
		savedLocationsArray.push(locObject);

		// Store updated savedLocationsArray as string
		localStorage.setItem("savedLocations", JSON.stringify(savedLocationsArray));
	} else {
		return;
	}

	renderSavedSearches();
}

// Ftn to populate the search menu using data retrieved from geocode API
// Called in the searchLocationInput ftn
function createSearchMenuItem(locObject) {
	const locName = locObject.locName;
	const countryName = locObject.countryName;
	const stateName = locObject.stateName;

	// Populate searchMenu
	// Create a dropdown item
	let searchMenuItem = $("<a>");
	searchMenuItem.text(`${locName}, ${stateName}, ${countryName}`);
	searchMenuItem.addClass("dropdown-item search-menu-item");

	// Add locObject as a data attribute as a string
	searchMenuItem.attr("data-loc-object", JSON.stringify(locObject));

	// Append item to the searchMenu
	searchMenu.append(searchMenuItem);

	// Add click event listener to dropdown item via delegation
	searchMenuItem.on("click", function () {
		getWeather(searchMenuItem);
		saveSearch(searchMenuItem);
	});
}

// Ftn called in the search bar callback to run a direct geocoding API call
function searchLocationInput(location) {
	$.ajax({
		method: "GET",
		url: `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=30&appid=6d0b8f00a5e89b3778bf56d92924ed24`,
		success: function (result) {
			// console.log(result);

			// Empty the searchMenu on each keystroke before repopulating
			searchMenu.empty();

			// Extract data from each API result array element
			result.forEach((loc) => {
				let lat = loc.lat;
				let lon = loc.lon;
				let locName = loc.name;
				let countryName = loc.country;
				let stateName = loc.state;

				// Assign variables to object
				let locObject = {
					locName: locName,
					countryName: countryName,
					stateName: stateName,
					lat: lat,
					lon: lon
				};

				// Feed object into populateSearchMenu ftn
				createSearchMenuItem(locObject);
			});
		}
		// API error handler
		// error: function () {
		// }
	});
}

// Callback ftn for search bar typing input
function returnSearchResults(event) {
	if (event.keyCode !== 27 && event.keyCode !== 8) {
		searchDiv.css("cursor", "progress");
		locSearchBar.css("cursor", "progress");
	} else {
		searchDiv.css("cursor", "pointer");
		locSearchBar.css("cursor", "auto");
	}

	// Grabs the input field text and stores in variable
	const locInputString = locSearchBar.val().trim();

	// Sets dropdown display default as "none" to avoid displaying an empty dropdown display while API is running
	searchMenu.css("display", "none");

	// Prevents response results for <2 characters as <2 gives too many results
	if (locInputString.length > 2 && event.keyCode !== 27) {
		// If >2 characters are typed, the geoCode API "searchLocationInput" ftn is called to populate the search menu
		searchLocationInput(locInputString);

		// Only displays the search menu once API returns data
		setTimeout(() => {
			if (searchMenu.children().length == 0) {
				searchMenu.css("display", "none");
			} else {
				searchMenu.css("display", "block");
				searchDiv.css("cursor", "pointer");
				locSearchBar.css("cursor", "auto");
			}
		}, 1500);
	} else if (locInputString.length < 3) {
		searchMenu.empty();
	}
	// Enables the escape key to clear the input field
	else if (event.keyCode == 27) {
		$(this).val("");
		searchMenu.empty();
	}
}

// Document Ready Event Handlers
$(function () {
	// Keyup event listener for movie search input field
	locSearchBar.on("keyup", returnSearchResults);

	// Render historyDiv with saved searches
	renderSavedSearches();
});

/*
--- STEPS ---
- Complete getWeather function
	- Add elements to the weather display div
- Add localStorage to the saveSearch ftn
- Create a renderSearches ftn to load historyDiv with stored search data
 */
