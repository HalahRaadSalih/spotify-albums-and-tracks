// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things 
// like attach event listeners and any dom manipulation. 
var spotifyURL =  "https://api.spotify.com/v1";
var artistsPart = "artists";
var albumsPart = "albums";
var searchPart = "search";
var slash = "/";
var tracksPart = "tracks";

(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = spotifyURL+"/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success 
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items' 
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure 
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');

  // These two lines can be deleted. They're mostly for show. 
  console.log("you clicked on:");
  console.log($(event.target).attr('data-spotify-id'));//.attr('data-spotify-id'));
   var artistID = $(event.target).attr('data-spotify-id');

  getArtistAlbums(artistID);
}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */

function getArtistAlbums(artistID){
  var albums = [];
  var albumsArea = $('#albums-and-tracks');

  var albumsRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: spotifyURL+slash+artistsPart+slash+artistID+slash+albumsPart
      });

  
  albumsRequest.done(function(data){
    albums = data.items;

    albums.forEach(function(album){

    displayAlbum(album, albumsArea);

    });
  });

  albumsRequest.error(function (error){
     console.log(error);
  });

  return [];
}
function getAlbumInfo(albumID){
  var promise;

  albumReqeust = $.ajax({
    type: "GET",
    dataType: "json",
    url: spotifyURL+slash+albumsPart+slash+albumID
  });

  promise = albumReqeust.done(function(album){

    return album.release_date;;
  });

  promise = albumReqeust.error(function(error){
    console.log(error);
  });

  return promise;
}

function getTrakcsofAlbum(albumID){
  var tracks;

  tarcksRequest = $.ajax({
    type: "GET",
    dataType: "json",
    url: spotifyURL+slash+albumsPart+slash+albumID+slash+tracksPart
  });

  tracks = tarcksRequest.done(function(data){
    return data.items;
  });

  tracks = tarcksRequest.error({

  });
  
  return tracks;
}


function displayAlbum(album, displayArea){
 //request album info then display albums then get each track
 // of an album and display them
 getAlbumInfo(album.id).then(function(albumInfo){

  var albumLi = $("<li>" + album.name + 
                   " - " + 
                    albumInfo.release_date 
                         + 
                   "</li>");

          albumLi.attr('album-spotify-id', album.id);
          displayArea.append(albumLi);
          albumLi.append($('<ul id="tracks"></ul>'));
        }).then(getTrakcsofAlbum(album.id).then(function(tracks){
            tracks.items.forEach(function(track){
              displayTracks(track,$('#tracks'));
            })
        
        }));
        

}

function displayTracks(track, displayArea){
  var tracksLi = $("<li>" + track.name + "</li>");
  displayArea.append(tracksLi);
}


