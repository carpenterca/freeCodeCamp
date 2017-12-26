//Set up initial variables for Charleston, SC
var latitude = 32.7765;
var longitude = -79.9311;

var city = "";
var weatherCondition = "";
var temperature = 0;
var tempMax = 0;
var tempMin = 0;
var humidity = 0;
var windSpeed = 0;
var windDir = 0;
var sunRise = 0;
var sunSet = 0;
var sunRisehour = 0;
var sunRiseMin = 0;
var sunSetHour = 0;
var sunSetMin = 0;
var timeOfDay = "day";

var marsMonth = "";
var sol = 0;
var atmosphere = "";
var temperatureMin = 0;
var temperatureMax = 0;
var temperatureAvg = 0;
var marsSunrise = 0;
var marsSunset = 0;
var dataReceived = 0;

var currentUnit = "imperial";

const bgImages = ["clear_skys.jpg", "clear_night.jpg", "cloudy_mountains.jpg", "clouds_night.jpg", "rain.jpg", "rain_night.jpg",
                  "thunderstorm.jpg", "snow.jpg", "snow_night.jpg", "fog.jpg", "hurricane.jpg", "mars_landscape.jpg"];
const imgPath = "./img/";
var bgImage = "earth_from_space.jpg";
var weatherCode = 0;

function initWeather() {
  //Pre-load bgImages
  for (let i = 0; i < bgImages.length; ++i) {
      const img = new Image();
      img.src = imgPath + bgImages[i];
  }

  //Set up event handlers
  //Set up each planet's view
  document.getElementById("earth").addEventListener("click", expandView);
  document.getElementById("mars").addEventListener("click", expandView);
  const back_buttons = document.getElementsByClassName("back-btn");
  for (let i = 0; i < back_buttons.length; i++) {
    back_buttons[i].addEventListener("click", reduceView);
  }
  //Set up view unit conversion toggle
  // earth toggle
  $("#toggle").on("click", function (e) {
      if($(e.target).hasClass("imperial")) {
          toggleUnits("metric");
          currentUnit = "metric";
          $("#mars-toggle").prop("checked", true);
          toggleUnitsMars(currentUnit);
          document.getElementById("mars-toggle").classList.remove("imperial");
          document.getElementById("mars-toggle").classList.add("metric");
      } else {
          toggleUnits("imperial");
          currentUnit = "imperial";
          $("#mars-toggle").prop("checked", false);
          toggleUnitsMars(currentUnit);
          document.getElementById("mars-toggle").classList.remove("metric");
          document.getElementById("mars-toggle").classList.add("imperial");
      }

      $(e.target).toggleClass("imperial");
      $(e.target).toggleClass("metric");

      //$("#mars-toggle").toggleClass("imperial");
      //$("#mars-toggle").toggleClass("metric");
    });
    // mars toggle
    $("#mars-toggle").on("click", function (e) {
        if($(e.target).hasClass("imperial")) {
            toggleUnitsMars("metric");
            currentUnit = "metric";
            $("#earth-toggle").prop("checked", true);
            toggleUnits(currentUnit);
            document.getElementById("earth-toggle").classList.remove("imperial");
            document.getElementById("earth-toggle").classList.add("metric");
        } else {
            toggleUnitsMars("imperial");
            currentUnit = "imperial";
            $("#earth-toggle").prop("checked", false);
            toggleUnits(currentUnit);
            document.getElementById("earth-toggle").classList.remove("metric");
            document.getElementById("earth-toggle").classList.add("imperial");
        }

        $(e.target).toggleClass("imperial");
        $(e.target).toggleClass("metric");

        //$("#earth-toggle").toggleClass("imperial");
        //$("#earth-toggle").toggleClass("metric");
      });

    //Set up button to get user location
    $("#current-location").on("click", getGeolocation);

    //Get Mars Weather
    getMarsWeather();
    //Get Earth Weather
    getLocalWeather(latitude, longitude);
}

