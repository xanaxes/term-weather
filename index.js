#!/usr/bin/env node
import inquirer from 'inquirer';
import axios from 'axios';
import chalk from 'chalk';
// Map weather main to emoji/icon
const weatherIcons = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Smoke: '💨',
  Haze: '🌫️',
  Dust: '🌪️',
  Fog: '🌫️',
  Sand: '🏜️',
  Ash: '🌋',
  Squall: '🌬️',
  Tornado: '🌪️',
};

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
      console.log(chalk.yellow('\n[Demo Mode] No API key set. Showing mock weather data.'));
    }
    const icon = weatherIcons[weather.weather[0].main] || '';
    console.log(chalk.bold(`\nWeather for ${weather.name}, ${weather.sys.country}:`));
    console.log(`  ${icon}  ${chalk.cyan(weather.weather[0].main)} - ${chalk.gray(weather.weather[0].description)}`);
    console.log(`  🌡️  Temperature: ${chalk.red(weather.main.temp + '°C')} (feels like ${chalk.red(weather.main.feels_like + '°C')})`);
    console.log(`  💧 Humidity: ${chalk.blue(weather.main.humidity + '%')}`);
    console.log(`  💨 Wind: ${chalk.green(weather.wind.speed + ' m/s')}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
