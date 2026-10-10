const {chromium}=require('C:/Users/for-ai/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage();
  await page.goto('https://hkrgb.github.io/island-journey-visual-novel/');
  const code=fs.readFileSync(require('node:path').join(__dirname,'../output/game.js'),'utf8');
  await page.evaluate(()=>history.replaceState(null,'','?game='+encodeURIComponent('給爸爸的生日禮物-mv1wlsxc')));
  const requests=[];page.on('request',r=>{if(r.url().includes('/content/published'))requests.push(r.url())});
  await page.addScriptTag({content:code});
  await page.waitForFunction(()=>window.GAME_SETTINGS?.projectName==='給爸爸的生日禮物');
  assert(requests.length>0);assert(requests.every(u=>!u.includes('revision=')));
  console.log('PASS real Firebase birthday story:',await page.evaluate(()=>({title:GAME_SETTINGS.projectName,dialogueCount:STORY.length})));
  const fail=await browser.newPage();await fail.route('**/documents/**',r=>r.fulfill({status:503,body:'unavailable'}));
  await fail.route('**/game.js?*',r=>r.fulfill({contentType:'text/javascript',body:code}));
  await fail.goto('https://hkrgb.github.io/island-journey-visual-novel/?game=missing-regression-test');
  await fail.getByText('暫時未能載入這個故事，請重新載入。你的遊戲資料未有更改。',{exact:true}).first().waitFor();
  assert.equal(await fail.locator('script[src*="game-core-loader"]').count(),0);
  console.log('PASS failed project does not fall back to a different story');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
