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

  function saveKey(){
    return 'visualNovelSave:'+(window.GAME_ID||'island-journey');
  }
  function fmtTime(ts){
    try{
      var d=new Date(ts); if(isNaN(d.getTime())) return '';
      var p=function(n){return String(n).padStart(2,'0')};
      return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());
    }catch(e){ return ''; }
  }
  function readSave(){
    try{
      var raw=localStorage.getItem(saveKey());
      if(!raw) return null;
      var data=JSON.parse(raw);
      if(!data || typeof data.i !== 'number') return null;
      return data;
    }catch(e){ return null; }
  }
  function writeSave(st){
    var payload={
      i: (st.i|0),
      vars:{
        money: +(st.vars && st.vars.money) || 0,
        score: +(st.vars && st.vars.score) || 0,
        affection: +(st.vars && st.vars.affection) || 0
      },
      applied: st.applied || {},
      log: st.log || [],
      savedAt: Date.now()
    };
    localStorage.setItem(saveKey(), JSON.stringify(payload));
    return payload;
  }
  function refreshLabels(){
    var data=readSave();
    var t=data && data.savedAt ? fmtTime(data.savedAt) : '';
    var page=data ? ('第 '+(Number(data.i)+1)+' 頁') : '';
    var scores=data && data.vars ? (' · 金'+(data.vars.money||0)+' 分'+(data.vars.score||0)+' 感'+(data.vars.affection||0)) : '';
    var sg=document.getElementById('saveGame');
    var lg=document.getElementById('loadGame');
    if(sg){
      if(t) sg.innerHTML='儲存目前進度<small>'+t+scores+'</small>';
      else sg.innerHTML='儲存目前進度<small>覆蓋自動存檔</small>';
    }
    if(lg){
      if(t) lg.innerHTML='讀取進度<small>'+page+' · '+t+scores+'</small>';
      else lg.innerHTML='讀取進度<small>尚未有存檔</small>';
    }
    var r=document.getElementById('resume');
    if(r) r.disabled=!data;
  }
  function doSave(){
    if(typeof state === 'undefined') return false;
    try{
      var payload=writeSave(state);
      state.savedAt=payload.savedAt;
      refreshLabels();
      return true;
    }catch(e){
      console.warn('save failed', e);
      return false;
    }
  }
  function doLoad(){
    var data=readSave();
    if(!data) return false;
    if(typeof state === 'undefined') return false;
    state.i = Math.max(0, Math.min(Number(data.i)||0, Math.max(0,(window.STORY||[]).length-1)));
    state.vars = {money:0, score:0, affection:0, ...(data.vars||{})};
    state.applied = data.applied || {};
    state.log = data.log || [];
    state.savedAt = data.savedAt;
    try{ if(typeof currentBg !== 'undefined') currentBg=''; }catch(e){}
    try{ if(typeof wasStreetview !== 'undefined') wasStreetview=false; }catch(e){}
    try{ if(typeof cardBusy !== 'undefined') cardBusy=false; }catch(e){}
    if(typeof view === 'function') view('reader');
    if(typeof render === 'function'){
      var s = (window.STORY||[])[state.i];
      if(!s){ if(typeof finish==='function') finish(); return true; }
      try{
        var c = (typeof chapterOf==='function') ? chapterOf(state.i) : 0;
        var ch = (window.CHAPTERS||[])[c] || {};
        var el;
        el=document.getElementById('chNum'); if(el) el.textContent=ch.no||'';
        el=document.getElementById('chName'); if(el) el.textContent=ch.name||'';
        if(typeof showWorld==='function') showWorld(s);
        if(typeof changeMusic==='function') changeMusic(s.music||ch.music);
        var narration=!String(s.sp||'').trim()&&!String(s.en||'').trim();
        var tb=document.getElementById('textbox');
        if(tb) tb.classList.toggle('narration', narration);
        if(typeof applyDialogueStyle==='function') applyDialogueStyle(narration);
        el=document.getElementById('speaker'); if(el) el.textContent=s.sp||'';
        el=document.getElementById('speakerEn'); if(el) el.textContent=s.en||'';
        try{ full=s.t||''; }catch(e){}
        el=document.getElementById('counter'); if(el) el.textContent=String(state.i+1).padStart(3,'0')+' / '+String((window.STORY||[]).length).padStart(3,'0');
        el=document.getElementById('progressBar'); if(el) el.style.width=((state.i+1)/(window.STORY||[1]).length*100)+'%';
        if(typeof setSprite==='function') setSprite(s);
        if(typeof showChoices==='function') showChoices(s);
        if(typeof updateStats==='function') updateStats();
        if(typeof beginTyping==='function'){
          try{ full = s.t||''; }catch(e){}
          beginTyping();
        } else {
          el=document.getElementById('dialogue'); if(el) el.textContent=s.t||'';
        }
      }catch(err){
        console.warn('resume UI error, fallback render', err);
        render(false);
      }
    }
    refreshLabels();
    return true;
  }
  function patchSaveLoad(){
    try{ window.save = doSave; }catch(e){}
    var sg=document.getElementById('saveGame');
    var lg=document.getElementById('loadGame');
    var rs=document.getElementById('resume');
    if(sg && !sg.__saveFix){
      sg.__saveFix=true;
      sg.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if(doSave()){
          var t=fmtTime(state.savedAt);
          sg.innerHTML='已儲存<small>第 '+(state.i+1)+' 頁 · '+t+'</small>';
          setTimeout(refreshLabels, 1600);
        } else {
          sg.innerHTML='儲存失敗<small>請檢查瀏覽器設定</small>';
          setTimeout(refreshLabels, 1600);
        }
      }, true);
    }
    if(lg && !lg.__saveFix){
      lg.__saveFix=true;
      lg.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if(doLoad()){
          var menu=document.getElementById('game-menu');
          if(menu) menu.classList.remove('open');
        } else {
          alert('沒有可讀取的存檔');
          refreshLabels();
        }
      }, true);
    }
    if(rs && !rs.__saveFix){
      rs.__saveFix=true;
      rs.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        if(!doLoad()) alert('沒有可讀取的存檔');
      }, true);
    }
    var menuBtn=document.getElementById('gameMenuBtn');
    if(menuBtn && !menuBtn.__saveFix){
      menuBtn.__saveFix=true;
      menuBtn.addEventListener('click', function(){ refreshLabels(); }, true);
    }
    refreshLabels();
  }

  function boot(){
    patchShowWorld();
    hookRender();
    styleNameplate();
    wireMenuControls();
    applyFonts();
    patchSaveLoad();
  }
  var tries = 0;
  (function wait(){
    tries++;
    if(typeof showWorld === 'function' || tries > 60) boot();
    else setTimeout(wait, 100);
  })();
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 50); });
})();
