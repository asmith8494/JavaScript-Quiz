// Assignment Code
var generateBtn = document.querySelector("#generate");

var lowerCase = "abcdefghijklmnopqrstuvwxyz".split("");
var upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var specialChars = "~!@#$%^&*()-_=+[{]}\\|;:\'\",<.>/?".split("");
var numericChars = "1234567890".split("");

var password = "";
var possibleChars = [];
var criteriaChars = [];
var passwordLength = 0;
var lower, upper, special, numeric;

function getPassParams() {
  passwordLength = parseInt( prompt("Please enter a desired password length between 8 and 128.") );

  if(passwordLength < 8 || passwordLength > 128)
  {
    alert("Invalid Password Length.");
    getPassParams();
  }

  lower = confirm("Would you like your password to contain lower case letters?");
  upper = confirm("Would you like your password to contain upper case letters?");
  special = confirm("Would you like your password to contain special characters?");
  numeric = confirm("Would you like your password to contain numbers?");
}

function rng (size) {
  return Math.floor(Math.random() * size);
}

function generatePassword() {

  if(lower) {
    possibleChars = possibleChars.concat(lowerCase);
    criteriaChars.push( lowerCase[rng(lowerCase.length)] );
  }

  if(upper) {
    possibleChars = possibleChars.concat(upperCase);
    criteriaChars.push( upperCase[rng(upperCase.length)] );
  }

  if(special) {
    possibleChars = possibleChars.concat(specialChars);
    criteriaChars.push( specialChars[rng(specialChars.length)] );
  }

  if(numeric) {
    possibleChars = possibleChars.concat(numericChars);
    criteriaChars.push( numericChars[rng(numericChars.length)] );
  }

  if(!lower && !upper && !special && !numeric) // if the user selects no criteria
  {
    console.log("inside no criteria.");
    alert("No criteria selected, please try again.");
    getPassParams();
    generatePassword();
  }

  for(var i = 0; i < passwordLength; i++)
  {
    if(criteriaChars[i])
    {
       password += criteriaChars[i]; 
    }
    else
    {
      password += possibleChars[ rng(possibleChars.length) ];
    }
  }

  return password;
}

// Write password to the #password input
function writePassword() {
  getPassParams();

  var password = generatePassword();

  var passwordText = document.querySelector("#password");

  passwordText.value = password;

}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);