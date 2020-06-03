var express = require("express");
var router = express.Router();
var Campground= require("../models/campgrounds");
var middleware= require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
//geocoder - in route 

//INDEX: GET: SHOW ALL CAMPGROUNDS
router.get("/", function(req,res){
	//GET ALL CAMPGROUNDS FROMM DB
	
	Campground.find({}, function(err, allcampgrounds){
		if(err){
		}
		else{
				res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});

		}
	});
	
});

// CREATE: POST: ADD A NEW CAMPGROUND TO DATABASE

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  
    var newCampground = {name: name, image: image, description: desc, author:author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);

        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });


//NEW- GET - SHOW FORM TO CREATE CAMPGROUND

router.get("/new", middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new.ejs");
});
//show page
router.get("/:id", function(req,res){
	//find the campground with provided id
	//render show template with that campground
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
	 if(err){
		 console.log(err);
	 }	
		else
			{
				console.log(foundCampground);
				res.render("campgrounds/show.ejs", {campground: foundCampground,page: 'campgrounds'});
			}
});
});


//EDIT 

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	
	//is user logged in
	
			Campground.findById(req.params.id, function(err, foundCampground){
		
				  res.render("campgrounds/edit",{campground: foundCampground});
				
				
	});
	
});
//UPDATE
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
 
    // Create a new campground and save to DB

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });

//DESTROY CAMPGROUND
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		res.redirect("/campgrounds");
	});
});




module.exports= router;