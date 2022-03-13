// 200122
'use strict';
const DEBUG=false; var isLoaded=false;
var gThis=this;
const bk='\n'; const sp=' ';
const fs=require('fs');
const pn=require('./pnnode.js');
const CONFIG=require('./pnconfig.json');
const cookieParser=require('cookie-parser');
const crypto=require('crypto');
const MAXLIFESPAN=CONFIG.auth.minutes*60*1000;
var bodyParser = require('body-parser');
//  app.use(bodyParser.json());

// {password:pass,email:email,screen:size}
// to /_login
// return hash | error

//--------------------------------------
// return true | false
exports.isAuthd=function(req,resp,cookin){
  pn.log('i90020 auth isAuthd: '+req.url+' '+cookin);
  if(req.url=='/logout')return true;
  if(req.url=='/login')return true;
  if(req.url=='/_log')return true;
  //if(req.hostname=='localhost')return true;

  let cookies=cookin;
  if(!cookies)cookies=req.cookies;
  if((!cookies)&&(req.headers)&&(req.headers.cookie))cookies=req.headers.cookies;
  if(!cookies){pn.log('e80032 auth isAuthd no cookies.');return false;}
  pn.log('i90031 auth isAuthd cookies: '+JSON.stringify(cookies));
  if(!cookies.hash){pn.log('e80033 auth isAuthd no cookies.hash');return false;}

  // GET DBASE OBJ
  let obj=dbaseToFrom('get',{'hash':cookies.hash});
  if(obj==null){pn.log('e80037 auth isAuthd hash not in dbase');return false;}
  pn.log('i90038 auth isAuthd dbase returned '+obj.time+' '+obj.email+' '+obj.screen);
  resp.locals.email=obj.email;
  resp.locals.screen=obj.screen;

  // CHECK TIME
  let now=pn.getTimeStamp();
  if(now - obj.time > MAXLIFESPAN){dbaseCleanup(); return false;}

  // CHECK CONTEXT
  let msg='';
  if(obj.host!=req.hostname)msg+='; '+obj.host+' != '+req.hostname;
  if(obj.ip!=req.ip)msg+='; '+obj.ip+' != '+req.ip;
  if(obj.agent!=req.get('user-agent'))msg+='; '+obj.agent+' != '+req.get('user-agent');
  if(msg){pn.log('e80051 auth isAuthd context mismatch: '+msg.slice(2));return false;}

  // UPDATE TIME, LOG, RESOLVE
  dbaseToFrom('update',{'time':obj.time},now);
  pn.log('i90055 auth isAuthd OK authorized '+obj.email);

  resp.locals.auth=true;
  return resp;
};//isAuthd

//--------------------------------------
// returns null | hash
exports.getHash=function(req,resp){return getToken(req,resp);}
const getToken=function(req,resp){ 
  let msg=null;
  pn.log('i90065 auth getToken body: '+JSON.stringify(req.body))
  if(!req.body)msg='e30066 auth: BAD LOGIN, NO REQUEST BODY '+req.method+' '+req.url+' >'+req.ip+'< '+req.get('user-agent');
  if((!msg)&&(typeof req.body!='object'))msg='e30067 auth: BAD LOGIN, NO DATA OBJECT '+req.method+' '+req.url+' >'+req.ip+'< '+req.get('user-agent');
  if((!msg)&&(!req.body.password))msg='e30068 auth: BAD LOGIN, NO PASSWORD '+req.method+' '+req.url+' |'+req.ip+'| '+req.get('user-agent');
  if((!msg)&&(!req.body.email))msg='e30069 auth: BAD LOGIN, NO EMAIL '+req.method+' '+req.url+' >'+req.ip+'< '+req.get('user-agent');
  if((!msg)&&(req.body.password!=CONFIG.password))msg='e30071 auth: BAD LOGIN, BAD PASSWORD '+req.body.password+' from '+req.body.email+' '+req.method+' '+req.url+' from '+req.ip; //+'< '+req.get('user-agent');
  if(msg){pn.log(msg);resp.status(511);return null;}

  // BUILD TOKEN OBJ
  let obj={};
  obj.email=req.body.email;
  obj.screen=req.body.screen;
  obj.ip=req.ip;
  obj.host=req.hostname;
  obj.agent=req.get('user-agent');
  obj.time=pn.getTimeStamp();
  obj.hash=obj.email+obj.ip+obj.host+obj.agent;
  obj.hash=crypto.createHash('md5').update(obj.hash).digest('hex');
  pn.log('i90083 auth.js createToken: dbase object '+JSON.stringify(obj));

  if(!dbaseToFrom('get',{'hash':obj.hash})){
    pn.log('i60086 auth createToken: '+obj.email+' '+obj.ip+' '+obj.screen+' '+obj.host+' '+obj.agent);
    dbaseToFrom('add',obj);
  }//else
  else{pn.log('i30089 auth createToken: hash already in dbase '+obj.email+' '+obj.hash);}
  return obj.hash;
};//getToken

//--------------------------------------
var DBASE=[]; // {email screen ip host agent time hash}
const dbaseToFrom=function(op,obj,newval){ // op = get | add | update | delete
  if(!op){return('e30096 auth dbaseToFrom: ERROR No dbase operation specified');}
  if(!obj){return('e30097 auth dbaseToFrom: ERROR No data object provided for dbase');}
  if((op=='update')&&(!newval)){return('e30106 auth.js dbaseToFrom: ERROR No value provided for dbase update');}

  if(op=='add'){DBASE.push(obj); return obj;}

  let key,val,targ=null;

  for(var k in obj){key=k;val=obj[k];}
  for(var i=0;i<DBASE.length;i++){if(DBASE[i][key]==val)targ=i;}

  if(op=='get'){ if(targ!=null)return(DBASE[targ]); return null;}
  if(op=='delete'){DBASE.splice(targ,targ+1);}
  if(op=='update'){DBASE[targ][key]=newval;}
  return true;
};//dbaseToFrom

//--------------------------------------
const dbaseCleanup=function(){
  let now=pn.getTimeStamp(); let expd=[];
  for(var i=0;i<DBASE.length;i++){
    if(now-DBASE[i].time > MAXLIFESPAN)expd.push(DBASE[i].time);
  }//for
  for(var i=0;i<expd.length;i++){dbaseToFrom('delete',{'time':expd[i]});}
};//dbaseCleanup
//--------------------------------------

isLoaded=true;
pn.log('i90124 auth.js is loaded '+isLoaded);
//--------------------------------------
//--------------------------------------



