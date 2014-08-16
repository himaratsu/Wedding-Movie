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

exports.postRandom = function(req, res) {
	getAllMovie(req, res);
}

// get all movie
function getAllMovie(req, res) {
  Movie.find({}, function(err, movies) {
    if (err) {
      console.log(err);
      res.send(400, err);
      return;
    }

    getYoutubeMovie(req, res, movies);
  });
}

// use youtube api
function getYoutubeMovie(req, res, movies) {
	var url = "http://gdata.youtube.com/feeds/api/videos?vq=結婚式の余興&max-results=20&orderby=viewCount&alt=json";
	request(url, function (error, response, body) {
		if (error) {
			console.log('error: ' + response.statusCode);
			return;
		}

		var json = JSON.parse(response.body);
		console.log(json);
		
		var array = json.feed.entry;
		for (var i=0; i<array.length; i++) {
		  // console.log(array[i]);
		  // console.log(array[i].title.$t);
		  // console.log(array[i].link[0].href);
		  var youtubeId = getQuerystring(array[i].link[0].href, "v");
		  console.log("new add ? youtubeId is " + youtubeId);
		  // console.log("---------");

		  var existStatus = 0;
		  for (var j=0; j<movies.length; j++) {
		  	var movie = movies[j];
		  	console.log("**** movie youtubeId is "+movie.youtubeId);

		  	if (youtubeId == movie.youtubeId) {
		  		existStatus = 1;
		  		break;
		  	}
		  }

		  if (existStatus == 0) {
		  		// insert new movie and res success!
		  		var newMovie = new Movie();
		  		newMovie.title = array[i].title.$t;
		  		newMovie.url = array[i].link[0].href;
		  		newMovie.youtubeId = youtubeId;

				newMovie.save(function(err) {
			    	if (err) {
			    	  console.log(err);
			    	  res.send(400, err);
			    	  return;
			    	}
			    	res.send(201, {message:"OK"});
			  		return;
			 	});
		  }
		}

		res.send(400, {message:"new movie not found"});
	});
}






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