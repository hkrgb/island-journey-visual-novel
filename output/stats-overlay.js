(function(){
  var applying=false;
  function cfg(){
    var g=window.GAME_SETTINGS||{};
    return {
      showMoney:g.showMoney, showScore:g.showScore, showAffection:g.showAffection,
      moneyLabel:g.moneyLabel||'金錢', scoreLabel:g.scoreLabel||'分數', affectionLabel:g.affectionLabel||'好感度',
      defaultMoney:+(g.defaultMoney||0)||0, defaultScore:+(g.defaultScore||0)||0, defaultAffection:+(g.defaultAffection||0)||0
    };
  }
  function visible(v){
    if(v===undefined||v===null||v==='') return true;
    return !(v===0||v==='0'||v===false||v==='false');
  }
  function applyLabelsAndVisibility(){
    if(applying) return;
    applying=true;
    try{
      var c=cfg();
      var items=[
        {show:c.showMoney,label:c.moneyLabel,wrap:'statMoney',lab:'moneyLabel'},
        {show:c.showScore,label:c.scoreLabel,wrap:'statScore',lab:'scoreLabel'},
        {show:c.showAffection,label:c.affectionLabel,wrap:'statAffection',lab:'affectionLabel'}
      ];
      var any=false;
      items.forEach(function(it){
        var on=visible(it.show); any=any||on;
        var w=document.getElementById(it.wrap);
        if(w){
          if(on){ w.style.display=''; w.removeAttribute('hidden'); }
          else { w.style.display='none'; w.setAttribute('hidden',''); }
        }
        var lab=document.getElementById(it.lab);
        if(lab) lab.textContent=it.label;
      });
      var bar=document.getElementById('stats');
      if(bar){
        if(any){ bar.style.display=''; bar.removeAttribute('hidden'); }
        else { bar.style.display='none'; bar.setAttribute('hidden',''); }
      }
    }finally{
      applying=false;
    }
  }
  function hookButtons(){
    function refresh(){
      setTimeout(applyLabelsAndVisibility, 30);
      setTimeout(applyLabelsAndVisibility, 200);
      setTimeout(applyLabelsAndVisibility, 600);
    }
    ['start','again','resume','loadGame'].forEach(function(id){
      var el=document.getElementById(id);
      if(el) el.addEventListener('click', refresh);
    });
    // Re-apply when reader view becomes active
    var reader=document.getElementById('reader');
    if(reader && window.MutationObserver){
      new MutationObserver(function(){
        if(reader.classList.contains('active')) applyLabelsAndVisibility();
      }).observe(reader,{attributes:true,attributeFilter:['class']});
    }
  }
  function boot(){
    applyLabelsAndVisibility();
    hookButtons();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  // GAME_SETTINGS is set async by game.js — re-apply several times
  setTimeout(applyLabelsAndVisibility, 200);
  setTimeout(applyLabelsAndVisibility, 800);
  setTimeout(applyLabelsAndVisibility, 1500);
  setTimeout(applyLabelsAndVisibility, 3000);
  // Also watch for GAME_SETTINGS assignment
  var tries=0;
  var poll=setInterval(function(){
    tries++;
    applyLabelsAndVisibility();
    if(tries>20||(window.GAME_SETTINGS&&('showMoney' in window.GAME_SETTINGS||'showScore' in window.GAME_SETTINGS))) clearInterval(poll);
  },250);
})();
