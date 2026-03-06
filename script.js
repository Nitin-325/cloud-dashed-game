
// Selectors
const box = document.querySelector('.box');
const play = document.querySelector('.box button');
const gamePage = document.querySelector('.game');
const cloudArea = document.querySelector('.game #cloud');
const cloud = document.querySelectorAll('.game #cloud .p');
const livesSelector = document.querySelector('.game #left #lives span');
const scoreSelector = document.querySelector('.game #left #score span');
const again = document.querySelector('.again');
const newGame = document.querySelector('.again #boxAgain #butdiv #new');
const resumeGame = document.querySelector('.again #boxAgain #butdiv #resume');
const exitGame = document.querySelector('.again #boxAgain #butdiv #exit');
const displayScore = document.querySelector('.again #boxAgain h2 span');
const setting = document.querySelector('.game #setting');

// Variables

var interval;
let flag = 1;
let arr = Array.from({ length: 20 }, (_, i) => i);
let arrCol = ['yellow', 'green', 'blue', 'royalblue', 'orange', 'cyan', 'pink', 'purple', 'blueviolet', 'red', 'black'];
let score = 0;
let count = 0;
let num;
let duration = 10;
let lives = 10;

// Functions
function scoreIncreDecreFunc(val) {
    switch (val) {
        case 'yellow':
        case 'green':
        case 'blue':
            num = 30;
            score += 30;
            scoreSelector.style.color = 'rgb(12, 255, 12)';
            break;
        case 'royalblue':
        case 'orange':
            num = 20;
            score += 20;
            scoreSelector.style.color = 'rgb(12, 255, 12)';
            break;
        case 'cyan':
        case 'pink':
            num = 10;
            score += 10;
            scoreSelector.style.color = 'rgb(12, 255, 12)';
            break;
        case 'purple':
        case 'blueviolet':
            num = -10;
            score -= 10;
            scoreSelector.style.color = 'red';
            break;
        case 'red':
        case 'black':
            num = -20;
            score -= 20;
            scoreSelector.style.color = 'red';
            break;
        default:
            break;
    }
}

function playGameButtonFunc() {
    play.addEventListener('click', () => {
        setTimeout(() => {
            box.style.animationName = 'opac';
            box.style.animationDuration = '1s';
            setTimeout(() => {
                box.style.visibility = 'hidden';
                gamePage.style.visibility = 'visible';
                flag = 0;
                gameStart();
            }, 900);
        }, 500);
    });
}

function gameStart() {
    interval = setInterval(() => {
        if(flag == 0){
            if (lives < 1) {
                flag = 1;
                endGame();
                return;
            }

            let val = Math.floor(Math.random() * arr.length);
            let create = document.createElement("div");
            create.classList.add('cloud');

            if (cloud[val]) {
                cloud[val].append(create);
                count++;
                adjustDuration();
                styleCloud(create, val);
            } else {
                console.error(`Invalid cloud index: ${val}`);
            }
            console.log("HEY", count)
        }
    }, 1000);
}

function adjustDuration() {
    if(count >= 30 && count <= 100) duration = Math.floor(Math.random() * 5) + 4;
    else if(count >= 100 && count <= 150) duration = Math.floor(Math.random() * 5) + 2;
    else if(count >= 150) duration = Math.floor(Math.random() * 5) + 1;
}

function styleCloud(create) {
    let col = Math.floor(Math.random() * arrCol.length);
    create.style.animationDuration = `${duration}s`;
    create.style.backgroundColor = `${arrCol[col]}`;

    create.addEventListener('click', () => handleCloudClick(create, col));
    create.addEventListener('animationend', () => handleCloudMiss(create, col));
}

function handleCloudClick(create, col) {
    scoreIncreDecreFunc(arrCol[col]);
    scoreSelector.innerHTML = `${score}`;
    create.innerHTML = `${num}`;
    create.style.border = 'none';
    create.style.animationPlayState = 'paused';
    create.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    create.style.color = num > 0 ? 'rgb(12, 255, 12)' : 'red';
    if (num < 0) lives--;
    livesColFunc()

    setTimeout(() => create.remove(), 500);
}

function handleCloudMiss(create, col) {
    if (col <= 6) {
        create.innerHTML = '-5'
        create.style.animationName = 'up'
        create.style.backgroundColor = 'rgba(0, 0, 0, 0)'
        create.style.border = 'none';
        score -= 5;
        scoreSelector.innerHTML = `${score}`;
        scoreSelector.style.color = 'red';
        lives--;
        livesColFunc();

    }
    setTimeout(() => create.remove(), 500);
}

function endGame() {
    clearInterval(interval)
    resumeGame.style.visibility = 'hidden';
    playAgainFunc();
}

function playAgainFunc() {
    flag = 1;
    again.style.visibility = 'visible';
    again.style.zIndex = '50';
    displayScore.innerHTML = `${score}`;

    let clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => cloud.style.animationPlayState = 'paused');

    // Remove previous event listeners by cloning nodes
    const newNewGame = newGame.cloneNode(true);
    newGame.parentNode.replaceChild(newNewGame, newGame);
    const newExitGame = exitGame.cloneNode(true);
    exitGame.parentNode.replaceChild(newExitGame, exitGame);

    // Add event listeners only once
    newNewGame.addEventListener('click', () => resetGame(), { multiple: true });
    resumeGame.addEventListener('click', () => { resumePausedGame()})
    newExitGame.addEventListener('click', () => exitToMainMenu(), { multiple: true });

    // Update references
    window.newGame = newNewGame;
    window.exitGame = newExitGame;
}

function resetGame() {
    clearInterval(interval)
    score = 0;
    lives = 10;
    scoreSelector.style.color = 'black'
    scoreSelector.innerHTML = `${score}`;
    again.style.visibility = 'hidden';
    again.style.zIndex = '10';
    resumeGame.style.visibility = 'hidden';
    let cloudsOnScreen = document.querySelectorAll('.cloud');
    cloudsOnScreen.forEach(cloud => cloud.remove());
    setTimeout( () => {
        count = 0;
        flag = 0;
        gameStart()
    },2000)
}

function resumePausedGame() {
    let cloudsOnScreen = document.querySelectorAll('.cloud');
    cloudsOnScreen.forEach(cloud => cloud.style.animationPlayState = 'running');
    flag = 0;
    resumeGame.style.visibility = 'hidden';
    again.style.visibility = 'hidden';
}

function exitToMainMenu() {
    clearInterval(interval)
    count = 0;
    score = 0;
    lives = 10;
    scoreSelector.style.color = 'black'
    scoreSelector.innerHTML = `${score}`;
    again.style.visibility = 'hidden';
    gamePage.style.visibility = 'hidden';
    box.style.visibility = 'visible';
    resumeGame.style.visibility = 'hidden';
    let cloudsOnScreen = document.querySelectorAll('.cloud');
    cloudsOnScreen.forEach(cloud => cloud.remove());
}

function livesColFunc(){
    livesSelector.innerHTML = `${lives}`
    if(lives > 5) livesSelector.style.color = 'rgba(0, 255, 0)';
    else livesSelector.style.color = 'rgb(255, 0 ,0)';
}

setting.addEventListener('click', () => {
    flag = 1;
    resumeGame.style.visibility = 'visible';
    playAgainFunc();
});




playGameButtonFunc()
