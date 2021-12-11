const proxy = "https://intense-mesa-62220.herokuapp.com/";

const mainDiv = document.createElement("div");  

// loading screen elements
const loadingScreen = document.createElement("div");
const spinnerTextEl = document.createElement("span");
const spinnerEl = document.createElement("img");
spinnerEl.src = "./covid.png";


// regions elements
const regionsDiv = document.createElement("div");
const regionText = document.createElement("span");
const asiaEl = document.createElement("button");
const europeEl = document.createElement("button");
const africaEl = document.createElement("button");
const americasEl = document.createElement("button");
const worldEl = document.createElement("button");

// statistics elements
const statisticsDiv = document.createElement("div");
const statisticsText = document.createElement("span")
const confirmedEl = document.createElement("button");
const deathsEl = document.createElement("button");
const recoveredEl = document.createElement("button");
const criticalEl = document.createElement("button");

// other elements
const dropDownDiv = document.createElement("div");
const dropDownListEl = document.createElement("select");
const firstDropDownOptionEl = document.createElement("option");
const canvasDiv = document.createElement("div");
const canvasEl = document.createElement("canvas");

let myChart = new Chart(canvasEl, {})
let graphType = "bar";
let graphFor = "confirmed";
let currentRegion = "";
let isShowingCountry = false;

appendAllChildren();
giveTexts();
addClasses();

// all the button event listeners
{
    // statistics buttons
    confirmedEl.addEventListener("click", () => {
        statisticsFunction("confirmed");
    });
    deathsEl.addEventListener("click", () => {
        statisticsFunction("deaths");
    });
    recoveredEl.addEventListener("click", () => {
        statisticsFunction("recovered");
    });
    criticalEl.addEventListener("click", () => {
        statisticsFunction("critical");
    });
    
    // region buttons.
    asiaEl.addEventListener("click", () => {
        regionFunction("/region/Asia");
    });
    europeEl.addEventListener("click", () => {
        regionFunction("/region/Europe");
    });
    africaEl.addEventListener("click", () => {
        regionFunction("/region/Africa");
    });
    americasEl.addEventListener("click", () => {
        regionFunction("/region/Americas");
    });
    worldEl.addEventListener("click", () => {
        regionFunction("");
    });
    
    // drop down list selector.
    dropDownListEl.addEventListener("input", (e) => {
        fetchByCountry(e.target.selectedOptions[0].getAttribute("code"));
    });
}

// give text to the necessary elements.
function giveTexts() {
    // loading screen.
    spinnerTextEl.textContent = "Loading...";

    // region buttons texts.
    regionText.textContent = "Choose a region for all the countries in it.";
    asiaEl.textContent = "Asia";
    europeEl.textContent = "Europe";
    africaEl.textContent = "Africa";
    americasEl.textContent = "Americas";
    worldEl.textContent = "World";

    // 4 stats buttons texts.
    statisticsText.textContent = "Choose one of the following options. (confirmed is the default)"
    confirmedEl.textContent = "Confirmed";
    deathsEl.textContent = "Deaths";
    recoveredEl.textContent = "Recovered";
    criticalEl.textContent = "Critical";

    // drop down list text.
    firstDropDownOptionEl.textContent = "Choose a country";
}

// append children, mostly to body.
function appendAllChildren() {
    document.body.appendChild(mainDiv);

    // loading screen.
    mainDiv.appendChild(loadingScreen);
    loadingScreen.appendChild(spinnerTextEl);
    loadingScreen.appendChild(spinnerEl);

    // containers.
    mainDiv.appendChild(regionText);
    mainDiv.appendChild(regionsDiv);
    mainDiv.appendChild(statisticsText);
    mainDiv.appendChild(statisticsDiv);
    mainDiv.appendChild(dropDownDiv);
    mainDiv.appendChild(canvasDiv);

    // region buttons.
    regionsDiv.appendChild(asiaEl);
    regionsDiv.appendChild(europeEl);
    regionsDiv.appendChild(africaEl);
    regionsDiv.appendChild(americasEl);
    regionsDiv.appendChild(worldEl);

    // 4 stats buttons.
    statisticsDiv.appendChild(confirmedEl);
    statisticsDiv.appendChild(deathsEl);
    statisticsDiv.appendChild(recoveredEl);
    statisticsDiv.appendChild(criticalEl);

    // other.
    dropDownDiv.appendChild(dropDownListEl);
}

// add the appropriate classes to style the page.
function addClasses() {
    mainDiv.classList.add("main");

    // loading screen.
    loadingScreen.classList.add("display-none");
    loadingScreen.classList.add("loading-screen");
    spinnerTextEl.classList.add("spinner-text");
    spinnerEl.classList.add("spinner");

    // region elements.
    regionsDiv.classList.add("container");
    regionText.classList.add("title-text");
    asiaEl.classList.add("btn");
    europeEl.classList.add("btn");
    africaEl.classList.add("btn");
    americasEl.classList.add("btn");
    worldEl.classList.add("btn");
    
    // statistics elements.
    statisticsDiv.classList.add("container");
    statisticsText.classList.add("title-text");
    confirmedEl.classList.add("btn");
    deathsEl.classList.add("btn");
    recoveredEl.classList.add("btn");
    criticalEl.classList.add("btn");

    // other elements.
    canvasDiv.classList.add("display-none");
    canvasDiv.classList.add("canvas-container");
    dropDownDiv.classList.add("display-none");
    dropDownDiv.classList.add("container")
}

