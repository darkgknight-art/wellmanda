import express from 'express';
import webpush from 'web-push';
import cron from 'node-cron';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const app=express();
app.disable('x-powered-by');
app.use(express.json({limit:'32kb'}));
const PORT=Number(process.env.PORT||3000);
const publicKey=process.env.VAPID_PUBLIC_KEY||'';
const privateKey=process.env.VAPID_PRIVATE_KEY||'';
const enabled=Boolean(publicKey&&privateKey);
if(enabled) webpush.setVapidDetails(process.env.VAPID_SUBJECT||'mailto:admin@example.com',publicKey,privateKey);
const dbPath=process.env.DATA_PATH||path.resolve('subscriptions.json');
let db={};
try{db=JSON.parse(fs.readFileSync(dbPath,'utf8'));}catch{}
function persist(){const tmp=dbPath+'.tmp';fs.writeFileSync(tmp,JSON.stringify(db));fs.renameSync(tmp,dbPath);}
const defaults=[['05:00','운동 시간입니다 💪','오늘의 운동 루틴을 확인하세요.'],['07:00','아침 식사 🍳','운동 후 단백질과 탄수화물을 챙기세요.'],['07:10','오늘의 업무 계획 📋','핵심 업무 3가지를 확인하세요.'],['12:30','점심 식사 🥗','맞춤 식단을 확인하고 식사하세요.'],['14:40','오후 중간 점검','미완료 업무와 다음 방문을 확인하세요.'],['17:30','업무 복기 ✍️','오늘의 성과와 내일의 우선순위를 정리하세요.'],['18:30','저녁 식사 🍽️','오늘의 마지막 식사입니다.'],['19:30','하루 건강 복기 🌙','운동·식단·체중 기록을 점검하세요.'],['20:30','취침 준비 😴','내일 새벽 운동을 위해 정리하세요.']];
app.get('/api/config',(_,res)=>res.json({pushEnabled:enabled,publicKey}));
app.post('/api/subscribe',(req,res)=>{
 const {id,subscription,person,reminders}=req.body||{};
 if(!enabled)return res.status(503).json({error:'VAPID keys not configured'});
 if(typeof id!=='string'||!/^[-a-zA-Z0-9_]{10,80}$/.test(id)||!subscription?.endpoint||!subscription?.keys?.auth||!subscription?.keys?.p256dh)return res.status(400).json({error:'Invalid subscription'});
 if(!['husband','wife'].includes(person)||!Array.isArray(reminders)||reminders.length>20)return res.status(400).json({error:'Invalid settings'});
 const valid=reminders.filter(x=>typeof x.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(x.time)&&typeof x.title==='string'&&x.title.length<100&&typeof x.body==='string'&&x.body.length<240).map(x=>({time:x.time,title:x.title,body:x.body}));
 db[id]={subscription,person,reminders:valid};persist();res.json({ok:true,count:valid.length});
});
app.post('/api/unsubscribe',(req,res)=>{const {id}=req.body||{};if(typeof id==='string'&&db[id]){delete db[id];persist();}res.json({ok:true});});
app.post('/api/test',(req,res)=>{
 const {id}=req.body||{};if(!enabled||!db[id])return res.status(404).json({error:'Not subscribed'});
 webpush.sendNotification(db[id].subscription,JSON.stringify({title:'알림 테스트 🔔',body:'알림이 정상적으로 도착했습니다!',url:'/'})).then(()=>res.json({ok:true})).catch(e=>res.status(502).json({error:'Push delivery failed: '+e.statusCode}));
});
const lastSent=new Map();
cron.schedule('* * * * *',async()=>{
 if(!enabled)return;
 const now=new Date();
 const seoul=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
 const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 let changed=false;
 await Promise.all(Object.entries(db).flatMap(([id,user])=>user.reminders.filter(r=>r.time===seoul).map(async r=>{
   const key=id+':'+date+':'+r.time+':'+r.title;
   if(lastSent.has(key))return;
   lastSent.set(key,true);
   try{await webpush.sendNotification(user.subscription,JSON.stringify({title:r.title,body:r.body,url:'/'}));}
   catch(e){if([404,410].includes(e.statusCode)){delete db[id];changed=true;}else console.error('Push failed',e.statusCode||e.message);}
 })));
 if(changed)persist();
 if(lastSent.size>10000)lastSent.clear();
});
app.use(express.static('public',{maxAge:'1h'}));
app.get('*',(_,res)=>res.sendFile(path.resolve('public/index.html')));
app.listen(PORT,()=>console.log(`Couple Wellness on port ${PORT}; push ${enabled?'enabled':'disabled (set VAPID keys)'}`));
