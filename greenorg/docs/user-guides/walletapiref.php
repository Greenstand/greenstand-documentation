<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/north.php');?>
<!-- END STANDARD PHP HEADER --------------- -->

<style>
  div#grnd2      {margin:24px;}
  div#grnd2 *    {color:#474B4F;font-family:sans-serif;font-size:16px;
                 line-height:22px;margin:0;padding:0;}
  div#grnd2 div   {margin:12px 12px 0 0;padding:8px 0 0 0;}
  div#grnd2 h1    {font-size:24px;font-weight:bold;padding:8px 0 0 0;} 
  div#grnd2 p     {margin:8px 0 0 0;}
  div#grnd2 code, c {font-family:monospace;font-size:13px;line-height:16px;}
  div#grnd2 a     {text-decoration:none;color:#86c232;}
  div#grnd2 i     {font-size:inherit;line-height:inherit;}

  div#grnd2 div#contents {}
  div#grnd2 div#contents p {margin:0;}
  div#grnd2 div#contents p span {color:#86c232;;cursor:pointer;}
  div#grnd2 div#contents .scripted {display:none;color:#333;cursor:default;font-style:italic;}

  div#grnd2 div.resource {border:0px solid #666; border-width:2px 0 0 0;margin-top:24px;padding-top:2px}  
  div#grnd2 p.title  {font-size:24px;line-height:22px;font-weight:bold;}
  div#grnd2 p.subhd  {font-weight:bold;}
  div#grnd2 p.code   {font-family:monospace;background:#eee;padding:2px;font-size:13px;white-space:pre;line-height:16px;}
  div#grnd2 p.fix    {margin:0;}
  div#grnd2 p.list   {margin-left:20px;text-indent:-8px;}
  div#grnd2 p.list:before {content:"- ";}
  div#grnd2 div.errs{margin:0 0 0 24px;}

  div#grnd2 p.note, div#grnd2 p.git {display:none;border:1px solid green;margin:6px 0;padding:6px;color:#080;white-space:pre;}
  div#grnd2 p.note:before{content:'??? ';}
  div#grnd2 p.git {display:none; color:#008}
  div#grnd2 div.notyet{display:none;}
  div#grnd2 div.gloss{display:none;}
  footer#page-footer {position:static !important;}

</style>

<!-- ----------------------------- -->
<script>
const loader=function(){
  override();
  // FIX T.O.C. LINKS
  var elms=document.getElementById('contents').getElementsByTagName('span');
  for(let i=0;i<elms.length;i++){
    elms[i].onclick=function(e){
      try{window.location.hash='#'+e.target.id.slice(3);} catch(e){alert(e);}
    }//onclick
  }//for
};//loader
</script>

<!-- ----------------------------- -->
<div id='grnd2' class='grnd2'>
<h1>Treetracker Wallet API Reference</h1>
<p class='note'>This is a note, hidden until location.search=?notes</p>
<!-- ----------------------------- -->
<div id='contents'> 
  <p>Contents: &nbsp; &nbsp;
    <span class='scripted'>Click for info. Double-click to run.</span><br class='scripted'/>
    <span id='tocintro'>Introduction</span>, &nbsp;
    <span id='tocauthenticate'>Authenticate</span>, &nbsp;
    <span id='tocgetWallets'>Get Wallets</span>, &nbsp;
    <span id='tocpostWallets'>Post Wallet</span>,</p>

  <p><span id='tocgetTokens'>Get Tokens by Wallet</span>, &nbsp;
    <span id='tocgetToken'>Get Token by ID</span>, &nbsp;
    <span id='tocgetTransactions'>Get Transactions by Token ID</span>,</p>

  <p><span id='toctransfersExplained'>Transfers Explained</span>, &nbsp;
    <span id='tocgetTransfers'>Get Transfers by Wallet</span>, &nbsp;
    <span id='tocgetTransferDetails'>Get Transfer Details by ID</span>, &nbsp;
    <span id='tocgetTransferTokens'>Get Tokens by Transfer</span>,</p>

  <p><span id='tocpostTransfers'>Post Transfers</span>, &nbsp;
    <span id='tocacceptTransfer'>Accept Transfer</span>, &nbsp;
    <span id='tocdeclineTransfer'>Decline Transfer</span>, &nbsp;
    <span id='tocfulfillTransfer'>Fulfill Transfer</span>, &nbsp;
    <span id='tocdeleteTransfer'>Delete Transfer</span>,</p>

  <p><span id='toctrustsExplained'>Trusts Explained</span>, &nbsp;
    <span id='tocgetTrusts'>Get Trusts</span>, &nbsp;
    <span id='tocpostTrustRequest'>Post Trust Request</span>, &nbsp;<br/>
    <span id='tocacceptTrust'>Accept Trust</span>, &nbsp;
    <span id='tocdeclineTrust'>Decline Trust</span>, &nbsp;
    <span id='tocdeleteTrust'>Delete Trust</span></p>
</div>

<!-- ----------------------------- -->
<!-- ----------------------------- -->
<div class='resource' id='intro'>
  <p>API requests need three headers:</p>
<p class='code'>- TREETRACKER-API-KEY:&lt;<i>api-key</i>&gt;
- Authorization:Bearer &lt;<i>token</i>&gt;
- Content-Type:application/json</p>
  <p>Every user's first request to the API is <a href='#authenticate'>Authenticate</a>.
     That returns a Bearer token good for about one year.</p>
  <p>Do not confuse the <i>Bearer &lt;token&gt;</i> with the other use of <i>token</i> in the API.<br/>
    In all other cases, a <i>token</i> is a data object that describes a tree.</p>
</div>

<!-- ----------------------------- -->
<!-- ----------------------------- -->
<div class='resource' id='authenticate'>
<p class='title'>Authenticate</p>
<p class='abs'>Provide a wallet's name or ID, and its password. Receive a bearer token to go in the header of subsequent API requests. Without the bearer token, requests return <code>403: ERROR: Authentication, token not verified.</code></p>
<p class='code path'>POST /wallet/auth</p>
<p class='subhd'>Request body: </p>
<p class='code reqb'>{"wallet": "nameOrID", "password": "string"}</p>
<p class='subhd'>Response:</p>
<p class='code'>200: OK
{token: string}</p>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>200: OK: 1.10.3</p>
<p class='fix'>Use <c>POST</c>, not <c>GET</c></p>

<p class='code'>404: Not Found
&lt;!DOCTYPE html>&lt;html lang="en">&lt;head>&lt;meta charset="utf-8">&lt;title>Error&lt;/title>&lt;/head>&lt;body>&lt;pre>Cannot POST /authnot&lt;/pre>&lt;/body>&lt;/html>
<p class='fix'>Post your request to <c>https://prod-k8s.treetracker.org/wallet/auth</c></p>

