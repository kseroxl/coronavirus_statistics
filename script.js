const select = document.getElementById("select");
const casesElement = document.getElementById("cases");
const deathsElement = document.getElementById("deaths");
const todayCasesElement = document.getElementById("todayCases");
const todayDeathsElement = document.getElementById("todayDeaths");
const allCases = document.getElementById("allCases");
const allDeaths = document.getElementById("allDeaths");

var cases;
var deaths;
var todayCases;
var todayDeaths;

var allcases;
var alldeaths;

var code = "";

function setHTML(cases, deaths) {
  allCases.innerHTML =
    '<p>Cases: <span class="numbers">' + `${cases}` + " </span></p>";
  allDeaths.innerHTML =
    '<p>Deaths: <span class="numbers">' + `${deaths}` + " </span></p>";
}

function getAllFirst() {
  fetch(`https://coronavirus-19-api.herokuapp.com/all`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      allcases = data.cases;
      alldeaths = data.deaths;
      var myObject = {
        Cases: 0,
        Deaths: 0
      };

      anime({
        targets: myObject,
        Cases: allcases,
        Deaths: alldeaths,
        easing: "linear",
        round: 1,
        update: function() {
          setHTML(myObject.Cases, myObject.Deaths);
        }
      });
    });
}

function getAll() {
  fetch(`https://coronavirus-19-api.herokuapp.com/all`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      setHTML(data.cases, data.deaths);
    });
}

function getFlag(country) {
  let promise = fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data[0].alpha2Code) {
        code = data[0].alpha2Code.toLowerCase();
        select.style.backgroundImage = `url(https://www.countryflags.io/${code.toLowerCase()}/flat/48.png)`;
      }
    });
}

function getCoronavirusCountries() {
  return fetch("https://coronavirus-19-api.herokuapp.com/countries")
    .then(response => {
      return response.json();
    })
    .then(data => {
      const countries = [];
      data.forEach(entry => {
        countries.push(entry.country);
      });
      countries.sort().forEach(country => {
        var opt = document.createElement("option");
        opt.value = country;
        opt.innerHTML = country;
        if (country === "Ukraine") opt.selected = "selected";
        select.appendChild(opt);
      });
    });
}

function getCoronavirusData(country) {
  getFlag(country);
  let countryData;
  return fetch("https://coronavirus-19-api.herokuapp.com/countries")
    .then(response => {
      return response.json();
    })
    .then(data => {
      countryData = data.find(entry => {
        return entry.country === country;
      });

      cases = countryData.cases;
      deaths = countryData.deaths;
      todayCases = countryData.todayCases;
      todayDeaths = countryData.todayDeaths;
      var myObject = {
        Cases: 0,
        Deaths: 0,
        "Cases today": 0,
        "Deaths today": 0
      };

      anime({
        targets: myObject,
        Cases: cases,
        Deaths: deaths,
        "Cases today": todayCases,
        "Deaths today": todayDeaths,
        easing: "linear",
        round: 1,
        update: function() {
          casesElement.innerHTML =
            '<p>Cases: <span class="numbers">' +
            `${myObject.Cases}` +
            " </span></p>";
          deathsElement.innerHTML =
            '<p>Deaths: <span class="numbers">' +
            `${myObject.Deaths}` +
            " </span></p>";
          todayCasesElement.innerHTML =
            '<p>Today cases: <span class="numbers">' +
            `${myObject["Cases today"]}` +
            " </span></p>";
          todayDeathsElement.innerHTML =
            '<p>Today deaths: <span class="numbers">' +
            `${myObject["Deaths today"]}` +
            " </span></p>";
        }
      });
    });
}
getCoronavirusCountries();
getAllFirst();

setInterval(() => {
  getAll();
}, 2000);

getCoronavirusData("Ukraine");
select.addEventListener("change", () => {
  getCoronavirusData(select.value);
});
