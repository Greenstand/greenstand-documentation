#!/usr/bin/env node
// 210512
'use strict';
const CONFIG=require('./config.json');
const pn=require('./pnnode.js');
const url=require('url');
var path = require('path');
const app=require('./app.js'); 
var port=CONFIG.ports.ssl;
var certs=null;
if(CONFIG.SSL)certs={key:pn.readFile(CONFIG.ssl.key),cert:pn.readFile(CONFIG.ssl.cert)};
var http=null;
if(!CONFIG.SSL){http=require('http'); port=CONFIG.ports.http;}
const https=require('https');
//const http2=require('http2');
var server;

//-------------------------------------------------
pn.log('i90015 startServer() in 600ms');
setTimeout(startServer,600);
async function startServer(){
  if(!CONFIG.SSL)server=http.createServer(app);
  if(CONFIG.SSL){
    let key=await pn.readFile(CONFIG.ssl.key);
    let cert=await pn.readFile(CONFIG.ssl.cert);
    server=https.createServer({'key':key,'cert':cert},app);
    //server=http2.createSecureServer({'key':key,'cert':cert},app);
  }//if
  server.listen(port);
  server.on('listening',onListen);
  server.on('request',onRequest);
  server.on('error',onError);
}//startServer

//-------------------------------------------------
function onRequest(req,res){
  pn.log('i90085 SERVER onRequest: vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
  pn.log('i90086 SERVER onRequest: '+res.statusCode+' '+req.url);
  res.on('finish',function(){pn.log('i90090 SERVER response.onFinish');});
  //res.headersSent=tf res.getHeaders()={} req.headers.cookie;
  pn.log('i90087 SERVER request referer: '+req.headers.referer);
  pn.log('i90087 SERVER request cookie: '+req.headers.cookie);
  
  let fname=null;

  // REDIRECT *.php => *.htm
  if(req.url.includes('.php')){
   fname=req.url.replace('.php','.htm');
  }//if php

  // REDIRECT *_* => referer?loginto=url
  if(req.url.includes('/_')){
    if((!req.headers)||(!req.headers.cookie)||(!req.headers.cookie.includes('authorized=OK'))){
      fname='/docs/index.php'; 
      if(req.headers.referer)fname=req.headers.referer;
      if(!fname.includes(req.headers.host))fname='/docs/index.php';
      if(!fname.includes('/docs'))fname='/docs/index.php';
      if(fname.includes('?'))fname=fname.slice(0,fname.indexOf('?'));
      fname+='?loginto='+encodeURIComponent(req.url); 
    }//if
  }//if

  if(!fname)return;

  pn.log('i90094 SERVER onRequest 302 redirect to: '+fname);
  try{res.statusCode=307; res.setHeader('Location',fname);}  //res.end();}
  catch(e){pn.log('i90096 SERVER onRequest redirect Error: '+e);}
  pn.log('i90095 SERVER onRequest res.headers sent?: '+res.headersSent+' '+JSON.stringify(res.getHeaders()));
  pn.log('i90095 SERVER onRequest res.finished?: '+res.writableEnded);
}//onRequest

//-------------------------------------------------
function onListen() {
  pn.writeFile('kill '+process.pid,'kill',0o700);
  pn.log('i90053 server '+process.pid+' listening at '+server.address().address+':'+server.address().port);
  pn.log('i90000 ---------------------------------------\n');
}// onListen

//-------------------------------------------------
function onError(error) {
  if(error.syscall !== 'listen'){pn.log('e90058 server: '+error.toString()); throw error;}
  switch(error.code){
    case 'EACCES':
      pn.log('e90061 server: '+port+' requires elevated privileges'); process.exit(1); break;
    case 'EADDRINUSE': pn.log('e90062 server: PORT IN USE: '+port); 
      console.log('> sudo lsof -i :'+port);
      console.log('> sudo pgrep -a node | PM2');
      process.exit(1); break;
    default: pn.log('e90063 server: '+error.toString()); throw error;
  }//switch
}// onError

//-------------------------------------------------
pn.log('i90999 server is loaded');
pn.log('e90999 server error message test');
//-------------------------------------------------
//-------------------------------------------------
//-------------------------------------------------