function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latitude = (position.coords.latitude).toFixed(6);
      longitude = (position.coords.longitude).toFixed(6);
      getLocalWeather(latitude, longitude);
    });
  }
}

function getLocalWeather(currentLat, currentLong) {
  latitude = currentLat;
  longitude = currentLong;

  $.ajax({
    url: "https://fcc-weather-api.glitch.me/api/current",
    dataType: "jsonp",
    data: {
        lat: latitude,
        lon: longitude,
        units: "imperial"
    },
    jsonpCallback: "displayEarthWeather"
  });

  //refresh the weather data every 10 minutes
  //pattern currently shows temp only slightly changing every 20 mins, so may change it
  t = setTimeout(function() {
    getLocalWeather(latitude, longitude);
  }, 600000);
}

function displayEarthWeather(jsonData) {
    console.log(jsonData);

    //Set data
    city = jsonData.name;
    weatherCondition = jsonData.weather[0].main;
    temperature = jsonData.main.temp;
    tempMax = jsonData.main.temp_max;
    tempMin = jsonData.main.temp_min;
    humidity = jsonData.main.humidity;
    windSpeed = jsonData.wind.speed;
    windDir = jsonData.wind.deg;
    sunRise = jsonData.sys.sunrise;
    sunSet = jsonData.sys.sunset;

    sunRise = unixTimeConvert(sunRise);
    sunSet = unixTimeConvert(sunSet);

    //Make conversions and display them
    toggleUnits(currentUnit);

    //Display remaining elements
    document.getElementById("location").innerHTML = city;
    document.getElementById("weather-condition").innerHTML = weatherCondition;
    document.getElementById("humidity").innerHTML = "Humidity: " + humidity + "%";
    document.getElementById("sunrise").innerHTML = "Sunrise: " + sunRise;
    document.getElementById("sunset").innerHTML = "Sunset: " + sunSet;

    //Data used in the following functions
    let sunRiseTimes = sunRise.split(":");
    let sunSetTimes = sunSet.split(":");
    sunRisehour = sunRiseTimes[0];
    sunRiseMin = sunRiseTimes[1];
    sunSetHour = sunSetTimes[0];
    sunSetMin = sunSetTimes[1];
    weatherCode = jsonData.weather[0].id;

    // start clock and determine daylight
    startTime();

    // set background image based on weather condition
    doWeatherCondition(weatherCode);
    updateBackgroundImage();
}

function getLocalWeatherForcast(latitude, longitude) {
  //https://home.openweathermap.org/
  /*var appid = "";
  var urlWeather = "api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + appid;
  var urlForcast = "api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + appid;
*/
}

function getMarsWeather() {
  // Use this call for locally run apps only.
  // CORS header ‘Access-Control-Allow-Origin’ are missing for this site,
  // and must use a backend server to get data on a live site.
  $.ajax({
    url: "http://marsweather.ingenology.com/v1/latest/?format=jsonp",
    crossOrigin: true,
    type: 'GET',
    dataType: "jsonp",
    xhrFields: { withCredentials: true },
    accept: 'application/json',
    jsonpCallback: "displayMarsWeather"
  });

  // Use this call on your own server to bypass CORS header
  // mars data from http://marsweather.ingenology.com/v1/latest/
  /*$.ajax({
      url:'maas-utility.php',
      complete: function (response) {
          let jsonObject = JSON.parse(response.responseText);
          console.log(jsonObject);
          displayMarsWeather(jsonObject);
      },
      error: function () {
          console.log("An error occurred obtaining the data.");
      }
  });
  return false;*/
}

