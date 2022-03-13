<!DOCTYPE html><html lang="en-GB">
<!-- NORTH.PHP ------------------------------------------ -->
<head><meta charset="utf-8">
<!-- base href="https://greenstand.org/"/ -->
<title>Greenstand Documentation</title>
<meta name="description" content="Greenstand documentation"/>
<meta name="robots" content="noindex,nofollow" />
<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"/>
<link rel="stylesheet" type="text/css" href="https://greenstand.org/typo3temp/assets/compressed/merged-a4f207d94b68ad37851f6918cb8d9c45-c8ba04fce7e4f54777b5e679be54bc50.css?1643906133" media="all">
<link rel="stylesheet" type="text/css" href="https://greenstand.org/typo3temp/assets/compressed/merged-eef1c1d7da58ff5c1682be8d489fda1a-911c5ed4e16e1cb73c13206dba5bfab1.css?1637819168" media="screen">

<!-- GREENDOC CSS & JS & AUTHORIZATION -->
<link rel='stylesheet' type='text/css' href='/docs/aparts/greendoc.css?'/>
<script src='/docs/aparts/greendoc.js'></script>
<?php
  if($_SERVER['QUERY_STRING']){
     parse_str($_SERVER['QUERY_STRING'],$qry);
     if(($qry['loginto'])||($qry['logout'])){
       echo("<script src='/docs/aparts/login.js'></script>");
     }//if
   }//if

   $authd=false;
   if( ($_COOKIE) && ($_COOKIE['authorized']) && ($_COOKIE['authorized']=='OK') )$authd=true;
   $path=$_SERVER['REQUEST_URI'];
   if(strpos($path,'?'))$path=substr($path,0,strpos($path,'?'));
   //echo('<!-- '.$authd.' '.$_COOKIE['authorized'].' -->');

   if((strpos($path,'_'))&&(!$authd)){
     require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/isloggedin.php');
   }//if
?>

<!-- ICONS -->
<link rel="shortcut icon" href="https://greenstand.org/fileadmin/02-graphics/04-favicons/favicon.ico" type="image/x-icon">
<link rel="apple-touch-icon" sizes="180x180" href="https://greenstand.org/fileadmin/02-graphics/04-favicons/apple-touch-icon.png?v=47BKvxlwGj">
<link rel="icon" type="image/png" sizes="32x32" href="https://greenstand.org/fileadmin/02-graphics/04-favicons/favicon-32x32.png?v=47BKvxlwGj">
<link rel="icon" type="image/png" sizes="16x16" href="https://greenstand.org/fileadmin/02-graphics/04-favicons/favicon-16x16.png?v=47BKvxlwGj">
<link rel="mask-icon" href="https://greenstand.org/fileadmin/02-graphics/04-favicons/safari-pinned-tab.svg?v=47BKvxlwGj" color="#86c232">
<link rel="shortcut icon" href="https://greenstand.org/fileadmin/02-graphics/04-favicons/favicon.ico?v=47BKvxlwGj">

<!-- GOOGLE TRACKER -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-1280531-62"></script>
<script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-1280531-62'); </script>
</head>

<!-- BODY NAVBAR -->
<body id="page-54" class="onecol layout-1 md" data-navbar-breakpoint="md">
<div id="page-wrapper"><nav id="main-navbar" class="navbar navbar-dark navbar-expand-md shrink py-5 bg-light fixed-top"
data-shrinkcolorschemes="bg-white" data-shrinkcolor="navbar-light" data-colorschemes="bg-light" data-color="navbar-dark">
<div class="container">
 <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
 </button>
 <a href="/" class="navbar-brand mr-0 mr-md-2">
  <img class="img-fluid d-inline-block align-top" alt="Company Logo" src="https://greenstand.org/fileadmin/08-logos/logo_loader.svg" width="30" height="30" />
  <span class="brandname">Greenstand</span>
 </a>
<div class="collapse navbar-collapse" id="navbarToggler">
 <ul class="navbar-nav ml-auto">
  <li id="nav-item-3" class="nav-item dropdown">
   <a class="nav-link dropdown-toggle" id="dropdown-menu-3" href="/greenstand" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Greenstand</a>
   <div class="dropdown-menu" aria-labelledby="dropdown-menu-3">
    <a href="/greenstand/about" target="_self" class="dropdown-item dropdown-item-16">About</a>
    <a href="/greenstand/what-drives-us" target="_self" class="dropdown-item dropdown-item-35">What Drives Us</a>
    <a href="/greenstand/community" target="_self" class="dropdown-item dropdown-item-7">Community</a>
    <a href="/greenstand/history" target="_self" class="dropdown-item dropdown-item-19">History</a>
    <a href="/greenstand/board" target="_self" class="dropdown-item dropdown-item-18">Board</a>
    <a href="/financials" target="_self" class="dropdown-item dropdown-item-31">Financials</a>
   </div
  </li>
  <li id="nav-item-45" class="nav-item dropdown">
   <a class="nav-link dropdown-toggle" id="dropdown-menu-45" href="/treetracker" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Treetracker</a>
   <div class="dropdown-menu" aria-labelledby="dropdown-menu-45"></a>
     <a href="/treetracker/how-it-works" target="_self" class="dropdown-item dropdown-item-37">How it Works</a>
     <a href="/treetracker/treetrackers" target="_self" class="dropdown-item dropdown-item-10">Treetrackers</a>
     <a href="/treetracker/start-tracking" target="_self" class="dropdown-item dropdown-item-11">Start Tracking</a>
     <a href="/treetracker/web-map" target="_self" class="dropdown-item dropdown-item-15">Web Map</a>
     <a href="/treetracker/services" target="_self" class="dropdown-item dropdown-item-14">Services</a>
     <a href="/treetracker/faq" target="_self" class="dropdown-item dropdown-item-17">FAQ</a>
   </div>
  </li>
  <li id="nav-item-2" class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="dropdown-menu-2" href="/contribute" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Contribute</a>
    <div class="dropdown-menu" aria-labelledby="dropdown-menu-2">
     <a href="/contribute/donate" target="_self" class="dropdown-item dropdown-item-50">Donate</a>
     <a href="/contribute/volunteer" target="_self" class="dropdown-item dropdown-item-48">Volunteer</a>
    </div>
  </li>
  <li id="nav-item-27" class="nav-item">
    <a href="/blog" target="_self" class="nav-link">Blog</a>
  </li>
  <li id="nav-item-9" class="nav-item">
    <a href="/contact" target="_self" class="nav-link">Contact&nbsp;Us</a>
  </li>
</ul></div></div></nav>

<!-- GREENDOC DIV -->
<div id='grnd' class='grnd' style='margin-top:140px'>

<!-- END NORTH.PHP -------------------------------------- -->

