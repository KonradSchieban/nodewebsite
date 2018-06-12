var express     = require('express'),
    nunjucks    = require('nunjucks'),
    bodyParser  = require('body-parser'),
    fs          = require("fs"),
    favicon     = require('serve-favicon'),
    async       = require('async'),
    tools       = require("./tools.js"),
    config      = require('./config.json'),
    session = require('express-session');

var User = require('./models/user.js');

var app         = express();

// Configure Nunjucks
//var _templates = process.env.NODE_PATH ? process.env.NODE_PATH + '/views' : 'views' ;
var _templates = __dirname + '/views';
nunjucks.configure(_templates, {
    autoescape: true,
    cache: false,
    express: app
});

// Set Nunjucks as rendering engine for pages with .html suffix
app.engine( 'html', nunjucks.render ) ;
app.set( 'view engine', 'html' ) ;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/views/user'));

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
}));

app.get('/', (req, res) => {
    res.redirect('/signin');
});

app.get('/home', function(req,get_res){

    User.getUserById(req.session.user_id,(err,user_obj) => {
        if(err) throw err;
        if(user_obj){
            get_res.render("sportsbetting/index.njk",{
                "title":"Home"
            });
        }else{
            get_res.redirect('/signin');
        }
    });

});

app.get('/user', function(req,get_res){
    
    User.getUserById(req.session.user_id,(err,user_obj) => {
        if(err) throw err;
        if(!user_obj){
            console.log("User not authenticated. Redirecting...");
            req.redirect('/signin');
        }else{
            get_res.render("sportsbetting/user/profile.njk",{
                "title":"User Profile",
                "user_obj": user_obj,
                "winning_percentage": "0"
            });
        }
    });

});

app.get('/signup', function(req,get_res){
    get_res.render("sportsbetting/user/signup.njk",{
        "title":"Sign Up"
    });
});

app.post('/signup', function(req,post_res){
    
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;

    var user_data = {
        email: email,
        username: username,
        password: password
    }

    User.createUser(user_data,(err,callback) =>{
        if(err) return;
        else{
            post_res.redirect('/signup');
        }
    });
});

app.get('/signin', function(req,get_res){
    get_res.render("sportsbetting/user/signin.njk",{
        "title":"Sign In"
    });
});

app.post('/signin', function(req,post_res){
    
    let username = req.body.username;
    let password = req.body.password;
    
    console.log("What is happening");
    console.log("username " + username);
    console.log("password " + password);

    User.getUserByUsername(username,(err, user_obj) => {
        if(err){
            console.log("Error occured");
            return;
        }
        else{
            let password_hash = user_obj.password;
            console.log(password_hash);
            User.comparePassword(password,password_hash,(err,is_match) => {
                if(err){
                    console.log('Error occured')
                    return;
                }else{
                    if(is_match){
                        console.log('Password correct');
                        req.session.user_id = user_obj._id;
                        post_res.redirect('/signup');
                    }else{
                        console.log('Password incorrect');
                        post_res.redirect('/signin');
                    }
                    
                }
                
            });
        }
    });
});

app.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
            return next(err);
            } else {
            return res.redirect('/');
            }
        });
    }
});

app.listen(process.env.PORT || config.listener_port);

if(process.env.PORT){
    console.log('Starting server on port ' + process.env.PORT + '...');
}else{
    console.log('Starting server on port ' + config.listener_port + '...');
}