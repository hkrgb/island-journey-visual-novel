(function(){
  function cfg(){
    var g=window.GAME_SETTINGS||{};
    return {
      showMoney:g.showMoney, showScore:g.showScore, showAffection:g.showAffection,
      moneyLabel:g.moneyLabel||'金錢', scoreLabel:g.scoreLabel||'分數', affectionLabel:g.affectionLabel||'好感度',
      defaultMoney:+(g.defaultMoney||0)||0, defaultScore:+(g.defaultScore||0)||0, defaultAffection:+(g.defaultAffection||0)||0
    };
  }
  function visible(v){ return !(v===0||v==='0'||v===false||v==='false'); }
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
      var w=document.getElementById(it.wrap); if(w) w.style.display=on?'':'none';
      var lab=document.getElementById(it.lab); if(lab) lab.textContent=it.label;
    });
    var bar=document.getElementById('stats'); if(bar) bar.style.display=any?'':'none';
  }
  function watch(){
    applyLabelsAndVisibility();
    var bar=document.getElementById('stats');
    if(!bar||bar.__statsObserved) return;
    bar.__statsObserved=true;
    new MutationObserver(applyLabelsAndVisibility).observe(bar,{childList:true,subtree:true,characterData:true});
  }
  function hookStartDefaults(){
    function afterFresh(){
      setTimeout(function(){
        var c=cfg();
        var m=document.getElementById('money');
        var s=document.getElementById('score');
        var a=document.getElementById('affection');
        if(m && s && a && m.textContent==='0' && s.textContent==='0' && a.textContent==='0'){
          m.textContent=String(c.defaultMoney);
          s.textContent=String(c.defaultScore);
          a.textContent=String(c.defaultAffection);
        }
        applyLabelsAndVisibility();
      }, 80);
    }
    var btn=document.getElementById('start');
    var again=document.getElementById('again');
    if(btn) btn.addEventListener('click', afterFresh);
    if(again) again.addEventListener('click', afterFresh);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ watch(); hookStartDefaults(); });
  else { watch(); hookStartDefaults(); }
  setTimeout(applyLabelsAndVisibility, 500);
  setTimeout(applyLabelsAndVisibility, 1500);
})();
