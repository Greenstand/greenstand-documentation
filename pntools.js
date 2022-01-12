//---------------------------
var pn={version:"200203",basedir:"./"};
(function($,pn){

// INITIALIZE ...........................
//alert(JSON.stringify(CONFIG));
pn.data={};
pn.loglevel=6;     try{pn.loglevel=CONFIG.loglevel;}  catch(e){pn.loglevel=6;}
pn.loglocal=true; //try{pn.loglocal=CONFIG.tobrowser;} catch(e){pn.loglocal=false;}
pn.logremote=false; try{pn.logremote=CONFIG.toserver;} catch(e){pn.logremote=false;}
if(location.search.includes('log=local')){pn.loglocal=true; pn.loglevel=3;}
if(location.search.includes('debug=true')){pn.loglocal=true; pn.loglevel=3;}

//--------------------------------------
pn.init=function(){
  //pn.log('i60016 pntools.js: log@client '+pn.loglocal+' '+pn.loglevel+', log@server '+pn.logremote);
  pn.getClient();
  pn.phonebreak=620;
  pn.debug=false; if(location.search.indexOf("debug=true")>-1)pn.debug=true;
  pn.getWidth(); window.onresize=function(){pn.getWidth();}
  //pn.log('i30018 pntools.js: pn.isPhone '+pn.isPhone);

  pn.cookie=pn.cookieToObj();
  //alert(JSON.stringify(pn.cookie));

  pn.query=pn.queryToObj();
  if(pn.query.loglevel){pn.loglevel=parseInt(pn.query.loglevel);}
  window.scrollTo(0,0);
  //pn.rsrch();
  if(!pn.debug)return;
  pn.getScroll();
  pn.setListener(window,"scroll",pn.getScroll,true);
  pn.setListener(document.body,"mousemove",pn.getMXY,true);
}//init
// ubu 1877 x 1056, ipad 1024 x  768, phil phone 360 x 720
// phil's phone: $(window).width()=360
// phone's do not accurately report scroll events

//--- OBJECT PRETTIFY ----------------------------------
// pn.objPrettify(obj) => string
pn.objPrettify=function(obj,ind){
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
      if(num)line=ind+'{'+pn.objPrettify(val,ind+'  ')+ind+'}'+c+ind;
      if(!num){
        if(typ=='string')line=ind+k+': '+val+c;
        if(typ=='object')line=ind+k+': {'+pn.objPrettify(val,ind+'  ')+ind+'}'+c+ind;
        if(typ=='ara')   line=ind+'{'+k+': ['+ind+' '+pn.objPrettify(val,ind+'  ')+ind+'] }'+c+ind;
      }//if !num
      ara.push(line);
    }//for
    line=ara.join('\n');
    while(line.indexOf(' \n')>-1) {line=pn.swap(line,' \n','\n');}
    while(line.indexOf('\n\n')>-1){line=pn.swap(line,'\n\n','\n');}
    return line;
  }//try
  catch(e){return e;}
}//objPrettify

//--------------------------------------
pn.rsrch=function(){
  let navtype=performance.getEntriesByType('navigation')[0].type;
  //navigate, reload, back_forward, prerender
  alert(navtype);
  alert(pn.objToString(performance.getEntriesByType('navigation')[0]));
  
  //window.location.lasthash='cow';
  //alert(window.location.lasthash);
  //if(opener)alert('opener: '+opener.location);
  //if(history)alert(pn.objToString(history));
  //window.onhashchange=function(){};
}//rsrch

//--------------------------------------
pn.writeCookie=function(nam,val,days){
  if(!nam)return;
  if((val===undefined)||(val==null)||(val=="")||(val==" ")){val=nam;days=-1;}
  val=encodeURIComponent(val);
  days=pn.cookieEnd(days);
  document.cookie=nam+'='+val+days;
  return document.cookie;
}//writeCookie

//--------------------------------------
pn.cookieEnd=function(days){
  if((days===undefined)||(days===null)||(days===''))days=30;
  if(days===0)return ';secure;';
  let exp=new Date();
  exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000) );
  exp=exp.toGMTString();
  return '; expires='+exp+'; path=/;secure;';
}//cookieEnd

