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

console.log(generateRandomString());
console.log(generateRandomString());
console.log(generateRandomString());
console.log(generateRandomString());
console.log(generateRandomString());
console.log(generateRandomString());
console.log(generateRandomString());
console.log(generateRandomString());
console.log(generateRandomString());