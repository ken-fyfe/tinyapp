// creation of a simple server using Express for node JS

// TODO: create functions to access user and database data to make more general

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const users = require('./users');
const urlDatabase = require('./urlDatabase');
const { getUserByEmail, generateRandomString } = require('./helpers');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// this gets called for every command to set the user
app.use((req, res, next) => {
  const userID = req.session.userID;
  const user = users[userID];
  req.user = user;
  next();
});

// default home page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// que up register page
app.get("/register", (req, res) => {
  const userID = req.session.userID;
  const templateVars = { users, loggedUserID: userID };
  res.render("register", templateVars);
});

// que up login page
app.get("/login", (req, res) => {
  const userID = req.session.userID;
  const templateVars = { users, loggedUserID: userID };
  res.render("login", templateVars);
});

// list available URLs
app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  const templateVars = { users, urls: urlDatabase, loggedUserID: userID };
  res.render("urls_index", templateVars);
});

// adding a new URL
app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  if (!userID) {
    res.redirect('/login');
  } else {
    const templateVars = { users, urls: urlDatabase, loggedUserID: userID };
    res.render("urls_new", templateVars);
  }
});

// edit an existing URL
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const templateVars = { users, loggedUserID: userID, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render("urls_show", templateVars);
});

// get directed to actual website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// generate a tinyURL for longURL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const userID = req.session.userID;
  urlDatabase[shortURL] = { longURL, userID};
  res.redirect('/urls');
});

// deletion of URL ink
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// updating after editing a long URL
app.post("/urls/:shortURL/edit", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  urlDatabase[shortURL] = { longURL, userID};
  const templateVars = { users, loggedUserID: userID, urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// edit an existing URL
app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const templateVars = { users, loggedUserID: userID, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render("urls_show", templateVars);
});

// save login information
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = getUserByEmail(email, users);
  if (userID) { // user has been registered
    const storedPassword = users[userID].password;
    const passwordMatches = bcrypt.compareSync(password, storedPassword);
    // if (passwordMatches(userID, password, users)) { // write cookie
    if (passwordMatches) { // write cookie
      req.session.userID = userID;
      const templateVars = { users, email, loggedUserID: userID, urls: urlDatabase };
      res.render("urls_index", templateVars);
    } else {
      res.status(403).send("Error: entered password does not match that stored in database.");
    }
  } else {
    res.status(403).send("Error: email registration not found.");
  }
});

// logout user from platform by removing ID cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// register new user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if ((email === '') || (password === '')) {
    res.status(400).send("Error: email/password fields may not be empty.");
  } else {
    const checkUserID = getUserByEmail(email, users);
    if (checkUserID) { // user email already used
      res.status(400).send("Error: this e-mail has already been used.");
    } else { // update user database
      const userID = generateRandomString();
      const hashedPassword = bcrypt.hashSync(password, 10);
      users[userID] = { id: userID, email, password: hashedPassword};
      res.redirect("/urls");
    }
  }
});

const PORT = 8080; // default port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});