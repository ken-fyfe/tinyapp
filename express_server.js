// creation of a simple server using Express for node JS

// generate a string of 6 random alphanumeric characters
const generateRandomString = function() {
  const alphanum = 'abcdefghijklmnopqrstuvwxyn0123456789';
  const numLetters = alphanum.length;
  const lengthOfString = 6;
  let outputString = '';
  for (let i = 0; i < lengthOfString; i++) {
    const randomNum = Math.round(Math.random() * (numLetters - 1));
    const selectedLetter = alphanum[randomNum];
    outputString += selectedLetter;
  }
  return outputString;
};

// create users object
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

// determine if email address exists in database
const findEmailInDB = function(emailAddress) {
  for (let user in users) {
    if (users[user].email === emailAddress) {
      return users[user].id;
    }
  }
  return false;
};

const passwordMatches = function(userID, password) {
  return (users[userID].password === password);
};

// default home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// hello page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// que up register page
app.get("/register", (req, res) => {
  let templateVars = { email: '' };  // giving username empty string for now
  res.render("register", templateVars);
});

// que up login page
app.get("/login", (req, res) => {
  let templateVars = { email: '' };  // giving username empty string for now
  res.render("login", templateVars);
});

// listing of available URLs
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, email: '' };  // giving username empty string for now
  res.render("urls_index", templateVars);
});

// adding a new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// edit an existing URL
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// get directed to actual website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// generate a tinyURL for longURL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
});

// deletion of URL ink
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];  // why are we not using req.body like in "/urls" ?
  res.redirect('/urls');
});

// updating after editing a long URL
app.post("/urls/:shortURL/edit", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
});

// edit an existing URL
app.post("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// save login information
app.post("/login", (req, res) => {
  // const userID = req.body.userID;
  const email = req.body.email;
  const password = req.body.password;
  // console.log('userID :', userID);
  console.log('email :', email);
  console.log('password :', password);
  const userID = findEmailInDB(email);
  console.log('userID :', userID);
  if (userID) {
    if (passwordMatches(userID, password)) {
      res.cookie("usedID", userID);
      let templateVars = { email: email, urls: urlDatabase };
      res.render("urls_index", templateVars);
    } else {
      console.log('error 404');
    }
  } else {
    console.log('error 404');
  }
});

// logout user from platform
app.post("/logout", (req, res) => {
  res.clearCookie("username"); // delete the username key!
  res.redirect("/urls");
});

// register new user
app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  // console.log('userID :', userID);
  // console.log('email :', email);
  // console.log('password :', password);
  users[userID] = { id: userID, email: email, password: password};
  // console.log('users :', users);
  res.cookie("ID", users); // delete the username key!
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}! at ${Date()}`);
});