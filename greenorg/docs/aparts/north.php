<!-- NORTH.PHP ------------------------------------------ -->
<?php
  // GET HEADER FROM /DEVBOX
  $std = file_get_contents("https://greenstand.org/devbox");
  $x=strpos($std,'</nav>');
  $north=substr($std,0,$x+6);
  // <base href="https://greenstand.org/">
  if($_SERVER['HTTP_HOST']!='greenstand.org'){
    $north=str_replace('<base','<xbase',$north);
  }//if  
  echo $north;
?>

<!-- GREENDOC CSS & JS & AUTHORIZATION -->
<link rel='stylesheet' type='text/css' href='/docs/aparts/greendoc.css?'/>
<script src='/docs/aparts/greendoc.js'></script>

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

<!-- GREENDOC DIV -->
<div id='grnd' class='grnd container' style='margin-top:140px'>
<div id='crumbsd'></div>
<!-- END NORTH.PHP -------------------------------------- -->

