var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = process.env.PORT || 5000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var token = "L-r_2iO5N7DkmeeHq1V6";
var uri = "https://the-one-api.dev/v2";

// togglePopup
function togglePopup() {
  document.getElementById("popup-1")
      .classList.toggle("active");
}

//call API 
async function callAPI(path) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", uri + "/" + path, false); // false for synchronous request
  xmlHttp.setRequestHeader("Authorization", "Bearer " + token)
  xmlHttp.setRequestHeader("Accept", "application/json")
  xmlHttp.send(null);
  let data = await xmlHttp;
  console.log(JSON.parse(data.response))
  data = JSON.parse(data.response)
  return data
}

var quoteCharacter;
var quoteMovie;
var randomInt;
// get quote 
function getQuote() {
  randomInt = getRandomInt(1000);
  callAPI("quote").then(data => {
      randomQuote = data.docs[randomInt].dialog;
      quoteCharacter = data.docs[randomInt].character;
      quoteMovie = data.docs[randomInt].movie;
      document.getElementById("myQuote").innerHTML = randomQuote;
  });
}

var allCharacters = [];
var characterBox;
function getCharacters() {
  characterBox = document.getElementById("characterName");
  
  var allCharactersResponse = callAPI("character").then(data => {
      allCharacters = data.docs

      for (var i in allCharacters) {
          var option = document.createElement("option");
          option.value = allCharacters[i]._id;
          option.text = allCharacters[i].name;

          characterBox.appendChild(option);
      }
  });
}

var allMovies = [];
var movieBox;
function getMovies() {
  movieBox = document.getElementById("movieName");

  var allMoviesResponse = callAPI("movie").then(data => {
      allMovies = data.docs

      for (var i in allMovies) {
          var option = document.createElement("option");
          option.value = allMovies[i]._id;
          option.text = allMovies[i].name;

          movieBox.appendChild(option);
      }
  });
}

//check quote
function checkQuote() {
  if(characterBox.value == quoteCharacter && movieBox.value == quoteMovie) {
      document.getElementById("userOutput").innerHTML = "Correct!";
      document.getElementById("userOutput").style.color = "#00ff00"; //groen
      winstreakCorrect();
  }
  else if(characterBox.value == quoteCharacter && !(movieBox.value == quoteMovie)) {
      document.getElementById("userOutput").innerHTML = "Het character is correct maar niet de juiste film.";
      document.getElementById("userOutput").style.color = "#ffa500"; //orange
  }
  else if(!(characterBox.value == quoteCharacter) && movieBox.value == quoteMovie) {
      document.getElementById("userOutput").innerHTML = "De film is correct maar niet de juiste character.";
      document.getElementById("userOutput").style.color = "#ffa500"; //orange
  }
  else {
      document.getElementById("userOutput").innerHTML = "Incorrect.";
      document.getElementById("userOutput").style.color = "#ff0000"; //rood
      winstreakWrong();
  }
}

// Notepad show / hide
var notepadStatus;
function show_hide_notepad() {
  if (notepadStatus == 1) {
      document.getElementById("notepad").style.display = "inline";

      return notepadStatus = 0;
  }
  else {
      document.getElementById("notepad").style.display = "none";
      return notepadStatus = 1;
  }
}

//Notepad Textarea opslagen.
function saveNote() {
  var textElement = document.getElementById("noteText").value;
  localStorage.setItem("note", (textElement));
}

//Notepad Text laden in de TextArea (notepad)
function loadTextarea() {
  document.getElementById("noteText").value = localStorage.getItem("note");
}

//Notepads Load Functions
function loadFunctions() {
  show_hide_notepad();
  loadTextarea();
  highestWinstreakScore = localStorage.getItem("highestWinstreakScoreMemory");
  document.getElementById("highest-winstreak").innerHTML = ("Highest Winstreak: " + highestWinstreakScore);
}

//Geen toegang tot de andere paginas
function noAuthorization() {
  alert("Geen toegang")
}

//Winstreak Functions
function winstreakCorrect() {
  winstreakScore++;
  document.getElementById("winstreak").innerHTML = ("Winstreak: " + winstreakScore);

  if (highestWinstreakScore < winstreakScore) {
      highestWinstreakScore = winstreakScore;
      localStorage.setItem("highestWinstreakScoreMemory", (highestWinstreakScore));
      document.getElementById("highest-winstreak").innerHTML = ("Highest Winstreak: " + highestWinstreakScore);
  }
}
function winstreakWrong() {
  winstreakScore = 0;
  document.getElementById("winstreak").innerHTML = ("Winstreak: " + winstreakScore);
}