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

	$.ajax({
	type: "POST",
	data: {url:url},
	url: "/v1/movies",
	success: function(data) {
		console.log(data);
		reloadMovie();
	},
	error: function(err) {
		console.log("err[0]:" + err.message);
		console.log("error: "+err.message);
		
	}
});
}