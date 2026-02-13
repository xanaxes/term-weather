#!/usr/bin/env node
import inquirer from 'inquirer';
import axios from 'axios';

async function getWeather(city, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('City not found.');
    }
    throw new Error('Failed to fetch weather data.');
  }
}

async function main() {
  const { city } = await inquirer.prompt({
    type: 'input',
    name: 'city',
    message: 'Enter a city name:',
  });

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error('Error: Please set your OPENWEATHER_API_KEY in a .env file.');
    process.exit(1);
  }

  try {
    const weather = await getWeather(city, apiKey);
    console.log(`\nWeather for ${weather.name}, ${weather.sys.country}:`);
    console.log(`  ${weather.weather[0].main} - ${weather.weather[0].description}`);
    console.log(`  Temperature: ${weather.main.temp}°C (feels like ${weather.main.feels_like}°C)`);
    console.log(`  Humidity: ${weather.main.humidity}%`);
    console.log(`  Wind: ${weather.wind.speed} m/s`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
