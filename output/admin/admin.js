import{initializeApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,collection,getDocs,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
const $=s=>document.querySelector(s),ADMIN='info@rgb-workshop.com';
const app=initializeApp({projectId:'island-journey-rgb',appId:'1:840035091382:web:e1689c28df34dbf4883717',apiKey:'AIzaSyCR6nPQIG9GLgbiLCVCZOc785j8BMicwQA',authDomain:'island-journey-rgb.firebaseapp.com',messagingSenderId:'840035091382'}),auth=getAuth(app),db=getFirestore(app);
$('#loginBtn').onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){$('#loginMsg').textContent=e.message}};
onAuthStateChanged(auth,async u=>{
  if(!u){$('#login').hidden=false;$('#cms').hidden=true;$('#projectHub').hidden=true;return}
  if((u.email||'').toLowerCase()!==ADMIN){$('#loginMsg').textContent='帳戶 '+u.email+' 沒有管理權限';await signOut(auth);return}
  $('#login').hidden=true;$('#cms').hidden=false;$('#projectHub').hidden=true;
  $('#userEmail').textContent=u.email;
  $('#status').textContent='後台暫時簡化模式（正在修復完整功能）';
});
