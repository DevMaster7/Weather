// Get Element From DOM
let container = document.querySelector(".more-days");
let leftBtn = document.querySelector(".cir1");
let rightBtn = document.querySelector(".cir2");
let circles = document.querySelectorAll(".circle");
let dateDiv = document.querySelector(".date");
let searchInput = document.getElementById("area");
let searchBtn = document.getElementById("btn");
let err = document.querySelector(".error");
let title = document.getElementsByTagName("title");
let countryName = document.querySelector(".country");
let ShowCurrentTemp = document.querySelector(".current-temp")
let ShowIcon = document.getElementById("showIcon")
let ShowFeelTemp = document.querySelector(".feelslike")
let showHumidity = document.getElementById("humidity")
let showWind = document.getElementById("wind")
let showMinTemp = document.querySelectorAll(".temp")[0]
let showMaxTemp = document.querySelectorAll(".temp")[1]
let boxesCon = document.querySelector(".more-days")
let themeBTN = document.querySelector(".theme-con")
let cir = document.querySelector(".cirbtn")
let body = document.getElementsByTagName("body")[0]
let mainCon = document.querySelector(".container")


// Scrolling Button
const boxWidth = 87;
let scrollPosition = 0;

rightBtn.addEventListener("click", () => {
    if (scrollPosition < container.scrollWidth - container.clientWidth) {
        scrollPosition += boxWidth;
        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
        console.log(`right ${scrollPosition}`);
    }
});

leftBtn.addEventListener("click", () => {
    if (scrollPosition > 0) {
        scrollPosition -= boxWidth;
        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
        console.log(`left ${scrollPosition}`);
    }
});

// Get Date and Time
function getFormattedDateTime() {
    const now = new Date();

    // Get day name (e.g., Monday)
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

    // Get date parts
    const month = now.getMonth() + 1; // Months are 0-based
    const day = now.getDate();
    const year = now.getFullYear();

    // Get time in 12-hour format with AM/PM
    const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return `${dayName} ${month}/${day}/${year} ${time}`;

}

// Insert Date and Time And Update Every Minute
function updateTime() {
    dateDiv.innerHTML = getFormattedDateTime()
}
updateTime();
setInterval(updateTime, 30000);