<p class='code'>404: Not Found
404: Could not find entity by wallet name: &lt;name></p>
<p class='fix'>Correct the value of <c>wallet</c> in the request body.</p>

<p class='code'>415: Unsupported Media Type
415: Invalid content type. API only supports application/json</p>
<p class='fix'>Provide the header: <c>Content-Type:application/json</c></p>

<p class='code'>401: Unauthorized
401: Invalid access - no API key
401: Invalid API access</p>
<p class='fix'>Provide a correct header: <code>'TREETRACKER-API-KEY:&lt;api-key>'</code></p>

<p class='code'>422: Unprocessable Entity
422: "wallet" is required
422: "password" is required
<p class='fix'>Provide the request body: <code>{"wallet": "name", "password": "value"}</code></p>

<p class='code'>401: Unauthorized
401: Invalid credentials</p>
<p class='fix'>Correct the value of <c>password</c> in the request body.</p>

<p class='subhd'>Authorization errors in subsequent requests:</p>
<p class='code'>500: Internal Server Error
500: Unknown error (undefined)
403: Forbidden
403: ERROR: Authentication, token not verified</p>
<p class='fix'>Provide a correct header: <c>Authorization: Bearer &lt;bearerToken></c></p>
</div>
</div>

<!-- ----------------------------- -->
<div class='resource' id='getWallets'>
<p class='title'>Get Wallets</p>
<p class='abs'>Get information regarding this session's authenticated wallet and the wallets it manages.</p>
<p class='code path'>GET /wallet/wallets?limit=n&start=n</p>
<p class='qry'>limit: Required integer. The maximum number of wallet objects to return.</p>
<p class='qry'>start: Optional integer, defaults to 1, the beginning. Of the tokens in the wallet, the one to start the list. But the precise order of wallet records is unpredictable.</p>
<p class='subhd'>Response, an array of wallet objects: </p>
<p class='code'>200: OK
{ wallets: [
  {
    id: string, 
    name: string, 
    password: string | null, 
    salt: string | null,
    logo_url: string |null
    created_at: date_string
    tokens_in_wallet: number
  }
]}</p>
<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1</p>
<p class='fix'>The path must end with <c>?limit=<i>n</i></c> or <c>?limit=<i>n</i>&start=<i>n</i></c>, where <i>n</i> is an integer</p>
<p class='note git'>issue 276 At
GET /wallet/wallets?limit=n&start=n
GET /wallet/tokens?limit=n&start=n
GET /wallet/tokens/&lt;token_id>/transactions?limit=n&start=n
GET /wallet/transfers?limit=n&start=n
GET /wallet/transfers/&lt;transfer_id>/tokens?limit=n&start=n
GET /wallet/trust_relationships?limit=n&start=n

?limit=n&start=n produces unexpected results.
Issue 261 replaces "start, defaults to 1" with "offset, defaults to 0"

It seems we should also fix limit to mean the maximum number of items to return,
not the index of the last item to select from the source array.

In other words, replace JavaScript array.slice(start,limit) with
array.slice(start,(start+limit))

Why? Because as it works now, limit can be a negative number, which
is hard to understand if you don't know the length of the array.
And because if start>limit, it returns nothing:
?limit=4&start=5 returns []

And limit &lt; 1 should return the same error as start &lt; 1:
422: "limit" must be greater than or equal to 1.</p>
</div>
</div>
<!-- ----------------------------- -->
<div class='resource' id='postWallets'>
<p class='title'>Post Wallet</p>
<p class='abs'>Create a new wallet that is managed by this session's authenticated wallet.</p>
<p class='code path'>POST /wallet/wallets</p>
<p class='subhd'>Request body: </p>
<p class='code reqb'>{"wallet": "nameOrID"}</p>
<p class='subhd'>Response:</p>
<p class='code'>200: OK
{"wallet": "nameOrID"}</p>

<div class='errs'>
<p class='subhd'>Errors:</p>

<p class='code'>500: Unknown error (Unexpected token <i>c</i> in JSON at position <i>n</i>)}</p>
<p class='fix'>Provide valid JSON format in the request body.</p>

<p class='code'>400: invalid wallet name:&lt;badname></p>
<p class='note'>What are the rules for wallet names?</p>
<p class='code'>403: Forbidden
403: The wallet '&lt;duplicateName>' has been existed</p>
<p class='fix'>A new wallet name must be unique to Greenstand. We suggest an email address.</p>
<p class='note git'>issue #266 I think we mean "The wallet &lt;name> already exists"</p>
</div>
</div>

<!-- ----------------------------- -->
<div class='resource' id='getTokens'>
<p class='title'>Get Tokens by Wallet</p>
<p class='abs'>Get a list of the tokens in this session's authenticated wallet or any wallet it manages.</p>
<p class='code path'>GET /wallet/tokens?limit=n&start=n&wallet=name</p>
<p class='qry'>limit: Required integer. The maximum number of tokens to return.</p>
<p class='qry'>start: Optional integer, defaults to 1, the beginning. Of the tokens in the wallet, the one to start the list. Within a wallet, token number 1 is the one that most recently arrived.</p>
<p class='qry'>wallet: Optional name or ID, defaults to this session's authenticated wallet.</p>
<!-- [[ offset: Offset of list. 0 = beginning ]] -->
<p class='subhd'>Response, an array of token objects:</p>
<p class='code'>200: OK
{ tokens: [
  {
    id: uuid,
    capture_id: uuid,
    wallet_id: uuid,
    transfer_pending: boolean,
    transfer_pending_id: uuid,
    created_at: date,
    updated_at: date,
    origin: null,
    claim: false,
    links: {capture: /webmap/tree?uuid=string}
  }
]}</p>
<p class='key'>links.capture: Path to tree data</p>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>404: Not Found
404: Could not find entity by wallet name: &lt;badName></p>
<p class='fix'>The wallet you specified does not exist. See <a href='#getWallets'>Get Wallets</a>, above, for a list of existing wallets.</p>

<p class='code'>422: Unprocessable Entity
422: "wallet" is not allowed to be empty</p>
<p class='fix'>The path need not include <c>wallet=</c>, but if it does, wallet must have a value: <c>wallet=&lt;value></c></p>

<p class='code'>403: Forbidden
403: Wallet do not belongs to wallet logged in</p>
<p class='fix'>You can only view tokens in wallets that you manage. See <a href='#getWallets'>Get Wallets</a>, above, for a list.</p>
<p class='note git'>issue #267 We mean "Wallet does not belong to...</p>

