// -----------------------------------------------------
// -----------------------------------------------------
window.onload=(e)=>{
 try{
  //alert('greendoc.js onload');

  // BREADCRUMBS
  setCrumbs();

  // SHOW NOTES
  if(location.search.includes('notes')){
    elms=document.getElementsByClassName('note');
    for(let i=0;i<elms.length;i++){elms[i].style.display='block';}
  }//if
  
  // SET EXPANDABLE BLOCKS
  var elms=[];
  try{elms=document.getElementsByClassName('more');} catch(e){elms=[];}
  for(let i=0;i<elms.length;i++){elms[i].onClick=(e)=>{deltaShow(e.target);}}

  // FIX #LINKS
  elms=document.getElementsByTagName('a'); let x;
  for(let i=0;i<elms.length;i++){
    if(elms[i].href.includes('#')){
      x=elms[i].href.indexOf('#');
      elms[i].href=location.pathname+elms[i].href.slice(x);
    }//if
  }//for
  
  // IF LOCAL, NO TOP MARGIN, NO BASE URL
  if(document.getElementById('northtxt')){
    document.getElementById('grnd').style.margin='24px'; 
    document.getElementById('grnd0').style.margin='24px'; 
  }//if

  // RUN OPTIONAL DOC-UNIQUE LOADER
  try{if(loader)loader();} catch(e){}//alert(e);}

  // FOOTER DOES NOT DISPLAY UNTIL PAGE LOADED
  try{document.getElementsByTagName('footer')[0].style.display='block';} catch(e){}

  //alert('green.js load end')
 }//try
 catch(e){}//alert('greendoc.js win.load error: '+e);}
};//load

// -----------------------------------------------------
// LET A PAGE OVERRIDE div#grnd & greendoc.css
// const loader=function(){override();}
const override=function(){
  document.getElementById('grnd').id='grnd0';
  document.getElementById('crumbsd').style.fontFamily='sans-serif';
  document.getElementById('crumbsd').style.marginTop='160px';
}//override

// -----------------------------------------------------
const setCrumbs=function(){
  // /docs/project-design /contributor-docs /user-guides
  let ara=location.pathname;
  if(ara.slice(0,1)=='/')ara=ara.slice(1);
  if(ara.slice(-1)=='/')ara=ara.slice(0,-1);
  ara=ara.split('/');
  if(ara.length==1)return;
  let crumbsd=document.getElementById('crumbsd');
  if(!crumbsd)return;
  let crumba="<a id='docs' href='/docs'>Documentation</a> -> ";
  if(ara.length==2){ crumbsd.innerHTML=crumba; return; }  
  let crumbh='/'+ara[0]+'/'+ara[1];
  let crumbt='Contributor';
    if(crumbh.includes('project'))crumbt='Project';
    if(crumbh.includes('user'))crumbt='User';
  crumba+="<a id='crumb2' href='"+crumbh+"'>"+crumbt+"</a> ->";
  crumbsd.innerHTML=crumba;
}//setCrumbs

// -----------------------------------------------------
const deltaShow=function(elm){
  elm.getElementsByTagName('div')[0].style.display='block';
  elm.getElementsByTagName('span')[0].style.display='none';
}//deltaShow

// -----------------------------------------------------
const goto=function(elm){
  window.open(elm.innerHTML,'w2','');
}//goto
// -----------------------------------------------------
// -----------------------------------------------------

