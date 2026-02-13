#!/usr/bin/env node
import inquirer from 'inquirer';
import axios from 'axios';

async function getWeather(city, apiKey) {
  if (!apiKey) {
    // Return mock/demo data if no API key is set
    return {
      name: city,
      sys: { country: 'XX' },
      weather: [
        { main: 'Clear', description: 'clear sky' }
      ],
      main: {
        temp: 22,
        feels_like: 21,
        humidity: 50
      },
      wind: { speed: 3 }
    };
  }
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
  try {
    const weather = await getWeather(city, apiKey);
    if (!apiKey) {
      console.log('\n[Demo Mode] No API key set. Showing mock weather data.');
    }
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
