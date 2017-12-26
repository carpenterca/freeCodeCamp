const searchLimit = 100; // basic max allowed is 100

let searchPage = 1;
let searchMin = 0;
let searchMax = 10;

let title = "";
let searchResults = [];

function searchWiki() {
  // resest search values
  title = document.getElementById('search').value;
  searchPage = 1;
  searchMin = 0;
  searchMax = 10;

  $.ajax({
    url: "https://en.wikipedia.org/w/api.php",
    dataType: "jsonp",
    data: {
        action: "opensearch",
        format: "json",
        limit: searchLimit,
        search: title
    },
    jsonpCallback: "getSearchResults"
  });
}

// store json data to use in pagination
function getSearchResults(jsonData) {
  //console.log(jsonData);
  searchResults = jsonData;
  displayWikiResults();
}

function displayWikiResults() {
  // clear search
  $("div#results").html("");
  // move search bar to top of screen
  document.getElementById("user-input").className = 'active';

  // check if the search is valid
  if (searchResults[1].length < 1) {
    $("div#results").append('<p id="not-found">Search results not found.</p>');
  } else {
    for (let i = searchMin; i < searchMax; i++) {
      if(searchResults[1][i] !== undefined) {
        $("div#results").append('<a class="search-result" target="_blank" href="' + searchResults[3][i] + '">' + '<h3 class="search-title">' + searchResults[1][i] + '</h3>' + '<p class="serach-description">' + searchResults[2][i] + '</p>'+'</a>');
      }
    }
    // Add Pagination for search results
    // add prev button if after first page
    if (searchPage > 1) {
      $("div#results").append('<a id="first" onclick="goToFirstPage()">First</a><a id="prev" class="fa fa-arrow-left" onclick="prevResults()"></a>');
    }
    // add current page number
    $("div#results").append('<span id="page">Page ' + searchPage);
    // add next button if there are more search results
    if (searchPage < Math.ceil(searchResults[1].length / 10) ) {
      $("div#results").append(' </span> <a id="next" class="fa fa-arrow-right" onclick="nextResults()"></a><a id="last" onclick="goToLastPage()">Last</a>');
    }
  }
  $('#results').show('slow');
}

function prevResults() {
  if (searchMin > 0) {
    searchMin -= 10;
    searchMax -=10;
    searchPage--;
    displayWikiResults();
    $("body").scrollTop(0);
  }
}

function nextResults() {
  if (searchMax < searchLimit) {
    searchMin += 10;
    searchMax += 10;
    searchPage++;
    displayWikiResults();
    $("body").scrollTop(0);
  }
}

function goToFirstPage() {
  searchPage = 1;
  searchMin = 0;
  searchMax = 10;
  displayWikiResults();
  $("body").scrollTop(0);
}

function goToLastPage() {
  searchPage = Math.ceil(searchResults[1].length / 10);
  searchMin = searchPage * 10 - 10;
  searchMax = searchPage * 10;
  displayWikiResults();
  $("body").scrollTop(0);
}
