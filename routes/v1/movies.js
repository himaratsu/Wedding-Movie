var Movie = require('../../models/movie.js')
var request = require('request');
var cheerio = require('cheerio');

exports.get = function(req, res) {
  Movie.find({}, function(err, movies) {
    if (err) {
      console.log(err);
      res.send(400, err);
      return;
    }
    res.json(200, movies);
  });
};

exports.post = function(req, res) {
  var movie = new Movie(req.body);

  console.log(movie);

  var youtubeId = movie.url.replace("https://www.youtube.com/watch?v=", "");
  movie.youtubeId = youtubeId;

  getYoutubeTitle(req, res, movie);
};


function getYoutubeTitle(req, res, movie) {
	console.log("get title!");
	request(
	{
		uri:movie.url
	}, 
	function(err, response, body) {
		if (err) {
			console.log(err);
	    	res.send(400, err);
	    	return;
		}
		var $ = cheerio.load(body);
		var title = $("#eow-title");

		console.log("title: " + title.text().trim());
		movie.title = title.text().trim();

		movie.save(function(err) {
	    	if (err) {
	    	  console.log(err);
	    	  res.send(400, err);
	    	  return;
	    	}
	    	res.send(201, {message:"OK"});
	 	});
	}
	);
}