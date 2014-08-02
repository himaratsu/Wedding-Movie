console.log("Hello");

$(function() {
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
		$.each(movies, function() {
			console.log("render!");
			var templateHtml = $('#movieTemplate').html(),
		        template = $.templates(templateHtml),
		        html = template.render(this),
		        $div = $('#container');
		        console.log($div.length);
		        console.log(templateHtml);
		    $div.append(html);
		});
}
});


$('#post_movie').click(function (){
	postMovie();
});



function postMovie() {
	console.log("psot movie");

	var title = $('input[name="title"]').val();
	var url = $('input[name="url"]').val();
	console.log("title:"+title);

	$.ajax({
	type: "POST",
	data: {title:title, url:url},
	url: "/v1/movies",
	success: function(data) {
		console.log(data);
	},
	error: function(err) {
		console.log("error: "+err);
	}
});
}