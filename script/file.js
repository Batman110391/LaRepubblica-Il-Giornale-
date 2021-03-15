const KEY_METEO = "c3ad6f2161d9bb80af798abe7a163c18";
const URL_DEFAULT = `https://api.allorigins.win/get?url=${encodeURIComponent(
  "http://newsapi.org/v2/top-headlines?country=it&apiKey=be9d28385d514cd3907dca50361cfb87"
)}`;
const CITY = ["Roma", "Napoli", "Milano", "Torino", "Palermo", "Firenze"];
const CATEGORY = [
  "primo piano",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

window.onload = () => {
  appendCategory();
  getNews(URL_DEFAULT);
  getDate();
  getWeather();
  document.querySelectorAll("input").forEach((i) => {
    i.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        appendSearch(e.target.value);
        $("#sidebar").collapse("hide");
      }
    });
  });
};

function getText() {
  document.querySelectorAll(".form-control").forEach((t) => {
    if (t.value != "") {
      appendSearch(t.value);
      $("#sidebar").collapse("hide");
    }
  });
}

function appendSearch(text) {
  document.querySelectorAll(".form-control").forEach((t) => {
    t.value = "";
  });

  var q =
    "https://newsapi.org/v2/everything?q=" +
    text +
    "&sortBy=publishedAt&language=it&apiKey=be9d28385d514cd3907dca50361cfb87";
  var url_search = `https://api.allorigins.win/get?url=${encodeURIComponent(
    q
  )}`;

  getNews(url_search);
  changeCategory(text);
}

function appendCategory() {
  CATEGORY.forEach((c) => {
    document.getElementById(
      "category"
    ).innerHTML += `<h5 onclick="Category('${c}')">${c}</h5>`;
    document.getElementById(
      "category-sidebar"
    ).innerHTML += `<div class="col-6 p-2 bd-b">
    <p data-bs-toggle="collapse" data-bs-target="#sidebar" onclick="Category('${c}')">${c}</p>
    </div>`;
  });
}

function Category(category) {
  var url =
    "http://newsapi.org/v2/top-headlines?country=it&category=" +
    category +
    "&apiKey=be9d28385d514cd3907dca50361cfb87";

  var decode_url = `https://api.allorigins.win/get?url=${encodeURIComponent(
    url
  )}`;

  if (category == "primo piano") {
    getNews(URL_DEFAULT);
  } else {
    getNews(decode_url);
  }

  changeCategory(category);
}

function changeCategory(category) {
  document.getElementById("title-category").textContent = category;
}

function getNews(url) {
  fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      var news = JSON.parse(data.contents);
      appendNews(news);
    });
}

function appendNews(news) {
  if (news.articles.length > 0) {
    document.getElementById("content-news-first").innerHTML = "";
    document.getElementById("content-news-second").innerHTML = "";
  } else {
    return;
  }

  noFade();
  var count = 0;

  news.articles.forEach((n) => {
    if (count == 0 && n.url) {
      document.getElementById(
        "content-news-first"
      ).innerHTML += `<div class="col-8 bd-r">
      <div class="main-news p-1">
      <img
      src="${n.urlToImage}"
      alt="${n.urlToImage}"
      />
      <a href="${n.url}" target="_blank">
      <h3>
      ${n.title}
      </h3>
      </a>
      <p>
      ${n.description}
      </p>
      </div>
      </div>
      </div>`;
      count++;
    } else if (count == 1 && n.url) {
      document.getElementById(
        "content-news-first"
      ).innerHTML += `<div id="content-news" class="col-4">
      <div class="secondary-news p-1 bd-b">
      <img
      src="${n.urlToImage}"
      alt="${n.urlToImage}"
      />
      <a href="${n.url}" target="_blank">
      <h4>
      ${n.title}
      </h4>
      </a>
      <p>
      ${n.description}
      </p>
      </div>`;
      count++;
    } else if (count == 2 && n.url) {
      document.getElementById("content-news").innerHTML += `<div class="col-4">
      <div class="secondary-news p-1">
      <img
      src="${n.urlToImage}"
      alt="${n.urlToImage}"
      />
      <a href="${n.url}" target="_blank">
      <h4>
      ${n.title}
      </h4>
      </a>
      <p>
      ${n.description}
      </p>
      </div>`;
      count++;
    } else if (count > 2 && n.url) {
      document.getElementById(
        "content-news-second"
      ).innerHTML += `<div class="latest-news">
      <img
      src="${n.urlToImage}"
      alt="${n.urlToImage}"
      />
      <a href="${n.url}" target="_blank">
      <h6>
      ${n.title.length > 150 ? n.title.substring(0, 150) + "..." : n.title}
      </h6>
      </a>
      
      </div>`;
      count++;
    }
  });
}

function openNews(title, src) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("frame-news").src = src;
}

function closeNews() {
  document.getElementById("frame-news").src = "";
}

function getDate() {
  var data = new Date();
  var gg, mm, aaaa;
  gg = data.getDate();
  mm = data.getMonth();
  aaaa = data.getFullYear();
  var mesi = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novemvre",
    "Dicembre",
  ];
  document.getElementById("data").textContent =
    (gg < 10 ? "0" + gg : gg) + " " + mesi[mm] + " " + aaaa;
}

function getWeather() {
  var randomCity = CITY[Math.floor(Math.random() * CITY.length)];
  let country = "IT";
  let baseURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    randomCity +
    "," +
    country +
    "&appid=" +
    KEY_METEO;

  fetch(baseURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        console.log("Richiesta errata");
      }
    })
    .then((city) => {
      document.getElementById("gradi-img").src =
        "http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png";
      document.getElementById("gradi").textContent =
        parseInt(city.main.temp) - 273 + "°";
      document.getElementById("city").textContent = city.name;
    })
    .catch((error) => console.log(error));
}

function noFade() {
  document.querySelector(".fade-pages").style = "opacity: 0; z-index: -1";
  document.querySelector("body").style = "overflow-y: visible";
}

function fade() {
  document.querySelector(".fade-pages").style =
    "opacity: 1!important; z-index: 10";
  document.querySelector("body").style = "overflow-y: hidden";
}
