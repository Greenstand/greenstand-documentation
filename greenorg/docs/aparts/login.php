<?php
  require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/greendoc.php');

  $cookie=$_COOKIE;
  $cookies=implode('; ',$cookie);
  $agent=$_SERVER['HTTP_USER_AGENT'];
  $method=$_SERVER['REQUEST_METHOD'];
  $protocol=$_SERVER['SERVER_PROTOCOL'];
  $data=file_get_contents('php://input');
  $obj=json_decode($data);
  $reply="<!DOCTYPE html><html><head><meta http-equiv='refresh' content='0; url=/docs'/></head><body></body></html>";

   if($agent){
    if($method=='POST'){
     if($data){
      $reply=0;
       if($data==$PASSWORD)$reply=1;
       if(($obj->password)&&($obj->password==$PASSWORD))$reply=1;
     }//if
    }//if
   }//if
  echo $reply;
  //echo $PASSWORD.' '.$data.' '.$obj->password;
?>
