let score=0;
let combo=0;
let currentMole=-1;
let username="";
let difficulty="medium";

let moleSpeed=600;
let gameTime=30;

function setDifficulty(level){

    difficulty=level;

    if(level==="easy") moleSpeed=900;
    if(level==="medium") moleSpeed=600;
    if(level==="hard") moleSpeed=350;

    document.getElementById("selectedDifficulty")
        .innerText=`Difficulty: ${level}`;
}

function startGame(){

    username=document.getElementById("username").value.trim();

    if(!username){
        alert("Enter your name first");
        return;
    }

    document.getElementById("startScreen").style.display="none";
    document.getElementById("gameContainer").style.display="block";

    createBoard();
    loadLeaderboard();

    startTimer();
    spawnMole();
}

function createBoard(){

    const board=document.getElementById("board");

    for(let i=0;i<9;i++){

        const hole=document.createElement("div");

        hole.className="hole";

        hole.onclick=()=>hitMole(i);

        board.appendChild(hole);
    }
}

function spawnMole(){

    setInterval(()=>{

        const holes=document.querySelectorAll(".hole");

        holes.forEach(h=>h.innerHTML="");

        currentMole=Math.floor(Math.random()*9);

        holes[currentMole].innerHTML=
        `<div class="mole">🐹</div>`;

    },moleSpeed);
}

function hitMole(index){

    if(index!==currentMole) return;

    combo++;

    let points=1;

    if(combo>=5) points=3;
    else if(combo>=3) points=2;

    score+=points;

    document.getElementById("score").innerText=score;
    document.getElementById("combo").innerText=combo;

    currentMole=-1;
}

function startTimer(){

    const timer=document.getElementById("timer");

    const interval=setInterval(()=>{

        gameTime--;

        timer.innerText=gameTime;

        if(gameTime<=10){
            timer.classList.add("pulse");
        }

        if(gameTime<=0){

            clearInterval(interval);

            endGame();
        }

    },1000);
}

function endGame(){

    let achievement="🐣 Beginner";

    if(score>=10) achievement="⚡ Speedster";
    if(score>=25) achievement="🔥 Hunter";
    if(score>=50) achievement="👑 Mole King";

    document.getElementById("achievement").innerText=
    achievement;

    document.getElementById("finalScore").innerText=
    `Score: ${score}`;

    document.getElementById("badge").innerText=
    achievement;

    document.getElementById("gameOverModal").style.display=
    "block";
}

async function submitScore(){

    await fetch('/api/score',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            username,
            score
        })
    });

    location.reload();
}

async function loadLeaderboard(){

    const res=await fetch('/api/leaderboard');

    const data=await res.json();

    const list=document.getElementById("leaderboardList");

    list.innerHTML="";

    data.forEach((player,index)=>{

        let medal="";

        if(index===0) medal="🥇";
        else if(index===1) medal="🥈";
        else if(index===2) medal="🥉";

        list.innerHTML+=`
        <li>
            ${medal}
            ${player.username}
            -
            ${player.score}
        </li>
        `;
    });
}