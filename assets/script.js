var APIKEY = "c97bc02fb2a9573f74010db138c97564";



function getLocation(city) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + APIKEY)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data);
            getCurrentWeather(data[0].lat, data[0].lon);
        });
}

function getCurrentWeather(lat, long) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + APIKEY)
        .then(function(response){
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function(data){
            console.log(data);
            
            if (data.name) {
                const currentWeatherElement = document.getElementById('currentWeather');
                currentWeatherElement.innerHTML = `
                    <h2>Current Weather in ${data.name}</h2>
                    <p>Temperature: ${data.main.temp} °F</p>
                    <p>Weather: ${data.weather[0].description}</p>
                `;
                
                fetchDailyForecast(lat, long);
            } else {
                console.error("Unexpected data format:", data);
            }
        })
        .catch(function(error){
            console.error("Fetch error:", error);
        });
}

function fetchDailyForecast(lat, long) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + APIKEY)
        .then(function(response){
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function(data){
            console.log(data);
            
            const forecastElement = document.getElementById('forecast');
            forecastElement.innerHTML = `
                <h2>5 Day Forecast</h2>
            `;
            if (data.daily && data.daily.length >= 5) {
            
            for (let i = 0; i < 5; i++) {
                forecastElement.innerHTML += `
                    <div class="card">
                        <h3>${moment.unix(data.daily[i].dt).format('MM/DD/YYYY')}</h3>
                        <p>Temperature: ${data.daily[i].temp.day} °F</p>
                        <p>Weather: ${data.daily[i].weather[0].description}</p>
                    </div>
                `;
            }
            }
        })
        .catch(function(error){
            console.error("Fetch error:", error);
        });
}

getLocation("Hartford");
    