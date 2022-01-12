// -----------------------------------------------------
// -----------------------------------------------------
window.onload=(e)=>{
  var elms=document.getElementById('contents').getElementsByTagName('span');
  for(let i=0;i<elms.length;i++){elms[i].onclick=(e)=>{location.hash=e.target.id.slice(3);}}
  if(location.search.includes('notes')){
    elms=document.getElementsByClassName('note');
    for(let i=0;i<elms.length;i++){elms[i].style.display='block';}
  }//if
  //set body id='fname'
};//load
// -----------------------------------------------------
const goto=function(elm){
  window.open(elm.innerHTML,'w2','');
}//goto
// -----------------------------------------------------
const deltaShow=function(elm){
  elm.getElementsByTagName('div')[0].style.display='block';
  elm.getElementsByTagName('span')[0].style.display='none';
}//deltaShow
// -----------------------------------------------------
// -----------------------------------------------------

