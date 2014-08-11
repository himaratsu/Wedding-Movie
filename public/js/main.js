var nowPage;
var movies = Array();

$(function() {
	reloadMovie();
});


function onJSClientLoad() {
    gapi.client.load('youtube', 'v3', function(){
    	var SERVER_KEY = 'AIzaSyDAw4FMFn0xxuNrx_BTC4rBvFc9sElRhds';
    	gapi.client.setApiKey(SERVER_KEY);
    	console.log("set api key");

        searchMovie();
    });
}

// Search for a specified string.
function searchMovie() {
  var q = "結婚式の余興";
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet',
    order: 'rating',
    maxResults: '50'
  });

  request.execute(function(response) {
    var str = JSON.stringify(response.result);

    var videos = response.result.items;
    var isExistMovie = 0;

    for (i=0; i<videos.length; i++) {
    	var video = videos[i];
    	isExistMovie = 0;

    	for (j=0; j<movies.length; j++) {
    		if (video.id.videoId == movies[j].youtubeId) {
    			isExistMovie = 1;
    			break;
    		}
	   	}
	   	console.log(video.id.videoId + " / " + video.snippet.title);
 
 		if (isExistMovie == 1) {
 			console.log("すでに登録済の動画");
 		}
 		else {
 			console.log("新しく登録しました");
 			console.log(video.id.videoId + " / " + video.snippet.title);

 			var videoUrl = "https://www.youtube.com/watch?v=" + video.id.videoId;
 			sendNewMovie(videoUrl);
 			break;
 		}
	}
  });
}

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

	for(var i = 0; i < movies.length; i++){
		var movie = movies[i];
		if (movie.url == url) {
			alert('この動画は既に登録されています');
			console.log("movie already exist!");
			return;
		}
	};

	sendNewMovie(url);
}

function sendNewMovie(url) {
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
			console.log(err);
			alert('URLが不正です\nyoutubeのurl以外は登録できません');
		}
	});
}