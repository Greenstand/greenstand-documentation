// 220305
'use strict';
const CONFIG=require('./config.json');
const pn=require('./pnnode.js');
const fs=require('fs');
const express = require('express');
var router = express.Router();
const gThis=this;
const path=require('path');
const fsep=path.sep;
const north=fs.readFileSync(CONFIG.homeDir+fsep+'north.txt','utf8');
const south=fs.readFileSync(CONFIG.homeDir+fsep+'south.txt','utf8');

//--------------------------------------------------
//--- GET / ----------------------------------------
//--------------------------------------------------
//router.get('/:fname',async (req,res,next)=>{
router.get('*',async (req,res,next)=>{
try{
  //pn.log('i90033 router: req.url req.path req.query: '+req.url+' '+req.path);
  //+' '+JSON.stringify(req.query));
  //let fname=req.params.fname;
  pn.log('i90013 routes get '+req.url);

  // server changed .php to .htm
  // fname=req.url.replace('.php','.htm');
  // but the files are .php

  // app.js appended index.htm, .html, .php
  let fname=req.url;
  let obj=path.parse(fname);
  let ext=obj.ext;

  let bfname=fname;  
  let body=getFile(bfname); 
  if(!body){
    bfname=fname.replace(ext,'.php');
    body=getFile(bfname);
    if(!body){
      bfname=fname.replace(ext,'.htm');
      body=getFile(bfname);
      if(!body){
        bfname=fname.replace(ext,'.html');
        body=getFile(bfname);
      }//if
    }//if
  }//if

  if(body.includes('PHP HEADER'))body=north+'\n'+body;
  if(body.includes('PHP FOOTER'))body=body+'\n'+south;

  if(body)pn.log('i90014 routes got body file at '+bfname);
  if(!body)pn.log('i90014 routes did not get body file at '+fname);

  // ADD LOGIN?
  if((req.query)&&(req.query.loginto)){
    let x=body.lastIndexOf('</html>');
    body=body.slice(0,x)+"<script src='/docs/aparts/login.js'></script></html>";
  }// if login

  if(body)res.status(200).send(body);
  next();
}
catch(e){console.log('ERR '+e);next();}
}); //get /

//--------------------------------------------------
//--- UTILITIES ------------------------------------
//--------------------------------------------------
const setRespHeaders=function(res){
  res.set('Content-Type','text/html;charset=utf-8'); 
  return res;
}//setHeaders

const setHead=function(){
  var head="<!DOCTYPE html><html lang='en-US'><head><meta charset='UTF-8'/>";
      head+="<meta name='viewport' content='width=device-width, initial-scale=1.0'/>";
      head+="</head><body>";
  return head;
}// setHead

const setFoot=function(){
  var foot="<pre id='log'</pre></body>";
  foot+="<script src='/docs/aparts/jquery.js'></script>";
  foot+="<script src='/docs/aparts/pntools.js'></script>"
  return foot;
}// setFoot

const getFile=function(fname,trim){
  fname=CONFIG.homeDir+fsep+CONFIG.webRootDir+fname;
  fname=path.normalize(fname);
  if(!pn.isFile(fname)){
    pn.log('i90084 routes getFile cannot find file: '+fname);
    return null;
  }//if
  var retv=fs.readFileSync(fname,'utf8');
  if(!trim)return retv;
  var x=retv.indexOf('<body');
  if(x>-1){
    retv=retv.slice(x+5);
    x=retv.indexOf('>');
    retv=retv.slice(x+1);
    x=retv.indexOf('</body');
    retv=retv.slice(0,x);
  }//if
  return retv;
}// getFile

//--------------------------------------------------
//-----------------------------------------------
module.exports=router;
pn.log('i90999 routes is loaded');
//-----------------------------------------------
//-----------------------------------------------

