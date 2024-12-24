let key = 'London'

function construstURL(key) {
  return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${key}?unitGroup=us&key=S3FES2J7E7CP6FCPAVZ3S96FZ&contentType=json`
}

async function getWeatherInfo() {
  const url = construstURL(key)
  try {
    const response = await fetch(url)
    const jsonData = await response.json()
    console.log(jsonData)
    return jsonData
  } catch (error) {
    console.error({'Error Message': error})
    return null
  }
}

async function storeWeatherData() {
  const weatherData = await getWeatherInfo()
  if (weatherData) {
    const description = weatherData?.description
    console.log('Description:', description)

    const city = weatherData?.resolvedAddress
    console.log('City Location:', city)

    const temperature = weatherData?.currentConditions?.temp
    console.log('Temperature:', temperature)
    
    const conditions = weatherData?.currentConditions?.conditions
    console.log('Conditions:', conditions)
  }
}

async function handleSearch() {
  const data = searchBox.value.trim()
  console.log({Search: data})
  if (data) {
    key = data
    await storeWeatherData()
  } else {
    console.warn('Enter a valid location')
  }
  searchBox.value = ''
}

const searchBox = document.getElementById('search-box')
const btn = document.getElementById('btn')

searchBox.addEventListener('keypress', (event) => {
  if (event.key == 'Enter') {
    handleSearch()
  }
})
btn.addEventListener('click', handleSearch)

// getWeatherInfo()
storeWeatherData()
