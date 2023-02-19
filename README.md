# Week 8 Challenge: :Weather Dashboard

Using Server-Side APIs (OpenWeather API)

## Description

Build a front-end weather dashboard that displays the current weather and a 5-day forecast for user prompted locations. The service should use the [5 Day Weather Forecast](https://openweathermap.org/forecast5) to retrieve weather data for cities abd the app should run in the browser and feature dynamically updated HTML and CSS.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

- Create a weather dashboard with form inputs
  - When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
  - When a user views the current weather conditions for that city they are presented with:
    - The city name
    - The date
    - An icon representation of weather conditions
    - The temperature
    - The humidity
    - The wind speed
  - When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
    - The date
    - An icon representation of weather conditions
    - The temperature
    - The humidity
  - When a user click on a city in the search history they are again presented with current and future conditions for that city

## Usage

On loading, the page will display a default forecast for London. Input your desired location into the search bar and select from the dropdown options. The current weather + a 5 day forecast for the selected location will then be displayed on the screen. The selection will also automatically save the search, and a button will appear in the section below the search bar. These buttons will redisplay the weather forecast for their respective locations.

## Mock-Up

The following is a demo of the application functionality:

![Animation going through each step. Input a location into the search bar. Select the appropriate option from the resultant dropdown menu. Above steps are repeated for 2 more locations. Select the 2nd button to display weather for that location. End.](./assets/images/demo-gif.gif)

### Deployment Link

The following link takes you to the GitHub Pages deployment:

- https://mohseenhamid.github.io/tsbc-challenge-8-mh-weather-dashboard/
