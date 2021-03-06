//
var Campground= require("../models/campgrounds");
var Commentnew= require("../models/comment");




var middlewareObj={};

middlewareObj.checkCampgroundOwnership =function(req,res,next){
//is user logged in
	if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		}
		else
			{
				
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					
next();				}
				else{
					req.flash("error", "you don't have permission to do that");
					res.redirect("back");
				}
}
				
	});
	}
	else
		{
			  req.flash("error", "you need to be logged in to do that");
			    res.redirect("back");
		}
	//does user own the campground?
	//otherwise redirect
	//if not redirect
     




};

middlewareObj.checkCommentOwnership = function(req,res,next){
//is user logged in
	if(req.isAuthenticated()){
			Commentnew.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("/campgrounds");
		}
		else
			{
				
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					
next();				}
				else{
										req.flash("error", "you don't have permission to do that");

					res.redirect("back");
				}
}
				
	});
	}
	else
		{
						  req.flash("error", "you need to be logged in to do that");

			    res.redirect("back");
		}
	//does user own the campground?
	//otherwise redirect
	//if not redirect
     




};
middlewareObj.isLoggedIn = function(req,res,next){
	
	if(req.isAuthenticated()){
	   return next();
}
	req.flash("error","you need to be logined to do that !");
	res.redirect("/login");


};
module.exports = middlewareObj;
