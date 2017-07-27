$(function() {

	$('a[href*=#]:not([href=#])').click(function() {
	  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	    var target = $(this.hash);
	    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	    if (target.length) {
	      $('html,body').animate({
	        scrollTop: target.offset().top - 80
	      }, 1000);
	      return false;
	    }
	  }
	}); // code courtesy of CSS-Tricks

	// apply the class of nav-active to the current nav link
	$('a').on('click', function(e) {
		e.preventDefault();
		$('li.nav-active').removeClass('nav-active');
		$(this).parent('li').addClass('nav-active');
	});


	// get an array of 'href' of each a tag

	var navLink = $('ul.navHighlighter a');
	console.log(navLink);
	var aArray = [];

	for(var i = 0; i < navLink.length; i++) {
		console.log(i);
		var aChild = navLink[i];
		var navArray = $(aChild).attr('href');
		console.log(navArray);
		aArray.push(navArray);
		console.log(aArray);
		var selector = aArray.join(" , ");
		console.log(selector);
	}

	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();
		var tops = [];

		$(selector).each(function(){
			var top = $(this).position().top -90;
			if(scrollTop > top) {
				var id = $(this).attr('id');
				$('.nav-active').removeClass('nav-active');
				$('a[href="#'+id+'"]').parent().addClass('nav-active');
			}
			tops.push(top);
		});

	});
});
