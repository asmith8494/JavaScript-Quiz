var gameTimer = document.getElementById("game-timer");
var gameCard = document.getElementById("game-card");
var beginButton = document.querySelector("#begin-button");
var answerButton = document.querySelector("#answer-button");
var viewHighScores = document.querySelector("#viewHS");
var timeLimit;
var elapsedTime = 0;
var timePenalty = 10;
var questions = [];
var currentQuestion = 0;
var currentAnswers = [];
var highscores = localStorage.getItem("highscores");

console.log(highscores);

validateHighScores();

gameInit();

// Adds an event listener to the Nav Bar which contains a button/link to view the highscores without proceeding to the end of the game
viewHighScores.addEventListener('click', function(event) {
  displayHighScores();
});

// Because the answer buttons are created dynamically, we have to create a listener for the whole document and check if our click is an 'answer-button' id
document.addEventListener('click', function(event) {
  event.preventDefault();
  event.stopPropagation();
  if(event.target && event.target.id === "answer-button");
  {
    if(event.target.dataset.indexNumber != null) {
      checkAnswer(event.target.dataset.indexNumber);
    }
  }
});

// Helper functions -----------------------------------------

// this will create a question object to be added to an array of questions. This isn't the best way, however, it's a little bit cleaner storage for the questions asked.
function Question (question, answer, incorrect) {
  this.question = question;
  this.answer = answer;
  this.incorrectAnswers = incorrect;
};

// function to generate questions and fill the array 'questions'
function generateQuestions() {
  var questionObjArray = [];

  var question1 = new Question("Javascript is written under which of the following Tags?", "<script></script>", ["<JavaScript></JavaScript>", "<code></code>", "<head></head>"]);
  var question2 = new Question("Variables in JavasScript are declared with which following keyword?", "var", ["new", "int", "string"]);
  var question3 = new Question("Which of the following is a valid JavaScript function?", "function myFunc(){};", ["var myFunc = function myFunc{ };", "myFunc function(){ };", "function myFunc = { };"]);
  var question4 = new Question("What will 1 == \"1\" return?", "False", ["True", "0", "1"]);
  var question5 = new Question("What will be the output of the following JavaScript code?\nx = 1;\nconsole.log(\'x = \' + x);\nvar x;", "error: x is undefined", ["x = 1", "x = undefined", "x = null;"]);

  questionObjArray.push(question1, question2, question3, question4, question5);
  return questionObjArray;
};

// initialize the quiz game.
// overview:
   // clears the screen of all elements
   // creates a header element to display the discription of the quiz
   // dynamically creates a button to begin the quiz
function gameInit() {

  clearCard(); // start with a fresh card, no elements, future elements will be dynamically created

  // reset currentQuestion (iterator) and elapsedTime to zero
    // this is here as a reset for the back button at the end of the game
  currentQuestion = 0;
  elapsedTime = 0;

  // populate our question list - this is dynamic as the creator of the quiz, in the generateQuestions function, can add however many questions they want to the game
  // and it will adjust the timeLimit and length of the game.
  questions = generateQuestions();

  // timeLimit based on number of questions
    // should change how highscores are displayed
  timeLimit = questions.length * 15;
  gameTimer.textContent = "Timer: " + timeLimit; // update navbar timer to the total time to start

  gameCard.setAttribute("class", "card-body text-center"); // this just centers everything in the card before the game starts


  // code below generates various elements of the initial game screen
  var cardHeader = document.createElement("h1");
  cardHeader.textContent = "JavaScript Quiz!";
  cardHeader.setAttribute("style", "text-align: center;");
  gameCard.appendChild(cardHeader);

  var cardText = document.createElement("p");
  cardText.setAttribute("class", "card-text");
  cardText.textContent = "Welcome to the JavaScript quiz!  You will be asked " + questions.length + " questions.  Try to answer the questions as quickly as possible. Incorrect answers will add 10 seconds to your final score. Time limit: " + 15 * questions.length + " seconds.\nGood luck!";
  gameCard.appendChild(cardText);

  var button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("class", "btn btn-dark");
  button.setAttribute("id", "begin-button");
  button.textContent = "Begin!";
  gameCard.appendChild(button);

  // dynamically add an event listener to the begin button created directly above
  button.addEventListener("click", function(event) {
    event.preventDefault();
    gameStart();
    populateQuestion();
  });

}

