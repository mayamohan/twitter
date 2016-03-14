var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('databases/words.sqlite');

db.run("PRAGMA case_sensitive_like = true");
var Twitter = require('twitter');
var credentials = require("../.credentials.js");
var twitParams = credentials.twitParams;
var twitClient = new Twitter(credentials.twitCredentials);

router.get('/',function(req,res,next){
	var count=0;
	db.get("SELECT COUNT(*) AS tot FROM words",function(err,row){
		var respText = "Words API: " + row.tot + " words online.";
		res.send(respText);
	});
});

router.get('/search/:abbrev', function(req, res, next) {
	var abbrev = req.params.abbrev;
	var threshold = req.query.threshold || 3;
	var likeClause = "lower(word) LIKE lower('" + abbrev + "%')";
	 var noCase = req.query.noCase;
	 if (noCase === "true") {
    //console.log("Case Sensitive");
    // Case-sensitive query:
    likeClause = "word LIKE '" + abbrev + "%'";
  }
		if(threshold && abbrev.length < Number(threshold)){
			res.status(204).send();

			return;
		}
	var query = ( "SELECT id, word FROM words " + 
	           " WHERE " + likeClause + " ORDER BY word ");
  	db.all(query, function(err,data) {
  		if (err) { res.status(500).send("Database Error"); }
  		else { res.status(200).json(data); }
  	}); 
});
/*dict routes*******************************************************************/
router.get('/dictionary/:wordId',function(req,res,next){
	console.log("fist route (database)");
	var wordId = req.params.wordId;
	var query = ("SELECT word FROM words WHERE id="+wordId);
	console.log("in DICTIONARY route query=" +query);
	db.get(query,function(err,data){
		if(err){res.status(500).send("Database Error");}
		else{
			//res.status(200).json(data);
			res.wordData=data;
			next();
		}
	});
});
router.delete('/dictionary/:wordId',function(req,res,next){
	var wordId = req.params.wordId;
	var query = ("DELETE FROM words WHERE id="+wordId);
	console.log("in DELETE route query=" +query);
	db.run(query,function(err,data){
		if(err){res.status(500).send("Database Error");}
		else{res.status(202).json();}
	});
});
// router.get('/put/:wordId',function(req,res,next){
// 	var wordId = req.params.wordId;
// 	 var query = ("UPDATE words SET word=NEWWORDHERE WHERE id="+wordId);
// 	 console.log("in UPDATE route query=" +query);
// 	 db.run(query,function(err,data){
// 	 	if(err){res.status(500).send("Database Error");}
// 	 	else{res.status(202).json();}
// 	 });
// });
router.post('/dictionary/:word',function(req,res,next){
	console.log("IN POST ROUTE");
	var word = req.params.word;
	var query = ("INSERT INTO words (word) VALUES ('"+word+"')");

	console.log("in INSERT route query=" +query);
	 db.run(query,function(err,data){
	 	if(err){console.log(err);res.status(500).send("Database Error");}
	 	else{console.log("INSERTED "+word);
	 	res.status(202).json(this.lastId);}
	 });
});
router.get('/dictionary/:wordId',function(req,res,next){
	//next is called from the first dict route
	console.log("SECOND DICT ROUTE");
	var word = req.params.word;
	res.wordData.twitter={};
	var twitSearch="https://api.twitter.com/1.1/search/tweets.json?";
	twitSearch+="q=";
	twitSearch+="%23"+word;//#word
	twitSearch+="&result_type=recent";
	console.log("INSIDE TWITTER" + twitSearch);
	twitClient.get(twitSearch,twitParams,function(error,tweets,response){
		if(error){
			console.error("TWITTER screwed YO!");
			console.error(error);
		}else{
			res.wordData.twitter=tweets;
		}
		res.status(200).json(res.wordData);
	});
});
module.exports = router;