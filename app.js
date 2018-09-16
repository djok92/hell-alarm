//UI variables
const clock = document.querySelector(".clock");
const clockDisplay = document.querySelector(".clockDisplay");
const gameDisplay = document.querySelector(".gameDisplay");
const submitButton = document.querySelector(".submitButton");
const setAgain = document.querySelector(".againButton");
const statusMessage = document.querySelector(".statusMessage");
const gameStatusMessage = document.querySelector(".gameStatusMessage");
const gameNumInput = document.querySelector("#guessNumberInput");
const minuteInput = document.querySelector("#minuteInput");
const hourInput = document.querySelector("#hourInput");
const numberLimitSpan = document.querySelector(".numberLimit");
const audio = new Audio("alarm_classic.mp3");
//Game variables
let counter = 0;
let correctNum, guessNum;
let minuteInputVal, hourInputVal, alarmTime, currentTime, play;

//Hide function
function hideElements(arg) {
  if (arg.length < 2) {
    arg.style.display = "none";
  } else {
    Array.from(arguments).forEach(item => {
      item.style.display = "none";
    });
  }
}

//Show function
function showElements(arg) {
  if (arg.length < 2) {
    arg.style.display = "block";
  } else {
    Array.from(arguments).forEach(item => {
      item.style.display = "block";
    });
  }
}

//Time function
function startTime() {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  let t = setTimeout(startTime, 500);
  clock.innerHTML = `<p>${h}</p> : <p>${m}</p> : <p>${s}</p>`;
  currentTime = `${h} : ${m}`;
}

//Function that check digits of number
function checkTime(i) {
  if (i < 10 && i.toString().length < 2) {
    i = "0" + i;
  }
  return i;
}

//User input function
function getInputValue() {
  minuteInputVal = document.querySelector("#minuteInput").value;
  hourInputVal = document.querySelector("#hourInput").value;
  alarmTime = checkTime(hourInputVal) + " : " + checkTime(minuteInputVal);
  if (
    minuteInputVal > 59 ||
    hourInputVal > 23 ||
    minuteInputVal === "" ||
    hourInputVal === ""
  ) {
    alarmTime = null;
    inputError();
  } else {
    inputSuccess();
    compare();
  }
}

//On success
function inputSuccess() {
  updateUiSuccess();
  resetInput();
}

//On error
function inputError() {
  updateUiError();
  resetInput();
  return;
}

//Clear input
function resetInput() {
  minuteInput.value = null;
  hourInput.value = null;
}

//On success update UI
function updateUiSuccess() {
  showElements(statusMessage);
  statusMessage.textContent = `Your alarm is set at: ${alarmTime}`;
  statusMessage.classList.remove("error");
  statusMessage.classList.add("success");
}

//On error update UI
function updateUiError() {
  showElements(statusMessage);
  statusMessage.textContent =
    "Sorry you have entered invalid value, please try again!";
  statusMessage.classList.remove("success");
  statusMessage.classList.add("error");
}
//Compare user input and time
function compare() {
  let b = setTimeout(compare, 500);
  play = true;
  if (play) {
    if (currentTime === alarmTime) {
      clockDisplay.style.display = "none";
      audio.play();
      clearTimeout(b);
      numberGuesser();
    }
  }
}
//Stop audio
function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
  play = false;
}
//Number guesser game
function numberGuesser() {
  hideElements(setAgain);
  showElements(gameDisplay);
  //Limit for guessing
  numberLimit = 100;
  correctNum = Math.round(Math.random() * numberLimit);
  numberLimitSpan.textContent = numberLimit;
  gameNumInput.focus();
  gameNumInput.value = "";
  gameNumInput.addEventListener("keypress", function (e) {
    if (e.keyCode === 13) {
      if (this.value >= 0 && this.value <= numberLimit && this.value !== " ") {
        guessNum = parseInt(this.value);
        if (guessNum === correctNum) {
          stopAudio();
          correctGuess();
        } else {
          gameStatusMessage.classList.add("error");
          gameStatusMessage.textContent = "You are wrong, try again!";
        }
      } else {
        showElements(gameStatusMessage);
        gameStatusMessage.classList.add("error");
        gameStatusMessage.textContent = "Invalid input!";
        this.value = null;
      }
    }
  });
  //Correct num log for testing
  console.log(correctNum);
}

//Correct guess
function correctGuess() {
  //Num of tries counter variable increment
  counter++;
  gameStatusMessage.classList.remove("error");
  gameStatusMessage.classList.add("success");
  gameStatusMessage.textContent = "You have stopped alarm!";
  showElements(setAgain);
  setAgain.addEventListener("click", function () {
    if (counter <= 3) {
      init();
      clearSetAgain();
    } else {
      document.querySelector(".gameTitle").textContent =
        "Stop playing games and get up!";
      hideElements(gameStatusMessage, setAgain, guessNumberInput);
    }
  });
}

function clearSetAgain() {
  correctNum = null;
  showElements(clockDisplay);
  hourInput.focus();
  gameStatusMessage.textContent = " ";
  statusMessage.textContent = " ";
  statusMessage.classList.remove("success");
  gameStatusMessage.classList.remove("success");
  hideElements(statusMessage);
}
//Init function
function init() {
  hideElements(statusMessage, gameDisplay);
  startTime();
  submitButton.addEventListener("click", getInputValue);
}

init();