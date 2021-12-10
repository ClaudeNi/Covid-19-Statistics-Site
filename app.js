// https://intense-mesa-62220.herokuapp.com/

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
document.body.appendChild(dropDownListEl)
document.body.appendChild(canvasEl);

confirmedEl.textContent = "Confirmed";
deathsEl.textContent = "Deaths";
recoveredEl.textContent = "Recovered";
criticalEl.textContent = "Critical";
asiaEl.textContent = "Asia";
europeEl.textContent = "Europe";
africaEl.textContent = "Africa";
americasEl.textContent = "Americas";
worldEl.textContent = "World";

confirmedEl.addEventListener("click", () => {
    graphFor = "confirmed";
    fetchCountriesByRegion(currentRegion);
});

deathsEl.addEventListener("click", () => {
    graphFor = "deaths";
    fetchCountriesByRegion(currentRegion);
});

recoveredEl.addEventListener("click", () => {
    graphFor = "recovered";
    fetchCountriesByRegion(currentRegion);
});

criticalEl.addEventListener("click", () => {
    graphFor = "critical";
    fetchCountriesByRegion(currentRegion);
});

asiaEl.addEventListener("click", () => {
    fetchCountriesByRegion("/region/Asia");
});

europeEl.addEventListener("click", () => {
    fetchCountriesByRegion("/region/Europe");
});

africaEl.addEventListener("click", () => {
    fetchCountriesByRegion("/region/Africa");
});

americasEl.addEventListener("click", () => {
    fetchCountriesByRegion("/region/Americas");
});

worldEl.addEventListener("click", () => {
    fetchCountriesByRegion("");
});

async function fetchCountriesByRegion(region) {
    try {
        const regionData = await axios.get('https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1' + region);
        dropDownListEl.innerHTML = "";
        myChart.destroy();
        const graphLabelsArr = [[],[]];
        const graphDataArr = [];
        for (let country of regionData.data) {
            const dropDownOptionEl = document.createElement("option");
            dropDownListEl.appendChild(dropDownOptionEl);
            dropDownOptionEl.textContent = country.name.common;
            graphLabelsArr[0].push(country.name.common);
            graphLabelsArr[1].push(country.cca2);
        }
        for (let country of graphLabelsArr[1]) {
            if (country == "XK") {
                continue;
            }
            const countryCovidData = await axios.get('https://intense-mesa-62220.herokuapp.com/http://corona-api.com/countries/' + country);
            graphDataArr.push(countryCovidData.data.data.latest_data[graphFor]);
        }
        const graphColorsArr = grabRandomColors(graphDataArr.length);
        drawGraph(graphType, graphLabelsArr[0], graphFor, graphDataArr, graphColorsArr);
    } catch (err) {
        console.log("failed", err);
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