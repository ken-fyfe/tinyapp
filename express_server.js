// creation of a simple server using Express for node JS

// TODO
// 1) create a function to access user and database data
// 2) use compact syntax for objects user: user => user
// 3) implement a simple manner to access user data:
//    app.use((req, res) +>    {
//      const userID = req.session.userID
//      const user = users[userid]
//      req.user = user;
//      next()
//    })

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

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

const PORT = 8080; // default port 8080

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

// check if entered password agrees with stored
const passwordMatches = function(userID, enteredPassword) {
  return bcrypt.compareSync(enteredPassword,users[userID].password);
};
// const passwordMatches = function(userID, password) {
//   return (users[userID].password === password);
// };

// this gets called for every command to set the user
app.use((req, res, next) => {
  const userID = req.session.userID;
  const user = users[userID];
  console.log('*** userID in app.use |', userID,'|');
  req.user = user;
  next();
});

// default home page
app.get("/", (req, res) => {
  console.log('inside / (get)');
  // res.send("Hello!");
  res.redirect("/urls");
});

// hello page
app.get("/hello", (req, res) => {
  console.log('inside /hello (get)');
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// que up register page
app.get("/register", (req, res) => {
  console.log('inside /register (get)');
  // const user = req.cookies["userID"];
  const userID = req.session.userID;
  const templateVars = { users, loggedUserID: userID };
  res.render("register", templateVars);
});

// que up login page
app.get("/login", (req, res) => {
  console.log('inside /login (get)');
  // const user = req.cookies["userID"];
  const userID = req.session.userID;
  console.log('useID in /login from req.user (get)', req.user);
  const templateVars = { users, loggedUserID: userID };
  res.render("login", templateVars);
});

// list available URLs
app.get("/urls", (req, res) => {
  console.log('inside /urls (get)');
  // const user = req.cookies["userID"];
  const userID = req.session.userID;
  const templateVars = { users, urls: urlDatabase, loggedUserID: userID };
  res.render("urls_index", templateVars);
});

// adding a new URL
app.get("/urls/new", (req, res) => {
  console.log('inside /urls/new (get)');
  // const user = req.cookies["userID"];
  const userID = req.session.userID;
  if (!userID) {
    // res.status(400).send("Error: can't use this function unless logged in.");
    res.redirect('/login');
  } else {
    const templateVars = { users, urls: urlDatabase, loggedUserID: userID };
    res.render("urls_new", templateVars);
  }
});

// edit an existing URL
app.get("/urls/:shortURL", (req, res) => {
  console.log('inside /urls/:shortURL (get)');
  const userID = req.session.userID;
  const templateVars = { users, loggedUserID: userID, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render("urls_show", templateVars);
});

// get directed to actual website
app.get("/u/:shortURL", (req, res) => {
  console.log('inside /u/:shortURL (get)');
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// generate a tinyURL for longURL
app.post("/urls", (req, res) => {
  console.log('inside /urls (post)');
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  // const userID = req.cookies["userID"];
  const userID = req.session.userID;
  urlDatabase[shortURL] = { longURL, userID};
  res.redirect('/urls');
});

// deletion of URL ink
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log('inside /urls/:shortURL/delete (post)');
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

// updating after editing a long URL
app.post("/urls/:shortURL/edit", (req, res) => {
  console.log('inside /urls/:shortURL/edit (post)');
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  // const userID = req.cookies["userID"];
  const userID = req.session.userID;
  urlDatabase[shortURL] = { longURL, userID};
  const templateVars = { users, loggedUserID: userID, urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// edit an existing URL
app.post("/urls/:shortURL", (req, res) => {
  console.log('inside /urls/:shortURL (post)');
  // const user = req.cookies["userID"];
  const userID = req.session.userID;
  const templateVars = { users, loggedUserID: userID, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render("urls_show", templateVars);
});

// save login information
app.post("/login", (req, res) => {
  console.log('inside /login (post)');
  const email = req.body.email;
  const password = req.body.password;
  const userID = findEmailInDB(email);
  if (userID) { // user has been registered
    if (passwordMatches(userID, password)) { // write cookie
      // res.cookie("userID", userID);
      req.session.userID = userID;
      console.log('req.session.userID from within /login: (post)', req.session.userID);
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
  console.log('inside /logout (post)');
  // res.clearCookie("userID");
  req.session = null;
  res.redirect("/urls");
});

// register new user
app.post("/register", (req, res) => {
  console.log('inside /register (post)');
  const email = req.body.email;
  const password = req.body.password;
  if ((email === '') || (password === '')) {
    res.status(400).send("Error: email/password fields may not be empty.");
  } else {
    const checkUserID = findEmailInDB(email);
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}! at ${Date()}`);
});