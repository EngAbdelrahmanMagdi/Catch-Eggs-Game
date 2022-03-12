const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

const START = document.getElementById('start');
const PLAY_AGAIN = document.getElementById('playAgain');
const BASKET = document.getElementById('basket');
const GAME = document.getElementById('game');
const SECONDS_COUNTER = document.getElementById('secondsCounter');
const SCORE = document.getElementById('score');
const nameElem = document.getElementById("nameUser");

const TARGET = 20;
const SECONDS = 60;
const EGG_SPEED = 3;

let GAME_HEIGHT = 600;
let GAME_WIDTH = 400;
let EGGS = [];
let YOUR_SCORE = 0;

let secondsCounter;
let secondsInterval = null;
let gameInterval = null;
let username;

// Get username
let parts = window.location.href.split("?")[1];
username = parts.split("=")[1];

window.addEventListener("DOMContentLoaded", function () {
  nameElem.innerHTML = username;
  // Start the game
  console.log('DOMContentLoaded');
  start();
});

document.addEventListener('keydown', moveBasket);
document.addEventListener('mousemove', function (event) {
  BASKET.style.left = (event.clientX - BASKET.offsetWidth / 2) + "px";
});

function start() {
  resetAll();

  getLastGameDate(username);

  secondsInterval = setInterval(function () {
    secondsCounter--;
    if (secondsCounter > 0) {
      SECONDS_COUNTER.innerHTML = secondsCounter;
    } else {
      clearInterval(secondsInterval);
      secondsInterval = null;
      endGame();
    }
  }, 1000);

  gameInterval = setInterval(function () {
    let min = 30;
    let max = GAME_WIDTH - 30;
    let random = min + (Math.random() * (max - min));
    createEgg(Math.floor(random));
  }, 2000);
}

function resetAll() {
  YOUR_SCORE = 0;
  secondsCounter = SECONDS;

  GAME_HEIGHT = GAME.offsetHeight;
  GAME_WIDTH = GAME.offsetWidth;

  START.style.display = 'none';
  PLAY_AGAIN.style.display = 'none';

  SECONDS_COUNTER.innerHTML = secondsCounter;
  SCORE.innerHTML = YOUR_SCORE;
}

function createEgg(randomLeft) {
  let egg = document.createElement('div');
  egg.className = 'egg';
  egg.style.left = `${randomLeft}px`;
  let top = 0;

  GAME.appendChild(egg);

  function moveEgg() {
    egg.style.top = `${top}px`;

    if (egg.offsetTop > BASKET.offsetTop) {  // reaches the ground
      if (checkCatch(egg)) {
        YOUR_SCORE++;
        SCORE.innerHTML = YOUR_SCORE;
      }
      egg.remove();
      egg = undefined;
    } else { // didn't reach the ground
      top += EGG_SPEED;
      window.requestAnimationFrame(moveEgg);
    }
  }
  window.requestAnimationFrame(moveEgg);
  EGGS.push(egg);
  return egg;
}

function checkCatch(egg) {
  //const eggTop = egg.offsetTop; // top in number

  if (egg.offsetTop > BASKET.offsetTop) { // reaches the ground
    const basketLeft = BASKET.offsetLeft;
    const basketRight = basketLeft + BASKET.offsetWidth;
    const eggLeft = egg.offsetLeft;
    const eggRight = eggLeft + egg.offsetWidth;

    if (eggLeft < basketRight && eggRight > basketLeft) {
      return true;
    }
  }
}

// ----- * ----- * ----- Basket Movment ----- * ----- * ----- //

function moveBasket(e) {
  if (e.which === RIGHT_ARROW) {
    moveBasketRight();
    e.preventDefault();
    e.stopPropagation();
  } else if (e.which === LEFT_ARROW) {
    moveBasketLeft();
    e.preventDefault();
    e.stopPropagation();
  }
}

function moveBasketLeft() {
  function moveLeft() {
    const left = BASKET.offsetLeft;
    if (left < 4) {
      BASKET.style.left = '0px';
    }
    if (left >= 4) {
      BASKET.style.left = `${left - 4}px`;
      window.requestAnimationFrame(moveLeft);
    }
  }
  window.requestAnimationFrame(moveLeft);
}

function moveBasketRight() {
  function moveRight() {
    const right = BASKET.offsetLeft;

    if (right > GAME_WIDTH - 44) {
      BASKET.style.left = `${GAME_WIDTH - 40}px`;
    }
    if (right <= GAME_WIDTH - 44) {
      BASKET.style.left = `${right + 4}px`;
      window.requestAnimationFrame(moveRight);
    }
  }
  window.requestAnimationFrame(moveRight);
}

// ----- * ----- * ----- End Game ----- * ----- * ----- //

function endGame() {
  clearInterval(gameInterval);
  EGGS.forEach(function (egg) {
    egg.remove();
    egg = undefined;
  });

  saveGameDate(username);

  if (YOUR_SCORE >= TARGET) {
    PLAY_AGAIN.innerHTML = `You Win!<br/>You caught ${YOUR_SCORE} eggs!<br/><br/>PLAY AGAIN?`;
  } else {
    PLAY_AGAIN.innerHTML = `You Lose!<br/>You caught ${YOUR_SCORE} eggs!<br/><br/>PLAY AGAIN?`;
  }
  PLAY_AGAIN.style.display = 'inline';
  BASKET.style.left = GAME.offsetWidth / 2;
}
