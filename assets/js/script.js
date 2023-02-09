// Fetch Request
let weatherKey = "9fcd097a93f060e0de25cf3f15c75b25"
let todayEl = document.querySelector('#today')
let fiveDayEl = document.querySelectorAll('#day')



$(document).ready(function () {
    loadBtns()
    loadDates()
})
//todo: search button click event, run get coords for input value, then populate main elements with forecast data
//todo: sidebar button click event, populate main elements with forecast data for clicked button's city







// **on search**
// user searches for a city by name
// store a localstorage object with the city's name, longitude, and latitude
// create a button in the sidebar that is tied to the localstorage object
// search for weather information by coordinates
// populate main elements with weather information


//add an event listener for click of search button
function getCoords(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${weatherKey}`)
        .then(Response => Response.json())
        .then(function (data) {
            let searchResult = {
                cityName: data[0].name,
                lat: data[0].lat,
                lon: data[0].lon
            }
            console.log(searchResult)
            let searchHistory = JSON.parse(localStorage.getItem("cityHistory"))
            if (searchHistory == null) searchHistory = [];
            searchHistory.push(searchResult);
            localStorage.setItem("cityHistory", JSON.stringify(searchHistory));
            generateBtn(city)
            getWeather(searchResult.lat, searchResult.lon)
        });
}

function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherKey}`)
        .then(Response => Response.json())
        .then(function (data) {
            console.log(data)
            let weatherToday = {
                todayTemp: data.list[0].main.temp,
                todayWind: data.list[0].wind.speed,
                todayHumid: data.list[0].main.humidity,
                todayIcon: data.list[0].weather[0].icon
            }
            console.log(weatherToday.todayIcon)
            let weatherForecast = [
                {
                    temp: data.list[7].main.temp,
                    wind: data.list[7].wind.speed,
                    humid: data.list[7].main.humidity,
                    icon: data.list[7].weather[0].icon
                },
                {
                    temp: data.list[15].main.temp,
                    wind: data.list[15].wind.speed,
                    humid: data.list[15].main.humidity,
                    icon: data.list[15].weather[0].icon
                },
                {
                    temp: data.list[23].main.temp,
                    wind: data.list[23].wind.speed,
                    humid: data.list[23].main.humidity,
                    icon: data.list[23].weather[0].icon
                },
                {
                    temp: data.list[31].main.temp,
                    wind: data.list[31].wind.speed,
                    humid: data.list[31].main.humidity,
                    icon: data.list[31].weather[0].icon
                },
                {
                    temp: data.list[39].main.temp,
                    wind: data.list[39].wind.speed,
                    humid: data.list[39].main.humidity,
                    icon: data.list[39].weather[0].icon
                }
            ]
            todayEl.children[1].setAttribute("src", `http://openweathermap.org/img/wn/${weatherToday.todayIcon}@2x.png`)
            todayEl.children[2].innerText = `Temp: ${weatherToday.todayTemp} F`
            todayEl.children[3].innerText = `Wind: ${weatherToday.todayWind} mph`
            todayEl.children[4].innerText = `Humidity: ${weatherToday.todayHumid}%`

            for (let i = 0; i < fiveDayEl.length; i++) {
                fiveDayEl[i].children[1].setAttribute("src", `http://openweathermap.org/img/wn/${weatherForecast[i].icon}@2x.png`)
                fiveDayEl[i].children[2].innerText = `Temp: ${weatherForecast[i].temp} F`
                fiveDayEl[i].children[3].innerText = `Wind: ${weatherForecast[i].wind} mph`
                fiveDayEl[i].children[4].innerText = `Humidity: ${weatherForecast[i].humid}%`
            }

        })
}

getWeather(40.88, -111.88)



// **on click sidebar button**
// clear main elements
// use linked ls object to search for weather by coords
// populate main elements with clicked city's weather info



function generateBtn(i) {
    var sidebarEl = document.querySelector('#sidebar')
    var btn = document.createElement("button")
    btn.innerText = i
    btn.setAttribute('type', 'button')
    btn.setAttribute('id', 'sidebarBtn')
    sidebarEl.append(btn)
}

function loadBtns() {
    let searchHistory = JSON.parse(localStorage.getItem("cityHistory"))
    if (searchHistory == null) return;
    for (let index = 0; index < searchHistory.length; index++) {
        generateBtn(searchHistory[index].cityName)
    }
}

function loadDates() {
    let today = dayjs().format('MM/DD/YYYY')
    let todayH = document.createElement('h5')
    todayH.innerText = today
    todayEl.prepend(todayH)
    for (let i = 0; i < fiveDayEl.length; i++) {
        let forecastDay = document.createElement('h5')
        futureDate = dayjs().add(i + 1, 'day').format('MM/DD/YYYY')
        forecastDay.innerText = futureDate
        fiveDayEl[i].prepend(forecastDay)
    }
}


