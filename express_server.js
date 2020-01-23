// creation of a simple server using Express for node JS

// TODO
// 1) create a function to access user and database data
// 2) implement a simple manner to access user data:
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

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const PORT = 8080; // default port 8080

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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

// check if entered password agrees with stored
const passwordMatches = function(userID, password) {
  return (users[userID].password === password);
};

// default home page
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect("/urls");
});

// hello page
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// que up register page
app.get("/register", (req, res) => {
  let templateVars = { email: '' };  // giving email empty string for now
  res.render("register", templateVars);
});

// que up login page
app.get("/login", (req, res) => {
  let templateVars = { email: '' };  // giving email empty string for now
  res.render("login", templateVars);
});

// list available URLs
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, email: '' };  // giving email empty string for now
  res.render("urls_index", templateVars);
});

// adding a new URL
app.get("/urls/new", (req, res) => {
  // const user = res.cookie("userID");
  const user = req.cookies["userID"];
  if (!user) {
    // res.status(400).send("Error: can't use this function unless logged in.");
    res.redirect('/login');
  } else {
    console.log('user from cookies inside adding URL :', user);
    let templateVars = { urls: urlDatabase, email: '' };  // giving email empty string for now
    res.render("urls_new", templateVars);
  }
});

// edit an existing URL
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
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
  const userID = req.cookies["userID"];
  urlDatabase[shortURL] = { longURL: longURL, userID: userID};
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
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render("urls_show", templateVars);
});

// save login information
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('email :', email);
  console.log('password :', password);
  const userID = findEmailInDB(email);
  console.log('userID :', userID);
  if (userID) { // user has been registered
    if (passwordMatches(userID, password)) {
      res.cookie("userID", userID);
      let templateVars = { email: email, urls: urlDatabase };
      res.render("urls_index", templateVars);
    } else {
      res.status(403).send("Error: password does not match.");
    }
  } else {
    res.status(403).send("Error: email registration not found.");
  }
});

// logout user from platform by removing ID cookie
app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
});

// register new user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if ((email === '') || (password === '')) {
    res.status(400).send("Error: email/password fields may not be empty.");
  } else {
    const checkUserID = findEmailInDB(email);
    if (checkUserID) { // user email already used
      res.status(400).send("Error: this e-mail has already been used.");
    } else {
      const userID = generateRandomString();
      users[userID] = { id: userID, email: email, password: password};
      res.redirect("/urls");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}! at ${Date()}`);
});