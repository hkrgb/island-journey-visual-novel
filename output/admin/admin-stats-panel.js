(function(){
  function ensurePanel(){
    if(document.getElementById('stats-settings-panel')) return;
    var form=document.getElementById('settingsForm');
    if(!form) return;
    var exportPanel=form.querySelector('.export-import-panel');
    var div=document.createElement('div');
    div.id='stats-settings-panel';
    div.className='stats-settings-panel';
    div.innerHTML='<p class="eyebrow">前台數值列</p><p class="hint">控制右上角數值是否顯示、名稱，以及新開局預設。改完請儲存草稿再發布。</p><div class="grid">'+
      '<label>金錢：顯示<select id="showMoney"><option value="1">顯示</option><option value="0">隱藏</option></select></label>'+
      '<label>金錢：名稱<input id="moneyLabel" placeholder="金錢"></label>'+
      '<label>金錢：開局預設<input id="defaultMoney" type="number" step="1" value="0"></label>'+
      '<label>分數：顯示<select id="showScore"><option value="1">顯示</option><option value="0">隱藏</option></select></label>'+
      '<label>分數：名稱<input id="scoreLabel" placeholder="分數"></label>'+
      '<label>分數：開局預設<input id="defaultScore" type="number" step="1" value="0"></label>'+
      '<label>好感度：顯示<select id="showAffection"><option value="1">顯示</option><option value="0">隱藏</option></select></label>'+
      '<label>好感度：名稱<input id="affectionLabel" placeholder="好感度"></label>'+
      '<label>好感度：開局預設<input id="defaultAffection" type="number" step="1" value="0"></label>'+
      '</div>';
    if(exportPanel) form.insertBefore(div, exportPanel);
    else form.appendChild(div);
  }
  var obs=new MutationObserver(function(){ ensurePanel(); });
  obs.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState!=='loading') ensurePanel();
  else document.addEventListener('DOMContentLoaded', ensurePanel);
})();