<p class='code'>422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1</p>
<p class='fix'>The path must include <c>limit=<i>n</i></c>. It may include <c>start=<i>n</i></c>. In either case, <i>n</i> must be an integer</p>
</div></div>

<!-- ----------------------------- -->
<div class='resource' id='getToken'>
<p class='title'>Get Token by ID</p>
<p class='abs'>Get details about one specified token in this session's authenticated wallet or a wallet it manages.</p>
<p class='code path'>GET /wallet/tokens/&lt;token_id&gt;</p>
<p class='qry'>&lt;token_id&gt;: Replace with a token ID.</p>
<p class='subhd'>Response, a token object:</p>
<p class='code'>200: OK
{
  id: uuid,
  capture_id: uuid,
  wallet_id: uuid,
  transfer_pending: boolean,
  transfer_pending_id: uuid,
  created_at: date,
  updated_at: date,
  origin: null,
  claim: false,
  links: {capture: /webmap/tree?uuid=string}
}</p>
<p class='key'>links.capture: Path to tree data</p>

<div class='errs'>
<p class='subhd'>Errors:</p>

<p class='code'>500: Internal Server Error
500: Unknown error (select * from "token" ... invalid input syntax for type uuid: "&lt;bad_token_id")</p>
<p class='fix'>Copy the &lt;token_id> accurately. Token IDs comform to the rules of <i>universally unique identifiers (UUIDs)</i>: 32 hex digits and 4 hyphens in a specific pattern. Though the request will work if any or all of the hyphens are removed.</p>

<p class='code'>404: Not Found
404: can not found token by id:&lt;token_id></p>
<p class='fix'>The specified token_id does not exist.</p>
<p class='note git'>issue #268 We mean "cannot find token...</p>

<p class='code'>401: Unauthorized
401: Have no permission to visit this token</p>
<p class='fix'>You can only read tokens that reside in wallets that you manage.</p>
</div>
</div>

<!-- ----------------------------- -->
<div class='resource' id='getTransactions'>
<p class='title'>Get Transactions by Token ID</p>
<p class='abs'>For a specified token, get a history of all transfers.</p>
<p class='code path'>GET /wallet/tokens/&lt;token_id&gt;/transactions?limit=n&start=n</p>
<p class='note'>Why <c>/transactions</c>, instead of <c>/transfers</c>? "transfers" is the word we use everywhere else. 
Is there such thing as a transaction that isn't a transfer?</p>
<p class='qry'>&lt;token_id&gt;: Replace with a token ID.</p>
<p class='qry'>limit: Required integer. The maximum number of transfer objects to return.</p>
<p class='qry'>start: Optional integer, defaults to 1, the beginning. Of the transfer objects in the wallet, the one to start the list. But the order of transfer records is unpredictable.</p>
<p class='note'>How long is history retained? 
Do records of completed transfers get deleted at some point?</p>
<p class='subhd'>Response, an array of history objects: </p>
<p class='code'>200: OK
{ history: [
  {
    processed_at: date
    sender_wallet: string
    receiver_wallet: string
  }
] }</p>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>500: Internal Server Error
500: Unknown error (select * from "token" ... invalid input syntax for type uuid: "&lt;bad_token_id")</p>
<p class='fix'>Copy the &lt;token_id> accurately. Token IDs comform to the rules of <i>universally unique identifiers (UUIDs)</i>: 32 hex digits and 4 hyphens in a specific pattern. Though the request will work if any or all of the hyphens are removed.</p>

<p class='code'>404: Not Found
404: can not found token by id:&lt;token_id></p>
<p class='fix'>The specified token_id does not exist.</p>
<p class='note git'>issue #268 We mean "cannot find token...</p>

<p class='code'>401: Unauthorized
401: Have no permission to visit this token</p>
<p class='fix'>You can only read the history of tokens that reside in wallets that you manage.</p>

<p class='code'>422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1</p>
<p class='fix'>The path must include <c>limit=<i>n</i></c>. It may include <c>start=<i>n</i></c>. In either case, <i>n</i> must be an integer</p>
</div>
</div>

<!-- ----------------------------- -->
<div class='resource' id='transfersExplained'>
<p class='title'>Transfers Explained</p>
<p class='abs'>A <i>transfer</i> moves tokens from one wallet to another by a variety of paths. It is easy to confuse them. This section explains the process and terminology.</p>
<p class='subhd'>Post a transfer:</p>
<p>The <c>originating</c> user or wallet posts the initial transfer request.
That request asks to move tokens from the <c>source</c> wallet to the <c>destination</c> wallet. 
Understand that the originator can be either the source or destination. In other words,
tokens may move towards the originator, or away from the originator.</p>
<p class='subhd'>Accept or fulfill a transfer:</p>
<p>The <c>target</c> is the other party to the transfer. The target may be the source or destination of the tokens, depending on the request.</p>
<p>In some cases, the origin and target wallets are <c>managed</c> (belong to) the same user. In some cases, the origin and target have previously established a <c>trust</c> <c>relationship</c>. In those cases, the transfer will execute and complete immediately after the origin posts it.</p>
<p>But when the origin and target are relative strangers, the transfer does not complete until the target agrees to it. If the target is the destination, the target posts an <c>accept</c> request to the API. If the target is the source, the target posts a <c>fulfill</c> request to the API.</p>
<p class='subhd'>Decline or delete a transfer:</p>
<p>In the event that a target objects to a transfer, the target can post a <c>decline</c> request to the API.</p>
<p>The originator may withdraw a request before the target accepts, fulfills, or declines. To do that, the originator sends a <c>DELETE</c> request to the API.</p>
<p class='subhd'>Transfer states:</p>
<p>Every transfer data object includes a <c>state</c> property. Here's what it means:</p>
<p class=''><c>requested</c>: The origin of the request is the destination of the transfer. It awaits the target/source's request to fulfill the transfer.</p>
<p class=''><c>pending</c>: The origin of the request is the source of the transfer and awaits the target/destination's request to accept the transfer.</p>
<p class=''><c>cancelled</c>: The target of a transfer request has declined to accept or fulfill it. Or the originator of the transfer request has deleted it.</p>
<p class=''><c>failed</c>:</p>
<p class=''><c>completed</c>: The transfer has been accepted or fulfilled by the target. Or the transfer simply moved tokens between two wallets both managed by the originator of the request.</p>

