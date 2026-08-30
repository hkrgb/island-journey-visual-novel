(function(){
  ['auto','backlog'].forEach(function(id){
    if(!document.getElementById(id)){
      var b=document.createElement('button');
      b.id=id;b.type='button';b.style.display='none';b.setAttribute('aria-hidden','true');
      (document.body||document.documentElement).appendChild(b);
    }
  });
})();

(function(){
  var INV_KEY='islandJourneyInv:'+(window.GAME_ID||'island-journey');
  function vars(){
    var v=(window.state&&state.vars)||{};
    return {score:Number(v.score)||0,money:Number(v.money)||0,affection:Number(v.affection)||0,gachaAlbum:(v.gachaAlbum&&typeof v.gachaAlbum==='object')?v.gachaAlbum:{},fishingBag:Array.isArray(v.fishingBag)?v.fishingBag:[],fishingProgress:(v.fishingProgress&&typeof v.fishingProgress==='object')?v.fishingProgress:{},certificates:(v.certificates&&typeof v.certificates==='object')?v.certificates:{}};
  }
  function write(){
    if(!window.state||!state.vars)return;
    var v=vars();
    try{localStorage.setItem(INV_KEY,JSON.stringify({gachaAlbum:v.gachaAlbum,fishingBag:v.fishingBag,fishingProgress:v.fishingProgress,certificates:v.certificates}))}catch(e){}
  }
  function restore(){
    if(!window.state||!state.vars)return;
    var inv=null;try{inv=JSON.parse(localStorage.getItem(INV_KEY)||'null')}catch(e){}
    if(!inv)return;
    if(inv.gachaAlbum&&typeof inv.gachaAlbum==='object')state.vars.gachaAlbum=inv.gachaAlbum;
    if(Array.isArray(inv.fishingBag))state.vars.fishingBag=inv.fishingBag;
    if(inv.fishingProgress&&typeof inv.fishingProgress==='object')state.vars.fishingProgress=inv.fishingProgress;
    if(inv.certificates&&typeof inv.certificates==='object')state.vars.certificates=inv.certificates;
  }
  function clear(){
    try{localStorage.removeItem(INV_KEY)}catch(e){}
    if(window.state&&state.vars){state.vars.gachaAlbum={};state.vars.fishingBag=[];state.vars.fishingProgress={};state.vars.certificates={}}
  }
  function applySet(set){
    if(!set||typeof set!=='object')return;
    if(!window.state)window.state={vars:{}};if(!state.vars)state.vars={};
    ['money','score','affection'].forEach(function(k){if(Number.isFinite(+set[k]))state.vars[k]=+set[k]});
    if(set.gachaAlbum&&typeof set.gachaAlbum==='object')state.vars.gachaAlbum=set.gachaAlbum;
    if(set.album&&typeof set.album==='object')state.vars.gachaAlbum=set.album;
    if(Array.isArray(set.fishingBag))state.vars.fishingBag=set.fishingBag;
    if(set.fishingProgress&&typeof set.fishingProgress==='object')state.vars.fishingProgress=set.fishingProgress;
    if(set.certificates&&typeof set.certificates==='object')state.vars.certificates=Object.assign({},state.vars.certificates||{},set.certificates);
    if(typeof updateStats==='function')updateStats();write();if(typeof save==='function')save();
  }
  window.addEventListener('message',function(e){var d=e.data;if(d&&typeof d==='object'&&d.type==='island-stats'&&d.set)applySet(d.set)});
  function patchOpen(){
    if(typeof openMiniGame!=='function'||openMiniGame.__progressBridge)return;
    var original=openMiniGame;
    window.openMiniGame=function(url){restore();var box=document.getElementById('mini-game'),frame=box&&box.querySelector('iframe'),payload=Object.assign({type:'island-stats'},vars());function ping(){try{frame&&frame.contentWindow&&frame.contentWindow.postMessage(payload,'*')}catch(e){}}if(frame)frame.addEventListener('load',function(){ping();setTimeout(ping,250);setTimeout(ping,800)},{once:true});var result=original(url);setTimeout(ping,400);return result};
    window.openMiniGame.__progressBridge=true;
  }
  function wire(){
    patchOpen();
    [['start',clear],['again',clear],['resume',restore],['loadGame',restore],['saveGame',write]].forEach(function(x){var b=document.getElementById(x[0]);if(b&&!b.__sharedProgress){b.__sharedProgress=true;b.addEventListener('click',function(){setTimeout(x[1],50)})}});
    var close=document.querySelector('#mini-game>button');if(close&&!close.__sharedProgress){close.__sharedProgress=true;close.addEventListener('click',function(){var f=document.querySelector('#mini-game iframe');try{f&&f.contentWindow&&f.contentWindow.postMessage({type:'island-stats',request:'dump'},'*')}catch(e){}setTimeout(write,80)})}
  }
  var tries=0;(function wait(){tries++;wire();if(tries<80)setTimeout(wait,100)})();
})();
(function(){
  var lastBg = '';
  function resolveBg(s){
    var g = window.GAME_SETTINGS || {};
    var def = (g.defaultBg || (window.UI && UI.defaultBg) || '').trim();
    var bg = (s && s.bg) ? String(s.bg).trim() : '';
    if(bg){ lastBg = bg; return bg; }
    if(lastBg) return lastBg;
    return def || '';
  }
  function patchShowWorld(){
    if(typeof showWorld !== 'function') return false;
    if(showWorld.__sticky) return true;
    var orig = showWorld;
    window.showWorld = function(s){
      var street = (s && s.street) || {};
      if(s && s.backgroundType==='streetview' && street.lat && street.lng){
        return orig(s);
      }
      var bg = resolveBg(s);
      var s2 = Object.assign({}, s, {bg: bg || s.bg});
      if(!s2.bg){
        var f = document.querySelector('#streetview');
        if(f){ f.classList.add('hidden'); f.removeAttribute('src'); }
        return;
      }
      return orig(s2);
    };
    window.showWorld.__sticky = true;
    function resetBg(){ lastBg = ''; }
    ['start','again'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) el.addEventListener('click', resetBg);
    });
    return true;
  }

  function styleNameplate(){
    var np = document.querySelector('.nameplate');
    if(!np) return;
    np.style.minWidth = '150px';
    np.style.maxWidth = 'min(90%, 520px)';
    np.style.width = 'max-content';
    np.style.boxSizing = 'border-box';
    np.style.top = '-38px';
    np.style.zIndex = '2';
    var sp = np.querySelector('span');
    if(sp){
      sp.style.whiteSpace = 'nowrap';
      sp.style.overflow = 'hidden';
      sp.style.textOverflow = 'ellipsis';
      sp.style.maxWidth = '480px';
    }
  }

  var KEY_NAME = 'islandJourneyNameFontSize';
  var KEY_BODY = 'islandJourneyBodyFontSize';

  function getNameSize(){
    var n = parseInt(localStorage.getItem(KEY_NAME) || '', 10);
    if(!n || n < 12 || n > 48){
      var g = window.GAME_SETTINGS || {};
      n = parseInt(g.nameFontSize || g.dialogueFontSize || 16, 10) || 16;
    }
    return Math.max(12, Math.min(48, n));
  }
  function getBodySize(){
    var n = parseInt(localStorage.getItem(KEY_BODY) || '', 10);
    if(!n || n < 14 || n > 56){
      var g = window.GAME_SETTINGS || {};
      n = parseInt(g.dialogueFontSize || 22, 10) || 22;
    }
    return Math.max(14, Math.min(56, n));
  }
  function applyFonts(){
    var nameSz = getNameSize();
    var bodySz = getBodySize();
    var p = document.querySelector('.textbox > p, #dialogue');
    if(p) p.style.setProperty('font-size', bodySz + 'px', 'important');
    var name = document.querySelector('.nameplate span, #speaker');
    if(name) name.style.setProperty('font-size', nameSz + 'px', 'important');
    var en = document.querySelector('.nameplate small, #speakerEn');
    if(en) en.style.setProperty('font-size', Math.max(9, Math.round(nameSz * 0.65)) + 'px', 'important');
    var nl = document.getElementById('nameFontSizeLabel');
    if(nl) nl.textContent = nameSz + 'px';
    var bl = document.getElementById('bodyFontSizeLabel');
    if(bl) bl.textContent = bodySz + 'px';
    try{
      if(window.UI){
        UI.dialogueFontSize = bodySz;
        UI.nameFontSize = nameSz;
      }
    }catch(e){}
  }
  function setNameSize(sz){
    sz = Math.max(12, Math.min(48, sz|0));
    localStorage.setItem(KEY_NAME, String(sz));
    applyFonts();
  }
  function setBodySize(sz){
    sz = Math.max(14, Math.min(56, sz|0));
    localStorage.setItem(KEY_BODY, String(sz));
    applyFonts();
  }

  function wireMenuControls(){
    var nd = document.getElementById('nameFontSizeDown');
    var nu = document.getElementById('nameFontSizeUp');
    var bd = document.getElementById('bodyFontSizeDown');
    var bu = document.getElementById('bodyFontSizeUp');
    if(nd && !nd.__wired){
      nd.__wired = true;
      nd.onclick = function(e){ e.stopPropagation(); setNameSize(getNameSize()-1); };
    }
    if(nu && !nu.__wired){
      nu.__wired = true;
      nu.onclick = function(e){ e.stopPropagation(); setNameSize(getNameSize()+1); };
    }
    if(bd && !bd.__wired){
      bd.__wired = true;
      bd.onclick = function(e){ e.stopPropagation(); setBodySize(getBodySize()-1); };
    }
    if(bu && !bu.__wired){
      bu.__wired = true;
      bu.onclick = function(e){ e.stopPropagation(); setBodySize(getBodySize()+1); };
    }
    var old = document.getElementById('fontSizeRow');
    if(old) old.remove();
    applyFonts();
  }

  function hookRender(){
    if(typeof render !== 'function' || render.__fontHooked) return;
    var orig = render;
    window.render = function(){
      var r = orig.apply(this, arguments);
      setTimeout(function(){ applyFonts(); styleNameplate(); }, 0);
      return r;
    };
    window.render.__fontHooked = true;
  }

  function boot(){
    patchShowWorld();
    hookRender();
    styleNameplate();
    wireMenuControls();
    applyFonts();
  }
  var tries = 0;
  (function wait(){
    tries++;
    if(typeof showWorld === 'function' || tries > 60) boot();
    else setTimeout(wait, 100);
  })();
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 50); });
})();

