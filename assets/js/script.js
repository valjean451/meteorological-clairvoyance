let weatherKey = "9fcd097a93f060e0de25cf3f15c75b25"
let todayEl = document.querySelector('#today')
let fiveDayEl = document.querySelectorAll('#day')
let searchEl = document.getElementById('first_name')

// Populate current and future dates on load, as well as the search history.
$(document).ready(function () {
    loadBtns()
    loadDates()
})

// Search event
$('#newsearchbtn').on('click', function(){
    getCoords(searchEl.value)
})

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

// Weather data call
function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherKey}`)
        .then(Response => Response.json())
        .then(function (data) {
            console.log(data)
            let weatherToday = {
                todayName: data.city.name,
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
            todayEl.children[1].innerText = `Weather for ${weatherToday.todayName}`
            todayEl.children[2].setAttribute("src", `http://openweathermap.org/img/wn/${weatherToday.todayIcon}@2x.png`)
            todayEl.children[3].innerText = `Temp: ${weatherToday.todayTemp} F`
            todayEl.children[4].innerText = `Wind: ${weatherToday.todayWind} mph`
            todayEl.children[5].innerText = `Humidity: ${weatherToday.todayHumid}%`

            for (let i = 0; i < fiveDayEl.length; i++) {
                fiveDayEl[i].children[1].setAttribute("src", `http://openweathermap.org/img/wn/${weatherForecast[i].icon}@2x.png`)
                fiveDayEl[i].children[2].innerText = `Temp: ${weatherForecast[i].temp} F`
                fiveDayEl[i].children[3].innerText = `Wind: ${weatherForecast[i].wind} mph`
                fiveDayEl[i].children[4].innerText = `Humidity: ${weatherForecast[i].humid}%`
}})}

// Generate sidebar buttons
function generateBtn(i) {
    var sidebarEl = document.querySelector('#sidebar')
    var btn = document.createElement("button")
    btn.innerText = i
    btn.setAttribute('type', 'button')
    btn.setAttribute('class', 'sidebarbtn')
    btn.setAttribute('id', i)
    $(btn).on("click", function () {
        let searchHistory = JSON.parse(localStorage.getItem("cityHistory"))
        console.log(searchHistory)
        let histLon = 0
        let histLat = 0
        for (let i = 0; i < searchHistory.length; i++) {
            if (searchHistory[i].cityName == $(btn).attr('id')){
                histLon = searchHistory[i].lon
                histLat = searchHistory[i].lat
            }}
            console.log(histLat, histLon)
            console.log($(this).attr('id'))
            getWeather(histLat, histLon)
    })
    sidebarEl.append(btn)
}

function loadBtns() {
    let searchHistory = JSON.parse(localStorage.getItem("cityHistory"))
    if (searchHistory == null) return;
    for (let index = 0; index < searchHistory.length; index++) {
        generateBtn(searchHistory[index].cityName)
    }
}

// Generate dates
function loadDates() {
    let today = dayjs().format('dddd, MMMM DD')
    let todayH = document.createElement('h2')
    todayH.innerText = today
    todayEl.prepend(todayH)
    for (let i = 0; i < fiveDayEl.length; i++) {
        let forecastDay = document.createElement('h5')
        futureDate = dayjs().add(i + 1, 'day').format('MM/DD/YYYY')
        forecastDay.innerText = futureDate
        fiveDayEl[i].prepend(forecastDay)
    }
}

// Ways to improve:
// 1a. Rework the API calls to align to the right dates and times. The 5 day call actually begins 8 hours in the future, I learned, and so to populate the 'today' data, I should have been using a third call.
// 1b. Rework searches to better find the city you are looking for, either by validating inputs, or returning more responses and cross-checking, or asking for more data.
// 2. Use a constructor function to build the search object, and then append the created object to the LS entry.
// 3. Optimize the search event for forms, rather than being on element click.
