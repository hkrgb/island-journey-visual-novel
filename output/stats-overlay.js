(function(){
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
      if(w) w.style.display=on?'':'none';
      var lab=document.getElementById(it.lab);
      if(lab) lab.textContent=it.label;
    });
    var bar=document.getElementById('stats');
    if(bar) bar.style.display=any?'':'none';
  }
  function watch(){
    applyLabelsAndVisibility();
    var bar=document.getElementById('stats');
    if(!bar||bar.__statsObserved) return;
    bar.__statsObserved=true;
    new MutationObserver(function(){ applyLabelsAndVisibility(); }).observe(bar,{childList:true,subtree:true,characterData:true,attributes:true});
  }
  function hookButtons(){
    function refresh(){ setTimeout(applyLabelsAndVisibility, 50); setTimeout(applyLabelsAndVisibility, 300); }
    ['start','again','resume','loadGame'].forEach(function(id){
      var el=document.getElementById(id);
      if(el) el.addEventListener('click', refresh);
    });
  }
  function boot(){
    watch();
    hookButtons();
    applyLabelsAndVisibility();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(applyLabelsAndVisibility, 300);
  setTimeout(applyLabelsAndVisibility, 1000);
  setTimeout(applyLabelsAndVisibility, 2500);
})();
