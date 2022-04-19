<!-- SOUTH.PHP ------------------------------------------------ -->
</div><!-- END DIV#GRND.GRND -->
<?php 
// NO DISPLAY FOOTER TILL AFTER PAGE LOAD COMPLETE
  $x=strpos($std,'<footer');
  $south=substr($std,$x+7);
  $south='<footer style="display:none"'.$south;
  echo $south;
?>