<p class='note'>What is <c>state: failed</c>?</p>
<p class='note'>What is <c>type: send, deduct, or managed</c>?</p>
<p class='note'>What is <c>active: boolean</c>? It's value is always true?</p>
<p class='note'>The property transfer.claim is not yet implemented. Right?
It's value now is always false? 
When it is implemented, a POST /wallet/transfers request with claim:true 
means the tokens cannot be further transferred after the current transfer completes.</p>
</div>

<!-- ----------------------------- -->
<div class='resource' id='getTransfers'>
<p class='title'>Get Transfers by Wallet</p>
<p class='abs'>For a specified wallet, get a list of the transfers in a specified state. The transfers available are those for which the origin, source, or destination is the currently authenticated wallet or any wallet it manages.</p>
<p class='code path'>GET /wallet/transfers?limit=n&start=n&wallet=nameOrID&state=value</p>
<p class='qry'>limit: Required integer. The maximum number of transfer objects to return.</p>
<p class='qry'>start: Optional integer, defaults to 1, the beginning. Of the transfer objects in the wallet, the one to start the list. But the order of the transfers is unpredictable.</p>
<p class='qry'>wallet: Optional string or ID, defaults to currently logged-in wallet. List transfers to, from, or requested by this wallet.</p>
<p class='qry'>state: Optional string, defaults to * (all). Possible values: <c>requested, pending cancelled, failed, completed</c>.</p>

<p class='subhd'>Response, an array of transfer objects:</p>
<p class='code'>200: OK
{ transfers: [
  {
    id: transfer_id
    type: send, deduct, or managed
    parameters: {
      tokens: [token_id,token_id,token_id]
      <i>or</i>
      bundle: { bundle_size: integer }
    }
    state: requested, pending, completed, cancelled, or failed
    created_at: date
    closed_at: date
    active: boolean
    claim: false
    originating_wallet: walletNameOrID
    source_wallet: walletNameOrID
    destination_wallet: walletNameOrID
  }
] }</p>
<div class='errs'>
<p class='subhd'>Errors:<p>
<p class='code'>422: Unprocessable Entity
422: "state" must be one of [requested, pending, completed, cancelled, failed]</p>
<p class='fix'>Fix the value of <c>state</c> in the request.</p>
<p class='code'>422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1</p>
<p class='fix'>The path must include <c>?limit=<i>n</i></c> or <c>?limit=<i>n</i>&start=<i>n</i></c>, where <i>n</i> is an integer</p>
<p class='code'>404: Not Found
404: Could not find entity by wallet name: &lt;badName></p>
<p class='fix'>The wallet you specified does not exist. See <a href='#getWallets'>Get Wallets</a>, above, for a list of existing wallets.</p>

<p class='code'>422: Unprocessable Entity
422: "wallet" is not allowed to be empty</p>
<p class='fix'>The path need not include <c>wallet=</c>, but if it does, wallet must have a value: <c>wallet=&lt;value></c></p>

<p class='note'>Is this resource working as intended?
It shows me transfers between strangers, transfers that I had nothing to do with. 
I log in to PhilNorcross and 
<c>GET /wallet/transfers?limit=9&start=1&wallet=SebastianWalletHandler</c>
I see, for example, a transfer from Sebastion to TraditionalDreamFactory.</p>
</div>

<!-- ----------------------------- -->
<div class='resource' id='getTransferDetails'>
<p class='title'>Get Transfer Details by ID</p>
<p class='abs'>Get details for one specific transfer.</p>
<p class='code path'>GET /wallet/transfers/&lt;transfer_id&gt;</p>
<p class='qry'>&lt;transfer_id&gt;: Replace with a transfer ID.</p>
<p class='subhd'>Response, a transfer object: </p>
<p class='code'>200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    <i>or</i>
    bundle: { bundle_size: integer }
  }
  state: requested, pending, completed, cancelled, or failed
  created_at: date
  closed_at: date
  active: boolean
  claim: false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}</p>
<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>404: Not Found
404: Can not find this transfer or it is related to this wallet</p>
<p class='fix'>You can only read details of transfers to or from the wallets you manage.</p>
<p class='note git'>issue #269 Don't we mean "Cannot find...it is <i>not</i> related to this wallet"?</p>

<p class='code'>422: Unprocessable Entity
422: "transfer_id" must be a valid GUID</p>
<p class='fix'>Copy the &lt;transfer_id> accurately. Transfer IDs comform to the rules of <i>globally unique identifiers (GUIDs)</i>: 32 hex digits and 4 hyphens in a specific pattern.</p>
<p class='note git'>issue #270 Everywhere else we use UUID, not GUID.</p>
<p class='note'>At GET token by ID, I can delete the hyphens from the UUID and it still works. Is that OK?</p>
</div>
</div>

<!-- ----------------------------- -->
<div class='resource' id='getTransferTokens'>
<p class='title'>Get Tokens by Transfer</p>
<p class='note'>Get tokens by transfer is not yet working?</p>
<p class='abs'>Get a list of the tokens moved by a given transfer.</p>
<p class='code path'>GET /wallet/transfers/&lt;transfer_id&gt;/tokens?limit=n&start=n</p>
<p class='qry'>&lt;transfer_id&gt;: Replace with a transfer ID.</p>
<p class='qry'>limit: Required integer. The maximum number of tokens to return.</p>
<p class='qry'>start: Optional integer, defaults to 1, the beginning. Of the tokens in the transfer, the one to start the list. But the precise order of token records is unpredictable.</p>
<p class='subhd'>Response:</p>
<p class='code'>500: Internal Server Error
{
  code: 500,
  message: Unknown error (result is not iterable)
}</p>
</div>

<!-- ----------------------------- -->
<div class='resource' id='postTransfers'>
<p class='title'>Post Transfers</p>
<p class='abs'>Send a request to move tokens from one wallet to another, as allowed by the wallets' trust relationships. Specify tokens by their IDs, or specify a number of tokens.</p>
<p class='abs'>The session's authenticated wallet makes the request--it is the <i>originating_wallet</i>.</p>
<p class='abs'>The other party to the request is the <i>requestee</i> or <i>target</i>.</p>
<p class='abs'>Tokens are <i>debited</i> from from the <i>sender_wallet</i> and <i>credited</i> to the <i>receiver_wallet</i>.</p>
<p class='abs'>If the wallets share the right <a href='#trustsExplained'><i>trust relationship</i></a>, transfers take place immediately and automatically. Otherwise, the server stores the request and waits for the requestee to accept or decline it.</p>

