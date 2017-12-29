const streamers = ["freecodecamp", "day9tv", "kinenz", "boogie2988", "novawar", "lagtvmaximusblack", "technicalalpha", "disguisedtoasths", "trumpsc", "itmejp", "towelliee", "asmongold", "anniefuchsia"];
//funfunfunction, Faker
let liveStreams = []; // if live add to array, if present in offlineStreams then remove from array
let offlineStreams = [];
let callsCompleted = 0;
let currentView = "home";
let t;

function initStreamHome() {
  currentView = "home";
  document.getElementById('search').value = "";
  $("#page-title").show();
  $("#filter-btns").show();
  showAllStreams();

  for (let i = 0; i < streamers.length; i++) {
    getLiveStreamers(streamers[i]);
  }
  // update streams every 5 minutes
  clearTimeout(t);
  t = setTimeout(function() {
    startTime();
    if (currentView === "home") {
      initStreamHome();
    }
  }, 300000);
}

function getLiveStreamers(streamerName) {
  // reset data
  $("div#online-streamers").html("");
  $("div#offline-streamers").html("");
  $("#error-info").hide();
  offlineStreams = [];
  callsCompleted = 0;

  let userURL = "https://wind-bow.glitch.me/twitch-api/streams/" + streamerName;
  $.ajax({
    type: 'GET',
    url: userURL,
    dataType: 'json',
    success: function(jsonData) {
      //console.log(jsonData);
      if (typeof jsonData.stream !== 'undefined' && jsonData.stream !== null ) {
        displayLiveStreamers(jsonData, streamerName);
      } else {
        offlineStreams.push(streamerName);
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      displayCallError();
    },
    complete: function () {
      callsCompleted++;
      if (currentView === "home" && callsCompleted === streamers.length) {
        //console.log(offlineStreams);
        setUpOfflineStreamers();
      } else if (currentView === "search") {
        //console.log(offlineStreams);
        setUpOfflineStreamers();
      }
    }
  });
}

function getOfflineStreamers() {
  for (let i = 0; i < offlineStreams.length; i++) {
    let userURL = "https://wind-bow.glitch.me/twitch-api/users/" + offlineStreams[i];
    $.ajax({
      type: 'GET',
      url: userURL,
      dataType: 'json',
      success: function(jsonData) {
        displayOfflineStreamers(jsonData, offlineStreams[i]);
      },
      error: function() {
        displayCallError();
      }
    });
  }
}

function setUpOfflineStreamers() {
  for (let j = 0; j < offlineStreams.length; j++) {
    $("div#offline-streamers").append('<div class="streamer" id="' + offlineStreams[j] + '"></div>');
    $("#" + offlineStreams[j]).append('<div class="standard-view" id="standard-view-' + offlineStreams[j] + '"></div>');
  }
  getOfflineStreamers();
}

function displayLiveStreamers(jsonData, streamerName) {
  let timestamp = new Date().toLocaleString();
  $("div#online-streamers").append('<div class="streamer" id="' + streamerName + '"></div>');
  $("#" + streamerName).append('<a class="stream-link" target="_blank" href="' + jsonData.stream['channel'].url + '"><div class="standard-view" id="standard-view-' + streamerName + '"></div></a>');
  $("#standard-view-" + streamerName).append('<img class="user-img" src="' + jsonData.stream['channel'].logo + '"></img>');
  $("#standard-view-" + streamerName).append('<div class="standard-view-text" id="standard-view-text-' + streamerName + '"></div>');
  $("#standard-view-text-" + streamerName).append('<h2 class="streamer-name" id="user-' + streamerName + '">' + jsonData.stream['channel'].display_name + '</h2>');
  $("#standard-view-text-" + streamerName).append('<p class="streamer-status" id="status-' + streamerName + '"><span class="fa fa-circle" aria-hidden="true"></span>' + "&nbsp;&nbsp;LIVE" + '</p>');
  $("#standard-view-" + streamerName).append('<div style="clear: both;"></div>');
  $("#" + streamerName).append('<p class="streamer-playing" id="playing-' + streamerName + '"></p>');
  //$("div#" + streamers[i]).append('<p class="stream-description" id="decscription-' + streamers[i] + '">' + jsonData.stream[i]['channel'].description + '</p>');
  $("#" + streamerName).append('<a class="stream-link" target="_blank" href="' + jsonData.stream['channel'].url + '"><img class="stream-preview-img" src="' + jsonData.stream['preview'].medium + '?lastmod=' + timestamp + '"></img></a>');

  $("#playing-" + streamerName).append('<p class="stream-game" id="game-' + streamerName + '">Playing: ' + jsonData.stream['channel'].game + '</p>');
  $("#playing-" + streamerName).append('<p class="stream-status" id="title-' + streamerName + '">\"' + jsonData.stream['channel'].status + '\"</p>');
  $("#playing-" + streamerName).append('<p class="stream-views" id="viewer-count-' + streamerName + '">Viewers: ' + jsonData.stream.viewers + '</p>');
}

function displayOfflineStreamers(jsonData, streamerName) {
  if (jsonData.status === 422) {
    $("div#online-streamers").html("");
    $("div#offline-streamers").html("");
    $("#error-info").html("Account has been deleted.").show();
  }
  else if (jsonData.status !== 404) {
    //console.log(jsonData);
    $("#standard-view-" + streamerName).append('<img class="user-img" src="' + jsonData.logo + '"></img>');
    $("#standard-view-" + streamerName).append('<a class="stream-link" target="_blank" href="https://www.twitch.tv/' + streamerName + '"><div class="standard-view-text" id="standard-view-text-' + streamerName + '"></div></a>');
    $("#standard-view-text-" + streamerName).append('<h2 class="streamer-name" id="user-' + streamerName + '">' + jsonData.display_name + '</h2>');
    $("#standard-view-text-" + streamerName).append('<p class="streamer-status" id="status-' + streamerName + '">' + "Offline" + '</p>');
    $("#standard-view-" + streamerName).append('<div style="clear: both;"></div>');
    if (jsonData.bio !== null) {
      $("div#" + streamerName).append('<p class="stream-description" id="decscription-' + streamerName + '">' + jsonData.bio + '</p>');
    } else {
      // remove border sperating bio if there is no bio given
      $("#standard-view-" + streamerName).removeClass("standard-view");
      $("#standard-view-" + streamerName).addClass("standard-view-nobio");
    }
  } else {
    $("div#online-streamers").html("");
    $("div#offline-streamers").html("");
    $("#error-info").html("Account does not exist.<br><br>Check the spelling and try again.").show();
  }
}

function displayCallError() {
  $("div#online-streamers").html("");
  $("div#offline-streamers").html("");
  $("div#streamers").append('<p>' + "Data Not Retrieved." + '</p>');
}

function searchStreamer() {
  let streamerRequested = (document.getElementById('search').value).toLowerCase();
  // make sure user typed in searchable text
  if (streamerRequested.trim() !== "") {
    // set view to search
    currentView = "search";
    $("#page-title").hide();
    $(".online-status").hide();
    $("#filter-btns").hide();
    getLiveStreamers(streamerRequested);
  }
}

function showAllStreams() {
  $("#online-streamers").show();
  $("#online-title").show();
  $("#offline-streamers").show();
  $("#offline-title").show();
}

function showOnlineStreams() {
  $("#online-streamers").show();
  $("#online-title").show();
  $("#offline-streamers").hide();
  $("#offline-title").hide();
}

function showOfflineStreams() {
  $("#offline-streamers").show();
  $("#offline-title").show();
  $("#online-streamers").hide();
  $("#online-title").hide();
}

// to debug time sensitive code
function startTime() {
  let debugTime= new Date().toLocaleString();
  console.log(debugTime);
}
