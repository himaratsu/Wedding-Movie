// require
var mongoose = require('mongoose');
var Schema	 =  mongoose.Schema;

var MovieSchema = new Schema({
	title : {type:String, require:true},
	url	  : {type:String, require:true}
});
mongoose.model('Movie', MovieSchema);

var Movie = mongoose.model('Movie');
module.exports = Movie;