//--------------------------------------
pn.cookieToObj=function(){
  if((!document)||(!document.cookie))return {};
  let c=document.cookie;
  c=pn.swap(c,'; ',';'); c=c.split(';');
  if(c.length<1)return {};
  let nv; let obj={};
  for(let i=0;i<c.length;i++){
    nv=c[i].split('=');
    if(nv.length==2)obj[nv[0]]=nv[1];
  }//for
  return obj;
}//CookieToObj

//--------------------------------------
pn.getClient=function(){
  let agt=navigator.userAgent; let plat,brw=null; //linux macbook ipad windows; fox chrome safari edge

  if((agt.includes('Linux'))&&(agt.includes('Firefox'))){plat='linux'; brw='firefox';}
  if((agt.includes('Macintosh'))&&(agt.includes('Firefox'))){plat='macbook'; brw='firefox';}
  if((agt.includes('Macintosh'))&&(agt.includes('13.1 '))){plat='ipad'; brw='firefox';}

  if((agt.includes('Linux'))&&(agt.includes('Chrome'))){plat='linux'; brw='chrome';}
  if((agt.includes('Macintosh'))&&(agt.includes('Chrome'))){plat='macbook'; brw='chrome';}
  if((agt.includes('IPad'))&&(agt.includes('CriOS'))){plat='ipad'; brw='chrome';}
  if((agt.includes('Macintosh'))&&(agt.includes('13.1.2'))){plat='imac'; brw='chrome';}

  if((!plat)&&(agt.includes('iPad')))plat='ipad';
  if((!brw)&&(agt.includes('Firefox')))brw='firefox';
  if((!brw)&&(agt.includes('Chrome')))brw='chrome';
  if((!brw)&&(agt.includes('iPad')))brw='safari';
  if(agt.includes('Windows'))plat='windows';
  if(agt.includes('Edge'))brw='edge';

  //pn.log('i9====================\n===================================');
  if((plat)&&(brw)){
    $('body').addClass(plat).addClass(brw);
    pn.log('i30055 pntools getClient: '+plat+' '+brw+' : '+agt);
  }//if
  else{pn.log('e90056 pntools getClient unknown: '+agt);}
  pn.platform=plat; pn.browser=brw;
}//getClient

//--------------------------------------
pn.userName=function(userid){
  if(userid.includes('@'))userid=userid.slice(0,userid.indexOf('@'));
  return userid.slice(0,1).toUpperCase()+userid.slice(1);
}//userName

//--------------------------------------
pn.sleep=function(ms){return new Promise(resolve=>setTimeout(resolve,ms));}

//--------------------------------------
pn.addScript=function(path){
  path=path+"?"+pn.version;
  pn.log("i90078 pntools.addScript("+path+")");
  var hd=document.getElementsByTagName("head")[0];
  var nd=document.createElement("script");
      nd.setAttribute("src",path);
      nd=hd.appendChild(nd);
}//addScript

//--------------------------------------
pn.addStyle=function(path){
  pn.log("i90087 pntools.addStyle("+path+")");
  var hd=document.getElementsByTagName("head")[0];
  var nd=document.createElement("link");
      nd.setAttribute("rel","stylesheet");
      nd.setAttribute("type","text/css");
      nd.setAttribute("media","all");
      nd.setAttribute("href",path);
      nd=hd.appendChild(nd);
}//addStyle

//--------------------------------------
pn.getScroll=function(){
  let x=window.scrollX; let xx=pageXOffset;
  let y=window.scrollY; let yy=pageYOffset;
  let msg=x+','+y+'\n'+xx+','+yy;
  if((x==xx)&&(y==yy))msg=x+','+y;
  if(pn.debug)$('#SCROLL').html(msg).show();
  return {'x':x,'y':y};
}//getScroll

//--------------------------------------
pn.getWidth=function(){
  pn.wWidth=$(window).width();
  pn.sWidth=screen.availWidth;
  if(pn.debug)$('#WIDE').html(pn.wWidth+'/'+pn.sWidth).show();
  return pn.wWidth;
}//getWidth

