   var apiKey = '7d15aadc0b3b16687261731ee8d12f7a';

    function getWeather() {
        var city = document.getElementById('cityInput').value;
        
        if (city == '') {
            alert('Please enter a city name!');
            return;
        }

        document.getElementById('loading').style.display = 'block';
        document.getElementById('weatherDiv').style.display = 'none';
        document.getElementById('error').style.display = 'none';

        var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric';

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                showWeather(data);
            })
            .catch(function(error) {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error').innerHTML = 'City not found!';
                document.getElementById('error').style.display = 'block';
            });
    }

    function getMyLocation() {
        if (navigator.geolocation) {
            document.getElementById('loading').style.display = 'block';
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                
                var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';

                fetch(url)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        showWeather(data);
                    })
                    .catch(function(error) {
                        document.getElementById('loading').style.display = 'none';
                        alert('Error getting weather!');
                    });
            }, function(error) {
                document.getElementById('loading').style.display = 'none';
                alert('Could not get your location!');
            });
        } else {
            alert('Geolocation not supported!');
        }
    }

    function showWeather(data) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('weatherDiv').style.display = 'block';

        document.getElementById('cityName').innerHTML = data.name + ', ' + data.sys.country;
        
        var today = new Date();
        document.getElementById('date').innerHTML = today.toDateString();

        var temperature = Math.round(data.main.temp);
        document.getElementById('temp').innerHTML = temperature + '°C';

        document.getElementById('description').innerHTML = data.weather[0].description;

        document.getElementById('feels').innerHTML = Math.round(data.main.feels_like) + '&degC';
        document.getElementById('humidity').innerHTML = data.main.humidity + '%';
        document.getElementById('wind').innerHTML = data.wind.speed + ' m/s';
        document.getElementById('pressure').innerHTML = data.main.pressure + ' hPa';
    }

    // Enter key support
    document.getElementById('cityInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            getWeather();
        }
    });