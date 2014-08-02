$(function() {
	reloadMovie();
});


$('#post_movie').click(function (){
	postMovie();
});


function reloadMovie() {
		$.ajax({
		type: "GET",
		url: "/v1/movies",
		success: function(data) {
			console.log(data);
			renderMovies(data);
		},
		error: function(err) {
			console.log("error: "+err);
		}
	});

	function renderMovies(movies) {
		$('#container').text("");
		$.each(movies, function() {
			var templateHtml = $('#movieTemplate').html(),
		        template = $.templates(templateHtml),
		        html = template.render(this),
		        $div = $('#container');
		    $div.append(html);
		});
	}
}

function postMovie() {
	var url = $('input[name="url"]').val();
	console.log("url: "+url);

	$.ajax({
	type: "POST",
	data: {url:url},
	url: "/v1/movies",
	success: function(data) {
		console.log(data);
		reloadMovie();
	},
	error: function(err) {
		console.log("error: "+err);
	}
});
}