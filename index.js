let key = 'London'

function construstURL(key) {
  return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${key}?unitGroup=us&key=S3FES2J7E7CP6FCPAVZ3S96FZ&contentType=json`
}

async function getWeatherInfo() {
  const url = construstURL(key)
  const response = await fetch(url)
  const jsonData = await response.json()
  console.log(jsonData)
  return jsonData
}

function handleSearch() {
  const data = searchBox.value.trim()
  console.log({Search: data})
  if (data) {
    key = data
    getWeatherInfo()
    searchBox.value = ''
  } else {
    console.warn('Enter a valid location')
  }
}

const searchBox = document.getElementById('search-box')
const btn = document.getElementById('btn')

searchBox.addEventListener('keypress', () => {
  if (event.key == 'Enter') {
    handleSearch()
  }
})
btn.addEventListener('click', handleSearch)

getWeatherInfo()
