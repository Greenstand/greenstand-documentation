// 200416
'use strict';
var gLoaded=false; var gThis=this;
const pn=require('./pnnode.js');
const fs=require('fs');
const {Console}=require('console');

const config=require('./config.json');
var logpath=config.logs.logpath;
exports.getLogPath=function(){return logpath;}
var loglevel=config.logs.level
exports.getLogLevel=function(){return loglevel;}
exports.setLogLevel=function(n){if((n>=0)&&(n<=9))loglevel=n;}

//------------------------------------------------------
const TEST=false;//true;
const test=async function(){
  if(!gLoaded){setTimeout(test,500); return;}
  console.log('config.logs.toConsole '+config.logs.toConsole);
  gThis.log('i30024 pnlog test()');
  gThis.log('w30024 pnlog test()');
  gThis.log('e30024 pnlog test()');
  gThis.log('n30024 pnlog test()');
  gThis.log('a30024 pnlog test()');
  gThis.log('d30024 pnlog test()');
  gThis.log('| 30024 pnlog test()');
  gThis.log('> 30024 pnlog test()');
}//test
if(TEST)test();

//--- CONSOLES & ROLLER SCRIPT ------------------------
// flags: a append, r read, w write; 
// _+ read & write; _x fail if file exists; +s synchronous

var consoles={};
var rollers=[];

exports.setLogPath=function(path){
  if(path)logpath=path;
  //console.log('i90043 pnlog setLogPath(): '+logpath);
  //reWriteRoller();
  return logpath;
}//setLogPath

const newConsole=function(n){
  if(!n)return null;
  consoles[n]=new console.Console(fs.createWriteStream(logpath+n,{flags:'a+'}));
  //console.log('i90050 pnlog newConsole(): '+logpath+n);
  //writeRoller(logpath+n);
  return consoles[n];
}//newConsole

const writeRoller=function(logpath){
  let line='cat '+logpath+' >> '+logpath+'.$tday; echo $tday > '+logpath+';';
  fs.writeFileSync('./pnlog.sh',line,{encoding:'utf8',flag:'a','mode':0o774});
}//writeRoller

const reWriteRoller=function(){
  let line='tday=`date +%y%m%d`; echo $tday;';
  fs.writeFileSync('./pnlog.sh',line,{encoding:'utf8',flag:'w','mode':0o774});
}//rewrite

//--- LOG -------------------------------------------
// log type prefixes: i w e n m > | a d
const LOGSTYPES='iwenm';
const LOGtTYPES='enmad';
exports.log=async function(msg,tin){
  try{
    // MSG TO STRING
    if((msg==undefined)||(msg==null))return;
    if((typeof msg !='string')&&(msg.toString))msg=msg.toString();

    // TYPE
    let typ=msg.slice(0,1).toLowerCase();
    if(tin)typ=tin.toLowerCase();
        
    // LEVEL
    let level=msg.slice(1,2);
    if((level<0)||(level>9))level=1;
    //if((typ=='e')||(typ=='>')||(typ=='|')||(typ=='a'))level=9;
    if(typ=='a')level=9;
    if(level<loglevel)return;
    //console.log('\n');
    //console.log('i90084 pnlog.js typ level: '+typ+' '+level);

    // TO CONSOLE?
    if((typ!='a')&&(config.logs.toConsole))console.log(msg);
    if((typ=='a')&&(config.logs.logaccesstoconsole))console.log(msg);

    // TO LOGS
    msg=pn.getYMDHMS()+' '+msg;
    if(!consoles.s)newConsole('s');
    if(LOGSTYPES.includes(typ))consoles.s.log(msg);
    
    // TO LOG<t>
    if(LOGtTYPES.includes(typ)){
      if(!consoles[typ])newConsole(typ);
      consoles[typ].log(msg);
    }//if
    
  }//try
  catch(e){console.log('e90107 pnlog.log(): ERROR Unwritable log message: '+e.toString());}
}//log

//--- ACCESS LOGS ---------------------------
exports.reslog=function(res,prefix){
  try{
    const path=res.locals.url; if(path=='/_log')return;
    //pn.log('i90333 pnlog reslog() '+path);
    const time=pn.getYMDHMS();
    const code=res.statusCode;
    const method=res.locals.method;
    const ip=res.locals.ip;
    const agent=res.locals.agent;
    const toAddr=res.locals.toAddr;
    const state=res.statusCode+' '+res.statusMessage; 
    const hdr=res._header; 
    let email=res.locals.email;   if(!email)email='';
    let screen=res.locals.screen; if(!screen)screen='';
    let   authd='';
          if((res.locals.tryToAuthorize)&&(!res.locals.ok))authd='AuthNO';
          if((res.locals.tryToAuthorize)&&(res.locals.ok))authd='AuthOK';
    const sp=' ';
    let msg=code+sp+ip+sp+method+sp+path+sp+authd+sp+email+sp+screen+sp+'||'+sp+agent;
    gThis.log(msg,'a');
    if(code>399)gThis.log(msg,'e');
    if(!config.logs.aLogsToConsole)return;
    if(!prefix)prefix='';
    console.log(prefix+pn.swap(msg,agent,''));
  } 
  catch(e){console.log('e90136 ERROR: pnlog reslog(). Unwritable access log: '+e.toString());}
}//reslog

//---------------------------------------------
console.log('i90998 pnlog loaded: '+gThis.setLogPath());
console.log('i90999 pnlog log level : '+loglevel);
gLoaded=true;
//---------------------------------------------
//---------------------------------------------
//--- 30 ------------------------------------