<p class='code path'>POST /wallet/transfers</p>
<p class='subhd'>Request body: </p>
<p class='code reqb'>{
  "sender_wallet": "nameOrID",
  "receiver_wallet": "nameOrID",
  "bundle":{"bundle_size": integer}
}</p>
<p class='subhd'>or</p>
<p class='code reqb'>{
  "sender_wallet": "nameOrID",
  "receiver_wallet": "nameOrID",
  "tokens": ["token_id","token_id"]
}</p>
<p class='note'>Tag selection does not yet work.
  {"matching_all_tags": ["tag","tag","tag"] }</p>
<p class='subhd'>Response: </p>
  <p class='code'>201: Created
202: Accepted</p>
<p><c>Created</c> means the transfer is complete.<br/>
<c>Accepted</c> means it awaits an accept or fulfill request from the target.</p>
<p class='note'>Accepted? That's confusing. We still need the destination to POST /wallet/transfers/&lt;transfer_id>/<b>accept</b>. 
So it's easy to think "It was accepted. Why to we need to accept again?"
In the same situation POST /wallet/trust_relationships returns 200: OK.
Let's do that here.</p>

<p class='subhd'>Response body, a transfer object:</p>
<p class='code'>200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    <i>or</i>
    bundle: { bundle_size: integer }
  }
  state: completed, requested, or pending
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}</p>
<p class='note'>Are the timestamps working as intended?
I create a pending transfer request, the values created_at and closed_at are identical. 
Then I accept the transfer, the state changes to completed, but created_at and closed_at do not change. 
Likewise with trust relationships: created_at and updated_at are identical and never change.</p>
<p class='note'>The POST transfer request speaks of "sender_wallet" and "receiver_wallet." 
A transfer object speaks of "source_wallet" and "destination_wallet." 
Using two pairs of names for the same pair of roles causes needless confusion, it seems.</p>
<p class='note'>I can post a transfer to and from the same wallet.
The source = destination, sender = receiver.
The response is 201: Created.
It seems to me that such a request should return an error.</p>

<div class='errs'>
<p class='subhd'>Errors</p>
<p class='code'>404: Not Found
404: Could not find entity by wallet name:&lt;wallet_name>
404: can not found token by id:&lt;token_id></p>
<p class='fix'>Fix the wallet names and/or token IDs in the request body.</p>
<p class='note git'>issue #268 We mean "cannot find token...</p>

<p class='code'>403: Forbidden
403: Do not have enough tokens to send</p>
<p class='fix'>Decrease the value of <c>bundle_size</c> in the request body.</p>
<p class='code'>403: Forbidden
403: The token &lt;token_id> can not be transfer for some reason, 
     for example, it's been pending for another transfer</p>
<p class='fix'>Change the list of token IDs in the request body. 
Or replace the list with bundle: { bundle_size: <i>n</i> }.
If you own the token, you can learn what has happened by posting a
request to <a href='#getTransactions'>get transactions by token ID</a>. 
When a transfer request asks you to send tokens, 
respond by posting a request to <a href='#fulfillTransfer'>fulfill the transfer</a>, 
not by posting a new transfer.</p>
<p class='note git'>issue #271 We mean "cannot be transferred"</p>

<p class='code'>403: Forbidden
403: The token &lt;token_id> do not belongs to sender wallet</p>
<p class='fix'>Fix the list of token IDs in the request body. 
Or write <c>bundle: { bundle_size: <i>n</i> }</c>. 
You can get a list of the tokens you own with a request to 
<a href='#getTokens'>get tokens by wallet</a>.</p>
<p class='note git'>issue #272 We mean "The token &lt;token_id> does not belong to...</p>

<p class='code'>422: Unprocessable Entity
422:"tokens[<i>n</i>]" contains a duplicate value</p>
<p class='fix'>Do not list the same token twice in the request body.</p>

<p class='code'>422: Unprocessable Entity
422: "bundle.bundle_size" must be a number
422: "bundle.bundle_size" must be greater than or equal to 1</p>
<p class='fix'>For the value of <c>bundle_size</c>, provide a positive integer,
with or without quotes.</p>

</div>
</div>

<!-- ----------------------------- -->
<div class='resource' id='acceptTransfer'>
<p class='title'>Accept Transfer</p>
<p class='abs'>A destination wallet completes a pending transfer by accepting in-coming tokens.</p>
<p class='code path'>POST /wallet/transfers/&lt;transfer_id&gt;/accept</p>
<p class='qry'>&lt;transfer_id&gt;: Replace with a transfer ID.</p>
<p class='subhd'>Response, a transfer object:</p>
<p class='code'>200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    <i>or</i>
    bundle: { bundle_size: integer }
  }
  state: <b>completed</b>
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}</p>
<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>403: Forbidden
403: Current account has no permission to accept this transfer</p>
<p class='fix'>Only the target destination can accept a transfer. The originating wallet is not allowed to.</p>

<p class='code'>403: Forbidden
403: The transfer state is not pending</p>
<p class='fix'>The transfer asks the target wallet to <i>send</i> tokens, not receive them.
The transfer state is <c>requested</c>. 
The target source can either fulfill or decline. It cannot accept.</p>


</div>
</div>

<!-- -------------------dogdog---------- -->
<div class='resource' id='fulfillTransfer'>
<p class='title'>Fulfill Transfer</p>
<p class='abs'>A source wallet completes a requested transfer by sending out-going tokens to their destination.</p>
<p class='code path'>POST /wallet/transfers/&lt;transfer_id&gt;/fulfill</p>
<p class='qry'>&lt;transfer_id&gt;: Replace with a transfer ID.</p>
<p class='subhd'>Request body:</p>
<p class='code reqb'>{"implicit":true}</p>
<p class='key'><c>implicit</c> sends the tokens requested, whether the transfer specifies
 a bundle size or literal token IDs. When a transfer specifies a bundle size, the fulfill request may 
 instead specify literal token IDs with a message body like this:</p>
<p class='code'>{ tokens: [ token_id, token_id, token_id ] }
<p class='note'>In my tests, implicit:false gets the same result as implicit:true
Nonetheless, implicit must be either true or false, implicit:null returns an error:
422: "implicit" must be a boolean</p>
<p class='subhd'>Response, a transfer object:</p>
<p class='code'>200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    <i>or</i>
    bundle: { bundle_size: integer }
  }
  state: <b>completed</b>
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}</p>

<div class='errs'>
<p class='subhd'>Errors:</p>

<p class='code'>404: Not Found
&lt;!DOCTYPE html>&lt;html lang="en">Error ... Cannot POST /transfers/&lt;transfer_id>/fullfill</p>
<p class='fix'>In the path, spell fulfill with 3 ells, not 4.</p>

