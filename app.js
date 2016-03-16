var express = require("express");
var MongoClient = require("mongodb").MongoClient;
var enginers = require("jade");
var assert = require("assert");

app = express();

app.set("view engine", "jade");
app.set("views", __dirname + "/views");

MongoClient.connect("mongodb://localhost:27017/garden", function(err, db){
	assert.equal(null, err);
	console.log("connected to MongoDB");
	
	app.get('/', function(req, res){
		db.collection("flowers").find({}, {"name": true, "color": true}).toArray(function(err, flowerdocs){
			if (err) { return res.sendStatus(500);}
			
			var colordocs = db.collection("flowers").distinct("color", function(err, colordocs){
				if (err) {return res.sendStatus(500);}
				return res.render("allflowers", {"flowers" : flowerdocs, "flowerColors":colordocs});
		    })
	    });
	});
	
	app.get("/showColors", function(req, res){
		var color = req.query.colorDropDown;
		
		db.collection("flowers").find({"color": color},{"name":true, "color":true}).toArray(function(err, docs){
			
			if(err) {return res.sendStatus(500);}
			
			var colordocs = db.collection("flowers").distinct("color", function(err, colordocs){
				if(err) {return res.sendStatus(500);}
			
			var displayColor = color.slice(0,1).toUpperCase() + color.slice(1, color.length)
			
			return res.render("allflowers",
			{"flowers" : docs, "currentColor" : displayColor, "flowerColors" : colordocs });
			
		
		});
		});
	});
	
	
	app.use(function(req, res){
		res.sendStatus(404);
	});
	
	var server = app.listen(3050, function(){
		var port = server.address().port;
		console.log("Server listening on port " + port);
	});
	
});


