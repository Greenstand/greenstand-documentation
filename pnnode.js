// 210409
'use strict';
var gLoaded=false; var gThis=this;
//var express = require('express');
const fs=require('fs');
const CONFIG=require('./config.json');
const gHome=CONFIG.homeDir;
const plog=require('./pnlog.js');

//------------------------------------------------------
//exports.log=async function(msg){await plog.log(msg);}
exports.log=function(msg){plog.log(msg);}
exports.reslog=function(msg){plog.reslog(msg);}

//------------------------------------------------------
const test=async function(){
  if(!gLoaded){setTimeout(test,500); return;}
  console.log("i90016 pnnode test console.log() OK");
  gThis.log("i90017 pnnode test pnlog.log() OK");
}//test
//test();

//--- COMMS -----------------------------------
// pn.getUserIP(req);
exports.getUserIP=function(req){
  // Apache reverse proxy put client IP in header "X-Forwarded-For”
  // req.ip=Apache's address
  if((req.ip==CONFIG.proxyIP)||(req.ip=='::ffff:'+CONFIG.proxyIP)){
    try{return req.get('X-Forwarded-For');} catch(e){}
  }//if
  return req.ip;
}//getUseIP

//--- FILE IO -----------------------------------
// append to file: pn.writeFile(txt,fname,null,a+)
// empty file: pn.writeFile('',fname);

// According to nodejs docs, Windows accepts both / and \ 
//https://nodejs.org/api/path.html#path_path_sep
const path=require('path');
var fileSep=path.sep;
var isWindows=false;
if(fileSep='\\')isWindows=true;

const fixfsep=function(s){ return s; }
//  let fsep='/'; let fnot='\\';
//  if(isWindows){fsep='\\'; fnot='/';}
//  s='x'+s+'x';
//  s=s.split(fnot).join(fsep);
//  return s.slice(1,-1);
//}//fixfsep

exports.isFile=function(fname){
  //fname=fixfsep(fname);
  try{
    fs.accessSync(fname,fs.R_OK);
    return true;
  } catch(e){return false;}
}//isFile

exports.writeFile=function(txt,fname,mode,flag){
  fname=fixfsep(fname);
  try{
    if(!mode)mode=0o664; if(!flag)flag='w+';
    if((txt)&&(Array.isArray(txt)))txt=txt.join('\n');
    fs.writeFileSync(gHome+fname,txt,{encoding:'utf8',flag:'w+','mode':mode});
    // flags: w write, w+ read/write, r read, r+ read/write, a append, a+ read/append
    // synchronous: as, as+, rs+ 
  }//try
  catch(e){throw e;}
}//writeFile

exports.readFile=async function(fname){
  fname=fixfsep(fname);
  try{let d=await fs.readFileSync(fname,'utf8'); return d;} catch(e){throw e;}
}//readFile

exports.fileToAra=async function(fname){
  fname=fixfsep(fname);
  try{
    let txt=await gThis.readFile(fname);
    txt=txt.toString();
    while(txt.slice(-1)=='\n')txt=txt.slice(0,-1);
    while(txt.slice(0,1)=='\n')txt=txt.slice(1);
    let ara=txt.split('\n');
    return ara;
  } catch(e){throw e;}
}//fileToAra

const modname=module.filename;
const basename=path.basename(modname);
exports.dirList=function(dir){
  if(!dir)dir=__dirname;
  var ara=[]; var ls='';
  fs.readdirSync(__dirname)
    .filter(function(file){return(file.indexOf('.')!==0)&&(file!==basename)&&(file.slice(-3) === '.js');})
    .forEach(function(file){ls+=file+'\n'; ara.push(file)});
  return ara;
}//dirList

