(function(){
  'use strict';
  var preloadedChapters=new Set();
  var patched=false;
  function resolveAssetUrl(key,map){
    if(!key)return '';
    if(typeof key==='string'&&(key.startsWith('http')||key.startsWith('data:')||key.startsWith('assets/')||key.startsWith('blob:')||key.startsWith('/')))return key;
    return (map&&map[key])||'';
  }
  function chapterOfSafe(i){
    if(typeof chapterOf==='function')return chapterOf(i);
    var c=0,STORY=window.STORY||[];
    for(var n=0;n<=i&&n<STORY.length;n++)if(STORY[n].c!==undefined)c=STORY[n].c;
    return c;
  }
  function collectChapterAssets(ch){
    var urls=new Set();
    var CHAPTERS=window.CHAPTERS||[],STORY=window.STORY||[];
    var BG=window.BG||{},SPR=window.SPR||{};
    if(window.GAME_ASSETS){
      if(window.GAME_ASSETS.bg)Object.assign(BG,window.GAME_ASSETS.bg);
      if(window.GAME_ASSETS.sprite)Object.assign(SPR,window.GAME_ASSETS.sprite);
    }
    var chap=CHAPTERS[ch];
    if(chap){
      [chap.intro,chap.outro,chap.video,chap.music].forEach(function(v){
        if(!v)return;
        (Array.isArray(v)?v:[v]).forEach(function(u){
          if(typeof u==='string'&&u&&!/youtube|youtu\.be|vimeo/i.test(u))urls.add(u);
        });
      });
    }
    for(var i=0;i<STORY.length;i++){
      if(chapterOfSafe(i)!==ch)continue;
      var s=STORY[i];
      if(s.bg){var u=resolveAssetUrl(s.bg,BG);if(u)urls.add(u);}
      if(s.sprite){var su=resolveAssetUrl(s.sprite,SPR);if(su)urls.add(su);}
      if(s.music&&typeof s.music==='string'&&!/youtube|youtu\.be/i.test(s.music))urls.add(s.music);
      if(s.media){
        (Array.isArray(s.media)?s.media:[s.media]).forEach(function(m){
          var src=typeof m==='string'?m:(m&&m.src);
          if(src&&typeof src==='string'&&!/youtube|youtu\.be|vimeo/i.test(src))urls.add(src);
        });
      }
    }
    return Array.from(urls).filter(Boolean);
  }
  function loadOneAsset(url){
    return new Promise(function(resolve){
      var done=function(){resolve(url);};
      try{
        if(/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)){
          var v=document.createElement('video');
          v.preload='auto';v.muted=true;
          v.oncanplaythrough=done;v.onerror=done;
          setTimeout(done,10000);v.src=url;v.load();
        }else if(/\.(mp3|wav|ogg|m4a|aac)(\?|$)/i.test(url)){
          var a=new Audio();a.preload='auto';
          a.oncanplaythrough=done;a.onerror=done;
          setTimeout(done,10000);a.src=url;
        }else{
          var img=new Image();
          img.onload=done;img.onerror=done;
          setTimeout(done,10000);img.src=url;
        }
      }catch(e){done();}
    });
  }
  function ensurePreloadUI(){
    var el=document.getElementById('preload-overlay');
    if(el)return el;
    el=document.createElement('div');
    el.id='preload-overlay';
    el.innerHTML='<div class="preload-panel"><p class="preload-title">載入資源中</p><p class="preload-sub" id="preloadSub">準備中…</p><div class="preload-track"><i id="preloadBar"></i></div><p class="preload-pct" id="preloadPct">0%</p></div>';
    document.body.appendChild(el);
    return el;
  }
  function showPreloadUI(){ensurePreloadUI().classList.add('active');}
  function hidePreloadUI(){var el=document.getElementById('preload-overlay');if(el)el.classList.remove('active');}
  function updatePreloadUI(done,total,label){
    var pct=total?Math.round(done/total*100):100;
    var bar=document.getElementById('preloadBar');
    var pctEl=document.getElementById('preloadPct');
    var sub=document.getElementById('preloadSub');
    if(bar)bar.style.width=pct+'%';
    if(pctEl)pctEl.textContent=pct+'%';
    if(sub)sub.textContent=label||('已載入 '+done+' / '+total);
  }
  function preloadChapter(ch,opts){
    opts=opts||{};
    var CHAPTERS=window.CHAPTERS||[];
    if(ch==null||ch<0||ch>=CHAPTERS.length)return Promise.resolve();
    if(preloadedChapters.has(ch)&&!opts.force)return Promise.resolve();
    var urls=collectChapterAssets(ch);
    if(!urls.length){preloadedChapters.add(ch);return Promise.resolve();}
    if(opts.showUI!==false){showPreloadUI();updatePreloadUI(0,urls.length,opts.label||('載入第 '+(ch+1)+' 章資源…'));}
    var done=0,idx=0;
    var n=Math.min(6,urls.length);
    function worker(){
      return new Promise(function(res){
        (function next(){
          if(idx>=urls.length)return res();
          var i=idx++;
          loadOneAsset(urls[i]).then(function(){
            done++;
            if(opts.showUI!==false)updatePreloadUI(done,urls.length,opts.label||('載入第 '+(ch+1)+' 章資源…'));
            next();
          });
        })();
      });
    }
    var workers=[];
    for(var w=0;w<n;w++)workers.push(worker());
    return Promise.all(workers).then(function(){
      preloadedChapters.add(ch);
      if(opts.showUI!==false)updatePreloadUI(urls.length,urls.length,'完成');
    });
  }
  function wrapStart(){
    if(typeof start!=='function'||start.__preloadWrapped)return false;
    var orig=start;
    window.start=function(fresh,index){
      index=index||0;
      var ch;
      try{
        if(fresh){window.state={i:index,log:[],vars:{money:0,score:0,affection:0},applied:{}};
        }else if(window.state){window.state.i=index;}
        ch=chapterOfSafe((window.state&&window.state.i)||index);
      }catch(e){ch=0;}
      function go(){
        orig.call(this,fresh,index);
        var next=ch+1;
        if(next<(window.CHAPTERS||[]).length)preloadChapter(next,{showUI:false}).catch(function(){});
      }
      if(preloadedChapters.has(ch)){go();return;}
      showPreloadUI();
      preloadChapter(ch,{showUI:true,label:'載入第 '+(ch+1)+' 章資源…'}).then(function(){
        hidePreloadUI();go();
      }).catch(function(){hidePreloadUI();go();});
    };
    window.start.__preloadWrapped=true;
    return true;
  }
  function wrapApplyLoaded(){
    if(typeof applyLoaded!=='function'||applyLoaded.__preloadWrapped)return false;
    var orig=applyLoaded;
    window.applyLoaded=function(data){
      if(!data)return false;
      var ch=0;
      try{
        var max=Math.max(0,(window.STORY||[]).length-1);
        ch=chapterOfSafe(Math.max(0,Math.min(Number(data.i)||0,max)));
      }catch(e){}
      function go(){return orig.call(this,data);}
      if(preloadedChapters.has(ch))return go();
      showPreloadUI();
      preloadChapter(ch,{showUI:true,label:'載入第 '+(ch+1)+' 章資源…'}).then(function(){
        hidePreloadUI();go();
        var n=ch+1;
        if(n<(window.CHAPTERS||[]).length)preloadChapter(n,{showUI:false}).catch(function(){});
      }).catch(function(){hidePreloadUI();go();});
      return true;
    };
    window.applyLoaded.__preloadWrapped=true;
    return true;
  }
  function tryPatch(){
    if(patched)return true;
    var a=wrapStart(),b=wrapApplyLoaded();
    if(a||b){patched=true;console.log('[preload] ready');return true;}
    return false;
  }
  var tries=0;
  var timer=setInterval(function(){
    tries++;
    if(tryPatch()||tries>100)clearInterval(timer);
  },200);
  window.__preloadChapter=preloadChapter;
})();
