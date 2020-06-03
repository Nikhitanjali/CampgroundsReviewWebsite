require('dotenv').config();
var express = require("express");
var app= express();
var bodyParser = require("body-parser");
var mongoose= require("mongoose");
var Campground=require("./models/campgrounds.js");
var Commentnew=require("./models/comment");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User= require("./models/user");
var flash= require("connect-flash");

var seedDB= require("./seeds");
var methodOverride = require("method-override");

//requiring route
var commentRoutes = require("./routes/comments"),
     campgroundRoutes = require("./routes/campgrounds"), 
	 authRoutes= require("./routes/index");
//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp",  {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname+"/public"));
app.use(require("express-session")({
	secret: "I am the best in the world",
	resave: false,
	saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser= req.user;
	res.locals.error= req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


app.use("/",authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(2080, () => {
	console.log("server has started!!");
});