//--- OBJECT PRETTIFY ----------------------------------
// pn.objPrettify(obj) => string
exports.objPrettify=function(obj,ind){
  let typ=typeof obj; 
  if(typ=='string')obj=JSON.parse(obj);
  let cnt=Object.keys(obj).length;
  if(!ind)ind='\n'; 
  let val,num,line,c;
  let ara=[];

  try{
    for(var k in obj){
      num=false;
      if(typeof k=='number')num=true;
      if(!isNaN(k))num=true;

      val=obj[k];
      if(val==undefined)val='null';
      if(val==null)val='null';
      if(k.slice(0,1)=='_')val='ComplexObject';

      typ=typeof val;
      if(Array.isArray(val))typ='ara';

      c=','; cnt--; if(cnt==0)c='';

      line=''
      if(num)line=ind+'{'+gThis.objPrettify(val,ind+'  ')+ind+'}'+c+ind;
      if(!num){
        if(typ=='string')line=ind+k+': '+val+c;
        if(typ=='object')line=ind+k+': {'+gThis.objPrettify(val,ind+'  ')+ind+'}'+c+ind;
        if(typ=='ara')   line=ind+'{'+k+': ['+ind+' '+gThis.objPrettify(val,ind+'  ')+ind+'] }'+c+ind;
      }//if !num
      ara.push(line);
    }//for
    line=ara.join('\n');
    while(line.indexOf(' \n')>-1) {line=gThis.swap(line,' \n','\n');}
    while(line.indexOf('\n\n')>-1){line=gThis.swap(line,'\n\n','\n');}
    return line;
  }//try
  catch(e){return e;}
}//objPrettify

//--- OBJECT IO -----------------------------------
exports.queryToObj=function(req){
  try{
    if((!req)||(!req.query))return {};
    gThis.log('i90069 pnnode queryToObj: '+JSON.stringify(req.query));
    gThis.log('i90070 pnnode queryToObj: '+gThis.objToString(req.query));
    return req.query;
  }//try
  catch(err){gThis.log('e90094 pnnode queryToObj ERROR: '+err);return {};}
}//queryToObj

exports.csvAraToObjAra=function(dara){
  for(var i=1;i<dara.length;i++){dara[i]=this.csvToObj(dara[0],dara[i]);}
  return dara;
}//csvAraToObjAra

exports.csvToObj=function(nams,vals){
  nams=nams.split(',');
  vals=vals.split(',');
  let obj={};
  for(var i=0;i<nams.length;i++){obj[nams[i]]=vals[i];}
  return obj;
}//csvToObj

exports.cookieToObj=function(c){
  if((c==undefined)||(c==null)||(typeof c!='string'))return {};
  c=gThis.swap(c,'; ',';'); c=c.split(';');
  if(c.length<1)return {};
  let nv; let obj={};
  for(let i=0;i<c.length;i++){
    nv=c[i].split('=');
    if(nv.length==2)obj[nv[0]]=nv[1];
  }//for
  return obj;
}//CookieToObj

exports.objLength=function(obj){return Object.keys(obj).length;}
exports.objToString=function(obj,depth,ind){return gThis.objKeys(obj,depth,ind,true);}
exports.objKeys=function(obj,depth,ind,shoval){
  if((depth==undefined)||(depth==null))depth=1;
  if((ind==undefined)||(ind==null)){ind='\n'; if(depth==1)ind=', ';}
  let out=''; let typ,val;
  try{
    for(var k in obj){
      typ=typeof obj[k];
      if(obj[k]==undefined)typ='undefined'; 
      if(obj[k]==null)typ='null';
      if(obj[k]=='')typ='emptyString';
      if(k.indexOf('_')==0)typ='complexObject';
      val=''; if(shoval)val=obj[k];
      if((depth>1)&&(typ=='object')){
          out+=ind+k+': object'+ind+gThis.objKeys(obj[k],depth--,ind+'  ');
      }//if
      else{out+=ind+k+': '+typ+' '+val;}
    }//for
    return out.slice(ind.length);
  }//try
  catch(e){return e;}
}//objKeys