function displayMarsWeather(jsonData) {
  console.log(jsonData);

  marsMonth = jsonData.report.season;
  sol = jsonData.report.sol;
  atmosphere = jsonData.report.atmo_opacity;
  temperatureMin = jsonData.report.min_temp;
  temperatureMax = jsonData.report.max_temp;
  temperatureAvg = (temperatureMin + temperatureMax)/2;
  marsSunrise = jsonData.report.sunrise;
  marsSunset = jsonData.report.sunset;
  dataReceived = jsonData.report.terrestrial_date;

  //Make conversions and display them
  toggleUnitsMars(currentUnit);

  //Display remaining elements
  document.getElementById("current-season-mars").innerHTML = marsMonth + ",";
  document.getElementById("current-day-mars").innerHTML = "Sol: " + sol;
  document.getElementById("weather-condition-mars").innerHTML = atmosphere;
  document.getElementById("sunrise-mars").innerHTML = "Sunrise: " + marsSunrise.substring(11, 16); //example string: 2017-11-19T11:53:00Z
  document.getElementById("sunset-mars").innerHTML = "Sunset: " + marsSunset.substring(11, 16);
  document.getElementById("data-received-mars").innerHTML = "Data transmision on: " + dataReceived + '<br> by the Mars Curiosity Rover';
}

