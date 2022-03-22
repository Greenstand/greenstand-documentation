<?php
  $path=$_SERVER['REQUEST_URI'];
  $authd=false;
  if( ($_COOKIE) && ($_COOKIE['authorized']) && ($_COOKIE['authorized']=='OK') )$authd=true;
  //echo( $_COOKIE.'\n'.$_COOKIE['authorized'].'\n'.$authd);

  if((strpos($path,'_'))&&(!$authd)){

    $refer=$_SERVER['HTTP_REFERER'];
    $host=$_SERVER['HTTP_HOST'];
    $fname='/docs/index.php';
    if($refer)$fname=$refer;
    if(!strpos($fname,$host))$fname='/docs/index.php';
    if(!strpos($fname,'/docs'))$fname='/docs/index.php';
    if(strpos($fname,'_'))$fname='/docs/index.php';
    if(strpos($fname,'?'))$fname=substr($fname,0,strpos($fname,'?'));
    $fname=$fname.'?loginto='.urlencode($path); 

    header('Location: '.$fname);
    $reply="<!DOCTYPE html><html><head><meta http-equiv='refresh' content='3; url=".$fname."'/></head><body></body></html>";
    echo $reply;
    exit;
  }//if

?>