//------------------------------------
pn.isPhone=function(){if(pn.wWidth<pn.phonebreak)return true; return false;}
pn.isMobile=function(){
  if(navigator.userAgent.match(/iPad|iPhone|Android|Windows Phone|webOS/i))return true;
  return false;
}//if

//------------------------------------
pn.isTouch=function(e,verbose){
  if(verbose)alert(120+' '+e.type);
  if(e.type.indexOf('touch')!=0)return 0;
  if(e.originalEvent.touches.length>1)return 2;
  if(verbose)alert(123+' '+e.originalEvent.touches.length);
  return e.originalEvent.touches[0];
}//isTouch

//------------------------------------
pn.getMXY=function(e){
  if(!e)e=window.event;
  pn.MX=e.clientX; pn.MY=e.clientY;
  $('#MX').html(pn.MX+' x '+pn.MY);
  if(pn.debug)$('#MX').show();
  return {'x':pn.MX,'y':pn.MY};
}//getMXY

//------------------------------------
pn.isEmail=function(email){
  const rx = /\S+@\S+\.\S+/;
  if(!rx.test(email))return false;
  if(email.includes('{'))return false;
  if(email.indexOf('@')!=email.lastIndexOf('@'))return false;
  return true;
}//isEmail

//------------------------------------
pn.isPhoneNumber=function(inp){
  if((!inp)||(!inp.toString))return false;
  inp=inp.toString();
  let ck,x; let num='';
  for(var i=0;i<inp.length;i++){
    ck=inp.charAt(i);
    x=parseInt(ck);
    if((x>=0)&&(x<=9))num+=ck;
  }//for
  if(num.length==10)return true;
  return false;
}//isEmail

//--------------------------------------
//elm.addEventListener('onclick',fun);
//elm.attachEvent('onclick',fun);
//elm.onclick=fun
//pn.setListener(window,"scroll",pn.getScroll,true);
pn.setListener=function(elm,act,fun,cap){
   if(document.addEventListener){
      if(elm.addEventListener){
         elm.addEventListener(act,fun,cap);
         return elm;}}
   if(document.attachEvent){
      if(elm.attachEvent){
         elm.attachEvent("on"+act,fun);
         return elm;}}
   eval("elm.on"+act+"="+fun);
   return elm;
}//setListener

// ...........................
pn.stopEvent=function(e){
  //alert('117 '+e.type);
  if(!e)e=window.event;
  if(!e)return false;
  if(e.stopPropagation)e.stopPropagation();
  if(e.cancelBubble)e.cancelBubble=true;
  if(e.preventDefault)e.preventDefault();
  if(e.returnValue)e.returnValue=false;
  return false;
}//stopevent

// ...........................
pn.queryToObj=function(sin){
  if((location)&&(location.search))if(!sin)sin=location.search;
  if(!sin)return {};
  if(sin.slice(0,1)=='?')sin=sin.slice(1);
  sin=sin.split('&');
  if(sin.length<1)return {};
  let nv; let obj={};
  for(let i=0;i<sin.length;i++){
    nv=sin[i].split('=');
    if(nv.length==2){
      nv[0]=decodeURIComponent(nv[0]);
      nv[1]=decodeURIComponent(nv[1]);
      obj[nv[0]]=nv[1];
    }//if
  }//for
  return obj;
}//queryToObj

