<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/north.php'); ?>
<script> const loader=function(){override(); getYaml();} </script>

<!-- Swagger HTML for static distribution bundle build -->
<!-- copied from the /dist directory of swagger-ui-4.4.0.zip -->
<!-- https://github.com/swagger-api/swagger-ui/realeases/latest -->
<!-- Phil Norcross, 220118 -->

<link rel="stylesheet" type="text/css" href="/docs/contributor-docs/_swagger/swagger-ui.css" />
<link rel="icon" type="image/png" href="/docs/contributor-docs/_swagger/favicon-32x32.png" sizes="32x32" />
<link rel="icon" type="image/png" href="/docs/contributor-docs/_swagger/favicon-16x16.png" sizes="16x16" />

<style>
 /* PHIL'S STYLE ------------------------------- */ 
 div#grnd2          {margin:12px 12px 24px 12px; padding:0 0 20px 0;
                     border:0px solid #86c232; border-width:0 0 2px 0;}
 div#grnd2 p        {font-family:sans-serif;margin:0;padding:0;font-size:100%; color:#000;}
 div#grnd2 button   {font-family:monospace;padding:2px;font-size:90%;line-height:90%;}
 div#grnd2 input    {width:99% !important;font-family:monospace;border:1px solid #666;background:#fff;color:#86c232;padding:1px 3px;}
 footer#page-footer {position:static !important;}
</style>

<!-- PHIL'S HTML: INPUT URLs ------------------------------------ -->
<!-- 
https://raw.githubusercontent.com/Greenstand/treetracker-wallet-api/master/docs/api/spec/treetracker-wallet-api.yaml
https://raw.githubusercontent.com/Greenstand/treetracker-query-api/main/docs/api/spec/query-api.yaml
 -->
<div id='grnd2'>
  <p>To see API spec's, provide the URL of a *.yaml file in a Greenstand repository, 
     then <button onclick='getYaml();'>&nbsp;Submit&nbsp;</button></p>
  <p id='inp'><input id='yaml' class='txt' type='text' onchange='getYaml();' 
     placeholder='https://raw.githubusercontent.com/Greenstand/&lt;name-of-api&gt;/main/docs/api/spec/query-api.yaml'></input></p>
  <p>In some cases, the spec's specify a server URL for handling trial requests</p>
</div>

<style>
 /* SWAGGER'S STYLE ADJUSTED ------------------------------- */ 
 div#grnd3 form.download-url-wrapper {display:none !important;}
 div#grnd3 div.information-container {margin-bottom:0 !important; padding:0 !important;}
 div#grnd3 div.info {margin:0 !important;}
 div#grnd3 div.info * {margin:0 0 8px 0 !important;line-height:20px;}
 div#grnd3 div.scheme-container {margin-bottom:0 !important; padding:0 !important;}
 div#grnd3 div.servers select {} 

 div#grnd3 section.scheme-container {padding:0 !important;box-shadow:none !important;}
 div#grnd3 section.models.is-open {padding:0 !important;box-shadow:none !important;}
 div#grnd3 section.block.col-12 {min-height:0px !important;}
 div#grnd3 section.models.is-open {min-height:0px !important;}
 div#grnd3 section.response-controls {min-height:0px !important;}
 div#grnd3 section {min-height:0px !important;}
</style>

<!-- PHIL'S SCRIPT: INPUT YAML URL ------------------------------------ -->
<script>// GET YAML
  const getYaml=function(yaml){
    let insw=document.getElementById('swagger-ui');
      if(insw)insw=insw.getElementsByTagName('input')[0];
      //if((!yaml)&&(insw)&&(insw.value))yaml=insw.value;
    let inpy=document.getElementById('yaml');
      yaml=inpy.value;
    if((!yaml)&&(document.cookie)&&(document.cookie.includes('yaml='))){  
      let ck=document.cookie.split('yaml=')[1];
      yaml=ck.split(';')[0];
      //if(yaml)yaml=decodeURI(yaml);
    }//if
    //if(!yaml)return '';
    inpy.value=yaml;
    if(insw)insw.value=yaml;
    document.cookie='yaml='+yaml; //encodeURI(ymal);
    getSwagger(yaml);
    //return yaml;
  }//getYaml
    //if((yaml)&&(!yaml.includes('/Greenstand/'))){alert(yaml+' is not a valid URL for this tool');yaml=null;}
</script>

<!-- SWAGGER'S SCRIPT ------------------------------------ -->
<div id='grnd3'>
  <div id="swagger-ui"></div>
  <script src="/docs/contributor-docs/_swagger/swagger-ui-bundle.js" charset="UTF-8"> </script>
  <script src="/docs/contributor-docs/_swagger/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
  <script>
    const getSwagger=function(yml){
      const ui = SwaggerUIBundle({
        url: yml,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets:[SwaggerUIBundle.presets.apis,SwaggerUIStandalonePreset],
        plugins:[SwaggerUIBundle.plugins.DownloadUrl],
        layout: "StandaloneLayout"
      });
      window.ui = ui;
    };// getSwagger
  </script>
</div>

<!-- STANDARD PHP FOOTER --------------- -->
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/south.php');?>



