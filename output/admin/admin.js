const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/c5fceb05455bae9a3d049ccf5b46260c33ef23c3/output/admin/admin.js';
const PURL='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/main/output/admin/admin-p.txt';
function decodeB64(s){const bin=atob(s);const bytes=new Uint8Array(bin.length);for(let i=0;i!==bin.length;++i)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}
Promise.all([
  fetch(SRC+'?t='+Date.now()).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}),
  fetch(PURL+'?t='+Date.now()).then(r=>{if(!r.ok)throw new Error('P HTTP '+r.status);return r.text()})
]).then(([code,p])=>{
  const patches=JSON.parse(decodeB64(p.trim()));
  let n=0;
  for(const [a,b] of patches){if(code.indexOf(a)===-1){console.warn('patch miss',a.slice(0,40));continue}code=code.replace(a,b);n++}
  console.log('applied patches:',n);
  code=code.replace("].forEach(id=>$('#'+id).oninput=()=>syncDisplay())","].forEach(id=>{const el=$('#'+id);if(el)el.oninput=()=>syncDisplay()})");
  code=code.replace("].forEach(k=>$('#'+k).value=settings[k])","].forEach(k=>{const el=$('#'+k);if(el)el.value=(settings[k]!=null?settings[k]:'')})");
  code=code.replace("['chapterId','chapterNo','chapterName','chapterMusic','chapterIntro','chapterOutro'].forEach(id=>$('#'+id).oninput=syncChapter)","['chapterId','chapterNo','chapterName','chapterMusic','chapterIntro','chapterOutro'].forEach(id=>{const el=$('#'+id);if(el)el.oninput=syncChapter})");
  code=code.replace("['sceneId','sceneName','bg','place','streetUrl','streetLat','streetLng','streetHeading','streetPitch','streetZoom','iframeUrl','requirements','effects','sceneMusic'].forEach(id=>$('#'+id).oninput=syncScene)","['sceneId','sceneName','bg','place','streetUrl','streetLat','streetLng','streetHeading','streetPitch','streetZoom','iframeUrl','requirements','effects','sceneMusic'].forEach(id=>{const el=$('#'+id);if(el)el.oninput=syncScene})");
  code=code.replace("Object.values(sf).forEach(e=>e.oninput=syncSettings)","Object.values(sf).forEach(e=>{if(e)e.oninput=syncSettings})");
  return import(URL.createObjectURL(new Blob([code],{type:'text/javascript'})));
}).catch(e=>{console.error(e);const m=document.getElementById('loginMsg');if(m)m.textContent='Load failed: '+e.message;});
