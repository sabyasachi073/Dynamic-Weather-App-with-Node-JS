const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp - 273.15);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min - 273.15);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max - 273.15);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((request, response) => {
    if (request.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=fef862c415c32ffb67181f765f6e25d6")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk); // Converts data from JSON format to JavaScript object format
                const arrData = [objData]; // Coverts to array of objects

                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                response.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                response.end();
            });
    }
});

server.listen(8080, "127.0.0.1");