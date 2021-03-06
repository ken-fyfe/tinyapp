// helper files for TinyApp server

// determine if email address exists in database
// return id if found, false if not found
const getUserByEmail = function(emailAddress, users) {
  for (let user in users) {
    if (users[user].email === emailAddress) {
      return users[user].id;
    }
  }
  return false;
};

// determine if short URL exists in database
// return long URL if found, false if not found
const getLongURLbyShortURL = function(shortURL, urlDatabase) {
  for (let keyShortURL in urlDatabase) {
    if (keyShortURL === shortURL) {
      return urlDatabase[keyShortURL].longURL;
    }
  }
  return false;
};

// determine if short URL is owned by user database
const shortURLOwnedByUser = function(shortURL, user, urlDatabase) {
  return (urlDatabase[shortURL].userID === user);
};

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

module.exports = { getUserByEmail,
                   generateRandomString,
                   getLongURLbyShortURL,
                   shortURLOwnedByUser
                 };