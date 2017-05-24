// 
function switchBg(weatherIcon) {
    var icon = " ",
        bgStyle = " ";
    console.log(weatherIcon);
    switch (weatherIcon) {
        case "01d":
            //clear sky
            bgStyle = " bg_container1";
            icon = " wi-day-sunny";
            break;

        case "02d":
            //                        few clouds
            bgStyle = " bg_container2";
            icon = " wi-day-sunny-overcast";

            break;

        case "03d":
            //                        	scattered clouds
            bgStyle = " bg_container3";
            icon = " wi-day-cloudy";

            break;

        case "04d":
            //                        broken clouds
            bgStyle = " bg_container4";
            icon = " wi-cloudy";

            break;

        case "09d":
            //                        	shower rain
            bgStyle = " bg_container5";
            icon = " wi-day-showers";

            break;

        case "10d":
            //                        rain
            bgStyle = " bg_container6";
            icon = " wi-showers";

            break;

        case "11d":
            //                        thunderstorm
            bgStyle = " bg_container7";
            icon = " wi-thunderstorm";

            break;

        case "13d":
            //                        snow
            bgStyle = " bg_container8";
            icon = " wi-snow";

            break;

        case "50d":
            //                          mist                   
            bgStyle = " bg_container9";
            icon = " wi-fog";

            break;
        default:
    }
    console.log("ico" + icon);
    document.querySelector(".bg_container").className += bgStyle;
    document.querySelector(".wi").className += icon;
}

//function switchIcon(id) { 
//    var icon = JSON.parse(this.responseText);
//    var prefix = "wi wi-";
//    console.log(icon);
//}

function switchLvlPollution(pollutionLvl) {
    var bgColor = "lightblue",
        airText = " ";
    switch (pollutionLvl) {
        case 1:
            console.log("B. niski");
            bgColor = "#6bc926";
            airText = "Bardzo dobra";
            break;

        case 2:
            console.log("Niski");
            bgColor = "#d1cf1e";
            airText = "Dobra";

            break;

        case 3:
            console.log("Średni");
            bgColor = "#efbb0f";
            airText = "Ujdzie";

            break;

        case 4:
            console.log("Wysoki");
            bgColor = "#ef7120";
            airText = "Nie jest dobrze";

            break;

        case 5:
            console.log("B. wysoki");
            bgColor = "#ef2a36";
            airText = "Zła";

            break;

        case 6:
            console.log("Extremalny");
            bgColor = "#9d0028";
            airText = "Tragedia";

            break;
        default:
            bgColor = "lightblue";
    }
    console.log("AirPoll bgColor + text " + bgColor + " " + airText);
    document.getElementById("airQ").style.backgroundColor = bgColor;
    document.getElementById("airText").innerHTML = airText;
}

function leadingZero(i) {
    return (i < 10) ? "0" + i : i;
}

function currentDate() {
    var now = new Date();
    var h = now.getHours(),
        min = now.getMinutes(),
        day = now.getDay(),
        dayArr = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],

        time = leadingZero(h) + ":" + leadingZero(min);

    console.log(time + " " + dayArr[day]);
    document.getElementById("time").innerHTML = time + " " + dayArr[day];

    setTimeout(currentDate, 60000);
}

