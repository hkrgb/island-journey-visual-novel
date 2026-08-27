(function(){
  var GACHA_CFG='https://hkrgb.github.io/yes-card-gacha/config.json';
  var GACHA_BASE='https://hkrgb.github.io/yes-card-gacha/';
  var FISH_BASE='https://hkrgb.github.io/hong-kong-fishing/';
  var catalog=null;
  function abs(src,base){
    if(!src) return '';
    if(/^https?:|^data:|^\//.test(src)) return src;
    return base+src.replace(/^\.\//,'');
  }
  function ensure(){
    if(document.getElementById('pack-modal')) return;
    var css=document.createElement('link');
    css.rel='stylesheet';css.href='backpack.css?v=1';
    document.head.appendChild(css);
    var m=document.createElement('div');
    m.id='pack-modal';m.className='modal';
    m.innerHTML='<div class="paper pack-paper"><button class="close" type="button">×</button><p class="cap">BACKPACK</p><h2>我的背包</h2><div class="pack-tabs"><button type="button" data-tab="cards" class="on">卡牌</button><button type="button" data-tab="fish">魚獲</button></div><div id="packGrid" class="pack-grid"></div><p id="packEmpty" class="pack-empty"></p></div>';
    document.body.appendChild(m);
    m.querySelector('.close').onclick=function(){m.classList.remove('open');};
    m.onclick=function(e){if(e.target===m)m.classList.remove('open');};
    m.querySelectorAll('.pack-tabs button').forEach(function(b){
      b.onclick=function(){
        m.querySelectorAll('.pack-tabs button').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on');
        render(b.getAttribute('data-tab'));
      };
    });
    var menu=document.querySelector('#game-menu .menu-grid');
    if(menu && !document.getElementById('openPack')){
      var btn=document.createElement('button');
      btn.id='openPack';btn.type='button';
      btn.innerHTML='我的背包<small>卡牌與魚獲</small>';
      menu.insertBefore(btn, menu.firstChild);
      btn.onclick=function(){
        document.getElementById('game-menu').classList.remove('open');
        openPack();
      };
    }
  }
  function vars(){
    var v=(window.state&&state.vars)||{};
    return {
      album:(v.gachaAlbum&&typeof v.gachaAlbum==='object')?v.gachaAlbum:{},
      bag:Array.isArray(v.fishingBag)?v.fishingBag:[]
    };
  }
  function loadCatalog(){
    if(catalog) return Promise.resolve(catalog);
    return fetch(GACHA_CFG,{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){
      catalog=j.cards||[];return catalog;
    }).catch(function(){catalog=[];return catalog;});
  }
  function render(tab){
    var grid=document.getElementById('packGrid');
    var empty=document.getElementById('packEmpty');
    if(!grid) return;
    grid.innerHTML='';
    var data=vars();
    if(tab==='fish'){
      if(!data.bag.length){empty.textContent='尚未有魚獲，去釣魚小遊戲試試吧。';return;}
      empty.textContent='';
      data.bag.forEach(function(x){
        var art=document.createElement('article');
        art.className='pack-item';
        art.innerHTML='<img src="'+abs(x.image,FISH_BASE)+'" alt=""><b>'+(x.name||'魚獲')+'</b><span>'+(x.weight||'?')+' kg · '+(x.points||0)+' 分</span><small>'+(x.area||'')+'</small>';
        grid.appendChild(art);
      });
      return;
    }
    loadCatalog().then(function(cards){
      var ids=Object.keys(data.album).filter(function(id){return +data.album[id]>0;});
      if(!ids.length){empty.textContent='尚未有卡牌，去扭卡機抽一張吧。';grid.innerHTML='';return;}
      empty.textContent='';
      ids.forEach(function(id){
        var card=cards.find(function(c){return c.id===id;})||{id:id,name:id,image:'',rarity:''};
        var art=document.createElement('article');
        art.className='pack-item';
        art.innerHTML='<img src="'+abs(card.image,GACHA_BASE)+'" alt=""><b>'+(card.name||id)+'</b><span>'+(card.rarity||'')+' × '+data.album[id]+'</span>';
        grid.appendChild(art);
      });
    });
  }
  function openPack(){
    ensure();
    var inv=null;
    try{inv=JSON.parse(localStorage.getItem('islandJourneyInv:'+(window.GAME_ID||'island-journey'))||'null');}catch(e){}
    if(inv && window.state && state.vars){
      if(inv.gachaAlbum) state.vars.gachaAlbum=inv.gachaAlbum;
      if(inv.fishingBag) state.vars.fishingBag=inv.fishingBag;
    }
    document.getElementById('pack-modal').classList.add('open');
    var on=document.querySelector('#pack-modal .pack-tabs button.on');
    render(on?on.getAttribute('data-tab'):'cards');
  }
  function boot(){ensure();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
  window.openIslandPack=openPack;
})();
