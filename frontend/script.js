const board=document.getElementById('board');
const scoreEl=document.getElementById('score');
const timeEl=document.getElementById('time');
const startBtn=document.getElementById('startBtn');
const submitBtn=document.getElementById('submitBtn');
const leaderboard=document.getElementById('leaderboard');
const msg=document.getElementById('message');
const usernameInput=document.getElementById('username');
let score=0,time=30,timer,moleTimer,current=-1,gameRunning=false;

for(let i=0;i<9;i++){
 const d=document.createElement('div');
 d.className='hole';
 d.onclick=()=>{ if(gameRunning && i===current){ score++; scoreEl.textContent=score; current=-1; d.classList.remove('mole'); } };
 board.appendChild(d);
}
const holes=document.querySelectorAll('.hole');

function showMessage(t){ msg.textContent=t; setTimeout(()=>msg.textContent='',2500); }
function showMole(){
 holes.forEach(h=>h.classList.remove('mole'));
 current=Math.floor(Math.random()*9);
 holes[current].classList.add('mole');
}
async function loadLeaderboard(){
 try{
   const r=await fetch('/api/leaderboard');
   const data=await r.json();
   leaderboard.innerHTML='';
   if(data.length===0){ leaderboard.innerHTML='<li>No scores yet</li>'; return; }
   data.forEach((x,i)=>{
     const li=document.createElement('li');
     li.textContent=`${i+1}. ${x.username} — ${x.score}`;
     leaderboard.appendChild(li);
   });
 }catch{ leaderboard.innerHTML='<li>API not connected</li>'; }
}

startBtn.onclick=()=>{
 const username=usernameInput.value.trim();
 if(!username){ showMessage('Please enter your name first!'); return; }
 gameRunning=true; score=0; time=30;
 scoreEl.textContent=0; timeEl.textContent=30; submitBtn.disabled=true;
 showMole();
  moleTimer=setInterval(showMole,700);
 timer=setInterval(()=>{
   time--; timeEl.textContent=time;
   if(time<=0){
     clearInterval(timer); clearInterval(moleTimer);
     holes.forEach(h=>h.classList.remove('mole'));
     gameRunning=false;
     submitBtn.disabled=false;
     showMessage('Game over! Submit your score.');
   }
 },1000);
};

submitBtn.onclick=async()=>{
 const username=usernameInput.value.trim();
 if(!username) return;
 const r=await fetch('/api/score',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({username,score})
 });
  if(r.ok){ showMessage('Score submitted!'); submitBtn.disabled=true; loadLeaderboard(); }
};

loadLeaderboard();