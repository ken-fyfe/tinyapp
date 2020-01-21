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

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.send("Hello!");
});
//
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
//
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
//
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
//
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
// generate a tinyURL based on input longURL
app.post("/urls", (req, res) => {
  const longURL = req.body;
  const tinyURL = generateRandomString();
  urlDatabase[tinyURL] = longURL;
  res.redirect('/urls/:' + tinyURL);
});
// deletion of URL ink
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];  // why is it not req.body like in "/urls" ?
  res.redirect('/urls/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});