function unixTimeConvert(unixTimestamp) {
  let date = new Date(unixTimestamp*1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  return hours + ':' + minutes.substr(-2);
}

//F = C x 1.8 + 32
function convertCtoF(cel) {
  return Math.floor(cel * 1.8 + 32);
}

function convertWindToMiles(meters) {
  return (meters * 2.2369).toFixed(2);
}

function toggleUnits(unit) {
  if(unit === "imperial") {
    document.getElementById("temperature").innerHTML = convertCtoF(temperature) + "&degF";
    document.getElementById("maxtemp").innerHTML = convertCtoF(tempMax) + "&deg";
    document.getElementById("mintemp").innerHTML = convertCtoF(tempMin) + "&deg";
    document.getElementById("wind").innerHTML = convertWindToMiles(windSpeed) + " mph " + windDirection(windDir);
  } else if (unit === "metric") {
    document.getElementById("temperature").innerHTML = temperature.toFixed() + "&degC";
    document.getElementById("maxtemp").innerHTML = tempMax + "&deg";
    document.getElementById("mintemp").innerHTML = tempMin + "&deg";
    document.getElementById("wind").innerHTML = windSpeed + " m/s " + windDirection(windDir);
  }
}

function toggleUnitsMars(unit) {
  if(unit === "imperial") {
    document.getElementById("avg-temp-mars").innerHTML = convertCtoF(temperatureAvg) + "&degF";
    document.getElementById("max-temp-mars").innerHTML = convertCtoF(temperatureMax) + "&deg";
    document.getElementById("min-temp-mars").innerHTML = convertCtoF(temperatureMin) + "&deg";
  } else if (unit === "metric") {
    document.getElementById("avg-temp-mars").innerHTML = temperatureAvg + "&degC";
    document.getElementById("max-temp-mars").innerHTML = temperatureMax + "&deg";
    document.getElementById("min-temp-mars").innerHTML = temperatureMin + "&deg";
  }
}

function windDirection(degree) {
  let dir = "";
  switch (true) {
    case (degree < 11.25):
      dir = "N";
      break;
    case (degree < 33.75):
      dir = "N NW";
      break;
    case (degree < 56.25):
      dir = "NE";
      break;
    case (degree < 78.75):
      dir = "E NE";
      break;
    case (degree < 101.25):
      dir = "E";
      break;
    case (degree < 123.75):
      dir = "E SE";
      break;
    case (degree < 146.25):
      dir = "SE";
      break;
    case (degree < 168.75):
      dir = "S SE";
      break;
    case (degree < 191.25):
      dir = "S";
      break;
    case (degree < 213.75):
      dir = "S SW";
      break;
    case (degree < 236.25):
      dir = "SW";
      break;
    case (degree < 258.75):
      dir = "W SW";
      break;
    case (degree < 281.25):
      dir = "W";
      break;
    case (degree < 303.75):
      dir = "W NW";
      break;
    case (degree < 326.25):
      dir = "NW";
      break;
    case (degree < 348.75):
      dir = "N NE";
      break;
    default:
      dir = "N";
  }
  return dir;
}

function startTime() {
  const today = new Date();
  let day = today.getDay();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();

  //Determine if there is sunlight or not based on sunset time
  if(hours >= sunRisehour && minutes >= sunRiseMin && hours < sunSetHour) {
    timeOfDay = "day";
  } else if (minutes > sunSetMin) {
    timeOfDay = "night";
  } else {
    timeOfDay = "day";
  }

  // add a zero in front of numbers<10
  minutes = checkTime(minutes);
  seconds = checkTime(seconds);

  // convert day to string
  day = checkDay(day);
  document.getElementById('time').innerHTML = hours + ":" + minutes + ":" + seconds + " (" + day + ")";

  // timer to update clock and check for change in daylight
  t = setTimeout(function() {
    startTime()
  }, 500);
}

//Adds a 0 infront of single digit times
function checkTime(i) {
  if (i < 10) { i = "0" + i; }
  return i;
}

function checkDay(day) {
  let weekday = "";
  switch (day) {
    case 1:
      weekday = "Mon";
      break;
    case 2:
      weekday = "Tues";
      break;
    case 3:
      weekday = "Wed";
      break;
    case 4:
      weekday = "Thurs";
      break;
    case 5:
      weekday = "Fri";
      break;
    case 6:
      weekday = "Sat";
      break;
    default:
      weekday = "Sun";
  }
  return weekday;
}


function doWeatherCondition(weatherCode) {
  switch (true) {
    case (weatherCode < 240): //Thunderstorm
      if (timeOfDay === "day") {
        bgImage = "thunderstorm.jpg";
      } else {
        bgImage = "thunderstorm.jpg";
      }
      break;
    case (weatherCode < 330): //Drizzle
      bgImage = "rain.jpg";
      break;
    case (weatherCode < 540): //Rain
      if (timeOfDay === "day") {
        bgImage = "rain.jpg";
      } else {
        bgImage = "rain_night.jpg";
      }
      break;
    case (weatherCode < 630): //Snow
      if (timeOfDay === "day") {
        bgImage = "snow.jpg";
      } else {
        bgImage = "snow_night.jpg";
      }
      break;
    case (weatherCode < 790): //Atmospheric - haze, fog, mist
      if (timeOfDay === "day") {
        bgImage = "fog.jpg";
      } else {
        bgImage = "fog.jpg";
      }
      break;
    case (weatherCode === 800): //Clear
      if (timeOfDay === "day") {
        bgImage = "clear_skys.jpg";
      } else {
        bgImage = "clear_night.jpg";
      }
      break;
    case (weatherCode < 805): //Clouds
      if (timeOfDay === "day") {
        bgImage = "cloudy_mountains.jpg";
      } else {
        bgImage = "clouds_night.jpg";
      }
      break;
    case (weatherCode < 910): //Extreme - tropical storm, hail, hurricane, tornado
      bgImage = "hurricane.jpg";
      break;
    case (weatherCode < 970): //Additional - breeze, wind, gale
      if (timeOfDay === "day") {
        bgImage = "earth_from_space.jpg";
      } else {
        bgImage = "earth_from_space.jpg";
      }
      break;
    default:
      bgImage = "earth_from_space.jpg";
  }
}

function updateBackgroundImage() {
    if ($("#earth").hasClass("view-left-active")) {
        doWeatherCondition(weatherCode); //check to make sure weather condition is correct
        $('.view-left-active').css("background-image", "url('" + imgPath + bgImage + "')");
        $("#earth").removeClass("view-left");
    } else {
      bgImage = "earth_from_space.jpg";
      $("#earth").addClass("view-left");
      $('.view-left').css("background-image", "url('" + imgPath + bgImage + "')"); //Why is it required to update background-image for element to update
    }
}

function expandView(e) {
  const worldSelectEarth = document.getElementById("earth");
  const worldSelectMars = document.getElementById("mars");
  const mq1000 = window.matchMedia( "(min-width: 1000px)" );
  switch (e.target.id) {
    case "earth-title":
    case "earth-title1":
    case "earth-title2":
    case "earth":
      //remove mars view
      worldSelectMars.className = 'view-unfocused';

      //select desktop or mobile views
      if (mq1000.matches) {
        worldSelectEarth.className = 'view view-focus-desktop';
      } else {
        worldSelectEarth.className = 'view view-focus-mobile';
      }

      //add elements for view
      this.getElementsByClassName("title")[0].style.display = 'none';
      this.getElementsByClassName("back-btn")[0].style.display = 'inline-block';
      document.getElementById("current-location").style.display = 'inline-block';
      document.getElementById("toggle").style.display = 'inline-block';
      document.getElementById("earth-weather").style.display = 'block';

      //add classes and apply background
      this.classList.add("view-left-active");
      updateBackgroundImage();
      break;
    case "mars-title":
    case "mars-title1":
    case "mars-title2":
    case "mars":
      //remove earth view
      worldSelectEarth.className = 'view-unfocused';

      //select desktop or mobile views
      if (mq1000.matches) {
        worldSelectMars.className = 'view view-focus-desktop';
      } else {
        worldSelectMars.className = 'view view-focus-mobile';
      }

      //add elements for mars view
      this.getElementsByClassName("title")[0].style.display = 'none';
      this.getElementsByClassName("back-btn")[0].style.display = 'inline-block';
      document.getElementById("toggle-mars").style.display = 'inline-block';
      document.getElementById("mars-weather").style.display = 'block';

      //add classes and apply background
      this.classList.add("view-right-active");
      //this.style.backgroundImage = "url('./img/mars_landscape.jpg')";
      break;
    default:
      //console.log("Error occurred when switching view!");
  }
}

function reduceView(e) {
  const worldSelectEarth = document.getElementById("earth");
  const worldSelectMars = document.getElementById("mars");
  const mq1000 = window.matchMedia( "(min-width: 1000px)" );
  let parentElement = this.parentNode;
  switch (parentElement.id) {
    case "earth":
      //remove elements for earth view
      parentElement.getElementsByClassName("back-btn")[0].style.display = 'none';
      document.getElementById("current-location").style.display = 'none';
      document.getElementById("toggle").style.display = 'none';
      document.getElementById("earth-weather").style.display = 'none';

      //add elements for home view
      parentElement.getElementsByClassName("title")[0].style.display = 'block';

      worldSelectEarth.className = 'view view-left';
      worldSelectMars.className = 'view view-right';

      worldSelectMars.classList.remove("view-unfocused");

      //select desktop or mobile views
      if (mq1000.matches) {
        worldSelectEarth.classList.remove("view-focus-desktop");
      } else {
        worldSelectEarth.classList.remove("view-focus-mobile");
      }

      //view home view, remove classes, and update background
      worldSelectEarth.classList.remove("view-left-active"); //remove active before updating the background image
      updateBackgroundImage();
      break;
    case "mars":
      //remove elements for mars view
      parentElement.getElementsByClassName("back-btn")[0].style.display = 'none';
      document.getElementById("toggle-mars").style.display = 'none';
      document.getElementById("mars-weather").style.display = 'none';

      //add elements for home view
      parentElement.getElementsByClassName("title")[0].style.display = 'block';
      //return width to mobile or desktop versions

      worldSelectMars.className = 'view view-right';
      worldSelectEarth.className = 'view view-left';

      worldSelectEarth.classList.remove("view-unfocused");

      //select desktop or mobile views
      if (mq1000.matches) {
        worldSelectMars.classList.remove("view-focus-desktop");
      } else {
        worldSelectMars.classList.remove("view-focus-mobile");
      }

      //parentElement.style.backgroundImage = "url('./img/mars_from_space.jpg')";
      worldSelectMars.classList.remove("view-right-active");
      break;
    default:
      console.log("Error occurred when returning to home view!");
  }
}
