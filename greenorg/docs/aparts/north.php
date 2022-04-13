<!-- NORTH.PHP ------------------------------------------ -->

<!-- GET HEADER FROM /DEVBOX -->
<?php
  $std = file_get_contents("https://greenstand.org/devbox");
  $x=strpos($std,'</nav>');
  $north=substr($std,0,$x+6);
  // <base href="https://greenstand.org/">
  if($_SERVER['HTTP_HOST']!='greenstand.org'){
    $north=str_replace('<base','<xbase',$north);
  }//if

  // SET TITLE TO FNAME
  $url=$_SERVER['REQUEST_URI'];
  $ara=pathinfo($url);
  $fname=$ara['basename'];
  $north=str_replace('devbox | ',$fname,$north);
  
  // MISC
  $north=str_replace('Contact Us','Contact&nbsp;Us',$north);

  echo $north;
?>

<!-- GREENDOC AUTHORIZATION -->
<?php
// LOGIN? LOGOUT?
  if($_SERVER['QUERY_STRING']){
    parse_str($_SERVER['QUERY_STRING'],$qry);
    if(($qry['loginto'])||($qry['logout'])){
      echo("<script src='/docs/aparts/login.js'></script>");
    }//if
  }//if
// AUTHORIZED?
  $authd=false;
  if( ($_COOKIE) && ($_COOKIE['authorized']) && ($_COOKIE['authorized']=='OK') )$authd=true;
  $path=$_SERVER['REQUEST_URI'];
    if(strpos($path,'?'))$path=substr($path,0,strpos($path,'?'));
  if((strpos($path,'_'))&&(!$authd)){
    require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/isloggedin.php');
  }//if
?>

<!-- GREENDOC CSS, JS, CONTAINER, CRUMBS -->
<link rel='stylesheet' type='text/css' href='/docs/aparts/greendoc.css?'/>
<script src='/docs/aparts/greendoc.js'></script>
<div id='grnd' class='grnd container' style='margin-top:140px'>
<div id='crumbsd'>&nbsp;</div>

<!-- END NORTH.PHP -------------------------------------- -->

