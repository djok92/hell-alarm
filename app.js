let clock = document.querySelector(".clock");
let clockDisplay = document.querySelector(".clockDisplay");
let gameDisplay = document.querySelector(".gameDisplay");
let submitButton = document.querySelector(".submitButton");
let setAgain = document.querySelector(".againButton");
let statusMessage = document.querySelector(".statusMessage");
let gameStatusMessage = document.querySelector(".gameStatusMessage");
let gameNumInput = document.querySelector("#guessNumberInput");
let minuteInput = document.querySelector("#minuteInput");
let hourInput = document.querySelector("#hourInput");
let numberLimitSpan = document.querySelector(".numberLimit");
let audio = new Audio("alarm_classic.mp3");
let counter = 0;
let correctNum, guessNum;
let minuteInputVal, hourInputVal, alarmTime, currentTime, play;

function hideElements(arg) {
  if (arg.length < 2) {
    arg.style.display = "none";
  } else {
    Array.from(arguments).forEach(item => {
      item.style.display = "none";
    });
  }
}

function showElements(arg) {
  if (arg.length < 2) {
    arg.style.display = "block";
  } else {
    Array.from(arguments).forEach(item => {
      item.style.display = "block";
    });
  }
}

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

function checkTime(i) {
  if (i < 10 && i.toString().length < 2) {
    i = "0" + i;
  }
  return i;
}

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

function inputSuccess() {
  updateUiSuccess();
  resetInput();
}

function inputError() {
  updateUiError();
  resetInput();
  return;
}

function resetInput() {
  minuteInput.value = null;
  hourInput.value = null;
}

function updateUiSuccess() {
  showElements(statusMessage);
  statusMessage.textContent = `Your alarm is set at: ${alarmTime}`;
  statusMessage.classList.remove("error");
  statusMessage.classList.add("success");
}

function updateUiError() {
  showElements(statusMessage);
  statusMessage.textContent =
    "Sorry you have entered invalid value, please try again!";
  statusMessage.classList.remove("success");
  statusMessage.classList.add("error");
}

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

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
  play = false;
}

function numberGuesser() {
  hideElements(setAgain);
  showElements(gameDisplay);
  numberLimit = 100;
  correctNum = Math.round(Math.random() * numberLimit);
  numberLimitSpan.textContent = numberLimit;
  gameNumInput.focus();
  gameNumInput.value = "";
  gameNumInput.addEventListener("keypress", function(e) {
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
  console.log(correctNum);
}

function correctGuess() {
  counter++;
  gameStatusMessage.classList.remove("error");
  gameStatusMessage.classList.add("success");
  gameStatusMessage.textContent = "You have stopped alarm!";
  showElements(setAgain);
  setAgain.addEventListener("click", function() {
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

function init() {
  hideElements(statusMessage, gameDisplay);
  startTime();
  submitButton.addEventListener("click", getInputValue);
}

init();
