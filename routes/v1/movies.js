var Movie = require('../../models/movie.js')
var request = require('request');
var cheerio = require('cheerio');

exports.get = function(req, res) {
  Movie.find({}, null, {sort:{created_at:-1}}, function(err, movies) {
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

  var youtubeId = getQuerystring(movie.url, "v");
  movie.youtubeId = youtubeId;

  getYoutubeTitle(req, res, movie);
};

function getQuerystring(url, key, default_) {
	if (default_ == null) default_="";
	key = key.replacekey = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
   	var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");  
   	var qs = regex.exec(url);  
  	if(qs == null)  
    	return default_;  
   	else  
    	return qs[1]; 
}

function getYoutubeTitle(req, res, movie) {
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

		if ($('title').text() == 'YouTube') {
			res.send(400, err);
			return;
		}

		var title = $("#eow-title");
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