<p class='code'>403: Forbidden
403: Current account has no permission to fulfill this transfer</p>
<p class='fix'>The transfer asks the target wallet to <i>receive</i> tokens, not send them.
The transfer state is <c>pending</c>, not <c>requested</c>. 
The target destination can either accept or decline. It cannot fulfill.</p>

<p class='code'>403: Forbidden
403: Operation forbidden, the transfer state is wrong</p>
<p class='fix'>The transfer has already been completed, declined, or cancelled</p>

<p class='code'>422: Unprocessable Entity
422: "implicit" is required</p>
<p class='fix'>Add the missing message body, probably: <c>{"implicit":"true"}</c></p>
<p class='note git'>issue #273 Implicit is not required. An array of token IDs will also work in some cases. 
So we might say "A message body is required"</p>

<p class='code'>422: Unprocessable Entity
422: "implicit" is not allowed</p>
<p class='fix'>In the message body, do not write <i>both</i> literal token IDs 
and the implicit property. Use one or the other, most likely <c>implicit:true</c></p>

<p class='code'>403: Forbidden
403: No need to specify tokens</p>
<p class='fix'>In the message body, write <c>implicit:true</c>, not a list of token IDs. The transfer request already specifies token IDs. The API does not allow them to be specified again.</p>
<p class='note git'>issue #274 So we mean to say "Must not specify tokens."</p>

<p class='code'>404: Not Found
404: can not found token by id:&lt;token_id></p>
<p class='fix'>In the message body, revise the list of token IDs, or write <c>implicit:true</c>.</p>
<p class='note git'>issue #268 We mean "cannot find token...</p>

<p class='code'>403: Forbidden
403: Too few tokens to transfer, please provide <i>n</i> tokens for this transfer
403: Too many tokens to transfer, please provide <i>n</i> tokens for this transfer
<p class='fix'>You provided fewer or more token IDs than the transfer requested in the <c>bundle_size</c> property. In the message body, write <c>implicit:true</c>. Or provide an array with the correct number of valid token IDs.</p>

<p class='code'>500 Internal Server Error
500: Unknown error (... invalid input syntax for type uuid: "$tokenid")</p>
<p class='fix'>You probably wrote a bad token ID. In the message body, write <c>implicit:true</c>. 
Or provide an array of valid token IDs.</p>
</div>
</div>

<!-- ----------------------------- -->
<div class='resource' id='declineTransfer'>
<p class='title'>Decline Transfer</p>
<p class='abs'>The target wallet of a transfer--whether its the source or destination--refuses to complete the transfer.</p>
<p class='code path'>POST /wallet/transfers/&lt;transfer_id&gt;/decline</p>
<p class='qry'>&lt;transfer_id&gt;: Replace with a transfer ID.</p>
<p class='subhd'>Response, a transfer object:</p>
<p class='code'>200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    <i>or</i>
    bundle: { bundle_size: integer }
  }
  state: <b>cancelled</b>
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}</p>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>403: Forbidden
403: The transfer state is not pending and requested</p>
<p class='fix'>The transfer has already been either completed, deleted, or declined.</p>

<p class='code'>403: Forbidden
403: Current account has no permission to decline this transfer</p>
<p class='fix'>Only the target wallet can decline a transfer. 
The originating wallet can only <c>DELETE</c>.</p>

<p class='code'>404: Not Found
404: Can not found transfer by id:&lt;transfer_id></p>
<p class='fix'>Fix the transfer ID in the path.</p>
<p class='note git'>issue #275 We mean "cannot find transfer...</p>

</div>

<!-- ----------------------------- -->
<div class='resource' id='deleteTransfer'>
<p class='title'>Delete Transfer</p>
<p class='abs'>The originator cancels a transfer before target accepts or fulfills it.</p>
<p class='note'>The documentation in the *.yaml file for Postman says the "executer" can delete a transfer. 
The executer of a transfer is the originating wallet. Right?</p>
<p class='code path'>DELETE /wallet/transfers/&lt;transfer_id&gt;</p>
<p class='qry'>&lt;transfer_id&gt;: Replace with a transfer ID.</p>
<p class='subhd'>Response, a transfer object:</p>
<p class='code'>200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    <i>or</i>
    bundle: { bundle_size: integer }
  }
  state: <b>cancelled</b>
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}</p>

<div class='errs'>
<p class='subhd'>Errors:</p>

<p class='code'>403 Forbidden
403:The transfer state is not pending and requested</p>
<p class='fix'>The transfer has already been either completed, deleted, or declined.</p>

<p class='code'>403: Forbidden
403: Current account has no permission to cancel this transfer</p>
<p class='fix'>Only the originating wallet can delete a transfer. 
The target wallet can accept, fulfill, or decline.</p>

<p class='code'>404: Not Found
404: Can not found transfer by id:&lt;transfer_id></p>
<p class='fix'>Fix the transfer ID in the path.</p>

<!-- 403: Authenticated wallet does not have access to this transfer -->
<!-- 406: Transfer with this id is not in requested or pending state -->
</div>
</div>

<!-- ----------------------------- -->
<!-- ----------------------------- -->
<div class='resource' id='trustsExplained'>
<p class='title'>Trust Relationships Explained</p>
<p class='abs'>A <i>trust relationship</i> allows one wallet to move tokens
to or from another without getting permission for each individual transfer.
It can let Alice transfer tokens to Bob, for example, without Bob posting his acceptance.</p>

<p class='subhd'>Who Trusts Who?<p>
<p>GET <a href='#getTrusts'><c>/wallet/trust_relationships</c></a> lists the trust 
relationships that your wallets are party to.</p>

<p class='subhd'>Request and Accept Trust<p>
<p>To create a trust relationship, the <c>originating</c> wallet posts a message 
that specifies the other party to the relationship, called the <c>requestee</c>. Then the
requestee either accepts or declines the arrangement.</p>
<p>Once accepted, a trust remains in effect indefinitely, until either party cancels it.</p>

<p class='subhd'>Trust Relationship Roles</p>
<p><c>Originator, requester, actor</c>: These three terms mean the same 
thing and have the same value. A trust relaionship begins with the origin's
request to create it.</p>
<p><c>Requestee, target</c>: These two terms mean the same thing and
have the same value. A trust takes effect when the requestee accepts it.</p>
<p class='note'>Trusts would be easier to understand if requests and objects used the same terms.</p>
<p class='note'>And what is the purpose of the "actor_wallet" and the state "cancelled_by_actor"?
Will they gain a purpose in the next version, when requests can include "requester_wallet"?</p>

