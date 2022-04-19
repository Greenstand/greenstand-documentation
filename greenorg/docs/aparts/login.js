//220201
'usestrict';

//------------------------------------
var loginr={}
loginr.writeCookie=function(nam,val,days){
  if(!nam)return;
  if((val===undefined)||(val==null)||(val=="")||(val==" ")){val=nam;days=-1;}
  val=encodeURIComponent(val);
  days=loginr.cookieEnd(days);
  document.cookie=nam+'='+val+days;
}//writeCookie

//--------------------------------------
loginr.cookieEnd=function(days){
  if((days===undefined)||(days===null)||(days===''))days=30;
  if(days===0)return ';secure;';
  let exp=new Date();
  exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000) );
  exp=exp.toGMTString();
  return '; expires='+exp+'; path=/;';  //secure;samesite=None;';
}//cookieEnd

//--------------------------------------
loginr.fetcher=function(obj){
  fetch('/docs/aparts/login.php', obj)
    .then(reply => reply.text())
    .then(reply => {
      if(reply=='1'){
        loginr.writeCookie('authorized','OK',10);
        let path=location.search.split('=')[1];
        path=decodeURIComponent(path);
        location=path;
      }//if
      if(reply!='1')location.reload();
    })
    .catch(err => {alert(err);}); 
}//fetcher

//--------------------------------------
// PROMPTER
loginr.prompter=function(){
  //alert(document.cookie);

  // LOGIN?
  let qry=location.search;
  if(!qry)return;
  if( (!qry.includes('loginto=')) && (!qry.includes('logout=')) )return;
  if(qry.includes('logout=')){
    loginr.writeCookie('authorized','loggedout',10);
    //location=location.pathname;
    //location.search=''; 
    return;
  }//if
  //alert(document.cookie);
  document.cookie='cookies=OK;'; 
  let ck=document.cookie;
  if(!ck){alert('To log in, let '+location.hostname+' store a cookie.');return;}
  
  // GET PASSWORD & VERIFY
  let passwd=prompt("Please provide the password\n\n", "password");
  if(!passwd)return;
  let nots=' ;{;[;(;<;,'.split(';');
  for(let i=0;i<nots.length;i++){if(passwd.includes(nots[i]))return;}

  // POST LOGIN
  let bobj=JSON.stringify({'password':passwd});
  let opts = {
    method: 'POST',
    body:bobj,
    credentials: 'include', 
    headers:{'Content-Type': 'application/json'}
  };
  loginr.fetcher(opts);
}//prompter

//------------------------------------
window.setTimeout(loginr.prompter,600);
//------------------------------------