// this function initiates the game, starts the timer
function gameStart() {
  clearCard();

  gameCard.setAttribute("class", "card-body"); // sets card to left justified

  setTime(); // begins timer countdown
}

function populateQuestion() {
  clearCard(); // ran for each question to repopulate with a new question and buttons

  // question element
  var cardQuestion = document.createElement("h3");
  cardQuestion.textContent = questions[currentQuestion].question;

  gameCard.appendChild(cardQuestion);

  currentAnswers = generateAnswers(questions[currentQuestion].answer, questions[currentQuestion].incorrectAnswers);

  // create a button group to group created buttons vertically
  var btnGroup = document.createElement("div");
  btnGroup.setAttribute("class", "btn-group-vertical");

  for(var i = 0; i < currentAnswers.length; i++)
  {
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "btn btn-dark text-left");
    btn.setAttribute("id", "answer-button");
    btn.textContent = (i+1) + ". " + currentAnswers[i];
    btn.dataset.indexNumber = i;
    btnGroup.appendChild(btn);
  }

  gameCard.appendChild(btnGroup);  
}

function setTime() {
  var timerInterval = setInterval(function() {
    elapsedTime++;
    secondsLeft = timeLimit - elapsedTime;
    gameTimer.textContent = "Timer: " + (timeLimit - elapsedTime);
    
    if(secondsLeft <= 0 || currentQuestion === questions.length) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// helper function to create an array of both correct and incorrect answers to display to the user
// this has a rudementary randomizer so the possible answers get shuffled upon creation
function generateAnswers(answer, incorrect) {
 var answers = [];
 incorrect.push(answer);
 answers = incorrect;
 answers.sort(function(a, b){return 0.5 - Math.random()});
 return answers;
}

// helper function to determine if the answer clicked is the correct answer
// increases time penalty if incorrect
function checkAnswer(index) {
  if(questions[currentQuestion].answer === currentAnswers[index])
  {
    console.log("You are correct! " + currentAnswers[index]);
  }
  else {
    console.log("You are incorrect!" + currentAnswers[index]);
    elapsedTime += timePenalty;
  }

  currentQuestion++;

  if(currentQuestion === questions.length)
    return;

  populateQuestion();
}

// helper function for the end state of the game
// order of operations moving down the function
// clears the card
// creates the "game over" element
// various elements created and appended to each other to create the final form element
  // contains input fields, final score, submit buttons
function endGame() {
  clearCard();

  var gameOver = document.createElement("h3");
  gameOver.setAttribute("style", "text-align: center;");
  gameOver.textContent = "Game Over!";
  gameCard.appendChild(gameOver);

  var finalScore = document.createElement("p");
  finalScore.textContent = "Final Score: " + (elapsedTime);
  gameCard.appendChild(finalScore);

  var hsForm = document.createElement("form");
  hsForm.setAttribute("class", "form-inline");

  var newDivOne = document.createElement("div");
  newDivOne.setAttribute("class", "form-group mb-2");

  var hsFormLabel = document.createElement("label");
  hsFormLabel.setAttribute("class", "col-sm-6 col-form-lablel");
  hsFormLabel.textContent = "Enter Initials";

  newDivOne.appendChild(hsFormLabel);
  hsForm.appendChild(newDivOne);
  
  var newDivTwo = document.createElement("div");
  newDivTwo.setAttribute("class", "form-group mb-2");

  var hsInputLabel = document.createElement("lablel");
  hsInputLabel.setAttribute("for", "inputHS");
  hsInputLabel.setAttribute("class", "col-sm-4 sr-only");
  hsInputLabel.textContent = "Initials";

  var hsInput = document.createElement("input");
  hsInput.setAttribute("id", "inputHS");
  hsInput.setAttribute("type", "text");
  hsInput.setAttribute("placeholder", "Initials");

  newDivTwo.appendChild(hsInputLabel);
  newDivTwo.appendChild(hsInput);
  hsForm.appendChild(newDivTwo);

  var submitBtn = document.createElement("button");
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("class", "btn btn-dark mb-2");
  submitBtn.setAttribute("id", "hs-submit-button");
  submitBtn.textContent = "Submit";

  hsForm.appendChild(submitBtn);

  gameCard.appendChild(hsForm);


  // since the buttons and forms are created dynamically,
  // we have to add a global event listener for click and submit and detect when the ID we want is fired
  submitBtn.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    if(event.target && event.target.id === "hs-submit-button")
    {
      var hs = document.getElementById("inputHS");

      addHighScore(hs.value); // add the new highscore to the array
      displayHighScores(); // call the displayHighScores function which is basically another state of the game
    }
  });

  hsInput.addEventListener('submit', function(event) {
      addHighScore(event.target.value);
      displayHighScores();
  });

  console.log("game over!");

}

// adds the submitted high score to the highscores array and automatically updates the localStorage
function addHighScore(hs)
{
  console.log(hs + ": " + elapsedTime);
  highscores.push(hs + ": " + elapsedTime);

  var json = JSON.stringify(highscores);

  localStorage.setItem("highscores", json);
}

// helper function containing the code to display our list of high scores.
function displayHighScores()
{
  clearCard();

  var hsHeader = document.createElement("h2");
  hsHeader.textContent = "Highscores:";
  gameCard.appendChild(hsHeader);

  var hsList = document.createElement("ul");
  hsList.setAttribute("class", "list-group");

  if(highscores)
  {
    for(var i = 0; i < highscores.length; i++)
    {
      var li = document.createElement("li");
      li.setAttribute("class", "list-group-item");
      li.textContent = highscores[i];

      hsList.appendChild(li);
    }
    gameCard.appendChild(hsList);
  }

  var backBtn = document.createElement("button");
  backBtn.setAttribute("type", "button");
  backBtn.setAttribute("class", "btn btn-dark");
  backBtn.setAttribute("id", "back-button");
  backBtn.textContent = "Back";
  gameCard.appendChild(backBtn);

  var clearBtn = document.createElement("button");
  clearBtn.setAttribute("type", "button");
  clearBtn.setAttribute("class", "btn btn-dark");
  clearBtn.setAttribute("id", "clear-button");
  clearBtn.textContent = "Clear Highscores";
  gameCard.appendChild(clearBtn);


  clearBtn.addEventListener('click', function(event) {
    if(event.target && event.target.id === "clear-button")
    {
      highscores = [];
      var json = JSON.stringify(highscores);
      localStorage.setItem("highscores", json);
      displayHighScores();
    }
  });

  backBtn.addEventListener('click', function(event) {
    if(event.target && event.target.id === "back-button")
    {
      console.log("back button pressed");
      gameInit();
    }
  })
}

// Validates the highscores from local storage
// if highscores is null or dosen't exist, set the variable to an empty array
// if the highscores are deleted and the resulting storage is an empty string from JSON.stringify, we will also set the highscores to an empty array
// otherwise, the highscores should contain entries and can be json parsed
function validateHighScores() {
  if(highscores === null)
  {
    console.log("highscores === null");
    highscores = [];
  }
  else if(highscores === "")
  {
    highscores = [];
    console.log("highscores === \"\"");
  }
  else {
    highscores = JSON.parse(localStorage.getItem("highscores"));
  }
}

function clearCard()
{
  while(gameCard.firstChild)
  {
    gameCard.removeChild(gameCard.firstChild);
  }
}