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
        if(f){ f.classList.add('hidden'); f.removeAttribute('src');
        }
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
  function currentVars(){
    var v = (window.state && state.vars) || {};
    return {
      score: Number(v.score)||0,
      money: Number(v.money)||0,
      affection: Number(v.affection)||0
    };
  }
  function applySet(set){
    if(!set || typeof set!=='object' || !window.state || !state.vars) return;
    ['money','score','affection'].forEach(function(k){
      if(Number.isFinite(+set[k])) state.vars[k] = +set[k];
    });
    if(typeof updateStats==='function') updateStats();
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
      if(iframe){
        iframe.addEventListener('load', function(){
          try{
            iframe.contentWindow.postMessage(Object.assign({type:'island-stats'}, currentVars()), '*');
          }catch(err){}
        }, {once:true});
      }
      return orig(url);
    };
    window.openMiniGame.__bridged = true;
    return true;
  }
  var n=0;
  (function wait(){
    n++;
    if(patchOpen() || n>80) return;
    setTimeout(wait, 100);
  })();
})();