//--- ARRAYS -----------------------------------
exports.deleteFmAra=function(ara,goon){
  let x=ara.indexOf(goon);
  if(x<0)return ara;
  return ara.splice(x,1)
}//deleteFmAra

//--- STRINGS & INTS -----------------------------------
exports.userName=function(userid){
  if(userid.includes('@'))userid=userid.slice(0,userid.indexOf('@'));
  return userid.slice(0,1).toUpperCase()+userid.slice(1);
}//userName
  
exports.swap=function(str,olds,news){
  if((str==undefined)||(str==null))return str;
  if(typeof str!='string'){
    if(!str.toString)return str;
    str=str.toString();
  }//if
  return str.split(olds).join(news);
}//swap

exports.hasValue=function(v){
  try{
    if((v==undefined)||(v==null)||(v==false))return false;
    if((v==[])||(v=={}))return false;
    if((v.length)&&(v.length==0))return false;
    try{if(v.length()==0)return false;} catch(e){};
    let v2=v.toString().toLowerCase();
    if((v2=='')||(v2=='false')||(v2=='not')||(v2=='no')||(v2=='n'))return false;
    if((v2.slice(0,6)=='false ')||(v2.slice(0,4)=='not ')||(v2.slice(0,3)=='no ')||(v2.slice(0,2)=='n '))return false;
    v2=JSON.stringify(v);
    if((v=='""')||(v=='{}'))return false;
  } catch(e){return false;}
  return true;
}//hasValue

exports.isNum=function(s){
  var nums=/^[0-9]+$/;
  if(s.match(nums))return true;
  return false;
}//isNum

exports.isAlpha=function(s){
  if(s.toLowerCase()==s.toUpperCase())return false;
  return true;
}//isNum

exports.isEmail=function(email){
  const rx = /\S+@\S+\.\S+/;
  if(rx.test(email))return true;
  return false;
}//isEmail

//--- DATE & TIME ------------------------------------------
exports.getYesterday=function(){
  const d=new Date(); 
  var dd=d.getDate()-1;  
  d.setDate(dd);
  if(dd<10)dd='0'+dd;
  var yy=d.getFullYear()-2000;
  var mm=d.getMonth()+1; if(mm<10)mm='0'+mm;
  var ymd=' '+yy+mm+dd+' ';
  return ymd.trim().toString();
}//getYesterday

exports.getYYMMDD=function(){
  const d=new Date();
  var yy=d.getFullYear()-2000;
  var mm=d.getMonth()+1; if(mm<10)mm='0'+mm;
  var dd=d.getDate(); if(dd<10)dd='0'+dd;
  var ymd=' '+yy+mm+dd+' ';
  return ymd.trim().toString();
}//getYYMMDD

exports.getYYYYHMMHDD=function(){
  const d=new Date();
  var yy=d.getFullYear();
  var mo=d.getMonth()+1;  if(mo<10)mo='0'+mo;
  var dd=d.getDate();     if(dd<10)dd='0'+dd;
  var hh=d.getHours();    if(hh<10)hh='0'+hh;
  var mm=d.getMinutes();  if(mm<10)mm='0'+mm;
  var ss=d.getSeconds();  if(ss<10)ss='0'+ss;
  var ymdhms=' '+yy+'-'+mo+'-'+dd+' '+hh+':'+mm+':'+ss;
  return ymdhms.trim().toString();
}//getYYYYHMMHDD

exports.getYMDHMS=function(){
  const d=new Date();
  var yy=d.getFullYear()-2000;
  var mo=d.getMonth()+1;  if(mo<10)mo='0'+mo;
  var dd=d.getDate();     if(dd<10)dd='0'+dd;
  var hh=d.getHours();    if(hh<10)hh='0'+hh;
  var mm=d.getMinutes();  if(mm<10)mm='0'+mm;
  var ss=d.getSeconds();  if(ss<10)ss='0'+ss;
  var ymdhms=' '+yy+mo+dd+'_'+hh+':'+mm+':'+ss;
  return ymdhms.trim().toString();
}//getYMDHMS