// Fetching Data
function fetchOnDOM(location) {
    let URL = `http://api.weatherapi.com/v1/forecast.json?key=8b63ae1e38994ffd82594030251002&q=${location}&days=7&aqi=no&alerts=no`
    fetch(URL, {
        method: "GET",
        mode: "cors"
    }).then((e) => e.json())
        .then((data) => {
            if (data.error) {
                err.style.display = "flex";
                setTimeout(() => {
                    err.style.animation = "disappear 1s ease";
                    setTimeout(() => {
                        err.style.display = "none";
                        err.style.animation = "";
                    }, 1000);
                }, 1000);
            }
            else {
                let name = data.location.name
                let currentTemp = data.current.temp_c
                let iconSrc = data.current.condition.icon
                let feelsLikeTemp = data.current.feelslike_c
                let humidity = data.current.humidity
                let wind = data.current.wind_kph
                let foreCastDays = data.forecast.forecastday
                let minTemp = foreCastDays[0].day.mintemp_c
                let maxTemp = foreCastDays[0].day.maxtemp_c

                // Show Data On DOM
                title[0].innerHTML = `Weather - ${name}`
                countryName.innerHTML = name
                ShowCurrentTemp.innerHTML = `${currentTemp}°C`
                ShowIcon.src = iconSrc
                ShowFeelTemp.innerHTML = `Feels Like ${feelsLikeTemp}°C`
                showHumidity.innerHTML = `<i class="fa-solid fa-droplet"></i> ${humidity}%<br>Humidity`
                showWind.innerHTML = `<i class="fa-solid fa-wind"></i> ${wind}kmh<br>Wind`
                showMinTemp.innerHTML = `Start From<br>${minTemp}°C`
                showMaxTemp.innerHTML = `Go To<br>${maxTemp}°C`

                // Show API Data In Console
                console.log(data);

                // Hide Scrolling Buttons
                // let test = 6
                if (foreCastDays.length <= 5) {
                    for (const element of circles) {
                        element.style.display = "none"
                    }
                }
                else {
                    for (const element of circles) {
                        element.style.display = "flex"
                    }
                }

                // Reset Old Things
                scrollPosition = 0; // Reset scroll position to start
                container.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });
                boxesCon.innerHTML = '' // Remove Old Cards EveryTime

                // Forecast Cards
                for (let i = 0; i < foreCastDays.length; i++) {
                    let fullDate = foreCastDays[i].date
                    let dayName = new Date(fullDate).toLocaleDateString('en-US', { weekday: 'long' })
                    let icons = foreCastDays[i].day.condition.icon
                    let Text = foreCastDays[i].day.condition.text
                    let forecastMaxTemp = foreCastDays[i].day.maxtemp_c
                    let forecastMinTemp = foreCastDays[i].day.mintemp_c
                    let castMaxTemp = Math.trunc(forecastMaxTemp)
                    let castMinTemp = Math.trunc(forecastMinTemp)

                    // Insert Boxes
                    let boxDivs = document.createElement('div')
                    boxDivs.classList.add('boxes')
                    boxesCon.append(boxDivs)

                    // Insert DayName
                    let dayDivs = document.createElement('div')
                    dayDivs.classList.add('foreCastDay')
                    dayDivs.innerHTML = dayName
                    boxDivs.append(dayDivs)

                    // Insert Image Icon
                    let imgIcon = document.createElement('img')
                    imgIcon.classList.add('foreCastImg')
                    imgIcon.src = icons
                    boxDivs.append(imgIcon)

                    // Insert Text
                    let textDiv = document.createElement('div')
                    textDiv.classList.add('text')
                    textDiv.innerHTML = Text
                    boxDivs.append(textDiv)

                    // Insert Temprature Container
                    let tempConDiv = document.createElement('div')
                    tempConDiv.classList.add('foreCastTempCon')
                    boxDivs.append(tempConDiv)

                    // Insert Temprature Text
                    let maxTempDiv = document.createElement('div')
                    let minTempDiv = document.createElement('div')
                    minTempDiv.classList.add("foreCastMinTemp")
                    maxTempDiv.innerHTML = `${castMaxTemp}°`
                    minTempDiv.innerHTML = `${castMinTemp}°`
                    tempConDiv.append(maxTempDiv)
                    tempConDiv.append(minTempDiv)
                }
            }
        })
        // Show Error if Network Error
        .catch((e) => {
            console.log(`${e}`)
        })
}

let lastArea = ""
function fetchData() {
    // Insert Data else Show Error 
    let area = searchInput.value
    if (area !== lastArea) {
        lastArea = area
        fetchOnDOM(area);
    }
    else {
        err.style.display = "flex";
        setTimeout(() => {
            err.style.animation = "disappear 1s ease";
            setTimeout(() => {
                err.style.display = "none";
                err.style.animation = "";
            }, 1000);
        }, 1000);
    }
}
// Fetch Data on Click Events
searchBtn.addEventListener('click', function () {
    fetchData()
})

document.getElementsByTagName("body")[0].addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        fetchData()
    }
})

// Change Theme Button
let o = 0;
themeBTN.addEventListener("click", function () {
    if (o === 0) {
        themeBTN.style.justifyContent = "flex-end";
        cir.style.background = "#BB86FC"
        mainCon.style.background = getComputedStyle(document.documentElement).getPropertyValue("--darkTheme");
        body.style.color = getComputedStyle(document.documentElement).getPropertyValue("--text-secondary");
        searchBtn.style.color = "#E0E0E0"
        area.style.color = "#E0E0E0"
        const style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule(`
            input::placeholder {
                color: #E0E0E0 !important;
                }
                `, style.sheet.cssRules.length);
        o = 1;
    } else {
        themeBTN.style.justifyContent = "flex-start";
        cir.style.background = "#E0E0E0"
        mainCon.style.background = getComputedStyle(document.documentElement).getPropertyValue("--lightTheme");
        body.style.color = getComputedStyle(document.documentElement).getPropertyValue("--secondary-dark");
        searchBtn.style.color = "#16213E"
        area.style.color = "#16213E"
        const style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule(`
        input::placeholder {
            color: #16213E !important;
        }
        `, style.sheet.cssRules.length);
        o = 0;
    }
})
