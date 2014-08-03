var nowPage;
var movies = Array();

$(function() {
	reloadMovie();
});

$('#post_movie').click(function (){
	postMovie();
});

$('.movieContent').hover(function() {
	$(this).addClass("hover");
}, function() {
	if ($(this).hasClass("hover")) {
		$(this).removeClass("hover")
	}
});

$('#go-next').click(function (){
	if ($(this).hasClass('disable')) {
		return;
	}
	nowPage++;
	renderMovies();
});

$('#go-prev').click(function (){
	if ($(this).hasClass('disable')) {
		return;
	}
	nowPage--;
	renderMovies();
});

function setPagingEnable() {
	var total = movies.length;

	// 戻るボタンの表示/非表示
	var prevBtn = $('#go-prev');
	if (nowPage <= 0) {
		prevBtn.addClass('disable');
	}
	else {
		if (prevBtn.hasClass('disable')) {
			prevBtn.removeClass('disable');
		}
	}

	var nextBtn = $('#go-next');
	console.log("total: ", total);
	if ((nowPage+1)*4 >= total) {
		nextBtn.addClass('disable');
	}
	else {
		if (nextBtn.hasClass('disable')) {
			nextBtn.removeClass('disable');
		}
	}
}

function getUrlVars() 
{ 
    var vars = [], hash; 
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); 
    for(var i = 0; i < hashes.length; i++) { 
        hash = hashes[i].split('='); 
        vars.push(hash[0]); 
        vars[hash[0]] = hash[1]; 
    } 
    return vars; 
}

function reloadMovie() {
	nowPage = 0;

	$.ajax({
		type: "GET",
		url: "/v1/movies",
		success: function(data) {
			console.log(data);
			movies = data;
			renderMovies();
		},
		error: function(err) {
			console.log("error: "+err);
		}
	});
}

function renderMovies() {
	var targetMovies = movies.slice((nowPage*4), (nowPage*4)+4);

	$('#container').text("");
	$.each(targetMovies, function() {
		var templateHtml = $('#movieTemplate').html(),
	        template = $.templates(templateHtml),
	        html = template.render(this),
	        $div = $('#container');
	    $div.append(html);
	});

	// to top
	$("body").scrollTop(0);

	setPagingEnable();
}

function postMovie() {
	var url = $('input[name="url"]').val();

	$.ajax({
	type: "POST",
	data: {url:url},
	url: "/v1/movies",
	success: function(data) {
		console.log(data);
		reloadMovie();

		// clear text
		$('input[name="url"]').val("");
	},
	error: function(err) {
		console.log("err[0]:" + err.message);
		console.log("error: "+err.message);
		
	}
});
}