<p class='subhd'>Decline or Delete a Trust<p>
<p>The originator can cancel a trust at any time--before or after acceptance--with a <c>DELETE</c> request.</p>
<p>The requestee can refuse at any time--before or after acceptance--with a <c>decline</c> request.</p>
<p class='note'>After an accept, then a DELETE, the requestee can accept again and the state becomes "trusted" again. 
It seems the origin cannot confidently end a trust. Is that as intended?</p>
<p class='note'>DELETE & decline both set the state to "cancelled_by_..."
It would help users remember who DELETEs and who declines if the resulting
states were "declined_by_requestee" and "DELETEd_by_originator" or simply "declined" and "DELETED".</p>

<p class='subhd'>Trust Request Types<p>
<p>Four kinds of trust request allow tokens to move to or from either party, under the control of either party, as follows:</p>

<p><c>send</c>: The originating wallet can transfer its tokens to the requestee's wallet.</p>

<p><c>manage</c>: The originating wallet can transfer its tokens to the requestee's wallet.<br/>
The originating wallet can also transfer the requestee's tokens to itself.</p>

<p><c>receive</c>: The requestee's wallet can transfer its tokens to the originating wallet.</p>

<p><c>yield</c>: The requestee wallet can transfer its tokens to the originating wallet.<br/>
The requestee wallet can also transfer the originator's tokens to itself.</p>

<p class='note'>Are request_types manage and yield working as intended? 
Manage lets me send to the requestee and take (deduct) from the requestee.
I can't transfer my tokens some other wallet that the requestee manages.
I can't transfer requestee's tokens to some other wallet that the requestee manages.</p>

<p class='note'>Posting request_type "deduct" or "release" returns an error: 
<c>500 Unknown error (Class constructor HttpError cannot be invoked without 'new')</c>.</p>

<p class='code'>         Origin gets to transfer this way:
send:         origin's token ---> requestee's wallet
deduct:      origin's wallet &lt;--- requestee's token
manage:      both send and deduct

         Requestee gets to transfer this way:
receive:    origin's wallet &lt;--- requestee's token
release:     origin's token ---> requestee's wallet
yield:      both receive and release
</p>

<!-- req_type vs type:
send     send
receive  send
manage   manage
yield    manage
deduct   error
release  error -->

</div>

<!-- ----------------------------- -->
<div class='resource' id='getTrusts'>
<p class='title'>Get Trusts</p>
<p class='abs'>Get a list of requested, established, and/or cancelled trust relationships related to the currently authorized wallet and any wallets it manages.</p>
<p class='code path'>GET /wallet/trust_relationships?limit=n&start=n&state=string&request_type=string&type=string</p>
<p class='qry'>limit: Required integer. The maximum number of trust objects to return.</p>
<p class='qry'>start: Optional integer, defaults to 1, the beginning. Of the trust objects on the server, the one to start the list. But the precise order of trust records is unpredictable.</p>
<p class='qry'>state: Optional string:</p>
<p class='list'><c>trusted</c>: Active trust relationship</p>
<p class='list'><c>requested</c>: Trust relationship awaiting acceptance by the requestee.</p>
<p class='list'><c>cancelled_by_originator</c>: Trust relationship cancelled by the wallet that posted the initial request to create the trust.</p>
<p class='list'><c>cancelled_by_target</c>: Trust relationship was cancelled by the requestee.</p>

<p class='qry'>request_type: Optional string</p>
<p class='list'><c>send</c>: The originating wallet can transfer its tokens to the requestee's wallet.</p>
<p class='list'><c>manage</c>: The originating wallet can transfer its tokens to the requestee's wallet.<br/>
The originating wallet can also transfer the requestee's tokens to itself.</p>
<p class='list'><c>receive</c>: The requestee's wallet can transfer its tokens to the originating wallet.</p>
<p class='list'><c>yield</c>: The requestee wallet can transfer its tokens to the originating wallet.<br/>
The requestee wallet can also transfer the originator's tokens to itself.</p>
<p class='qry'>type: Optional string</p>
<p class='list'><c>send</c>: One wallet can give tokens to the other.</p>
<p class='list'><c>manage</c>: One wallet can both give and take tokens to and from the other.</p>

<p class='subhd'>Response, an array of trust relationship objects:</p>
<p class='code'>200: OK
{ trust_relationships: [
  {
    id: uuid
    type: string
    request_type: string
    state: string
    created_at: date
    updated_at: date
    orginating_wallet: string
    actor_wallet: string
    target_wallet: string
  }
] }</p>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>500: Internal Server Error
500: Unknown error (...invalid input value for...trust_<b>state</b>_type: "&lt;value>")
500: Unknown error (...invalid input value for...trust_<b>request_type</b>: "&lt;value>")
500: Unknown error (...invalid input value for...trust_<b>type</b>: "&lt;value>")
<p class='fix'>In the request path, provide a value for <c>state</c>, <c>request_type</c>, or <c>type</c> from the list above.</p>

<p class='code'>422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1</p>
<p class='fix'>The path must include <c>?limit=<i>n</i></c> or <c>?limit=<i>n</i>&start=<i>n</i></c>, where <i>n</i> is an integer</p>
</div></div>

<!-- ----------------------------- -->
<div class='resource' id='postTrustRequest'>
<p class='title'>Post Trust Request</p>
<p class='abs'>Request a new trust relationship from another wallet.</p>
<p class='code path'>POST /wallet/trust_relationships</p>
<p class='subhd'>Request body:</p>
<p class='code reqb'>{
  "trust_request_type": "string",
  "requestee_wallet": "nameOrID"
}</p>
<p class='qry'>trust_request_type:</p>
<p class='list'><c>send</c>: The originating wallet can transfer its tokens to the requestee's wallet.</p>
<p class='list'><c>manage</c>: The originating wallet can transfer its tokens to the requestee's wallet.<br/>
The originating wallet can also transfer the requestee's tokens to itself.</p>
<p class='list'><c>receive</c>: The requestee's wallet can transfer its tokens to the originating wallet.</p>
<p class='list'><c>yield</c>: The requestee wallet can transfer its tokens to the originating wallet.<br/>
The requestee wallet can also transfer the originator's tokens to itself.</p>

