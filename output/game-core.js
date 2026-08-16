const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const BG={
 ferry:'assets/ferry-cabin.png',office:'assets/office.jpg',market:'assets/market.jpg',room:'assets/room.jpg',storm:'assets/storm.jpg',sunrise:'assets/sunrise.jpg',camera:'assets/camera.jpg',cafe:'assets/cafe.jpg',newspaper:'assets/tv.jpg',redbrick:'assets/official/red-brick.jpg',schoolAerial:'assets/official/school-aerial.jpg',classroom:'assets/classroom-clean.jpg',tv:'assets/tv.jpg',window:'assets/window.jpg',laptop:'assets/laptop.jpg',nightstall:'assets/night-stall.jpg',olympic:'assets/official/olympic-wall.jpg',schoolcourt:'assets/official/school-court.jpg',harbour:'assets/official/harbour.jpg',alley:'assets/official/alley-sunset.jpg',beach:'assets/kwun-yam-wan.png'
};
const SPR={
 hoito:'assets/characters/hoito/neutral.png',hoitoNeutral:'assets/characters/hoito/neutral.png',hoitoJoy:'assets/characters/hoito/joy.png',hoitoAnger:'assets/characters/hoito/anger.png',hoitoSad:'assets/characters/hoito/sad.png',hoitoDelight:'assets/characters/hoito/delight.png',
 kitty:'assets/characters/kitty/neutral.png',kittyNeutral:'assets/characters/kitty/neutral.png',kittyJoy:'assets/characters/kitty/joy.png',kittyAnger:'assets/characters/kitty/anger.png',kittySad:'assets/characters/kitty/sad.png',kittyDelight:'assets/characters/kitty/delight.png',
 siningNeutral:'assets/characters/sining/neutral.png',siningHappy:'assets/characters/sining/joy.png',siningAnger:'assets/characters/sining/anger.png',siningCry:'assets/characters/sining/sad.png',siningThink:'assets/characters/sining/neutral.png',siningResolve:'assets/characters/sining/delight.png',
 auntieNeutral:'assets/characters/holiday-auntie/neutral.png',auntieJoy:'assets/characters/holiday-auntie/joy.png',auntieAnger:'assets/characters/holiday-auntie/anger.png',auntieSad:'assets/characters/holiday-auntie/sad.png',auntieDelight:'assets/characters/holiday-auntie/delight.png'
};
let state={i:0,log:[]},typing=false,typeTimer=null,autoTimer=null,full='',bgFlip=false,cardBusy=false,currentBg='';
function view(id){$$('.view').forEach(v=>v.classList.remove('active'));$('#'+id).classList.add('active')}
function save(){localStorage.setItem('islandFullSave',JSON.stringify(state));$('#resume').disabled=false}
function start(fresh,index=0){if(fresh)state={i:index,log:[]};else state.i=index;view('reader');render(true);save()}
function chapterOf(i){let c=0;for(let n=0;n<=i;n++)if(STORY[n].c!==undefined)c=STORY[n].c;return c}
function playSceneMotion(key){const motion=$('#scene-motion');motion.className='';void motion.offsetWidth;motion.classList.add('active',key);setTimeout(()=>motion.className='',1700)}
function playWipe(){const wipe=$('#scene-wipe');wipe.classList.remove('play');void wipe.offsetWidth;wipe.classList.add('play');setTimeout(()=>wipe.classList.remove('play'),850)}
function swapBackground(key){if(key===currentBg)return;const incoming=bgFlip?$('#bgA'):$('#bgB'),outgoing=bgFlip?$('#bgB'):$('#bgA');incoming.style.backgroundImage=`url("${BG[key]}")`;incoming.style.opacity='1';outgoing.style.opacity='0';bgFlip=!bgFlip;if(currentBg)playWipe();currentBg=key;if(['ferry','storm','sunrise','beach','harbour'].includes(key))setTimeout(()=>playSceneMotion(key),280)}
function showChapter(c){cardBusy=true;playWipe();$('#cardNum').textContent=CHAPTERS[c].no;$('#cardName').textContent=CHAPTERS[c].name;$('#chapter-card').classList.remove('hidden');setTimeout(()=>{$('#chapter-card').classList.add('hidden');cardBusy=false;beginTyping()},1500)}
function beginTyping(){clearInterval(typeTimer);const line=$('#dialogue');line.textContent='';typing=true;let n=0;typeTimer=setInterval(()=>{n++;line.textContent=full.slice(0,n);if(n>=full.length){clearInterval(typeTimer);typing=false}},18)}
function render(forceCard=false){const s=STORY[state.i];if(!s)return finish();const c=chapterOf(state.i);$('#chNum').textContent=CHAPTERS[c].no;$('#chName').textContent=CHAPTERS[c].name;swapBackground(s.bg);if(s.place)$('#place').textContent=s.place;$('#speaker').textContent=s.sp;$('#speakerEn').textContent=s.en||'';full=s.t;$('#counter').textContent=String(state.i+1).padStart(3,'0')+' / '+String(STORY.length).padStart(3,'0');$('#progressBar').style.width=((state.i+1)/STORY.length*100)+'%';setSprite(s);if(!state.log.length||state.log[state.log.length-1].t!==s.t)state.log.push({sp:s.sp,t:s.t});if(s.start||forceCard&&STORY[state.i].start)showChapter(c);else beginTyping();save()}
function inferredSprite(s){
 const bases={海淘:'hoito',淇:'kitty',淇老師:'kitty',思凝:'sining',渡假屋大姐:'auntie'};
 const base=bases[s.sp];if(!base)return null;const t=s.t||'';
 let mood='Neutral';
 if(/哭|眼淚|難過|傷心|失望|擔心|痛苦|對不起|死|離開/.test(t))mood='Sad';
 else if(/怒|生氣|竟然|不准|住口|可惡|？！|豈有此理/.test(t))mood='Anger';
 else if(/哈哈|太好了|成功|重新開始|找到|萬歲/.test(t))mood='Delight';
 else if(/笑|高興|開心|多謝|謝謝|早晨|好啊|歡迎/.test(t))mood='Joy';
 return base+mood;
}
function setSprite(s){const L=$('#spriteL'),R=$('#spriteR');L.classList.add('hidden');R.classList.add('hidden');const key=s.sprite||inferredSprite(s);if(!key||!SPR[key])return;const el=(s.side||((s.sp==='淇'||s.sp==='淇老師'||s.sp==='渡假屋大姐')?'left':'right'))==='left'?L:R;el.src=SPR[key];el.alt=s.sp;requestAnimationFrame(()=>el.classList.remove('hidden'))}
function next(){if(cardBusy)return;if(typing){clearInterval(typeTimer);$('#dialogue').textContent=full;typing=false;return}if(STORY[state.i].end){finish();return}state.i++;render()}
function finish(){clearInterval(autoTimer);localStorage.removeItem('islandFullSave');view('ending')}
function toggleAuto(){if(autoTimer){clearInterval(autoTimer);autoTimer=null;$('#auto').classList.remove('on')}else{autoTimer=setInterval(()=>{if(!cardBusy)next()},4200);$('#auto').classList.add('on')}}
function buildContents(){const starts=CHAPTERS.map((_,c)=>STORY.findIndex(s=>s.c===c));$('#chapter-list').innerHTML=CHAPTERS.map((c,i)=>`<button data-i="${starts[i]}"><small>${c.no}</small><b>${c.name}</b></button>`).join('');$$('#chapter-list button').forEach(b=>b.onclick=()=>{$('#contents-modal').classList.remove('open');start(true,+b.dataset.i)})}
function openLog(){const l=$('#log-list');l.innerHTML=state.log.map(x=>`<p><b>${x.sp}</b>${x.t}</p>`).join('');$('#log-modal').classList.add('open');l.scrollTop=l.scrollHeight}
$('#start').onclick=()=>start(true,0);$('#resume').disabled=!localStorage.getItem('islandFullSave');$('#resume').onclick=()=>{state=JSON.parse(localStorage.getItem('islandFullSave'));start(false,state.i)};$('#contents').onclick=()=>$('#contents-modal').classList.add('open');$('#home').onclick=()=>{clearInterval(autoTimer);view('title')};$('#backlog').onclick=openLog;$('#auto').onclick=toggleAuto;$('#hide-ui').onclick=()=>$('#reader').classList.toggle('ui-hidden');$('#advance').onclick=next;$('#textbox').onclick=e=>{if(e.target.id==='textbox'||e.target.id==='dialogue')next()};$('#again').onclick=()=>start(true,0);$$('.close').forEach(b=>b.onclick=()=>b.closest('.modal').classList.remove('open'));document.addEventListener('keydown',e=>{if(e.code==='Space'&&$('#reader').classList.contains('active')){e.preventDefault();next()}if(e.key==='Escape')$$('.modal').forEach(m=>m.classList.remove('open'))});buildContents();
