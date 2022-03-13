// 210515
'use strict';
const CONFIG=require('./pnconfig.json');
const pn=require('./pnnode.js');
const routes=require('./routes.js');
var express = require('express');
var app = express();
var path = require('path');
  const fsep=path.sep;
  app.use(express.static(path.join(__dirname, CONFIG.webRootDir)));
var bodyParser = require('body-parser');
  app.use(bodyParser.json());
var cookieParser=require('cookie-parser');
  app.use(cookieParser());  
const auth=require('./auth.js');

app.all('*',function(req,res,next){pn.log('i90001 app.js input: '+req.method+' '+req.url); next();})
///docs/contributor-docs/?loginto=%2Fdocs%2Fcontributor-docs%2F_swagger%2F

//--------------------------------------------
// INCOMING LOGIN 
app.all('/docs/aparts/login.htm',(req,res,next)=>{
  pn.log('i90002 app.js post /docs/aparts/login.htm: '+req.url);
  let reply='0';
  if((req.body)&&(req.body.password)&&(req.body.password==CONFIG.password))reply='1';
  res.set('Content-Type','text/plain;charset=utf-8'); 
  res.status(200).send(reply);
  next();
});//login

//--------------------------------------------
// INCOMING CLIENT LOG 
app.post('/_log',(req,res,next)=>{
  try{
    if(!CONFIG.clientlogs.toserver)return;
    if(!req.ip.includes(CONFIG.logs.fromclientips))return;
    let msg='e30164 routes POST: /_log, but no log msg';
    if((req.body)&&(req.body.msg))msg=req.body.msg;
    pn.log(msg);
    res.set('Content-Type','text/plain;charset=utf-8');
    res.status(200).send('true');
    return; 
  }//try
  catch(err){next(err);}
}); // post _log

//--------------------------------------------
// NORMALIZE PATH
app.use('/',function(req, res, next) {
  pn.log('i90017 app.js normalize req.url: '+req.url)
  pn.log('i90017 app.js normalize req.path: '+req.path)
  pn.log('i90017 app.js normalize req.query: '+req.query)
  // url:   /docs/contributor-docs/?loginto=%2Fdocs%2Fcontributor-docs%2F_swagger%2F
  // path:  /docs/contributor-docs/
  // query: {}

  let fname=req.path;
  fname=path.normalize(fname);
  let obj=path.parse(fname);
  let ext=obj.ext; 

  if((fname==='')||(fname==='/'))fname="/index.htm";
  else if(!ext)fname=fname+'/index.php';
  let absfname=CONFIG.homeDir+fsep+CONFIG.webRootDir+fname;
  absfname=path.normalize(absfname);
  if(!pn.isFile(absfname)){fname+='l'; absfname+='l';}
  fname=fname.replace('//','/');

  if(pn.isFile(absfname))req.url=fname;
  pn.log('i90019 app.js normalized to: '+req.url);
  
  next();

});//normalize path

//-------------------------------------------
// SERVE REQUEST
app.all('*',function(req,res,next){pn.log('i90009 app.js input: '+req.url); next();})
pn.log('i90019 ^^^^^^^^^^^^^^^^^^^^^^^');

app.use('/', routes);

//--------------------------------------------
// ERRORS?
app.use(function(req, res, next) {
  pn.log('i90074 app.js error?: '+req.url+' '+res.statusCode);
  let err=null;
  if(!res.finished){err=new Error('404 no such file'); err.status=404;}
  next(err);
});

//--------------------------------------------
// REPLY
app.use(function(err, req, res, next) {
  pn.log('i90080 app.js res.finished, code: '+res.finished+', '+res.statusCode);
  if((!err)||(res.finished))return;
  pn.log('i90082 app.js reply: '+req.url+' '+res.statusCode+' '+err.status+' \n ERROR: '+err);
  if(typeof err=='string')err=new Error(err);
  if(!err.status)err.status=500;
  if((!res.statusCode)||(res.statusCode<300))res.status(err.status);

  // SEND ERROR
  if(req.get('X-Forwarded-For'))pn.log('e90091 forwarded for: '+req.get('X-Forwarded-For'));
  pn.log('e90093 app error: '+req.url+' '+res.statusCode+' '+err.status+' '+err);
  res.set('Content-Type', 'text/plain;charset=utf-8');
  res.send(res.statusCode+' '+err.status+' '+err.toString());
});

module.exports = app;
//------------------------------------
pn.log('i90061 app.js loaded');
//------------------------------------

