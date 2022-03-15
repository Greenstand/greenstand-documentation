// -----------------------------------------------------
// -----------------------------------------------------
window.onload=(e)=>{

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
  }//if

  // RUN OPTIONAL DOC-UNIQUE LOADER
  try{if(loader)loader();} catch(e){}
  
};//load

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

