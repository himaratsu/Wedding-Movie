var Movie = require('../../models/movie.js')

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

  movie.save(function(err) {
    if (err) {
      console.log(err);
      res.send(400, err);
      return;
    }
    res.send(201, {message:"OK"});
  });
};