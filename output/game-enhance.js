(function(){
  // --- Sticky background + defaultBg ---
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
    var sp = np.querySelector('span');
    if(sp){
      sp.style.whiteSpace = 'nowrap';
      sp.style.overflow = 'hidden';
      sp.style.textOverflow = 'ellipsis';
      sp.style.maxWidth = '480px';
    }
  }

  var FONT_KEY = 'islandJourneyFontSize';
  function getFontSize(){
    var n = parseInt(localStorage.getItem(FONT_KEY) || '', 10);
    if(!n || n < 14 || n > 36){
      var g = window.GAME_SETTINGS || {};
      n = parseInt(g.dialogueFontSize || 22, 10) || 22;
    }
    return Math.max(14, Math.min(36, n));
  }
  function applyFontSize(size){
    size = Math.max(14, Math.min(36, size|0));
    localStorage.setItem(FONT_KEY, String(size));
    var p = document.querySelector('.textbox > p, #dialogue');
    if(p) p.style.fontSize = size + 'px';
    var name = document.querySelector('.nameplate span, #speaker');
    if(name) name.style.fontSize = Math.max(12, Math.round(size * 0.85)) + 'px';
    var en = document.querySelector('.nameplate small, #speakerEn');
    if(en) en.style.fontSize = Math.max(9, Math.round(size * 0.55)) + 'px';
    var label = document.getElementById('fontSizeLabel');
    if(label) label.textContent = size + 'px';
    try{ if(window.UI) UI.dialogueFontSize = size; }catch(e){}
  }
  function injectFontControls(){
    var grid = document.querySelector('#game-menu .menu-grid');
    if(!grid || document.getElementById('fontSizeRow')) return;
    var row = document.createElement('div');
    row.id = 'fontSizeRow';
    row.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;background:#fff;border:1px solid #cbd6db;color:#102d40;';
    row.innerHTML = '<div><b style="display:block;font-size:13px">文字大小</b><small style="color:#70858f">角色名 + 對白</small></div>'+
      '<div style="display:flex;align-items:center;gap:8px">'+
      '<button type="button" id="fontSizeDown" style="width:36px;height:36px;border:1px solid #cbd6db;background:#f4efe5;font-size:18px;cursor:pointer">A−</button>'+
      '<span id="fontSizeLabel" style="min-width:42px;text-align:center;font-weight:700"></span>'+
      '<button type="button" id="fontSizeUp" style="width:36px;height:36px;border:1px solid #cbd6db;background:#f4efe5;font-size:18px;cursor:pointer">A+</button>'+
      '</div>';
    grid.appendChild(row);
    document.getElementById('fontSizeDown').onclick = function(e){
      e.stopPropagation();
      applyFontSize(getFontSize() - 2);
    };
    document.getElementById('fontSizeUp').onclick = function(e){
      e.stopPropagation();
      applyFontSize(getFontSize() + 2);
    };
    applyFontSize(getFontSize());
  }

  function hookRender(){
    if(typeof render !== 'function' || render.__fontHooked) return;
    var orig = render;
    window.render = function(){
      var r = orig.apply(this, arguments);
      setTimeout(function(){ applyFontSize(getFontSize()); styleNameplate(); }, 0);
      return r;
    };
    window.render.__fontHooked = true;
  }

  function boot(){
    patchShowWorld();
    hookRender();
    styleNameplate();
    injectFontControls();
    applyFontSize(getFontSize());
  }
  var tries = 0;
  (function wait(){
    tries++;
    if(typeof showWorld === 'function' || tries > 40){
      boot();
    } else {
      setTimeout(wait, 100);
    }
  })();
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(boot, 50); });
})();