exports.getHHMMSS=function(msecs){
  const d=new Date();
  var hh=d.getHours();    if(hh<10)hh='0'+hh;
  var mm=d.getMinutes();  if(mm<10)mm='0'+mm;
  var ss=d.getSeconds();  if(ss<10)ss='0'+ss;
  if(!msecs)return hh+':'+mm+':'+ss;
  var ms=d.getMilliseconds(); 
    if(ms<10)ms='00'+ms;
    if(ms<100)ms='0'+ms;
  return hh+':'+mm+':'+ss+':'+ms;
}//getHHMMSS

exports.getHHMM=function(){
  const d=new Date();
  var hh=d.getHours();    if(hh<10)hh='0'+hh;
  var mm=d.getMinutes();  if(mm<10)mm='0'+mm;
  return hh+':'+mm;
}//getHHMM

exports.getTimeStamp=function(){
  let since1970=Date.now();
  let y50years=50*365*24*60*60*1000;
  let m9mo=9*30*24*60*60*1000;
  let timestamp=since1970-y50years-m9mo;
  return timestamp;
}//getTimeStamp  

exports.timestamp=function(){
  let since1970=Date.now();
  let y50years=50*365*24*60*60*1000;
  let m9mo=9*30*24*60*60*1000;
  let timestamp=since1970-y50years-m9mo;
  return timestamp;
}//getTimeStamp  

//--- RESEARCH -----------------------------------
exports.testObj=function(obj){
  let c=', '; let sp=' ';
  let o=typeof obj; 
  for(var k in obj){
    if(typeof obj[k]!='string')o+=c+typeof obj[k]+sp+k;
  }//for
  gThis.log(o);
}// testObj

exports.parseRes=function(res){
  //gThis.log('Parse response...'+gThis.objKeys(res));
  gThis.log('  res.headersSent: '+res.headersSent);
  gThis.log('  res.statusCode: '+res.statusCode);
  gThis.log('  res.sendDate: '+res.sendDate);
  gThis.log('  res.finished: '+res.finished);
}//parseRes

exports.parseReq=function(req){
  //gThis.log(gThis.objKeys(req));
  gThis.log('parseReq()...');
  gThis.log('  req.ip: '+req.ip);
  gThis.log('  req.method: '+req.method);
  gThis.log('  req.protocol: '+req.protocol);
  gThis.log('  req.get(host): '+req.get('host'));
  gThis.log('  req.hostname: '+req.hostname);
  gThis.log('  req.url: '+req.url);
  gThis.log('  req.originalUrl: '+req.originalUrl);
  gThis.log('  req.baseUrl: '+req.baseUrl);
  gThis.log('  req.domain: '+req.domain);
  gThis.log('  req.path: '+req.path);
  gThis.log('  req.query: '+gThis.objToString(req.query));
  gThis.log('  req.xhr: '+req.xhr); // T|F
  gThis.log('  req.body: '+gThis.objToString(req.body));
  gThis.log('  req.params: '+gThis.objToString(req.params));
  gThis.log('  req.headers: '+gThis.objToString(req.headers));
  gThis.log('  req.statusCode: '+req.statusCode);
  gThis.log('  req.statusMessage: '+req.statusMessage);

  //gThis.log(req.read);
  //gThis.log(req.read());
  //gThis.log(req.get(nam));
  //gThis.log(req._parsedOriginalUrl);
  //gThis.log(req._parsedUrl);
  //gThis.log(gThis.objToString(req.rawHeaders));
  //gThis.log(gThis.objKeys(req.client));

}//parseReq

//---------------------------------------------
gLoaded=true;
gThis.log('i90998 pnnode tests logger OK');
console.log('i90999 pnnode loaded');
//test();
//---------------------------------------------
//---------------------------------------------
//--- 30 ------------------------------------

