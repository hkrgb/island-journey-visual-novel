const {chromium}=require('C:/Users/for-ai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../output');
const sample={chapters:Array.from({length:40},(_,i)=>({id:'ch'+i,no:'CH '+i,name:'章節 '+i})),story:[{id:'scene1',c:0,name:'生日場景',bg:'harbour',lines:[{sp:'木火',en:'',sprite:'assets/characters/hoito/neutral.png',side:'left',t:'給爸爸的生日禮物',choices:[]}]}],settings:{projectName:'給爸爸的生日禮物'},assets:{bg:{},sprite:{}},characters:[]};
const appSDK='export const initializeApp=()=>({});';
const authSDK="export const getAuth=()=>({currentUser:{email:'info@rgb-workshop.com'}});export class GoogleAuthProvider{};export const signInWithPopup=async()=>{};export const signOut=async()=>{};export function onAuthStateChanged(a,cb){setTimeout(()=>cb(a.currentUser),0)}";
const dbSDK=`const docs=new Map();const sample=${JSON.stringify(sample)};docs.set('content/draft',{payload:JSON.stringify(sample),updatedAt:{seconds:1}});const newer=structuredClone(sample);newer.story[0].lines[0].t='較新的已發布文字';docs.set('content/published',{payload:JSON.stringify(newer),updatedAt:{seconds:2}});window.testDocs=docs;window.failPublish=false;export const getFirestore=()=>({}),doc=(db,...p)=>p.join('/'),collection=(db,...p)=>p.join('/'),serverTimestamp=()=>({seconds:Date.now()/1000});export async function getDoc(ref){return{exists:()=>docs.has(ref),data:()=>docs.get(ref)}}export const getDocFromServer=getDoc;export async function setDoc(ref,data){await new Promise(r=>setTimeout(r,30));docs.set(ref,data)}export const getDocs=async()=>({docs:[]});export function writeBatch(){const ops=[];return{set:(ref,data)=>ops.push([ref,data]),commit:async()=>{if(window.failPublish)throw Error('模擬網絡失敗');await new Promise(r=>setTimeout(r,150));for(const [r,d] of ops)docs.set(r,d)}}}`;
(async()=>{
 const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));const target=fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;if(!target.startsWith(root)||!fs.existsSync(target)){res.writeHead(404);return res.end()}res.setHeader('Content-Type',target.endsWith('.js')?'text/javascript':target.endsWith('.css')?'text/css':target.endsWith('.html')?'text/html':'image/png');res.end(fs.readFileSync(target))});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.route('https://www.gstatic.com/firebasejs/**',route=>{const url=route.request().url();route.fulfill({contentType:'text/javascript',body:url.includes('firebase-app')?appSDK:url.includes('firebase-auth')?authSDK:dbSDK})});
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/admin/');await page.locator('#cms').waitFor({state:'visible'});assert.equal(await page.locator('#login').isVisible(),false);
  await page.locator('[data-chapter="0"]').click();await page.locator('[data-scene="0"]').click();
  assert.equal(await page.locator('[data-field="t"]').inputValue(),'較新的已發布文字');
  assert.equal(await page.locator('.line-preview').count(),1);
  await page.locator('[data-field="side"]').selectOption('center');await page.locator('[data-field="spriteScale"]').fill('135');await page.locator('[data-field="spriteX"]').fill('-7');await page.locator('[data-field="spriteY"]').fill('5');
  await page.locator('[data-field="t"]').fill('生日新內容 <生日> "禮物"');await page.locator('#publishBtn').click();
  // Edit while the previous snapshot is being published: it must remain dirty.
  await page.locator('[data-field="t"]').fill('發布期間的新修改');await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('另有新修改'));
  const published=await page.evaluate(()=>JSON.parse(testDocs.get('content/published').payload));assert.equal(published.story[0].lines[0].spriteScale,135);assert.equal(published.story[0].lines[0].side,'center');assert.equal(published.story[0].lines[0].t,'生日新內容 <生日> "禮物"');assert.equal(await page.evaluate(()=>testDocs.get('content/published').payload===testDocs.get('content/draft').payload),true);
  await page.locator('#publishBtn').click();await page.waitForFunction(()=>document.querySelector('#status').textContent==='已發布並驗證；草稿與玩家版一致');
  await page.locator('#chapterTree').evaluate(el=>el.scrollTop=el.scrollHeight);const last=await page.locator('[data-chapter="39"]').boundingBox(),tree=await page.locator('#chapterTree').boundingBox();assert(last.y+last.height<=tree.y+tree.height);
  await page.locator('#chapterTree').evaluate(el=>el.scrollTop=0);await page.locator('[data-scene="0"]').click();
  await page.evaluate(()=>window.failPublish=true);await page.locator('#publishBtn').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('儲存／發布失敗'));
  // Unhandled failures should not leak from click handlers.
  assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(__dirname,'admin-editor-preview.png'),fullPage:true});console.log('PASS: latest published load, preview, center/scale/offsets, atomic publish, dirty edits, sidebar last item, failure feedback');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