// region button event listener runner.
function regionFunction(str) {
    fetchByRegion(str);
    currentRegion = str;
}

// statistics button event listener runner.
function statisticsFunction(str) {
    if (graphFor != str || isShowingCountry) {
        graphFor = str;
        fetchByRegion(currentRegion);
    }
}

// a function to get the required covid-19 data on a chosen region with all its countries and call the function to draw the graph.
async function fetchByRegion(region) {
    isShowingCountry = false;
    firstDropDownOptionEl.disabled = false; // makes it so the list starts at this option for it to be disabled later.
    loadingScreen.classList.toggle("display-none"); // shows the loading screen.
    try {
        const regionData = await axios.get(`${proxy}https://restcountries.herokuapp.com/api/v1${region}`); // fetching the countries in a given region.
        dropDownListEl.innerHTML = ""; // clearing the drop down list for a new set of country names.
        dropDownListEl.appendChild(firstDropDownOptionEl);
        myChart.destroy(); // reset the graph.
        const graphLabelsArr = [[],[]];
        const graphDataArr = [];
        for (let country of regionData.data) {
            if (country.cca2 == "XK") { // making sure we dont fetch the data on "XK" country for it doesn't exist in the covid-19 api.
                continue;
            }
            const dropDownOptionEl = document.createElement("option");
            dropDownListEl.appendChild(dropDownOptionEl);
            dropDownOptionEl.textContent = country.name.common; // country English name.
            dropDownOptionEl.setAttribute("code", country.cca2); // country 2 letter code.
            graphLabelsArr[0].push(country.name.common);
            graphLabelsArr[1].push(country.cca2);
        }
        for (let country of graphLabelsArr[1]) {
            const countryCovidData = await axios.get(`${proxy}http://corona-api.com/countries/${country}`); // fetching the covid-19 data.
            graphDataArr.push(countryCovidData.data.data.latest_data[graphFor]);
        }
        const graphColorsArr = grabRandomColors(graphDataArr.length); // grabing a random color for each country.
        drawGraph(graphType, graphLabelsArr[0], graphFor, graphDataArr, graphColorsArr); // drawing the graph.
        canvasDiv.appendChild(canvasEl);
    } catch (err) {
        console.log("failed", err);
    }
    loadingScreen.classList.toggle("display-none"); // hiding the loading screen.
    dropDownDiv.classList.remove("display-none"); // shows the drop down list.
    canvasDiv.classList.remove("display-none"); // shows the canvas.
}

// a function to get the required covid-19 data on a chosen country and call the function to draw the graph.
async function fetchByCountry(country) {
    isShowingCountry = true;
    firstDropDownOptionEl.disabled = true; // makes it so you can't choose the first option.
    loadingScreen.classList.toggle("display-none"); // shows the loading screen.
    try {
        myChart.destroy(); // reset the graph.
        const fetchedCovidyData = await axios.get(`${proxy}http://corona-api.com/countries/${country}`); // fetching the covid-19 data.
        const countryCovidData = fetchedCovidyData.data.data
        const countryDataObj = {
            "Total Cases": countryCovidData.latest_data.confirmed,
            "New Cases": countryCovidData.today.confirmed,
            "Total Deaths": countryCovidData.latest_data.deaths,
            "New Deaths": countryCovidData.today.deaths,
            "Total Recovered": countryCovidData.latest_data.recovered,
            "Total Critical": countryCovidData.latest_data.critical,
        }
        const graphColorsArr = grabRandomColors(6); // grabbing a random colors for each statistic.
        drawGraph(graphType, Object.keys(countryDataObj), countryCovidData.name, Object.values(countryDataObj), graphColorsArr); // drawing the graph.
    } catch (err) {
        console.log("failed to fetch", err);
    }
    loadingScreen.classList.toggle("display-none"); // hiding the loading screen.
}

// draw the graph with the given details.
    // graphType - a string for what type it is, for example bar, pie, etc etc
    // graphLabelsArr - an array with all the country names (could also be the statistics when choosing a country).
    // graphFor - a string for that contains what the statistics is currently showing.
    // graphDataArr - an array with all the covid-19 data.
    // graphColorsArr - an array with random colors for the graph.
function drawGraph(graphType, graphLabelsArr, graphFor, graphDataArr, graphColorsArr) {
    myChart = new Chart(canvasEl, {
        type: graphType,
        data: {
            labels: graphLabelsArr,
            datasets: [{
                label: "Covid-19 " + graphFor,
                data: graphDataArr,
                backgroundColor: graphColorsArr,
                borderColor: ['rgba(0,0,0,1)'],
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

// grab random colors for the graph drawing.
function grabRandomColors(length) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        const rand1 = Math.floor(Math.random() * 255);
        const rand2 = Math.floor(Math.random() * 255);
        const rand3 = Math.floor(Math.random() * 255);
        arr.push(`rgba(${rand1},${rand2},${rand3},0.5)`); // a random color from 3 numbers with some transparency.
    }
    return arr;
}