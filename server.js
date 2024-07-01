require('dotenv').config()

//___________________
//Dependencies
//___________________
const express = require('express');
const jordans = require("./models/jordans.js")
const methodOverride = require('method-override');
const mongoose = require ('mongoose');
const app = express();
const session = require('express-session');
const db = mongoose.connection;
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true }
);

// Error / success
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongod connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongod disconnected'));

//___________________
//Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false
  })
);
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000
//app.get('/jordans' , (req, res) => {
  //res.render('index.ejs' , {
    //currentUser: req.session.currentUser
  //});
//});

// Routes / Controllers
const userController = require('./controllers/users');
app.use('/users', userController);

const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);

const jordansController = require('./controllers/Jordans');
app.use('/jordans', jordansController);
app.get('/',(req, res) => {
  res.redirect('/sessions/new')
})
// Temporary root route. Please remove me when you add views:
//app.get("/", (req, res) => {
  //res.send("Root route");
//});
//___________________
//Listener
//___________________
app.listen(PORT, () => console.log('express is listening on:', PORT));