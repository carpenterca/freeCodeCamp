const streamers = ["wunyu", "Quin69", "Sco", "GingiTV", "imaqtpie", "Faker", "freecodecamp", "funfunfunction", "day9tv", "kinenz", "boogie2988", "novawar", "lagtvmaximusblack", "technicalalpha", "disguisedtoasths", "trumpsc", "itmejp", "towelliee", "asmongold", "anniefuchsia"];
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
        getOfflineStreamers();
      } else if (currentView === "search") {
        //console.log(offlineStreams);
        getOfflineStreamers();
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
        // check for bad accounts
        if (checkAccountStatus(jsonData)) {
          displayOfflineStreamers(jsonData, offlineStreams[i]);
        }
      },
      error: function() {
        displayCallError();
      }
    });
  }
}

function displayLiveStreamers(jsonData, streamerName) {
  let timestamp = new Date().toLocaleString();
  $("div#online-streamers").append('<div class="streamer" id="' + streamerName + '"></div>');
  $("#" + streamerName).append('<a class="stream-link-top" target="_blank" href="' + jsonData.stream['channel'].url + '"><div class="standard-view" id="standard-view-' + streamerName + '"></div></a>');
  $("#standard-view-" + streamerName).append('<img class="user-img" src="' + jsonData.stream['channel'].logo + '"></img>');
  $("#standard-view-" + streamerName).append('<div class="standard-view-text" id="standard-view-text-' + streamerName + '"></div>');
  $("#standard-view-text-" + streamerName).append('<h2 class="streamer-name" id="user-' + streamerName + '">' + jsonData.stream['channel'].display_name + '</h2>');
  $("#standard-view-text-" + streamerName).append('<p class="streamer-status" id="status-' + streamerName + '"><span class="fa fa-circle" aria-hidden="true"></span>' + "&nbsp;&nbsp;LIVE" + '</p>');
  $("#standard-view-" + streamerName).append('<div style="clear: both;"></div>');
  $("#" + streamerName).append('<p class="streamer-playing" id="playing-' + streamerName + '"></p>');
  $("#" + streamerName).append('<a class="stream-link" target="_blank" href="' + jsonData.stream['channel'].url + '"><img class="stream-preview-img" src="' + jsonData.stream['preview'].large + '?lastmod=' + timestamp + '"></img></a>');

  $("#playing-" + streamerName).append('<p class="stream-game" id="game-' + streamerName + '">Playing: ' + jsonData.stream['channel'].game + '</p>');
  // limit stream title to 2 lines
  let streamTitle = jsonData.stream['channel'].status;
  if (jsonData.stream['channel'].status.length > 69) {
    streamTitle = streamTitle.toString().slice(0, 63) + "...";
  }
  $("#playing-" + streamerName).append('<p class="stream-status" id="title-' + streamerName + '">\"' + streamTitle + '\"</p>');
  $("#playing-" + streamerName).append('<p class="stream-views" id="viewer-count-' + streamerName + '">Viewers: ' + jsonData.stream.viewers + '</p>');
}

function displayOfflineStreamers(jsonData, streamerName) {
  //console.log(jsonData);
  $("div#offline-streamers").append('<div class="streamer" id="' + streamerName + '"></div>');
  $("#" + streamerName).append('<div class="standard-view" id="standard-view-' + streamerName + '"></div>');
  $("#standard-view-" + streamerName).append('<img class="user-img" src="' + jsonData.logo + '"></img>');
  $("#standard-view-" + streamerName).append('<a class="stream-link-top" target="_blank" href="https://www.twitch.tv/' + streamerName + '"><div class="standard-view-text" id="standard-view-text-' + streamerName + '"></div></a>');
  $("#standard-view-text-" + streamerName).append('<h2 class="streamer-name" id="user-' + streamerName + '">' + jsonData.display_name + '</h2>');
  $("#standard-view-text-" + streamerName).append('<p class="streamer-status" id="status-' + streamerName + '">' + "Offline" + '</p>');
  $("#standard-view-" + streamerName).append('<div style="clear: both;"></div>');
  //if (jsonData.bio !== null) {
  if (jsonData.bio !== null) {
    $("div#" + streamerName).append('<p class="stream-description" id="decscription-' + streamerName + '">' + jsonData.bio + '</p>');
    if (currentView === "search") {
      $("#" + streamerName).css("min-height", "50px");
    }
  } else {
    if (currentView === "search") {
      // remove border sperating bio if there is no bio given
      $("#standard-view-" + streamerName).removeClass("standard-view");
      $("#standard-view-" + streamerName).addClass("standard-view-nobio");
      $("#" + streamerName).css("min-height", "50px");
    }
  }
}

function displayCallError() {
  $("div#streamers").html("");
  $("div#streamers").append('<p>' + "Data Not Retrieved." + '</p>');
}

function checkAccountStatus(jsonData) {
  if (jsonData.status === 400) {
    $("div#online-streamers").html("");
    $("div#offline-streamers").html("");
    $("#error-info").html("Invalid search.<br><br>Spaces are not valid in account names.").show();
    return false;
  }
  else if (jsonData.status === 404) {
    $("div#online-streamers").html("");
    $("div#offline-streamers").html("");
    $("#error-info").html("Account does not exist.<br><br>Check the spelling and try again.").show();
    return false;
  }
  else if (jsonData.status === 422) {
    $("div#online-streamers").html("");
    $("div#offline-streamers").html("");
    $("#error-info").html("Account has been deleted.").show();
    return false;
  }
  else {
    return true;
  }
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

/*function trimStreamTitle(str) {

}*/

// to debug time sensitive code
function startTime() {
  let debugTime= new Date().toLocaleString();
  console.log(debugTime);
}
