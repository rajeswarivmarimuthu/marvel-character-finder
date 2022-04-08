// get timestamp
var ts = new Date().getTime();
var privKey = "b864417049b272439dc6bb1fdaee4995343fc50b";
var pubKey = "e096fc0b2d2e3a94fbbc2ce9164e4bef" ;
var message = ts+privKey+pubKey;
var hashKey = CryptoJS.MD5(message);
var characterBaseUrl = "http://gateway.marvel.com/v1/public/characters?"

// global variables
var searchCharName;

// content elements
var charContainerEl = document.getElementById("characterCard");
var charThumbnail = document.getElementById("charImage");
var charName = document.getElementById("charName");
var charDescription = document.getElementById("charDescription");
var charComics = document.getElementById("charComics");

var movieContainerEl = document.getElementById("moviesContainer");

// form elements
var inputEl = document.getElementById("searchCharName");
var buttonEl = document.getElementById("submitBtn");

// event listeners
buttonEl.addEventListener("click", handleSearch);
// TODO history event listeners

// initialize page
init();

// functions
function init() {
    if (window.location.href.includes("index.html")) {
        getLast5FromLocalStorage();
        appendLast5();
    } else {
        searchId();
    }
}

function handleSearch(event) {
    event.preventDefault();
    localStorage.setItem("search-character-name", inputEl.value);
    if (window.location.href.includes("index.html")) {
        window.location.href = "./searchresults.html";
    } else {
        searchId();
    }
}

// main search function
function searchId() {
    var charName = localStorage.getItem("search-character-name");
    var charId;

    for (i = 0; i < characterList.length; i++) {
        if (characterList[i].searchString == charName) {
            charId = characterList[i].id;
            i = characterList.length;
        }
    }
    if (!charId) {
        charName.textContent = "Character Not Found";
        return;
    }

    searchCharacter(charId);
    searchMovie(charName);
}


function searchCharacter(id) {
    var requestById = "http://gateway.marvel.com/v1/public/characters/" + id + "?ts=" + ts + "&apikey=" + pubKey + "&hash=" + hashKey;
    fetch(requestById)
    .then(function (response) {
        return response.json();
    })
    .then(function (d) {
        var characterObj = {
            name: d.data.results[0].name,
            description: d.data.results[0].description,
            thumbnail: d.data.results[0].thumbnail.path + "." + d.data.results[0].thumbnail.extension,
            comics: d.data.results[0].urls[d.data.results[0].urls.length - 1].url
        };

        addToLocalStorage(characterObj)

        charThumbnail.setAttribute("src", characterObj.thumbnail);
        charThumbnail.setAttribute("alt", characterObj.name);

        charName.textContent = characterObj.name;
        charDescription.textContent = characterObj.description;
        charComics.setAttribute("href", characterObj.comics);
    });
}

function searchMovie(query) {
    var requestByQuery = "https://api.themoviedb.org/3/search/movie?api_key=c2d17b4b68756938636de8ad845e6940&query=" + query + "&page=1"
    fetch(requestByQuery)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if(data.results.length === 0) {
            movieContainerEl.textContent = "No Movies Found"; // TODO formatting?
            return;
        }

        movieContainerEl.textContent = "";

        for (i = 0; i < 5; i++) {
            
            var movieDiv = document.createElement("div");
            movieDiv.className = "max-w-sm rounded-lg overflow-hidden hover:bg-red-100 transition duration-200 hover:scale-105 shadow-2xl";

            var movieImg = document.createElement("img");
            movieImg.className = "w-full";
            movieImg.setAttribute("src", "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path);
            movieImg.setAttribute("alt", data.results[i].title + " poster");

            var infoDiv = document.createElement("div");
            infoDiv.className = "px-4 py-4";

            var movieTitle = document.createElement("div");
            movieTitle.className = "font-bold text-xl mb-2";
            movieTitle.textContent = data.results[i].title + " (" + data.results[i].release_date.slice(0, 4) + ")";   
            
            var movieOverview = document.createElement("p");
            movieOverview.className = "text-gray-700 text-base";
            movieOverview.textContent = data.results[i].overview;

            // append elements
            infoDiv.append(movieTitle, movieOverview);
            movieDiv.append(movieImg, infoDiv);
            movieContainerEl.append(movieDiv);
        }
    });
}

// sets character object to local storage
function addToLocalStorage(characterObj) {
    var searchedCharacters = JSON.parse(localStorage.getItem("searched_characters"));
    if (searchedCharacters == null) {
        searchedCharacters = []
    };
    // TODO duplicate searches
    localStorage.setItem("character", JSON.stringify(characterObj));
    searchedCharacters.push(characterObj);
    localStorage.setItem("searched_characters", JSON.stringify(searchedCharacters));
};

// gets last 5 character objects from local storage
function getLast5FromLocalStorage() {
    var storedCharacters = JSON.parse(localStorage.getItem("searched_characters"));
    if (storedCharacters == null) {
        storedCharacters = [];
    } else if (storedCharacters.length > 5) {
        storedCharacters = storedCharacters.slice(-5);
    };
    if (storedCharacters.length > 0) {
        var j = 0;
        var characterOrderDesc = [];
        for (let i = storedCharacters.length - 1; j < storedCharacters.length & j < 5; i--) {
            characterOrderDesc.push(storedCharacters[i]);
            j++;
        }
    }
    return characterOrderDesc;
}

function appendLast5() {
    // TODO
}