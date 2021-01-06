const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");

      var fs = require('fs');
      var myCss = {
        style : fs.readFileSync('views/style.css','utf8'),
    };
//Connecting database
mongoose.connect("mongodb://localhost/authtest_demo",{useUnifiedTopology: true,useNewUrlParser: true});

app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());

//=======================
//      R O U T E S
//=======================

app.get("/", (req,res) =>{
    res.render("home");
})

app.get("/index",isLoggedIn ,(req,res) =>{
    res.render("index");
})
//Auth Routes
app.get("/login",(req,res)=>{
    res.render("home");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/index",
    failureRedirect:"/"
}),function (req, res){

});

app.get("/register",(req,res)=>{
    res.render("home");
});

app.post("/register",(req,res)=>{
    
    User.register(new User({username: req.body.username,uniqueID: req.body.uniqueID,email: req.body.email}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("home");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/");
    })    
    })
})

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


//Listen On Server


app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }
      
});