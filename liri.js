require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var input = process.argv;
var action = input[2];
var inputs = input[3];

for (var i = 4; i < input.length; i++) {
  inputs += "+" + input[i];
}

switch (action) {
  case "concert-this":
    bandsInTown(inputs);
    break;
  case "spotify-this-song":
    playSong(inputs);
    break;
  case "movie-this":
    showMovie(inputs);
    break;
  case "do-what-it-says":
    doThing(inputs);
    break;
  default:
    console.log(
      "{Please enter a command: concert-this, spotify-this-song, movie-this, do-what-it-says}"
    );
    break;
}

function bandsInTown(input) {
  if (!input) {
    input = "";
  }
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        input +
        "/events?app_id=" +
        keys.bandsintown.appID
    )
    .then(function(response) {
      var data = response.data[0];
      console.log("Venue Name: " + data.venue.name);
      console.log("Venue Location: " + data.venue.city);
      console.log("Date: " + moment(data).format("MM/DD/YYYY"));
    })
    .catch(function(error) {
      return console.log("Error occurred: " + error);
    });
}

function playSong(input) {
  if (!input) {
    input = "The Sign Ace of Base";
  }
  spotify.search({ type: "track", query: input }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    var song = data.tracks.items[0];
    console.log("Artist: " + song.artists[0].name);
    console.log("Song: " + song.name);
    console.log("Preview URL: " + song.external_urls.spotify);
    console.log("Album: " + song.album.name);
  });
}

function showMovie(input) {
  if (!input) {
    input = "Mr. Nobody";
  }
  axios
    .get("http://www.omdbapi.com/?apikey=" + keys.omdb.appID, {
      params: {
        t: input
      }
    })
    .then(function(response) {
      var data = response.data;
      console.log("Title: " + data.Title);
      console.log("Year: " + data.Year);
      console.log("IMDB Rating: " + data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
      console.log("Country: " + data.Country);
      console.log("Language: " + data.Language);
      console.log("Plot: " + data.Plot);
      console.log("Actors: " + data.Actors);
    })
    .catch(function(error) {
      return console.log("Error occurred: " + error);
    });
}

function doThing() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var txt = data.split(",");
    switch (txt[0]) {
      case "concert-this":
        bandsInTown(txt[1]);
        break;
      case "spotify-this-song":
        playSong(txt[1]);
        break;
      case "movie-this":
        showMovie(txt[1]);
        break;
    }
  });
}