(function(){
  var INV_KEY = 'islandJourneyInv:' + (window.GAME_ID || 'island-journey');
  function currentVars(){
    var v = (window.state && state.vars) || {};
    return {
      score: Number(v.score)||0,
      money: Number(v.money)||0,
      affection: Number(v.affection)||0,
      album: (v.gachaAlbum && typeof v.gachaAlbum==='object') ? v.gachaAlbum : {},
      gachaAlbum: (v.gachaAlbum && typeof v.gachaAlbum==='object') ? v.gachaAlbum : {},
      fishingBag: Array.isArray(v.fishingBag) ? v.fishingBag : []
    };
  }
  function writeInv(){
    if(!window.state || !state.vars) return;
    try{
      localStorage.setItem(INV_KEY, JSON.stringify({
        gachaAlbum: currentVars().gachaAlbum,
        fishingBag: currentVars().fishingBag
      }));
    }catch(e){}
  }
  function clearInv(){
    try{ localStorage.removeItem(INV_KEY); }catch(e){}
    if(window.state && state.vars){
      state.vars.gachaAlbum = {};
      state.vars.fishingBag = [];
    }
  }
  function restoreInv(){
    var inv = null;
    try{ inv = JSON.parse(localStorage.getItem(INV_KEY) || 'null'); }catch(e){ inv = null; }
    if(!inv || !window.state || !state.vars) return;
    if(inv.gachaAlbum && typeof inv.gachaAlbum==='object') state.vars.gachaAlbum = inv.gachaAlbum;
    if(Array.isArray(inv.fishingBag)) state.vars.fishingBag = inv.fishingBag;
  }
  function applySet(set){
    if(!set || typeof set!=='object') return;
    if(!window.state) window.state = {vars:{}};
    if(!state.vars) state.vars = {};
    ['money','score','affection'].forEach(function(k){
      if(Number.isFinite(+set[k])) state.vars[k] = +set[k];
    });
    if(set.gachaAlbum && typeof set.gachaAlbum==='object') state.vars.gachaAlbum = set.gachaAlbum;
    if(set.album && typeof set.album==='object') state.vars.gachaAlbum = set.album;
    if(Array.isArray(set.fishingBag)) state.vars.fishingBag = set.fishingBag;
    if(typeof updateStats==='function') updateStats();
    writeInv();
    if(typeof save==='function') save();
  }
  window.addEventListener('message', function(e){
    var d = e.data;
    if(!d || typeof d!=='object') return;
    if(d.type==='island-stats' && d.set) applySet(d.set);
    else if(d.set) applySet(d.set);
  });
  function patchOpen(){
    if(typeof openMiniGame!=='function' || openMiniGame.__bridged) return !!window.openMiniGame;
    var orig = openMiniGame;
    window.openMiniGame = function(url){
      if(!url) return orig(url);
      restoreInv();
      try{
        var u = new URL(url, location.href);
        var v = currentVars();
        u.searchParams.set('score', v.score);
        u.searchParams.set('money', v.money);
        u.searchParams.set('affection', v.affection);
        url = u.toString();
      }catch(err){}
      var box = document.getElementById('mini-game');
      var iframe = box && box.querySelector('iframe');
      var payload = Object.assign({type:'island-stats'}, currentVars());
      function ping(){
        try{ iframe && iframe.contentWindow && iframe.contentWindow.postMessage(payload, '*'); }catch(err){}
      }
      if(iframe){
        iframe.addEventListener('load', function(){
          ping();
          setTimeout(ping, 250);
          setTimeout(ping, 800);
        }, {once:true});
      }
      var r = orig(url);
      setTimeout(ping, 400);
      return r;
    };
    window.openMiniGame.__bridged = true;
    return true;
  }
  function wireSaveButtons(){
    var startBtn = document.getElementById('start');
    var againBtn = document.getElementById('again');
    var resumeBtn = document.getElementById('resume');
    var saveBtn = document.getElementById('saveGame');
    var loadBtn = document.getElementById('loadGame');
    if(startBtn && !startBtn.__inv){
      startBtn.__inv = true;
      startBtn.addEventListener('click', function(){ setTimeout(clearInv, 0); });
    }
    if(againBtn && !againBtn.__inv){
      againBtn.__inv = true;
      againBtn.addEventListener('click', function(){ setTimeout(clearInv, 0); });
    }
    if(resumeBtn && !resumeBtn.__inv){
      resumeBtn.__inv = true;
      resumeBtn.addEventListener('click', function(){ setTimeout(restoreInv, 80); setTimeout(restoreInv, 400); });
    }
    if(loadBtn && !loadBtn.__inv){
      loadBtn.__inv = true;
      loadBtn.addEventListener('click', function(){ setTimeout(restoreInv, 80); setTimeout(restoreInv, 400); });
    }
    if(saveBtn && !saveBtn.__inv){
      saveBtn.__inv = true;
      saveBtn.addEventListener('click', function(){ writeInv(); });
    }
    var closeBtn = document.querySelector('#mini-game > button');
    if(closeBtn && !closeBtn.__inv){
      closeBtn.__inv = true;
      closeBtn.addEventListener('click', function(){
        var iframe = document.querySelector('#mini-game iframe');
        try{ iframe && iframe.contentWindow && iframe.contentWindow.postMessage({type:'island-stats', request:'dump'}, '*'); }catch(err){}
        writeInv();
        if(typeof save==='function') save();
      });
    }
  }
  var n=0;
  (function wait(){
    n++;
    patchOpen();
    wireSaveButtons();
    if(n>80) return;
    setTimeout(wait, 100);
  })();
})();