<p class='note'>We use <c>GET /wallet/trust_relationships?<b>request_type</b>=</c>. 
And in trust objects we use <c>request_type</c>. 
Let's do the same here: <c>request_type</c>, not <c>trust_request_type</c></p>
<p class='note'>v 0.9 will add: requester_wallet: Optional string. Defaults to currently logged-in wallet</p>
<p class='subhd'>Response, a trust relationship object:</p>
<p class='code'>200: OK
{
  id: uuid
  type: string
  request_type: string
  state: <b>requested</b>
  created_at: date
  updated_at: date
  orginating_wallet: &lt;currently logged-in wallet>
  actor_wallet: string
  target_wallet: string
}</p>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>403: Forbidden
403: The trust relationship has been requested or trusted</p>
<p class='fix'>Trust relationship requests cannot be duplicated. 
Use <a href='#getTrusts'><c>GET /wallet/trust_relationships</c></a> to get the ID of
the existing trust relationship (the state is <c>requested</c> or <c>trusted</c>) 
that matches your request. 0Then the requestee can accept or decline it. 
Or you can DELETE it.</p>
<p class='code'>422: Unprocessable Entity
422 "trust_request_type" must be one of [send, receive, manage, yield, deduct, release]</p>
<p class='fix'>Revise the message body to use a valid request type.</p>
<p class='code'>500: Internal Server Error
500: Unknown error (Class constructor HttpError cannot be invoked without 'new')</p>
<p class='fix'>Request types <c>deduct</c> and <c>release</c> are not yet implemented. 
Use <c>manage</c> or <c>yield</c>.</p>
<p class='code'>404: Not Found
404: Could not find entity by wallet name: &lt;wallet_name></p>
<p class='fix'>In the message body, fix the value of <c>requestee_wallet</c>.</p>
</div></div>

<!-- ----------------------------- -->
<div class='resource' id='acceptTrust'>
<p class='title'>Accept Trust</p>
<p class='abs'>With the accept message, the requestee allows a trust to take effect.
The accept message will re-instate a trust relationship that was previously declined or DELETEd</p>
<p class='code path'>POST /wallet/trust_relationships/&lt;trust_relationship_id&gt;/accept</p>
<p class='qry'>&lt;trust_relationship_id&gt;: Replace with a trust relationship ID.</p>
<p class='subhd'>Response, a trust relationship object:</p>
<p class='code'>200: OK
{
  id: uuid
  type: string
  request_type: string
  state: <b>trusted</b>
  created_at: date
  updated_at: date
  orginating_wallet: string
  actor_wallet: string
  target_wallet: &lt;currently logged-in wallet>
}</p>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>403: Forbidden
403: Have no permission to accept this relationship.</p>
<p class='fix'>Check the <c>trust_relationship_id</c> in your request. You may have provided the wrong one.
Or you are not this trust's requestee. Only the requestee can accept a trust request.</p>

</div></div>

<!-- ----------------------------- -->
<div class='resource' id='declineTrust'>
<p class='title'>Decline Trust</p>
<p class='abs'>With the decline message, the requestee cancels a previously accepted trust relationship, or refuses to 
let a new one take effect.</p>
<p class='code path'>POST /wallet/trust_relationships/&lt;trust_relationship_id&gt;/decline</p>
<p class='qry'>&lt;trust_relationship_id&gt;: Replace with a trust relationship ID.</p>
<p class='subhd'>Response, a trust relationship object:</p>
<p class='code'>200: OK
{
  id: uuid
  type: string
  request_type: string
  state: <b>cancelled_by_target</b>
  created_at: date
  updated_at: date
  orginating_wallet: string
  actor_wallet: string
  target_wallet: &lt;currently logged-in wallet>
}</p>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>403: Forbidden
403: Have no permission to decline this relationship.</p>
<p class='fix'>Check the <c>trust_relationship_id</c> in your request. You may have provided the wrong one.
Or you are not this trust's requestee. Only the requestee can decline a trust request.</p>

</div></div>

<!-- ----------------------------- -->
<div class='resource' id='deleteTrust'>
<p class='title'>Delete Trust</p>
<p class='abs'>With the DELETE message, the originator of a trust relationship cancels it,
regardless of whether the requestee has already accepted it.</p>
<p class='code path'>DELETE /wallet/trust_relationships/&lt;trust_relationship_id&gt;</p>
<p class='qry'>&lt;trust_relationship_id&gt;: Replace with a trust relationship ID.</p>
<p class='subhd'>Response, a trust relationship object:</p>
<p class='code'>200: OK
{
  id: uuid
  type: string
  request_type: string
  state: <b>cancelled_by_originator</b>
  created_at: date
  updated_at: date
  orginating_wallet: &lt;currently logged-in wallet>
  actor_wallet: string
  target_wallet: string
}</p>
</div>

<div class='errs'>
<p class='subhd'>Errors:</p>
<p class='code'>404: Not Found
404: Can not found wallet_trust by id:&lt;trust_relationship_id>
500: Internal Server Error
500: Unknown error (...invalid input syntax for type uuid: "&lt;trust_relationship_id>")</p>
<p class='fix'>In your request path, provide the correct trust ID.</p>
<p class='code'>403: Forbidden
403: Have no permission to cancel this relationship</p>
<p class='fix'>Check the <c>trust_relationship_id</c> in your request. You may have provided the wrong one.
Or you are not this trust's originator. Only the originator can DELETE a trust request.</p>
</div></div>
 
<!-- ----------------------------- -->
<!-- ----------------------------- -->
<!-- ----------------------------- -->
<p>&nbsp;</p>
<p class='note'>v. 0.9 adds 1 more resource: GET /events</p>

<!-- ----------------------------- -->
<!--
<div class='gloss' id='gloss'>
  Query parameters:
    limit
    start
  Transfer roles: 
    originating_wallet
    source_wallet
    destination_wallet
  Transfer states: 
    requested: Originating_wallet manages destination_wallet.
    pending: Originating_wallet manages source_wallet.
    completed
    cancelled 
    failed
  Trust relationship roles:
    originator
    actor
    target
  Trust relationship states:
    trusted: Active trust relationship
    requested: Trust relationship pending approval
    cancelled_by_originator
    cancelled_by_actor: Trust relationship cancelled by the actor.
    cancelled_by_target: Trust relationship was cancelled by the target
  Trust relationship types:
    send: Allow actor to send to target
    deduct: Allow actor to deduct from wallet
    manage: Allow actor to move tokens from target to any wallet the actor controls
  Trust relationship request types:
    send: Request to allow actor to send to target
    receive: Opposite of a send request. Allow a sending wallet to send to the originator's wallet.
    deduct: Request to allow actor to deduct from wallet
    release: Opposite of a deduct request. Request to allow some other wallet to deduct from the originator's wallet.
    manage: Allow actor to move tokens from target wallet to any wallet the actor controls
    yield: Opposite of a manage request. Allow some other wallet to move tokens to any wallet the originator 
 
</div>
-->
<p id='end'><a href='#grnd2'>^ back to top ^</a></p>
</div><!-- end of div#grnd2 -->
<!-- STANDARD PHP FOOTER --------------- -->
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/south.php'); ?>

