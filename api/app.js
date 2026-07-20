const express = require('express');
const app = express();
app.use(express.json());

// ========== IN-MEMORY STORAGE ==========
let responses = [];

// ========== INVITATION HTML ==========
const HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>一份特别的邀请 ✨</title>
<style>
:root {
  --rose: #e8a0b4; --rose-dark: #c97d93; --gold: #c9a96e; --gold-light: #e0cfa3;
  --bg: #fdf6f0; --text: #4a3548; --text-light: #7a6578; --white: #fff;
  --shadow: 0 4px 24px rgba(0,0,0,.08); --shadow-lg: 0 12px 48px rgba(0,0,0,.12);
}
* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: 'PingFang SC','Microsoft YaHei','Hiragino Sans GB',sans-serif;
  background: linear-gradient(135deg, #fce4ec 0%, #fdf6f0 30%, #f3e5f5 60%, #fce4ec 100%);
  background-attachment: fixed; min-height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow-x: hidden;
  color: var(--text);
}
.petals { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:0; }
.petal {
  position:absolute; top:-60px; animation: fall linear infinite; opacity:.6; font-size:24px;
}
@keyframes fall {
  0% { transform: translateY(0) rotate(0deg) translateX(0); opacity:.7; }
  50% { opacity:.3; }
  100% { transform: translateY(105vh) rotate(720deg) translateX(80px); opacity:0; }
}
.main { position:relative; z-index:1; width:100%; max-width:480px; padding:20px; }
.envelope-wrap { perspective:1200px; cursor:pointer; animation: float 3s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
.envelope {
  width:100%; aspect-ratio:4/3; background:linear-gradient(145deg,#f0d5d5,#e8c4c4);
  border-radius:20px; position:relative; box-shadow:var(--shadow-lg); overflow:hidden;
  transition:transform .6s cubic-bezier(.4,0,.2,1),opacity .6s;
}
.envelope::before {
  content:''; position:absolute; top:0;left:0;right:0;bottom:0;
  background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);
}
.envelope-flap {
  position:absolute; top:0; left:0; right:0; height:55%;
  background:linear-gradient(180deg,#f5e0e0,#ecc8c8); clip-path:polygon(0 0,50% 70%,100% 0);
  z-index:2; transition:transform .7s cubic-bezier(.4,0,.2,1);
  transform-origin:top center; box-shadow:0 2px 8px rgba(0,0,0,.06);
}
.envelope.open .envelope-flap { transform:rotateX(180deg); }
.envelope-seal {
  position:absolute; top:37%; left:50%; transform:translate(-50%,-50%);
  width:56px; height:56px; background:linear-gradient(135deg,var(--rose),var(--rose-dark));
  border-radius:50%; z-index:3; display:flex; align-items:center; justify-content:center;
  box-shadow:0 4px 16px rgba(200,120,140,.4); transition:transform .4s,opacity .4s;
}
.envelope.open .envelope-seal { transform:translate(-50%,-50%) scale(0); opacity:0; }
.envelope-seal span { font-size:26px; }
.envelope-letter {
  position:absolute; bottom:10%; left:10%; right:10%; top:45%;
  background:linear-gradient(180deg,#fffef9,#fef9f0); border-radius:6px;
  z-index:1; display:flex; align-items:center; justify-content:center;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.04);
  transition:transform .7s cubic-bezier(.4,0,.2,1),opacity .5s;
}
.envelope.open .envelope-letter { transform:translateY(-40px); }
.envelope-letter-content { text-align:center; color:var(--rose-dark); font-size:15px; letter-spacing:2px; line-height:1.8; }
.envelope-letter-content .heart { font-size:20px; display:block; margin-bottom:2px; }
.envelope-hint {
  position:absolute; bottom:-40px; left:50%; transform:translateX(-50%);
  color:var(--text-light); font-size:13px; animation:pulse 2s ease-in-out infinite; white-space:nowrap;
}
@keyframes pulse { 0%,100%{opacity:.5;} 50%{opacity:1;} }
.card {
  background:rgba(255,255,255,.85); backdrop-filter:blur(20px);
  border-radius:24px; padding:36px 28px; box-shadow:var(--shadow-lg); text-align:center;
  display:none; animation:cardIn .6s ease;
}
.card.active { display:block; }
@keyframes cardIn { from{opacity:0;transform:translateY(30px) scale(.95);} to{opacity:1;transform:translateY(0) scale(1);} }
.card-title { font-size:26px; font-weight:700; margin-bottom:8px; color:var(--rose-dark); letter-spacing:2px; }
.card-subtitle { font-size:14px; color:var(--text-light); margin-bottom:28px; letter-spacing:1px; }
.card-dear { font-size:16px; color:var(--text-light); margin-bottom:20px; line-height:1.8; letter-spacing:1px; }
.options { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-bottom:24px; }
.option {
  padding:14px 22px; border:2px solid #e8d5d5; border-radius:50px; background:var(--white);
  cursor:pointer; font-size:15px; color:var(--text); transition:all .3s; user-select:none;
  display:flex; align-items:center; gap:8px; letter-spacing:1px;
}
.option:hover { border-color:var(--rose); background:#fef5f7; transform:translateY(-2px); box-shadow:0 6px 20px rgba(200,120,140,.15); }
.option.selected {
  border-color:var(--rose-dark); background:linear-gradient(135deg,#fce4ec,#f8d4e0);
  color:var(--rose-dark); font-weight:600; box-shadow:0 4px 16px rgba(200,120,140,.2);
}
.time-group { display:flex; flex-direction:column; gap:14px; margin-bottom:24px; }
.time-row { display:flex; gap:10px; align-items:center; justify-content:center; }
.time-row label { font-size:14px; color:var(--text-light); min-width:40px; letter-spacing:1px; }
.time-input {
  padding:10px 16px; border:2px solid #e8d5d5; border-radius:12px; font-size:15px;
  background:var(--white); color:var(--text); font-family:inherit; outline:none;
  transition:border-color .3s; letter-spacing:1px;
}
.time-input:focus { border-color:var(--rose); }
.date-buttons { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
.date-btn {
  padding:8px 16px; border:2px solid #e8d5d5; border-radius:50px; background:var(--white);
  cursor:pointer; font-size:13px; color:var(--text); transition:all .3s; font-family:inherit;
}
.date-btn:hover { border-color:var(--rose); background:#fef5f7; }
.date-btn.selected { border-color:var(--rose-dark); background:#fce4ec; color:var(--rose-dark); font-weight:600; }
.btn {
  padding:14px 40px; border:none; border-radius:50px; font-size:16px; font-weight:600;
  cursor:pointer; letter-spacing:2px; transition:all .3s; font-family:inherit;
  display:inline-flex; align-items:center; gap:8px;
}
.btn-primary {
  background:linear-gradient(135deg,var(--rose),var(--rose-dark)); color:#fff;
  box-shadow:0 6px 24px rgba(200,120,140,.35);
}
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(200,120,140,.45); }
.btn-primary:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-secondary { background:var(--white); color:var(--rose-dark); border:2px solid var(--rose); }
.btn-secondary:hover { background:#fef5f7; transform:translateY(-2px); }
.btn-group { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:8px; }
.response-textarea {
  width:100%; min-height:100px; padding:16px; border:2px solid #e8d5d5; border-radius:16px;
  font-size:15px; font-family:inherit; resize:vertical; outline:none; background:var(--white);
  color:var(--text); margin-bottom:20px; transition:border-color .3s; letter-spacing:1px; line-height:1.6;
}
.response-textarea:focus { border-color:var(--rose); }
.final-heart { font-size:72px; animation:heartBeat 1s ease-in-out infinite; display:block; }
@keyframes heartBeat {
  0%,100%{transform:scale(1);} 15%{transform:scale(1.25);} 30%{transform:scale(1);} 45%{transform:scale(1.15);} 60%{transform:scale(1);}
}
.confetti-wrap { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:10; }
.confetti {
  position:absolute; width:10px; height:10px; border-radius:2px;
  animation:confettiFall linear forwards;
}
@keyframes confettiFall {
  0%{transform:translateY(-10vh) rotate(0deg); opacity:1;}
  100%{transform:translateY(110vh) rotate(720deg); opacity:0;}
}
.progress { display:flex; gap:8px; justify-content:center; margin-bottom:24px; }
.progress-dot { width:8px; height:8px; border-radius:50%; background:#e8d5d5; transition:all .4s; }
.progress-dot.done { background:var(--rose-dark); }
.progress-dot.current { background:var(--rose); width:24px; border-radius:12px; }
.fade-out { animation:fadeOut .4s ease forwards; }
@keyframes fadeOut { to{opacity:0;transform:translateY(-20px) scale(.95);} }
.toast {
  position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:100;
  padding:12px 24px; border-radius:50px; color:#fff; font-size:14px; font-weight:600;
  letter-spacing:1px; opacity:0; transition:opacity .3s;
}
.toast.success { background:linear-gradient(135deg,#7ecb8a,#5aad6e); }
.toast.error { background:linear-gradient(135deg,#e8a0a0,#d47878); }
@media(max-width:480px) {
  .card{padding:28px 18px;border-radius:20px;}
  .card-title{font-size:22px;}
  .option{padding:12px 16px;font-size:14px;}
  .main{padding:12px;}
}
</style>
</head>
<body>
<div class="petals" id="petals"></div>
<div class="confetti-wrap" id="confetti"></div>
<div class="toast" id="toast"></div>

<div class="main">
  <div class="envelope-wrap" id="envelopeWrap" onclick="openEnvelope()">
    <div class="envelope" id="envelope">
      <div class="envelope-flap"></div>
      <div class="envelope-seal"><span>💌</span></div>
      <div class="envelope-letter">
        <div class="envelope-letter-content"><span class="heart">💗</span>点 击 开 启</div>
      </div>
    </div>
    <div class="envelope-hint">👆 点击信封打开邀请</div>
  </div>

  <div class="card" id="card1">
    <div class="progress"><div class="progress-dot done"></div><div class="progress-dot current"></div><div class="progress-dot"></div><div class="progress-dot"></div><div class="progress-dot"></div></div>
    <div class="card-title">💌 一份特别的邀请</div>
    <div class="card-dear">嗨，<br>我想了很久，<br>决定认真地邀请你，<br>一起吃一顿饭 ✨<br><br><span style="font-size:13px;color:var(--text-light)">—— 点击下面的选项告诉我你的想法吧</span></div>
    <div style="margin-bottom:16px;color:var(--text-light);font-size:14px;">你想吃什么？</div>
    <div class="options" id="foodOptions">
      <div class="option" data-value="中餐" onclick="selectOption(this,'foodOptions')">🥢 中餐</div>
      <div class="option" data-value="日料" onclick="selectOption(this,'foodOptions')">🍣 日料</div>
      <div class="option" data-value="西餐" onclick="selectOption(this,'foodOptions')">🍝 西餐</div>
      <div class="option" data-value="火锅" onclick="selectOption(this,'foodOptions')">🍲 火锅</div>
      <div class="option" data-value="烧烤" onclick="selectOption(this,'foodOptions')">🥩 烧烤</div>
      <div class="option" data-value="随意" onclick="selectOption(this,'foodOptions')">🎲 听你的</div>
    </div>
    <button class="btn btn-primary" id="btn1" onclick="goTo(2)" disabled>下一步 →</button>
  </div>

  <div class="card" id="card2">
    <div class="progress"><div class="progress-dot done"></div><div class="progress-dot done"></div><div class="progress-dot current"></div><div class="progress-dot"></div><div class="progress-dot"></div></div>
    <div class="card-title">📍 想去哪里？</div>
    <div class="card-subtitle">选一个你喜欢的地方</div>
    <div class="options" id="locOptions">
      <div class="option" data-value="市中心" onclick="selectOption(this,'locOptions')">🏙️ 市中心</div>
      <div class="option" data-value="安静小店" onclick="selectOption(this,'locOptions')">🌿 安静小店</div>
      <div class="option" data-value="江边/海边" onclick="selectOption(this,'locOptions')">🌊 江边/海边</div>
      <div class="option" data-value="天台餐厅" onclick="selectOption(this,'locOptions')">🌃 天台餐厅</div>
      <div class="option" data-value="新开的店" onclick="selectOption(this,'locOptions')">🆕 去探新店</div>
      <div class="option" data-value="随意" onclick="selectOption(this,'locOptions')">🎲 听你的</div>
    </div>
    <div class="btn-group"><button class="btn btn-secondary" onclick="goTo(1)">← 上一步</button><button class="btn btn-primary" id="btn2" onclick="goTo(3)" disabled>下一步 →</button></div>
  </div>

  <div class="card" id="card3">
    <div class="progress"><div class="progress-dot done"></div><div class="progress-dot done"></div><div class="progress-dot done"></div><div class="progress-dot current"></div><div class="progress-dot"></div></div>
    <div class="card-title">📅 什么时候见？</div>
    <div class="card-subtitle">选一个你方便的时间</div>
    <div style="margin-bottom:10px;color:var(--text-light);font-size:13px;">最近几天：</div>
    <div class="date-buttons" id="dateOptions"></div>
    <div class="time-group" style="margin-top:12px;">
      <div class="time-row"><label>🕐 时间</label><input type="time" class="time-input" id="timeInput" value="18:30"></div>
    </div>
    <div class="btn-group"><button class="btn btn-secondary" onclick="goTo(2)">← 上一步</button><button class="btn btn-primary" id="btn3" onclick="goTo(4)" disabled>下一步 →</button></div>
  </div>

  <div class="card" id="card4">
    <div class="progress"><div class="progress-dot done"></div><div class="progress-dot done"></div><div class="progress-dot done"></div><div class="progress-dot done"></div><div class="progress-dot current"></div></div>
    <div class="card-title">💬 你的回应</div>
    <div class="card-subtitle">说点什么吧，我很期待听到你的回答</div>
    <textarea class="response-textarea" id="responseText" placeholder="比如：好啊，那到时候见~ 😊"></textarea>
    <div class="btn-group"><button class="btn btn-secondary" onclick="goTo(3)">← 上一步</button><button class="btn btn-primary" onclick="submitResponse()">💗 回应邀请</button></div>
  </div>

  <div class="card" id="card5">
    <span class="final-heart">💗</span>
    <div class="card-title" style="margin-top:12px;">谢谢你愿意来！</div>
    <div class="card-dear" id="finalMsg"></div>
    <div style="margin-top:20px;color:var(--text-light);font-size:13px;">到时候见 ✨<br><span style="font-size:12px;">—— 一个紧张又期待的人</span></div>
  </div>
</div>

<script>
// Petals
(function(){
  var p=document.getElementById('petals');
  var emojis=['🌸','💮','🌷','🪷','🌺','✿','❀','💠','🌼'];
  for(var i=0;i<30;i++){
    var el=document.createElement('span');
    el.className='petal';
    el.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    el.style.left=Math.random()*100+'%';
    el.style.animationDuration=(8+Math.random()*12)+'s';
    el.style.animationDelay=Math.random()*10+'s';
    el.style.fontSize=(14+Math.random()*20)+'px';
    p.appendChild(el);
  }
})();

// Date buttons
(function(){
  var d=document.getElementById('dateOptions');
  var days=['今天','明天','后天'];
  var now=new Date();
  for(var i=0;i<7;i++){
    var dt=new Date(now);
    dt.setDate(dt.getDate()+i);
    var label=i<3?days[i]:(dt.getMonth()+1)+'/'+dt.getDate()+' 周'+'日一二三四五六'[dt.getDay()];
    var btn=document.createElement('div');
    btn.className='date-btn';
    btn.textContent=label;
    btn.dataset.value=label;
    btn.onclick=function(){selectDate(this);};
    d.appendChild(btn);
  }
})();

var selectedFood='',selectedLoc='',selectedDate='',selectedTime='18:30';
var currentScreen=0;

function selectOption(el,groupId){
  var opts=document.querySelectorAll('#'+groupId+' .option');
  for(var i=0;i<opts.length;i++) opts[i].classList.remove('selected');
  el.classList.add('selected');
  if(groupId==='foodOptions'){selectedFood=el.dataset.value;document.getElementById('btn1').disabled=false;}
  if(groupId==='locOptions'){selectedLoc=el.dataset.value;document.getElementById('btn2').disabled=false;}
}

function selectDate(el){
  var opts=document.querySelectorAll('#dateOptions .date-btn');
  for(var i=0;i<opts.length;i++) opts[i].classList.remove('selected');
  el.classList.add('selected');
  selectedDate=el.dataset.value;
  checkTimeReady();
}

document.getElementById('timeInput').addEventListener('input',function(){
  selectedTime=this.value;checkTimeReady();
});

function checkTimeReady(){
  var t=selectedTime||document.getElementById('timeInput').value;
  document.getElementById('btn3').disabled=!(selectedDate&&t);
}

function openEnvelope(){
  if(currentScreen!==0)return;
  document.getElementById('envelope').classList.add('open');
  setTimeout(function(){
    document.getElementById('envelopeWrap').style.animation='fadeOut .5s ease forwards';
    setTimeout(function(){
      document.getElementById('envelopeWrap').style.display='none';
      goTo(1);
    },500);
  },800);
  currentScreen=-1;
}

function goTo(n){
  currentScreen=n;
  for(var i=1;i<=5;i++){
    var c=document.getElementById('card'+i);
    if(c)c.classList.remove('active');
  }
  var target=document.getElementById('card'+n);
  if(target){target.classList.add('active');target.scrollIntoView({behavior:'smooth',block:'center'});}
  if(n===3&&!selectedDate){
    var firstDate=document.querySelector('#dateOptions .date-btn');
    if(firstDate)firstDate.click();
  }
}

function showToast(msg,isError){
  var t=document.getElementById('toast');
  t.textContent=msg;
  t.className='toast '+(isError?'error':'success');
  t.style.opacity='1';
  setTimeout(function(){t.style.opacity='0';},3000);
}

function submitResponse(){
  var msg=document.getElementById('responseText').value||'好啊，那到时候见~ 😊';
  var data={
    food:selectedFood, location:selectedLoc,
    date:selectedDate, time:selectedTime||document.getElementById('timeInput').value,
    message:msg, timestamp:new Date().toISOString()
  };
  // Send to backend
  fetch('/api/submit',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(data)
  }).then(function(r){return r.json();}).then(function(res){
    if(res.ok){
      document.getElementById('finalMsg').innerHTML=
        '我们约好了：<br><br><strong>🍽️ '+selectedFood+'</strong> &nbsp;在 &nbsp;<strong>📍 '+selectedLoc+'</strong><br><strong>📅 '+selectedDate+'</strong> &nbsp;🕐 <strong>'+data.time+'</strong><br><br><span style="font-size:14px;color:var(--text-light)">你说："'+msg+'"</span>';
      goTo(5); launchConfetti();
    }else{
      showToast('发送失败，请重试',true);
    }
  }).catch(function(){
    showToast('网络错误，请检查网络后重试',true);
  });
}

function launchConfetti(){
  var wrap=document.getElementById('confetti');
  var colors=['#e8a0b4','#c9a96e','#f8d4e0','#e0cfa3','#f5a0b8','#d4a0c8','#ffd1dc'];
  for(var i=0;i<80;i++){
    var el=document.createElement('div');
    el.className='confetti';
    el.style.left=Math.random()*100+'%';
    el.style.top=-(Math.random()*20)+'%';
    el.style.animationDuration=(2+Math.random()*3)+'s';
    el.style.animationDelay=Math.random()*1.5+'s';
    el.style.width=(6+Math.random()*10)+'px';
    el.style.height=(6+Math.random()*10)+'px';
    el.style.background=colors[Math.floor(Math.random()*colors.length)];
    el.style.borderRadius=Math.random()>.5?'50%':'2px';
    wrap.appendChild(el);
    setTimeout(function(){el.remove();},5000);
  }
}
</script>
</body>
</html>`;

// ========== ROUTES ==========

// Serve invitation page
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(HTML);
});

// Submit response
app.post('/api/submit', (req, res) => {
  const { food, location, date, time, message } = req.body;
  if (!food || !location || !date) {
    return res.status(400).json({ ok: false, error: '请填写完整信息' });
  }
  const record = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    food, location, date, time, message,
    createdAt: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  };
  responses.push(record);
  console.log('New response:', JSON.stringify(record, null, 2));
  res.json({ ok: true });
});

// Admin page
app.get('/admin', (req, res) => {
  const pw = req.query.pw || '';
  // Change this password!
  const ADMIN_PW = 'momo520';
  if (pw !== ADMIN_PW) {
    return res.send(`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>管理员登录</title><style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'PingFang SC','Microsoft YaHei',sans-serif;background:linear-gradient(135deg,#fce4ec,#fdf6f0,#f3e5f5);min-height:100vh;display:flex;align-items:center;justify-content:center;}
      .box{background:rgba(255,255,255,.9);padding:40px 32px;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.1);text-align:center;max-width:380px;width:90%;}
      h2{margin-bottom:24px;color:#c97d93;}
      input{padding:12px 16px;border:2px solid #e8d5d5;border-radius:50px;font-size:15px;width:100%;outline:none;text-align:center;font-family:inherit;letter-spacing:2px;margin-bottom:16px;box-sizing:border-box;}
      input:focus{border-color:#c97d93;}
      button{padding:12px 32px;border:none;border-radius:50px;background:linear-gradient(135deg,#e8a0b4,#c97d93);color:#fff;font-size:15px;font-weight:600;cursor:pointer;letter-spacing:2px;font-family:inherit;}
    </style></head><body><div class="box"><h2>🔐 管理员登录</h2><form method="get" action="/admin"><input type="password" name="pw" placeholder="请输入密码" autofocus><br><button type="submit">验证</button></form></div></body></html>`);
  }

  // Show responses
  const rows = responses.length === 0
    ? '<div style="text-align:center;color:#999;padding:40px;">还没有收到回应<br><br>💌 把链接发给对方吧~</div>'
    : responses.slice().reverse().map((r, i) => `
      <div style="background:#fff;border-radius:16px;padding:20px;margin-bottom:16px;box-shadow:0 2px 12px rgba(0,0,0,.06);">
        <div style="font-size:13px;color:#999;margin-bottom:8px;">#${responses.length - i} · ${r.createdAt}</div>
        <div style="font-size:16px;line-height:2;color:#4a3548;">
          🍽️ <strong>${esc(r.food)}</strong> · 📍 <strong>${esc(r.location)}</strong><br>
          📅 <strong>${esc(r.date)}</strong> · 🕐 <strong>${esc(r.time||'未填')}</strong>
        </div>
        ${r.message ? `<div style="margin-top:12px;padding:12px 16px;background:#fef5f7;border-radius:12px;color:#7a6578;font-size:14px;line-height:1.6;">💬 ${esc(r.message)}</div>` : ''}
      </div>
    `).join('');

  res.send(`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>💌 回应列表</title><style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'PingFang SC','Microsoft YaHei',sans-serif;background:linear-gradient(135deg,#fce4ec,#fdf6f0,#f3e5f5);min-height:100vh;padding:20px;}
    .wrap{max-width:500px;margin:0 auto;}
    h1{text-align:center;color:#c97d93;margin:20px 0;letter-spacing:2px;}
    .info{text-align:center;color:#999;font-size:13px;margin-bottom:20px;}
    .url-box{background:#fff;border-radius:12px;padding:12px 16px;margin-bottom:20px;text-align:center;font-size:13px;color:#666;word-break:break-all;}
    .url-box strong{color:#c97d93;}
    .refresh{text-align:center;margin-bottom:20px;}
    .refresh a{color:#c97d93;font-size:13px;text-decoration:none;}
  </style></head><body><div class="wrap">
    <h1>💌 收到的回应</h1>
    <div class="info">邀请链接：<strong>${esc(req.protocol + '://' + req.get('host') + '/')}</strong></div>
    <div class="refresh"><a href="?pw=${esc(pw)}">🔄 刷新查看</a></div>
    ${rows}
  </div></body></html>`);
});

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// For local dev
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log('Invitation app running at http://localhost:' + port));
}

module.exports = app;
