<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/north.php');?>
<p>div#grnd div.grnd</p>
<h1>h1 Greendoc style</h1>
<p>This document describes specs for <c>greenstand.org/docs</c>.</p>
<p>Mostly, it demonstrates the style sheet <a href='./greendoc.css'>greendoc.css</p>

<div id='top' class='sect'>div.sect#top
<div id='contents'>
  <p><i>div#contents:</i> &nbsp;<br/>
    <a href='#mid'>Link to #mid</a>, &nbsp;
    <a href='#end'>link to #end</a>
  </p>
</div>
</div>

<div class='sect'>div.sect
<h2>h2 Misc. rules:</h2>
<p class='hang1'>1. A web page in greenstand.org/docs is named <c>*.php</c>.
It begins and ends with blocks of PHP code. 
<p class='in1'>The PHP supplies headers and footers. The top block ends with 
<c>&lt;div id='grnd' class='grnd'></c>. The bottom block begins <c>&lt;/div></c>
<p class='in1'>The rules in greendoc.css all begin with <c>div#grnd</c>,
  so they can override the web site's other styles, and they apply only to files
  in <c>/doc/*.php</c></p>
<p class='in1'>To understand more, look at this page's source code 
  and see <a href='/docs/aparts/template.php'>/docs/aparts/template.php</a></p>
<p class='hang1'>2. <c>greenstand.org/*.php</c> does <b>not</b> understand relative links.<br/>
All links must be relative to the root, or absolute:</br>
<c>/docs/*</c> or <c>https://greenstand.org/docs/*</c></p>
</div>

<div class='sect'>div.sect
<h2>h2 Style classes illustrated:</h2>
<p>paragraph</p>
<p>paragraph with a <a>link</a></p>
<p>paragraph</p>
<p class='code'>p.code or div.code
Line-breaks match the source code</p>
<p>paragraph: code tags <code>&lt;code&gt; &lt;/code&gt;</code>, 
and c tags <c>&lt;c&gt; &lt;/c&gt;</c>, 
and <span class='code'>&lt;span class='code'> &lt;/span></span> 
do the same, but inside of <c>&lt;p>&lt;/p></c> or <c>&lt;div>&lt;/div></c> blocks</p>
<p class='in1'>paragraph.in1<br/>
means indented</p>
<p class='hang1'>1. Paragraph.hang1<br/>means a hanging indent</p>
<p>paragraph</p>
<h3>h3 is a paragraph with extra line-space above</h3>
<p class='tight'>paragraph.tight is a paragraph with no line space above it.</p>
<p class='tight'>paragraph.tight</p>
<p class='fine'>paragraph.fine means fine print</p>
<p class='fine'>paragraph.fine means fine print</p>
<p>paragraph: the next line says &lt;p class='pb'&gt;&amp;npsp;&lt;/p&gt;. It inserts blank space.<br/>
(Called 'lead' in the old days, as in a strip of metal. <i>Pb</i> is the symbol for the element lead).</p>
<p class='pb'>&nbsp;</p>
<p>paragraph</p>
</div>

<div id='mid' class='sect'>div.sect#mid
<p class='title'>p.title</p>
<p>paragraph</p>
<div class='more' onclick='deltaShow(this);'><span class='plus'>+ </span>
div.more &lt;span&gt;+&lt;/span&gt; means click to expand the following &lt;div&gt;
<div class='code'>hidden code
more hidden code
hidden code line 3</div></div>
<p>paragraph</p>
<p class='subhd'>p.subhd</p>
<p class='list'>p.list</p>
<p class='list'>p.list</p>
<p class='list'>p.list</p>
<p>paragraph</p>
<p class='note'>paragraph.note</p>
<p class='git'>paragraph.git</p>
<p id='end'>paragraph#end <a href='#top'>link to top</a></p>
</div>

</div></body></html>



