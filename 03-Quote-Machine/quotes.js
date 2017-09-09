$(document).ready(function() {
	var randomQuote = "";
	var randomAuthor = "";
	var quotesUsed = [];
	var previousQuote = -1;

	function getQuote() {
		var quotes = [
			"Art is how we decorate space; music is how we decorate time",
			"May you pick up your tea when it’s exactly the right temperature, and may you happen to glance out the window when the light is just how you like it",
			"I walk through the wilderness, my eyes and my heart are pulled towards the thicket, the ever-changing landscapes, the gentle daisy and the old beloved stones; as I marvel at the timeless complexities of creation, Nature never disappoints me",
			"Nature is not a place to visit. It is home",
			"An early morning walk is a blessing for the whole day",
			"Nature does not hurry, yet everything is accomplished",
			"In all things of nature there is something of the marvelous",
			"Look deep into nature, and then you will understand everything better",
			"The trees that are slow to grow bear the best fruit",
			"There is pleasure in the pathless woods, there is rapture in the lonely shore, there is society where none intrudes, by the deep sea, and music in its roar; I love not Man the less, but Nature more",
			"Nature has been for me, for as long as I remember, a source of solace, inspiration, adventure, and delight; a home, a teacher, a companion",
			"Nature gives to every time and season some beauties of its own",
			"When one loses the deep intimate relationship with nature, then temples, mosques and churches become important",
			"We are part of this universe; we are in this universe, but perhaps more important than both of those facts, is that the universe is in us"
		];
		var author = [
			"just-shower-thoughts",
			"casual blessing",
			"Amelia Dashwood",
			"Gary Snyder",
			"Henry David Thoreau",
			"Lao Tzu",
			"Aristotle",
			"Albert Einstein",
			"Moliere",
			"Lord Byron",
			"Lorraine Anderson",
			"Charles Dickens",
			"Jiddu Krishnamurti"
			"Neil deGrasse Tyson"
		];

		var randomNumber = Math.floor(Math.random() * quotes.length);

		//don't allow for quotes to be repeated
		while (previousQuote == randomNumber || quotesUsed.includes(randomNumber)) {
			randomNumber = Math.floor(Math.random() * quotes.length);
		}
		//keep track of quotes used
		quotesUsed.push(randomNumber);
		previousQuote = randomNumber;
		//if all quotes have been used, empty the list
		if(quotesUsed.length == quotes.length) {
			quotesUsed = [];
		}

		randomQuote = quotes[randomNumber];
		randomAuthor = author[randomNumber];

		$(".quote").animate({opacity: 0}, 300, function() {
			$(this).animate({opacity: 1}, 300);
			$('.quote').text(randomQuote);
		});

		$(".author").animate({opacity: 0}, 300, function() {
			$(this).animate({opacity: 1}, 300);
			$('.author').html(randomAuthor);
		});
	} //end getQuote

	$(".owl-button").on("click", function() {
		getQuote();
		$(".social-media").show();
	});

	$(".tweet").on("click", function() {
		window.open(
			"https://twitter.com/intent/tweet?text=" +
			"\"" + randomQuote + "\"" + " - " + randomAuthor
			);
	});

	$(".tumblr").on("click", function() {
		window.open(
				"https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quote," + randomAuthor +
				"&caption=" +randomAuthor +
				'&content=' + randomQuote +
				'&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button'
			);
	});

});
