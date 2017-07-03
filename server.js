const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// set the dynamic PORT variable for Heroku or 3000 locally
// env variable can be found on Windows using SET in Command Prompt
const port = process.env.PORT || 3000;

var app = express();

// setup partials
hbs.registerPartials(__dirname + '/views/partials');

// sets up Handlebars as the templating engine for Express
app.set('view engine', 'hbs');

// next lets the app continue to run
// middleware to keep track of where users are coming from
app.use((req, res, next)=>{
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

// maintenance mode middleware, prevents any pages from being loaded
// and all code after this from rendering BECAUSE next() was not called
// app.use((req, res, next) =>{
//   res.render('maintenance.hbs', {
//     pageTitle: 'Maintenance Mode',
//     welcomeMessage: "We'll be right back."
//   });
// });

// express middleware (app.use to register the middleware)
// lets you configure how the express application works
app.use(express.static(__dirname + '/public'));

// =======================================================================
// new helper functions
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// =======================================================================
// routes
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Thank you for visiting my Node site!'
  });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
      pageTitle: 'About Page',
      welcomeMessage: 'Welcome to about.'
    });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
    welcomeMessage: 'Welcome to projects.'
  })
});

app.get('/bad', (req, res) => {
  res.send({
    error: '404 Error - Page not found'
  })
});

// =======================================================================
// needs to be dynamic for Heroku
app.listen(port, ()=> {
  console.log(`Server is up on port ${port}`);
});