// ...........................
pn.hasValue=function(v){
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

//------------------------------------
pn.timeStamp=function(){
  let since1970=Date.now();
  let y50years=50*365*24*60*60*1000;
  let m9mo=9*30*24*60*60*1000;
  let timestamp=since1970-y50years-m9mo;
  return timestamp;
}//getTimeStamp  

pn.getYYMMDD=function(){
  const d=new Date();
  var yy=d.getFullYear()-2000;
  var mm=d.getMonth()+1; if(mm<10)mm='0'+mm;
  var dd=d.getDate(); if(dd<10)dd='0'+dd;
  var ymd=' '+yy+mm+dd+' ';
  return ymd.trim();
}//getYYMMDD

pn.getHHMM=function(){return pn.getHHMMSS().slice(0,-3);}
pn.getHHMMSS=function(){
  const d=new Date();
  var hh=d.getHours();    if(hh<10)hh='0'+hh;
  var mm=d.getMinutes();  if(mm<10)mm='0'+mm;
  var ss=d.getSeconds();  if(ss<10)ss='0'+ss;
  return hh+':'+mm+':'+ss;
}//getHHMMSS

//------------------------------------
pn.swap=function(str,olds,news){return str.split(olds).join(news);}

pn.isNum=function(s){
  if(!pn.hasValue(s))return false;
  if(typeof s == 'number')return true;
  if(typeof s != 'string')return false;
  var nums=/^[0-9]+$/;
  if(s.match(nums))return true;
  return false;
}//isNum

//------------------------------------
pn.getURL=function(vURL){
  return new Promise((resolve,reject)=>{
	  $.ajax({
	    url:vURL,
		  method:'GET',
		  contentType:'text/plain',
		  dataType:'text',
		  error:function(xhr,state,err){
		    let msg="e0070 pntools.js getURL("+vURL+"): "+err.toString(); 
		    reject(msg);},
		  success:function(data,state,xhr){
			  if(!data){let msg="e0074 pntools.js getURL: no data fetched from vURL"; reject(msg);}
        if(data){resolve(data);}
		  }//success
		}); //ajax
  });//promise
};//getURL

// ...........................
// all xhr data comes and goes as strings
// handle objects with JSON.stringify(obj) and JSON.parse(reply) 
// send string, not object
// contentType, describes what sent
// dataType, describes what returned
// application/json arrives as req.body.object, not string
pn.fetch=function(geturl){
	if(!geturl)return null;

  // DEFAULTS:
  var vURL=geturl;
  var vDataType='text';
  var vType='GET';
  var vMethod='GET';
  var vContentType='text/plain';
  var vData={key1:'dog',key2:'cat'}; //'key1=dog&key2=cat'
  var vUsername='phil';
  var vPassword='phil';
  var vAsync=true;
  var vFetchToID="fetched";
  var vHandler=pn.handleFetch;
  
  //{url:'',resultID:''}
  
  // PARMS  
  if(geturl.url)vURL=geturl.url;
  if(geturl.dataType)vDataType=geturl.dataType;
  if(geturl.type)vType=geturl.type;
  if(geturl.method)vMethod=geturl.method;
  if(geturl.contentType)vContentType=geturl.contentType;
  if(geturl.data)vData=geturl.data;
  if(geturl.username)vUsername=geturl.username;
  if(geturl.password)vPassword=geturl.password;
  
  // ENVIRONMENT
  if(geturl.fetchToID)vFetchToID=geturl.fetchToID;
    pn.fetchToID='#'+vFetchToID;
  if(geturl.handler)vHandler=geturl.handler;
    pn.fetchHandler=vHandler;
	pn.fetchedData='';

  // LOGGING
  pn.log('i10171 pntools.js pn.fetch: '+pn.objToString(geturl));
  pn.log('i10172 pntools.js pn.fetch: write to '+pn.fetchToID);
  pn.log('i10173 pntools.js pn.fetch: handler: '+pn.fetchHandler);
  
	try{
		$.ajax({
			url:vURL,
			dataType:vDataType,
			type:vType,
			method:vMethod,
			contentType:vContentType,
			data:vData,
			username:vUsername,
			password:vPassword,

			async:vAsync,
			crossDomain: true,
			processData:false,
			cache:'false',
			headers:{},
      
			error:function(xhr,state,err){
				//pn.log(xhr.getAllResponseHeaders().slice(0,-1));
			  pn.log("e30059 xhr, state, err: "+xhr+", "+state+", "+err);
			  //for(p in xhr){pn.log(xhr[p]);}
			},

			success:function(data,state,xhr){
				if(!data){data=""; pn.log("e053 no data fetched");return;}
        pn.log("i10200 pn.tools pn.fetch => "+data.length+" ckrs fm "+vURL);
				pn.fetchedData=data;
        pn.fetchHandler();
				//pn.log(xhr.getAllResponseHeaders().slice(0,-1));
				//pn.log('i055 '+xhr.getResponseHeader('content-type'));
				//pn.log('i056 '+xhr.responseText);
			}//success
		}); //ajax
	}//try
	catch(e){alert("e30209 at fetch: "+e);}
	return pn.temp;
}//fetch

// ...........................
pn.handleFetch=function(){
  //fd=pn.fetchedData.split("\n").sort().join("\n");
  //while(fd.slice(0,1)=='\n')fd=fd.slice(1);
  $(pn.fetchToID).html(pn.fetchedData);
  pn.log("i10217 handle "+pn.fetchedData.length+" to "+pn.fetchToID);
}//handleFetch

// ...........................
pn.objToString=function(obj,depth,ind){return pn.objKeys(obj,depth,ind,true);}
pn.objKeys=function(obj,depth,ind,shoval){
  if((depth==undefined)||(depth==null)){depth=1;ind=', ';}
  if((ind==undefined)||(ind==null))ind=depth;
  if(!pn.isNum(depth))depth=1;
  if((!pn.hasValue(ind))||(pn.isNum(ind)))ind='\n  ';
  //pn.log('i0190 pntools.js objKeys() '+depth+' '+ind);
  let out=ind; let typ,val;
  try{
    for(var k in obj){
      typ=typeof obj[k];
      if(obj[k]==undefined)typ='undefined'; 
      if(obj[k]==null)typ='null';
      if(obj[k]=='')typ='emptyString';
      if(k.indexOf('_')==0)typ='complexObject';
      val=''; if(shoval)val=obj[k];
      if((depth>1)&&(typ=='object')){
          out+=ind+k+': object'+ind+this.objKeys(obj[k],depth--,ind+'  ');
      }//if
      else{out+=ind+k+': '+typ+' '+val;}
    }//for
    return out.slice(ind.length);
  }//try
  catch(e){return e;}
}//objKeys

// ...........................
// LOGGING
//----------------------------
pn.log=function(msg,force){
  if((!pn.loglocal)&&(!pn.logremote)&&(!force))return;
	if((msg===undefined)||(msg===null)){$("#log").text("");return;}
  if(msg.toString)msg=msg.toString(); else{msg=typeof msg};
  try{
    let typ=msg.slice(0,1).toLowerCase(); // a i w e >
    let level=msg.slice(1,2);
    if((typ=='e')||(typ=='w')||(typ=='>')||(force))level=9;
    if(level<pn.loglevel)return;
    if(pn.loglocal)$('#log').html(msg);//+'\n'+$('#log').html());
    if(pn.logremote)pn.postLog(msg);
    if(force)alert(msg);
  }//try
  catch(e){console.log('ERROR: unwritable message: '+e);}
}//log

//------------------------------------
pn.logara=[]; pn.logbusy=false;
pn.postLog=function(msg){
  if(msg)pn.logara.push(msg);
  if(pn.logbusy){window.setTimeout('pn.postLog()',500);return;}//if busy, come back later
  if(pn.logara.length>1)window.setTimeout('pn.postLog()',1000);//if more in queue, come back later
  if(pn.logara.length==0)return;
  pn.logbusy=true;
  msg=JSON.stringify({'msg':pn.logara.shift()});
  vURL='/_log';
  $.ajax({
    url:vURL, data:msg, method:'POST', contentType:'application/json',
	  dataType:'text', 
	  error:function(xhr,state,err){
	    let msg="e30216 pntools.js postLog: error at "+vURL;
	    //alert(msg+' '+state+' '+err);
	    pn.logbusy=false;
      //pn.log(225+' '+pn.logbusy+' '+err,true);
	  },
	  success:function(data,state,xhr){
		  let msg="e30221 pntools.js postLog: no reply from "+vURL; 
      if(data)msg="i10222 pntools.js postLog: reply from "+vURL; 
      //alert(msg);
      pn.logbusy=false;
      //pn.log(232+' '+pn.logbusy,true);
	  }//success
	});//ajax
};//postLog
// ...........................
/* the xhr object:
readyState: number
responseText: string
status: number
statusText: string 
statusCode: function
state: function

abort: function
then: function
promise: function

getResponseHeader: function
getAllResponseHeaders: function
setRequestHeader: function
overrideMimeType: function
always: function
pipe: function
done: function
fail: function
progress: function
complete: function
success: function
error: function
*/

// ...........................
// ...........................
$(document).ready(function(){pn.init();});
})(jQuery,pn);
// ... 30 ....................


