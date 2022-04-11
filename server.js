const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const app = express();





// Configure dotenv package

require("dotenv").config()

const apikey = `${process.env.API_KEY}`;
//5969b58ccb2768aecf15fc00b0900581
// Setup  express app and body-parser configurations
// Setup  javascript template view engine
// we will serve  static pages from the public directory, it will act as your root directory

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extend:true}));
app.set("view engine","ejs");

app.get("/",function (req,res){
    res.render("index",{weather:null,error:null})
});

app.post("/",function (req,res){
    // Get city name passed in the form
    let city = req.body.city;

    // Use that city name to fetch data
    // Use the API_KEY in the '.env' file
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`

    request(url,function (err,response,body) {
        if (err) {
            res.render('index', {weather: null, error: 'Error, please try again'})
        } else {
            let weather = JSON.parse(body);
            console.log(weather);

            if (weather.main == undefined) {
                res.render('index', {weather: null, error: "Error, please try again"})
            } else {
                let place = `${weather.name},${weather.sys.country}`,
                    weatherTimezone = ` ${new Date(
                        weather.dt * 1000 - weather.timezone * 1000)}`;
                let weatherTemp = `${weather.main.temp}`,
                    weatherPressure = `${weather.main.pressure}`,
                    weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                    weatherDescription = `${weather.weather[0].description}`,
                    humidity = `${weather.main.humidity}`,
                    clouds = `${weather.clouds.all}`,
                    visibility = `${weather.visibility}`,
                    main = `${weather.weather[0].main}`,
                    weatherFahrenheit;
                weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

                function roundToTow(num) {
                    return +(Math.round(num + "e+2") + "e-2");
                }

                weatherFahrenheit = roundToTow(weatherFahrenheit);
                res.render("index", {
                    weather: weather,
                    place: place,
                    temp: weatherTemp,
                    pressure: weatherPressure,
                    icon: weatherIcon,
                    description: weatherDescription,
                    timezone: weatherTimezone,
                    humidity: humidity,
                    fahrenheit: weatherFahrenheit,
                    clouds: clouds,
                    visibility: visibility,
                    main: main,
                    error: null,
                });



            }
        }
    })
});


app.listen(3000,function (){
    console.log("Weather app is start");
})
