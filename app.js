// https://intense-mesa-62220.herokuapp.com/

const proxy = "https://intense-mesa-62220.herokuapp.com/";

const confirmedEl = document.createElement("button");
const deathsEl = document.createElement("button");
const recoveredEl = document.createElement("button");
const criticalEl = document.createElement("button");
const asiaEl = document.createElement("button");
const europeEl = document.createElement("button");
const africaEl = document.createElement("button");
const americasEl = document.createElement("button");
const worldEl = document.createElement("button");
const dropDownListEl = document.createElement("select");
const firstDropDownOptionEl = document.createElement("option");

const canvasEl = document.createElement("canvas");
let myChart = new Chart(canvasEl, {})
let graphType = "bar";
let graphFor = "confirmed";
let currentRegion = "";

document.body.appendChild(confirmedEl);
document.body.appendChild(deathsEl);
document.body.appendChild(recoveredEl);
document.body.appendChild(criticalEl);
document.body.appendChild(asiaEl);
document.body.appendChild(europeEl);
document.body.appendChild(africaEl);
document.body.appendChild(americasEl);
document.body.appendChild(worldEl);

confirmedEl.textContent = "Confirmed";
deathsEl.textContent = "Deaths";
recoveredEl.textContent = "Recovered";
criticalEl.textContent = "Critical";
asiaEl.textContent = "Asia";
europeEl.textContent = "Europe";
africaEl.textContent = "Africa";
americasEl.textContent = "Americas";
worldEl.textContent = "World";
firstDropDownOptionEl.textContent = "Choose a country";

confirmedEl.addEventListener("click", () => {
    graphFor = "confirmed";
    fetchByRegion(currentRegion);
});

deathsEl.addEventListener("click", () => {
    graphFor = "deaths";
    fetchByRegion(currentRegion);
});

recoveredEl.addEventListener("click", () => {
    graphFor = "recovered";
    fetchByRegion(currentRegion);
});

criticalEl.addEventListener("click", () => {
    graphFor = "critical";
    fetchByRegion(currentRegion);
});

asiaEl.addEventListener("click", () => {
    fetchByRegion("/region/Asia");
    currentRegion = "/region/Asia";
});

europeEl.addEventListener("click", () => {
    fetchByRegion("/region/Europe");
    currentRegion = "/region/Europe";
});

africaEl.addEventListener("click", () => {
    fetchByRegion("/region/Africa");
    currentRegion = "/region/Africa";
});

americasEl.addEventListener("click", () => {
    fetchByRegion("/region/Americas");
    currentRegion = "/region/Americas";
});

worldEl.addEventListener("click", () => {
    fetchByRegion("");
    currentRegion = "";
});

dropDownListEl.addEventListener("input", (e) => {
    fetchByCountry(e.target.selectedOptions[0].getAttribute("code"));
});

async function fetchByRegion(region) {
    try {
        const regionData = await axios.get(`${proxy}https://restcountries.herokuapp.com/api/v1${region}`);
        dropDownListEl.innerHTML = "";
        document.body.appendChild(dropDownListEl)
        dropDownListEl.appendChild(firstDropDownOptionEl);
        myChart.destroy();
        const graphLabelsArr = [[],[]];
        const graphDataArr = [];
        for (let country of regionData.data) {
            const dropDownOptionEl = document.createElement("option");
            dropDownListEl.appendChild(dropDownOptionEl);
            dropDownOptionEl.textContent = country.name.common;
            dropDownOptionEl.setAttribute("code", country.cca2);
            graphLabelsArr[0].push(country.name.common);
            graphLabelsArr[1].push(country.cca2);
        }
        for (let country of graphLabelsArr[1]) {
            if (country == "XK") {
                continue;
            }
            const countryCovidData = await axios.get(`${proxy}http://corona-api.com/countries/${country}`);
            graphDataArr.push(countryCovidData.data.data.latest_data[graphFor]);
        }
        const graphColorsArr = grabRandomColors(graphDataArr.length);
        drawGraph(graphType, graphLabelsArr[0], graphFor, graphDataArr, graphColorsArr);
        document.body.appendChild(canvasEl);
    } catch (err) {
        console.log("failed", err);
    }
}

async function fetchByCountry(country) {
    try {
        myChart.destroy();
        const fetchedCovidyData = await axios.get(`${proxy}http://corona-api.com/countries/${country}`);
        const countryCovidData = fetchedCovidyData.data.data
        console.log(countryCovidData);
        const countryDataObj = {
            "Total Cases": countryCovidData.latest_data.confirmed,
            "New Cases": countryCovidData.today.confirmed,
            "Total Deaths": countryCovidData.latest_data.deaths,
            "New Deaths": countryCovidData.today.deaths,
            "Total Recovered": countryCovidData.latest_data.recovered,
            "Total Critical": countryCovidData.latest_data.critical,
        }
        const graphColorsArr = grabRandomColors(6);
        drawGraph(graphType, Object.keys(countryDataObj), countryCovidData.name, Object.values(countryDataObj), graphColorsArr);
    } catch (err) {
        console.log("failed to fetch", err);
    }
}

function drawGraph(graphType, graphLabelsArr, graphFor, graphDataArr, graphColorsArr) {
    
    myChart = new Chart(canvasEl, {
        type: graphType,
        data: {
            labels: graphLabelsArr,
            datasets: [{
                label: "Covid-19 " + graphFor,
                data: graphDataArr,
                backgroundColor: graphColorsArr[0],
                borderColor: graphColorsArr[1],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    
    });
}

function grabRandomColors(length) {
    const arr = [[],[]];
    for (let i = 0; i < length; i++) {
        const rand1 = Math.random() * 255;
        const rand2 = Math.random() * 255;
        const rand3 = Math.random() * 255;
        arr[0].push(`rgba(${rand1},${rand2},${rand3},0.2)`);
        arr[1].push(`rgba(${rand1},${rand2},${rand3},1)`);
    }
    return arr;
}