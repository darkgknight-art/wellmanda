const KEY='coupleWellnessV1';
const defaultAlerts=[
 {time:'05:00',title:'운동 시간입니다 💪',body:'오늘의 운동 루틴을 확인하세요.',on:true},
 {time:'07:00',title:'아침 식사 🍳',body:'운동 후 단백질과 탄수화물을 챙기세요.',on:true},
 {time:'07:10',title:'오늘의 업무 계획 📋',body:'오늘의 핵심 업무 3가지를 확인하세요.',on:true},
 {time:'12:30',title:'점심 식사 🥗',body:'오늘의 맞춤 식단을 확인하세요.',on:true},
 {time:'14:40',title:'오후 중간 점검',body:'남은 업무를 확인하세요.',on:true},
 {time:'17:30',title:'업무 복기 ✍️',body:'성과와 내일 할 일을 정리하세요.',on:true},
 {time:'18:30',title:'저녁 식사 🍽️',body:'오늘의 저녁 식단을 확인하세요.',on:true},
 {time:'19:30',title:'하루 건강 복기 🌙',body:'오늘의 운동·식단을 점검하세요.',on:true},
 {time:'20:30',title:'취침 준비 😴',body:'새벽 운동을 위해 잠자리를 준비하세요.',on:true}
];
const routines=[
 {title:'하체 A + 경사 걷기',items:[['워밍업 걷기','5~5.5km/h','4.5~5km/h','10분'],['레그프레스','60kg','20~30kg','12회 × 3'],['레그컬','15~20kg','5~10kg','12회 × 3'],['레그익스텐션','15~20kg','5~10kg','12회 × 3'],['카프레이즈','맨몸~20kg','맨몸','15회 × 3'],['플랭크','30~40초','20~30초','3세트'],['경사 걷기','5~5.5km/h','4.5~5km/h','25분']]},
 {title:'상체 A + 계단',items:[['워밍업','5km/h','4.5km/h','10분'],['랫풀다운','30kg','10~15kg','12회 × 3'],['체스트프레스','15~25kg','5~10kg','12회 × 3'],['시티드로우','20~25kg','10~15kg','12회 × 3'],['숄더프레스','10~15kg','2.5~5kg','10회 × 3'],['천국의 계단','속도 3','속도 1~2','5~10분'],['걷기','5.5km/h','4.5~5km/h','15~20분']]},
 {title:'유산소 + 코어',items:[['워밍업','5km/h','4.5km/h','10분'],['빠르게 걷기','5.5~6km/h','4.5~5.5km/h','30분'],['걷기·조깅 교대','5~6.5km/h','4.5~5.5km/h','25분'],['데드버그','맨몸','맨몸','좌우 10회 × 3'],['버드독','맨몸','맨몸','좌우 10회 × 3'],['스트레칭','가볍게','가볍게','10분']]},
 {title:'하체 B + 자전거',items:[['워밍업','5km/h','4.5km/h','10분'],['레그프레스','50~60kg','20~30kg','12회 × 3'],['고블릿 스쿼트','6~10kg','맨몸~4kg','10회 × 3'],['힙쓰러스트','20~30kg','맨몸~10kg','12회 × 3'],['레그컬','15~20kg','5~10kg','12회 × 3'],['실내 자전거','중간 강도','가벼운 강도','25분']]},
 {title:'상체 B + 경사 걷기',items:[['워밍업','5km/h','4.5km/h','10분'],['체스트프레스','15~25kg','5~10kg','12회 × 3'],['랫풀다운','30kg','10~15kg','12회 × 3'],['시티드로우','20~25kg','10~15kg','12회 × 3'],['레터럴레이즈','2~4kg씩','1~2kg씩','12회 × 3'],['덤벨 컬','4~6kg씩','2~3kg씩','12회 × 3'],['경사 걷기','5~5.5km/h','4.5~5km/h','25분']]},
 {title:'유산소 집중',items:[['빠르게 걷기','5.5~6km/h','4.5~5.5km/h','30분'],['실내 자전거','중간 강도','가벼운~중간 강도','25분'],['천국의 계단','속도 2~3','속도 1~2 또는 생략','5~10분'],['스트레칭','가볍게','가볍게','15분']]},
 {title:'회복',items:[['가벼운 산책','편안한 속도','편안한 속도','20~40분 선택'],['스트레칭','가볍게','가볍게','10분 선택']]}
];
const mealPlans={
 husband:[['07:00','아침','밥 180g + 닭가슴살 150g + 계란 2개 + 채소 + 과일'],['12:30','점심','밥 200g + 살코기 200g + 두부 100g + 채소'],['18:30','저녁','밥 180g + 생선 200g + 두부 150g + 채소']],
 wife:[['07:00','아침','밥 130g + 닭가슴살 100g + 계란 2개 + 채소 + 과일'],['12:30','점심','밥 150g + 살코기 150g + 두부 100g + 채소'],['18:30','저녁','밥 130g + 생선 150g + 두부 100g + 채소']]
};
const defaults={person:'husband',tab:'today',day:(new Date().getDay()+6)%7,records:{husband:[],wife:[]},checked:{husband:{},wife:{}},alerts:{husband:structuredClone(defaultAlerts),wife:structuredClone(defaultAlerts)},clientId:crypto.randomUUID(),push:{husband:false,wife:false},review:{husband:'',wife:''}};
let state;try{state={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{state=defaults;}
state.records??=structuredClone(defaults.records);state.checked??=structuredClone(defaults.checked);state.alerts??=structuredClone(defaults.alerts);state.push??=structuredClone(defaults.push);state.review??=structuredClone(defaults.review);
let swRegistration=null;let pushConfig={pushEnabled:false,publicKey:''};let installPrompt=null;
const $=s=>document.querySelector(s),view=$('#view');
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const personName=()=>state.person==='husband'?'남편':'아내';
const todayKey=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const latest=()=>state.records[state.person].at(-1);
function paint(){
 document.querySelectorAll('[data-person]').forEach(b=>b.classList.toggle('active',b.dataset.person===state.person));
 document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.tab));
 $('#startWeight').textContent=state.person==='husband'?'87kg':'62kg';$('#targetWeight').textContent=state.person==='husband'?'79kg':'59kg';$('#latestWeight').textContent=latest()?.weight?`${latest().weight}kg`:'—';
 $('#todayLabel').textContent=new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short',timeZone:'Asia/Seoul'}).format(new Date());
 view.innerHTML=({today:todayView,meal:mealView,exercise:exerciseView,progress:progressView,alerts:alertsView})[state.tab]();
 attach();
}
function todayView(){const events=[['04:45','기상·체중 측정','수면·컨디션 확인'],['05:00','운동 준비','물 마시기, 운동복 준비'],['05:15','부부 운동','오늘의 근력·유산소 루틴'],['07:00','아침 식사',mealPlans[state.person][0][2]],['07:10','업무 계획 확인','핵심 업무 3가지'],['12:30','점심 식사',mealPlans[state.person][1][2]],['14:40','업무 중간 점검','남은 일정 확인'],['17:30','업무 복기','오늘의 성과·내일의 우선순위'],['18:30','저녁 식사',mealPlans[state.person][2][2]],['19:30','하루 복기','운동·식단·내일 준비'],['20:30','취침 준비','21:00 취침 목표']];const key=todayKey();const c=state.checked[state.person][key]||[];return `<div class="panel"><h2>오늘의 루틴 <span class="pill">${c.length}/${events.length} 완료</span></h2><div class="progressbar"><div style="width:${Math.round(c.length/events.length*100)}%"></div></div>${events.map((e,i)=>`<div class="timeline"><div class="time">${e[0]}</div><div class="timeline-main"><b>${esc(e[1])}</b><p>${esc(e[2])}</p></div><input class="check" type="checkbox" data-check="${i}" ${c.includes(i)?'checked':''} aria-label="${esc(e[1])} 완료"></div>`).join('')}</div><div class="panel"><h2>오늘의 짧은 복기</h2><div class="field"><label>잘한 점 · 내일 할 일</label><textarea id="review" rows="3" placeholder="오늘 한 일과 내일의 한 가지 목표를 적어보세요.">${esc(state.review[state.person]||'')}</textarea></div><button class="btn" id="saveReview">복기 저장</button></div>`;}
function mealView(){const p=state.person;return `<div class="panel"><h2>${personName()}의 하루 3끼 <span class="pill">간식 없음</span></h2><p class="sub">하루 시작 목표 ${p==='husband'?'약 2,100kcal · 단백질 150~165g':'약 1,700kcal · 단백질 100~115g'}</p>${mealPlans[p].map(m=>`<div class="meal"><strong>${m[0]} · ${m[1]}</strong><p>${esc(m[2])}</p></div>`).join('')}<p class="notice">식단은 예시입니다. 조리법과 실제 섭취량을 확인해 열량·단백질을 맞추세요. 운동 전 어지럽다면 공복 운동을 중단하세요.</p></div>`;}
function exerciseView(){const r=routines[state.day];return `<div class="panel"><h2>요일별 운동 <span class="pill">05:15~06:45</span></h2><div class="day-buttons">${['월','화','수','목','금','토','일'].map((d,i)=>`<button data-day="${i}" class="${i===state.day?'active':''}">${d}</button>`).join('')}</div><h2 style="margin-top:18px">${r.title}</h2>${r.items.map(e=>`<div class="exercise-row"><div><b>${e[0]}</b><small>${esc(e[state.person==='husband'?1:2])}</small></div><div class="sets">${esc(e[3])}</div></div>`).join('')}<p class="notice">첫 주는 가벼운 중량으로 시작하고, 무리하면 세트를 줄이세요. 일요일은 회복일입니다.</p></div>`;}
function progressView(){const entries=[...state.records[state.person]].reverse();return `<div class="panel"><h2>${personName()} 체중·허리 기록</h2><form id="recordForm"><div class="field"><label>날짜</label><input type="date" name="date" value="${todayKey()}" required></div><div class="row"><div class="field"><label>체중 (kg)</label><input type="number" name="weight" min="25" max="300" step="0.1" placeholder="예: 62.0" required></div><div class="field"><label>허리 (인치)</label><input type="number" name="waist" min="15" max="70" step="0.1" placeholder="선택"></div></div><button class="btn wide" type="submit">측정 기록 저장</button></form></div><div class="panel"><h2>최근 기록</h2>${entries.length?`<table class="history"><thead><tr><th>날짜</th><th>체중</th><th>허리</th></tr></thead><tbody>${entries.slice(0,20).map(e=>`<tr><td>${esc(e.date)}</td><td>${e.weight}kg</td><td>${e.waist?e.waist+'인치':'—'}</td></tr>`).join('')}</tbody></table>`:'<p class="sub">아직 기록이 없습니다. 오늘 첫 측정을 남겨보세요.</p>'}<div class="row" style="margin-top:14px"><button class="btn secondary" id="exportData">기록 내보내기</button><button class="btn danger" id="clearRecords">기록 삭제</button></div></div>`;}
function alertsView(){return `<div class="panel"><h2>시간별 팝업 알림 🔔</h2><p class="sub">알림은 각자 휴대폰에서 별도로 설정합니다.</p><div id="pushStatus" class="${pushConfig.pushEnabled?'success':'notice'}">${pushConfig.pushEnabled?'서버 푸시 기능 준비됨. 아래 버튼으로 알림을 켜세요.':'현재 서버 푸시 미설정: 앱이 열려 있을 때만 화면 알림이 가능합니다. 백그라운드 알림에는 서버 설정이 필요합니다.'}</div>${state.alerts[state.person].map((a,i)=>`<div class="alert-item"><input type="time" data-time="${i}" value="${esc(a.time)}"><div class="title">${esc(a.title)}</div><input type="checkbox" data-alert="${i}" ${a.on?'checked':''} aria-label="알림 켜기"></div>`).join('')}<button class="btn wide" id="enablePush" style="margin-top:15px">알림 권한 허용 및 저장</button><div class="row" style="margin-top:9px"><button class="btn secondary" id="testPush">테스트 알림</button><button class="btn danger" id="disablePush">알림 해제</button></div><p class="notice" style="margin-top:12px">아이폰: Safari에서 공유 → 홈 화면에 추가 → 설치한 앱 실행 → 알림 허용. 갤럭시: Chrome에서 홈 화면에 설치 후 알림 허용. HTTPS 배포 및 서버 푸시 설정이 있어야 앱을 닫아도 알림이 옵니다.</p></div>`;}
function attach(){
 view.querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',()=>{const key=todayKey(),list=state.checked[state.person][key]||[],i=Number(el.dataset.check);state.checked[state.person][key]=el.checked?[...new Set([...list,i])]:list.filter(x=>x!==i);save();paint();}));
 view.querySelectorAll('[data-day]').forEach(el=>el.addEventListener('click',()=>{state.day=Number(el.dataset.day);save();paint();}));
 $('#saveReview')?.addEventListener('click',()=>{state.review[state.person]=$('#review').value;save();alert('복기를 저장했습니다.');});
 $('#recordForm')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget),date=f.get('date'),weight=Number(f.get('weight')),waist=f.get('waist')?Number(f.get('waist')):null;if(!date||weight<25||weight>300||waist&&(waist<15||waist>70))return alert('측정값을 확인해주세요.');state.records[state.person]=state.records[state.person].filter(x=>x.date!==date);state.records[state.person].push({date,weight,waist});state.records[state.person].sort((a,b)=>a.date.localeCompare(b.date));save();paint();});
 $('#exportData')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(state.records[state.person],null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`wellness-${state.person}-${todayKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);});
 $('#clearRecords')?.addEventListener('click',()=>{if(confirm('현재 선택한 사람의 체중·허리 기록을 모두 삭제할까요?')){state.records[state.person]=[];save();paint();}});
 view.querySelectorAll('[data-time]').forEach(el=>el.addEventListener('change',()=>{state.alerts[state.person][Number(el.dataset.time)].time=el.value;save();}));
 view.querySelectorAll('[data-alert]').forEach(el=>el.addEventListener('change',()=>{state.alerts[state.person][Number(el.dataset.alert)].on=el.checked;save();}));
 $('#enablePush')?.addEventListener('click',enablePush);$('#testPush')?.addEventListener('click',testPush);$('#disablePush')?.addEventListener('click',disablePush);
}
function urlB64ToUint8Array(base64){const padding='='.repeat((4-base64.length%4)%4);const raw=atob((base64+padding).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...raw].map(c=>c.charCodeAt(0)));}
async function enablePush(){
 if(!('Notification'in window)||!('serviceWorker'in navigator))return alert('이 브라우저는 알림을 지원하지 않습니다.');
 const permission=await Notification.requestPermission();if(permission!=='granted')return alert('알림 권한이 허용되지 않았습니다.');
 if(!pushConfig.pushEnabled)return alert('알림 권한이 허용되었습니다. 하지만 백그라운드 알림은 서버 VAPID 키 설정 후 가능합니다.');
 try{const reg=await navigator.serviceWorker.ready;const subscription=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlB64ToUint8Array(pushConfig.publicKey)});
 const reminders=state.alerts[state.person].filter(a=>a.on).map(({time,title,body})=>({time,title,body}));
 const res=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:state.clientId,person:state.person,subscription,reminders})});if(!res.ok)throw Error(await res.text());state.push[state.person]=true;save();alert('알림 설정 완료! 선택한 시간에 푸시 알림이 전송됩니다.');}catch(e){alert('설정 실패: '+e.message);}
}
async function testPush(){if(!('Notification'in window))return alert('알림 미지원');if(Notification.permission!=='granted')return alert('먼저 알림을 허용해주세요.');if(pushConfig.pushEnabled&&state.push[state.person]){const r=await fetch('/api/test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:state.clientId})});if(!r.ok)alert('푸시 전송 실패');}else{(await navigator.serviceWorker.ready).showNotification('알림 테스트 🔔',{body:'앱이 열려 있는 상태에서 알림이 작동합니다.',icon:'/icon-192.png'});}}
async function disablePush(){try{await fetch('/api/unsubscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:state.clientId})});const sub=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(sub)await sub.unsubscribe();state.push[state.person]=false;save();alert('이 기기의 서버 알림을 해제했습니다.');}catch(e){alert('해제 실패: '+e.message);}}
document.querySelectorAll('[data-person]').forEach(b=>b.addEventListener('click',()=>{state.person=b.dataset.person;save();paint();}));
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{state.tab=b.dataset.tab;save();paint();}));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('#installBtn').hidden=false;});
$('#installBtn').addEventListener('click',async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#installBtn').hidden=true;}});
async function init(){if('serviceWorker'in navigator){try{swRegistration=await navigator.serviceWorker.register('/sw.js');}catch(e){console.warn('SW registration failed',e);}}try{const r=await fetch('/api/config');if(r.ok)pushConfig=await r.json();}catch{}paint();}
init();
