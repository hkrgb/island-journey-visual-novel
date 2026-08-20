(function(){
const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/ab3699996cc71c4cc867c56f36f45a4db38c58b3/output/game-core.js';
const P='W1siZnVuY3Rpb24gc2V0U3ByaXRlKHMpe2NvbnN0IEw9JCgnI3Nwcml0ZUwnKSxSPSQoJyNzcHJpdGVSJyk7TC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtSLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO2NvbnN0IGtleT1zLnNwcml0ZXx8aW5mZXJyZWRTcHJpdGUocyk7aWYoIWtleXx8IVNQUltrZXldKXJldHVybjtjb25zdCBlbD0ocy5zaWRlfHwoKHMuc3A9PT0n5reHJ3x8cy5zcD09PSfmt4fogIHluKsnfHxzLnNwPT09J+a4oeWBh+Wxi+Wkp+WnkCcpPydsZWZ0JzoncmlnaHQnKSk9PT0nbGVmdCc/TDpSO2VsLnNyYz1TUFJba2V5XTtlbC5hbHQ9cy5zcDtyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCk9PmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpKX0iLCAiZnVuY3Rpb24gc2V0U3ByaXRlKHMpe2NvbnN0IEw9JCgnI3Nwcml0ZUwnKSxSPSQoJyNzcHJpdGVSJyk7TC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtSLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO2NvbnN0IGtleT1zLnNwcml0ZXx8aW5mZXJyZWRTcHJpdGUocyk7aWYoIWtleSlyZXR1cm47bGV0IHNyYz0nJztpZigvXmh0dHBzPzpcXC9cXC8vaS50ZXN0KGtleSl8fGtleS5zdGFydHNXaXRoKCdkYXRhOicpfHxrZXkuc3RhcnRzV2l0aCgnYmxvYjonKSlzcmM9a2V5O2Vsc2UgaWYoU1BSW2tleV0pc3JjPVNQUltrZXldO2Vsc2UgaWYoa2V5LmluZGV4T2YoJy8nKT49MClzcmM9a2V5O2lmKCFzcmMpcmV0dXJuO2NvbnN0IGVsPShzLnNpZGV8fCgocy5zcD09PSfmt4cnfHxzLnNwPT09J+a3h+iAgeW4qyd8fHMuc3A9PT0n5rih5YGH5bGL5aSn5aeQJyk/J2xlZnQnOidyaWdodCcpKT09PSdsZWZ0Jz9MOlI7ZWwub25lcnJvcj1mdW5jdGlvbigpe2VsLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpfTtlbC5zcmM9c3JjO2VsLmFsdD1zLnNwfHwnJztyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtlbC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKX0pfSJdLCBbIih3aW5kb3cuR0FNRV9DSEFSQUNURVJTfHxbXSkuZm9yRWFjaChjPT5PYmplY3QuZW50cmllcyhjLm1vb2RzfHx7fSkuZm9yRWFjaCgoW20sdXJsXSk9PntpZih1cmwpU1BSW2Mua2V5Kyc6JyttXT11cmx9KSk7IiwgIih3aW5kb3cuR0FNRV9DSEFSQUNURVJTfHxbXSkuZm9yRWFjaChjPT57aWYoYy5pbWFnZSl7U1BSW2Mua2V5XT1jLmltYWdlO2lmKGMubmFtZSlTUFJbYy5uYW1lXT1jLmltYWdlfU9iamVjdC5lbnRyaWVzKGMubW9vZHN8fHt9KS5mb3JFYWNoKChbbSx1cmxdKT0+e2lmKCF1cmwpcmV0dXJuO1NQUltjLmtleSsnOicrbV09dXJsO2lmKGMubmFtZSlTUFJbYy5uYW1lKyc6JyttXT11cmx9KX0pOyJdXQ==';
function decodeB64(s){const bin=atob(s);const bytes=new Uint8Array(bin.length);for(let i=0;i!==bin.length;++i)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}
fetch(SRC+'?t='+Date.now()).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}).then(function(code){
  var patches=JSON.parse(decodeB64(P));
  var n=0;
  for(var i=0;i!==patches.length;++i){
    var a=patches[i][0],b=patches[i][1];
    if(code.indexOf(a)===-1){console.warn('gcl miss',a.slice(0,40));continue}
    code=code.replace(a,b);n++;
  }
  console.log('game-core URL sprite patches:',n);
  var s=document.createElement('script');
  s.textContent=code;
  document.body.appendChild(s);
}).catch(function(e){console.error('game-core load failed',e)});
})();