function getWeather(urlW, country) {
    var weatherReq = new XMLHttpRequest();
    weatherReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var weather = JSON.parse(this.responseText),

                li_city = document.getElementById("city"),
                li_weatherType = document.getElementById("weatherType"),
                li_celciusT = document.getElementById("celsiusT"),
                li_windSpeed = document.getElementById("windSpeed"),
                li_press = document.getElementById("press"),
                li_humidity = document.getElementById("humidity"),

                cityName = weather.name + ", " + country,
                weatherType = weather.weather[0].description,
                weatherIcon = weather.weather[0].icon,
                id = weather.weather[0].id,
                wind = weather.wind.speed,
                temp = weather.main.temp,
                press = weather.main.pressure,
                humidity = weather.main.humidity;
            console.log(country);

            console.log(weatherIcon + " " + id);

            switchBg(weatherIcon); //Switch background depend weather


            //            switchIcon(id);



            // Kelvint to Ceil
            celsiusT = (temp - 273.15) + " &#186C";
            //Kelvin to Ferenheit
            fahrenheitT = Math.round((temp) * (9 / 5) - 459.67) + " &#186F";


            //updating list
            li_city.innerHTML = cityName;
            li_celciusT.innerHTML = celsiusT;
            li_windSpeed.innerHTML = wind + " m/s";
            li_press.innerHTML = press + " hPa";
            li_humidity.innerHTML = humidity + " %";

            //Toggle UNNIS
            document.getElementById("celsiusT").addEventListener("click", function () {
                if (!unitToggle) {
                    li_celciusT.innerHTML = celsiusT;
                    unitToggle = true;
                } else {
                    li_celciusT.innerHTML = fahrenheitT;
                    unitToggle = false;
                }
            });

        }
    }
    weatherReq.open("GET", urlW, true);
    weatherReq.send();
}

function getAirPollution(urlP) {
    var airlyReq = new XMLHttpRequest();
    airlyReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var airQuality = JSON.parse(this.responseText),

                li_airQ = document.getElementById("airQ"),
                li_pm25 = document.getElementById("pm25"),
                li_pm10 = document.getElementById("pm10"),

                airQualityIndex = Math.round(airQuality.currentMeasurements.airQualityIndex),
                pm25 = Math.round(airQuality.currentMeasurements.pm25),
                pm10 = Math.round(airQuality.currentMeasurements.pm10),
                humidity = airQuality.currentMeasurements.humidity,
                pollutionLvl = airQuality.currentMeasurements.pollutionLevel;

            switchLvlPollution(pollutionLvl);

            li_pm25.innerHTML = pm25;
            li_pm10.innerHTML = pm10;
        }
    }
    airlyReq.open("GET", urlP, true);
    airlyReq.send();
}


