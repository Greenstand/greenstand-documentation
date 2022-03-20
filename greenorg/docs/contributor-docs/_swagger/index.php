<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/north.php');?>

<!-- Swagger HTML for static distribution bundle build -->
<!-- copied from the /dist directory of swagger-ui-4.4.0.zip -->
<!-- https://github.com/swagger-api/swagger-ui/realeases/latest -->
<!-- Phil Norcross, 220118 -->

<link rel="stylesheet" type="text/css" href="/docs/contributor-docs/_swagger/swagger-ui.css" />
<link rel="icon" type="image/png" href="/docs/contributor-docs/_swagger/favicon-32x32.png" sizes="32x32" />
<link rel="icon" type="image/png" href="/docs/contributor-docs/_swagger/favicon-16x16.png" sizes="16x16" />
<style>

 /* PHIL'S STYLE ------------------------------- */ 
 div#grnd2          {margin:12px; border:0px solid green;}
 div#grnd2 p        {font-family:sans-serif;margin:0;padding:0;font-size:90%; border:0px solid red;}
 div#grnd2 button   {font-family:monospace;padding:2px;font-size:90%;line-height:90%;}
 div#grnd2 p#inp    {width:90%;font-family:monospace;}
 div#grnd2 input    {width:90% !important;font-family:monospace;border:1px solid #666;background:#fff;}
 div#grnd3 div.info {margin-bottom:0 !important;}
 div#grnd3 section.scheme-container {padding:0 !important;box-shadow:none !important;}
 div#grnd3 section.models.is-open {padding:0 !important;box-shadow:none !important;}
 div#grnd3 section.block.col-12 {min-height:0px !important;}
 div#grnd3 section.models.is-open {min-height:0px !important;}
 div#grnd3 section.response-controls {min-height:0px !important;}
 div#grnd3 xsection {min-height:0px !important;}
 
 /* SWAGGER'S STYLE ------------------------------- */ 
 div#grnd3 div {margin-top:6px !important;padding:0 !important;}
 div#grnd3 *  {box-sizing: border-box;overflow:-moz-scrollbars-vertical;overflow-y: scroll;}
 div#grnd3 *, div#grnd3 *:before, div#grnd3 *:after{box-sizing:inherit;}
 div#grnd3    {margin:0;background: #fafafa;}
 div#grnd3 form.download-url-wrapper {display:none !important;}
</style>

<!-- PHIL'S CODE ------------------------------------ -->
<div id='grnd2'>
  <p>Provide the URL of a *.yaml file in a Greenstand repository, 
     then <button onclick='getYaml();'>&nbsp;Submit&nbsp;</button></p>
  <p id='inp'><input id='yaml' class='txt' type='text' onchange='getYaml();' 
     placeholder='https://raw.githubusercontent.com/Greenstand/&lt;name-of-api&gt;/main/docs/api/spec/query-api.yaml'></input></p>
  <!-- https://raw.githubusercontent.com/Greenstand/treetracker-query-api/main/docs/api/spec/query-api.yaml -->
  <script>
    const getYaml=function(init){
      var yaml=document.getElementById('yaml').value;
      if((!yaml)&&(document.cookie)&&(document.cookie.includes('yaml='))){  
        let ck=document.cookie.split('yaml=')[1];
        yaml=ck.split(';')[0];
        if(yaml=='null')yaml=null;
      }//if
      //if((yaml)&&(!yaml.includes('/Greenstand/'))){alert(yaml+' is not a valid URL for this tool');yaml=null;}
      if(!yaml)return null;
      document.cookie='yaml='+yaml;
      document.getElementById('yaml').value=yaml;
      if(init)return yaml;
      location.reload();
    }//getYaml
  </script>
</div>

<!-- SWAGGER'S CODE ------------------------------------ -->
<div id='grnd3'>
  <div id="swagger-ui"></div>
  <script src="/docs/contributor-docs/_swagger/swagger-ui-bundle.js" charset="UTF-8"> </script>
  <script src="/docs/contributor-docs/_swagger/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
  <script>
    const loader=function(){  //getSwagger();}
    //const getSwagger=function(){
      // Begin Swagger UI call region
      let yml=getYaml(true); //if(!yml)return;
      const ui = SwaggerUIBundle({
        url: yml,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets:[SwaggerUIBundle.presets.apis,SwaggerUIStandalonePreset],
        plugins:[SwaggerUIBundle.plugins.DownloadUrl],
        layout: "StandaloneLayout"
      });
      // End Swagger UI call region
      window.ui = ui;
    };// getSwagger
  </script>
</div>

<!-- STANDARD PHP FOOTER --------------- -->
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/south.php');?>
