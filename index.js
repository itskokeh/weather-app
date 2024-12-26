'use strict'

function showLoading() {
  document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function constructURL(location) {
  return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=S3FES2J7E7CP6FCPAVZ3S96FZ&contentType=json`
}

async function getWeatherInfo(location) {
  const url = constructURL(location)
  try {
    const response = await fetch(url)
    if (!response.ok) {
      if (response.status === 404) {
          showNotification('Location not found. Please check the city name.', 'warning');
      } else {
          showNotification(`Error: ${response.status} - ${response.statusText}`, 'error');
      }
      return null;
    }
    const jsonData = await response.json()
    // console.log(jsonData)
    return jsonData
  } catch (error) {
    showNotification('Network error. Please check your connection.', 'error');
    return null
  }
}

async function storeWeatherData(location) {
  const elements = {
    city: document.querySelector('#locationCity'),
    country: document.querySelector('#locationCountry'),
    temperature: document.querySelector('.temperature'),
    humidity: document.querySelector('.humidity-value'),
    UVIndex: document.querySelector('.UVindex-value'),
    windSpeed: document.querySelector('.windSpeed-value'),
    feelLike: document.querySelector('.feellike-value'),
    weatherIcon: document.querySelector('.weather-icon'),
    description: document.querySelector('.weather-description')
  
  }
  const weatherData = await getWeatherInfo(location)
  if (weatherData) {
    elements.humidity.textContent = `${weatherData?.currentConditions?.humidity}%` || '- -'
    elements.UVIndex.textContent = weatherData?.currentConditions?.uvindex || '- -'
    elements.windSpeed.textContent = `${weatherData?.currentConditions?.windspeed}kph` || '- -'
    elements.feelLike.textContent = `${weatherData?.currentConditions?.feelslike}°C` || '- -'

    const addressParts = weatherData?.resolvedAddress?.split(',').map(part => part.trim()) || [];
    const cityName = addressParts[0] || '- -';
    const countryName = addressParts[1] || '- -';
    elements.city.textContent = cityName;
    elements.country.textContent = countryName;
    
    elements.temperature.textContent = `${weatherData?.currentConditions?.temp}°C` || '- -'
    elements.description.textContent = weatherData?.currentConditions?.conditions || '- -'
    const icon = weatherData?.currentConditions?.icon
    elements.weatherIcon.textContent = getWeatherEmoji(icon)

    updateDate(weatherData?.timezone)
  }
}

async function handleSearch() {
  const userInput = searchBox.value.trim()
  if (!userInput) {
    showNotification('Please enter a location', 'warning');
    return;
  }
  if (userInput) {
    showLoading()
    try {
      const formattedInput = formatCityName(userInput)
      await storeWeatherData(userInput)
    } catch (error) {
      showNotification('Failed to fetch weather data. Please try again.', 'error')
    } finally {
      hideLoading()
    }
  } else {
    console.warn('Enter a valid location')
  }
  searchBox.value = ''
}

const searchBox = document.getElementById('search-box')
const btn = document.getElementById('btn')

searchBox.addEventListener('keypress', (event) => {
  if (event.key == 'Enter') {
    event.preventDefault()
    handleSearch()
  }
})
btn.addEventListener('click', handleSearch)
document.querySelector('.notification-close').addEventListener('click', hideNotification);


function formatCityName(cityName) {
  return cityName
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

function getWeatherEmoji(iconName) {
  const iconMap = {
      'clear-day': '☀️',
      'clear-night': '🌙',
      'partly-cloudy-day': '⛅',
      'partly-cloudy-night': '☁️',
      'cloudy': '☁️',
      'rain': '🌧️',
      'snow': '🌨️',
      'sleet': '🌨️',
      'wind': '💨',
      'fog': '🌫️',
      'thunder': '⛈️',
      'thunder-rain': '⛈️',
      'thunder-showers-day': '⛈️',
      'thunder-showers-night': '⛈️',
      'showers-day': '🌦️',
      'showers-night': '🌧️'
  }
  
  return iconMap[iconName] || '❓'
}

function updateDate(timezone = 'Europe/London') {
  const dateElement = document.getElementById('current-date');
  const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
  };
  const currentDate = new Date().toLocaleDateString('en-US', options);
  dateElement.textContent = currentDate;
}

function showNotification(message, type = 'error') {
  const notification = document.getElementById('notification');
  const messageEl = notification.querySelector('.notification-message');
  
  messageEl.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'flex';

  // Auto-hide after 5 seconds
  setTimeout(() => {
      hideNotification();
  }, 5000);
}

function hideNotification() {
  const notification = document.getElementById('notification');
  notification.style.animation = 'slideOut 0.3s ease';
  setTimeout(() => {
      notification.style.display = 'none';
      notification.style.animation = '';
  }, 300);
}


showLoading()
storeWeatherData('London').finally(hideLoading)
