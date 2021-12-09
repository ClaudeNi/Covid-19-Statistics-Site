// https://intense-mesa-62220.herokuapp.com/

const allBtns = [];

setUpSite();
function setUpSite() {
    const asiaEl = document.createElement("button");
    document.body.appendChild(asiaEl);
    asiaEl.textContent = "Asia";

    const europeEl = document.createElement("button");
    document.body.appendChild(europeEl);
    europeEl.textContent = "Europe";

    const africaEl = document.createElement("button");
    document.body.appendChild(africaEl);
    africaEl.textContent = "Africa";

    const americasEl = document.createElement("button");
    document.body.appendChild(americasEl);
    americasEl.textContent = "Americas";

    const worldEl = document.createElement("button");
    document.body.appendChild(worldEl);
    worldEl.textContent = "World";
}

async function fetchCountriesByRegion(region) {
    try {
        const regionData = await axios.get('https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/' + region);
        console.log(regionData);
    } catch (err) {
        console.log("failed", err);
    }
}

fetchCountriesByRegion("Asia");