document.addEventListener("DOMContentLoaded", function () {
    console.log("1");
    var myPosition = document.getElementById("position"),

        lat, // szerokość
        lon, // wysokosć
        celsiusT, // temp C
        fahrenheitT, //temp F
        country,

        unitToggle = true;

    //=====================IP COUNTRY=========================//
    $.get("https://ipinfo.io", function (response) {
        country = response.country;
        //        console.log(country);
    }, "jsonp");

    //Latitude & longitude
    if (navigator.geolocation) {
        console.log("11");
        navigator.geolocation.getCurrentPosition(function (position) {
            // 
            function switchBg(weatherIcon) {
                var icon = " ",
                    bgStyle = " ";
                console.log(weatherIcon);
                switch (weatherIcon) {
                    case "01d":
                    case "01n":
                        //clear sky
                        bgStyle = " bg_container1";
                        icon = " wi-day-sunny";
                        break;

                    case "02d":
                    case "02n":
                        //                        few clouds
                        bgStyle = " bg_container2";
                        icon = " wi-day-sunny-overcast";

                        break;

                    case "03d":
                    case "03n":
                        //                        	scattered clouds
                        bgStyle = " bg_container3";
                        icon = " wi-day-cloudy";

                        break;

                    case "04d":
                    case "04n":
                        //                        broken clouds
                        bgStyle = " bg_container4";
                        icon = " wi-cloudy";

                        break;

                    case "09d":
                    case "09n":
                        //                        	shower rain
                        bgStyle = " bg_container5";
                        icon = " wi-day-showers";

                        break;

                    case "10d":
                    case "10n":
                        //                        rain
                        bgStyle = " bg_container6";
                        icon = " wi-showers";

                        break;

                    case "11d":
                    case "11n":
                        //                        thunderstorm
                        bgStyle = " bg_container7";
                        icon = " wi-thunderstorm";

                        break;

                    case "13d":
                    case "13n":
                        //                        snow
                        bgStyle = " bg_container8";
                        icon = " wi-snow";

                        break;

                    case "50d":
                    case "50n":
                        //                          mist                   
                        bgStyle = " bg_container9";
                        icon = " wi-fog";

                        break;
                    default:
                }
                console.log("ico" + icon);
                document.querySelector(".bg_container").className += bgStyle;
                document.querySelector(".wi").className += icon;
            }

            //function switchIcon(id) { 
            //    var icon = JSON.parse(this.responseText);
            //    var prefix = "wi wi-";
            //    console.log(icon);
            //}

            function switchLvlPollution(pollutionLvl) {
                var bgColor = "lightblue",
                    airText = " ";
                switch (pollutionLvl) {
                    case 1:
                        console.log("B. niski");
                        bgColor = "#6bc926";
                        airText = "Bardzo dobra";
                        break;

                    case 2:
                        console.log("Niski");
                        bgColor = "#d1cf1e";
                        airText = "Dobra";

                        break;

                    case 3:
                        console.log("Średni");
                        bgColor = "#efbb0f";
                        airText = "Ujdzie";

                        break;

                    case 4:
                        console.log("Wysoki");
                        bgColor = "#ef7120";
                        airText = "Nie jest dobrze";

                        break;

                    case 5:
                        console.log("B. wysoki");
                        bgColor = "#ef2a36";
                        airText = "Zła";

                        break;

                    case 6:
                        console.log("Extremalny");
                        bgColor = "#9d0028";
                        airText = "Tragedia";

                        break;
                    default:
                        bgColor = "lightblue";
                }
                console.log("AirPoll bgColor + text " + bgColor + " " + airText);
                document.getElementById("airQ").style.backgroundColor = bgColor;
                document.getElementById("airText").innerHTML = airText;
            }

            function leadingZero(i) {
                return (i < 10) ? "0" + i : i;
            }

            function currentDate() {
                var now = new Date();
                var h = now.getHours(),
                    min = now.getMinutes(),
                    day = now.getDay(),
                    dayArr = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],

                    time = leadingZero(h) + ":" + leadingZero(min);

//                console.log(time + " " + dayArr[day]);
                document.getElementById("time").innerHTML = time + " " + dayArr[day];

                setTimeout(currentDate, 60000);
            }

            function getWeather(urlW, country) {
                var weatherReq = new XMLHttpRequest();
                weatherReq.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var weather = JSON.parse(this.responseText),

                            li_city = document.getElementById("city"),
                            li_weatherType = document.getElementById("weatherType"),
                            li_celciusT = document.getElementById("celsiusT"),
                            li_windSpeed = document.getElementById("windSpeed"),
                            li_press = document.getElementById("press"),
                            li_humidity = document.getElementById("humidity"),

                            cityName = weather.name + ", " + country,
                            weatherType = weather.weather[0].description,
                            weatherIcon = weather.weather[0].icon,
                            id = weather.weather[0].id,
                            wind = weather.wind.speed,
                            temp = weather.main.temp,
                            press = weather.main.pressure,
                            humidity = weather.main.humidity;
                        console.log(country);

                        console.log(weatherIcon + " " + id);

                        switchBg(weatherIcon); //Switch background depend weather


                        //            switchIcon(id);



                        // Kelvint to Ceil
                        celsiusT = (temp - 273.15).toFixed(1) + " &#186C";
                        //Kelvin to Ferenheit
                        fahrenheitT = ((temp) * (9 / 5) - 459.67).toFixed(1) + " &#186F";


                        //updating list
                        li_city.innerHTML = cityName;
                        li_celciusT.innerHTML = celsiusT;
                        li_windSpeed.innerHTML = wind + " m/s";
                        li_press.innerHTML = press + " hPa";
                        li_humidity.innerHTML = humidity + " %";

                        //Toggle UNNIS
                        document.getElementById("celsiusT").addEventListener("click", function () {
                            if (!unitToggle) {
                                li_celciusT.innerHTML = celsiusT;
                                unitToggle = true;
                            } else {
                                li_celciusT.innerHTML = fahrenheitT;
                                unitToggle = false;
                            }
                        });

                    }
                }
                weatherReq.open("GET", urlW, true);
                weatherReq.send();
            }

            function getAirPollution(urlP) {
                var airlyReq = new XMLHttpRequest();
                airlyReq.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var airQuality = JSON.parse(this.responseText),

                            li_airQ = document.getElementById("airQ"),
                            li_pm25 = document.getElementById("pm25"),
                            li_pm10 = document.getElementById("pm10"),

                            airQualityIndex = Math.round(airQuality.currentMeasurements.airQualityIndex),
                            pm25 = Math.round(airQuality.currentMeasurements.pm25),
                            pm10 = Math.round(airQuality.currentMeasurements.pm10),
                            humidity = airQuality.currentMeasurements.humidity,
                            pollutionLvl = airQuality.currentMeasurements.pollutionLevel;

                        switchLvlPollution(pollutionLvl);

                        li_pm25.innerHTML = pm25;
                        li_pm10.innerHTML = pm10;
                    }
                }
                airlyReq.open("GET", urlP, true);
                airlyReq.send();
            }


            document.addEventListener("DOMContentLoaded", function () {
                console.log("1");
                var myPosition = document.getElementById("position"),

                    lat, // szerokość
                    lon, // wysokosć
                    celsiusT, // temp C
                    fahrenheitT, //temp F
                    country,

                    unitToggle = true;

                //=====================IP COUNTRY=========================//
                $.get("https://ipinfo.io", function (response) {
                    country = response.country;
                    //        console.log(country);
                }, "jsonp");

                //Latitude & longitude
                if (navigator.geolocation) {
                    console.log("11");
                    navigator.geolocation.getCurrentPosition(function (position) {
                        console.log("13");
                        var lat = (position.coords.latitude).toFixed(3);
                        var lon = (position.coords.longitude).toFixed(3);
                        console.log(lat + " " + lon);
                        //    API KEY
                        var dateTime = currentDate();
                        var apiKey = "98310c44c00378e11f092a57b0514137"
                        var airlyKey = "647a7cfea9aa4b158c59f8e00df50dc7";

                        var urlW = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=' + apiKey; //Weather API
                        var urlP = 'https://airapi.airly.eu/v1/mapPoint/measurements?latitude=' + lat + '&longitude=' + lon + '&apikey=' + airlyKey; // air POllution
                        console.log(urlP);
                        console.log(urlP);
                        //=====================WEATHER OPENWEATHERMAPS API=========================//
                        getWeather(urlW, country);
                        //=====================AIR POLLUTION AIRLY API=========================//
                        getAirPollution(urlP);


                    }); //current pos 
                } // geolocation if end
            }); // DOM ready end

            var lat = (position.coords.latitude).toFixed(3);
            var lon = (position.coords.longitude).toFixed(3);
            console.log(lat + " " + lon);
            //    API KEY
            var dateTime = currentDate();
            var apiKey = "98310c44c00378e11f092a57b0514137"
            var airlyKey = "647a7cfea9aa4b158c59f8e00df50dc7";

            var urlW = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=' + apiKey; //Weather API
            var urlP = 'https://airapi.airly.eu/v1/mapPoint/measurements?latitude=' + lat + '&longitude=' + lon + '&apikey=' + airlyKey; // air POllution
            
            console.log("Airly: " + urlP);
            console.log("Weather: " + urlW);
            
            
            //=====================WEATHER OPENWEATHERMAPS API=========================//
            getWeather(urlW, country);
            //=====================AIR POLLUTION AIRLY API=========================//
            getAirPollution(urlP);


        }); //current pos 
    } // geolocation if end
}); // DOM ready end
