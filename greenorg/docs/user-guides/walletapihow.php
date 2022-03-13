<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/north.php');?>
<!-- END STANDARD PHP HEADER --------------- -->

<!-- UNIQUE CONTENT HERE ------------------- -->
<style>
  div#grnd2      {margin:24px;}
  div#grnd2, div#grnd2 * {font-family:sans-serif;font-size:16px;line-height:20px;
                        margin:0;padding:0;color:#474B4F;}
  div#grnd2      {margin:24px;white-space:pre;}
  div#grnd2 div  {margin:0;padding:0;white-space:pre;min-width:720px;}
  div#grnd2 a    {color:#86c232;cursor:pointer;text-decoration:none;color:#569202;}
  div#grnd2 h1   {font-size:24px;font-weight:bold;padding:8px 0 0 0;margin:0;}
  div#grnd2 h2   {font-size:20px;font-weight:bold;padding:8px 0 0 0;margin:0;
                 border:0px solid #333; border-width:2px 0 0 0;} 
  div#grnd2 code, div#grnd2 c, div#grnd2 .code {font-size:90%;font-family:monospace;}
  div#grnd2 .code    {white-space:pre;background:#eee;padding:2px;margin-top:4px;}
  div#grnd2 div.code {margin:0px 44px 0px 12px;}

  div#grnd2 div#contents     {white-space:nowrap;}
  div#grnd2 div#contents p   {margin:0;}
  div#grnd2 div#contents p a {cursor:pointer;}

  div#grnd2 div.more      {cursor:pointer;}
  div#grnd2 div.more>span {font-weight:bold;color:#86c232;;}
  div#grnd2 div.more>div  {cursor:default;display:none;}

  div#grnd2 p.note {display:none;border:1px solid green;margin:6px 0; 
                    padding:6px;color:#080;white-space:pre;}
  div#grnd2 p.note:before {content:'??? ';}
</style>
<script>
const loader=function(){
  // OVERRIDE DIV#GRND & greendoc.css
  document.getElementById('grnd').id='grnd0';
}//loader
//<!-- ----------------------------------------------------------------- -->
//<!-- ----------------------------------------------------------------- -->
</script>

<div id='grnd2' class='grnd2'>
<h1>How to Use the Treetracker Wallet API</h2>
<p class='note'>This is a note, hidden until location.search=?notes</p>
<div id='contents'>
  <p><i>Contents:</i> &nbsp;<br/>
    <a href='#purpose'>Purpose</a>, &nbsp;
    <a href='#keys'>Your API Keys</a>, &nbsp;
    <a href='#sampleJavaScript'>Sample JavaScript</a>, &nbsp;
    <a href='#sampleBash'>Sample Bash and cURL</a>, &nbsp;
    <a href='#authentication'>Authentication</a>,</p>
  <p><a href='#listTrees'>List Your Trees</a>, &nbsp;
    <a href='#passTrees'>Pass Trees to a Client</a>, &nbsp;
    <a href='#sendTrees'>Send Trees to a New Manager</a>, &nbsp;
    <a href='#askForTrees'>Ask for More Trees</a>,</p>
  <p><a href='#trustSomeone'>Trust Someone to Give You Tokens Anytime</a>, &nbsp;
    <a href='#giveOrTake'>Give or Take, Trust or Ask for Trust</a>,<br/>
    <a href='#stopTrusting'>Stop Trusting</a>
</div>
You may also find help in a more-detailed, less-explanatory document, the <a href='/docs/user-guides/walletapiref.php'>Treetracker API Reference</a>.
<!-- --------------------------------------------------------------------- -->
<h2 id='purpose'>Purpose</h2>
You can read, write, download, and move your Greenstand tree data
with Treetracker's application programing interface (API).

Send HTTP requests to the API server. The server replies with the results of your request.

For example, send 
<div class='code'>GET https://prod-k8s.treetracker.org/wallet/tokens?limit=1</div>
Treetracker returns data about the first tree token in your Treetracker wallet.
<div class='code'>{ tokens: [ {
  id: "35ab365b-8864-42d4-8ba6-29700dfba334",
  capture_id: "e077293b-61e6-49ab-90d7-207d2f14e06f",
  wallet_id: "f2832ab6-cc58-4922-920a-568a3b63e247",
  transfer_pending: false,
  transfer_pending_id: null,
  created_at: "2021-08-26T20:19:06.089Z",
  updated_at: "2021-08-26T20:19:06.089Z",
  origin: null,
  claim: false,
  links: { capture: "/webmap/tree?uuid=e077293b-61e6-49ab-90d7-207d2f14e06f" }
} ] }</div>
Almost all Treetracker data moves in JSON objects, like the example above.

These instructions explain typical uses of the wallet API,
and they provide examples in JavaScript and cURL code.

These instructions assume you are familiar with those languages, and with the basics of
sending and receiving HTTP requests and parsing JSON data.

<h2 id='keys'>Your API Keys</h2>
To use the API you need to get three keys from Greenstand:
<c>&nbsp; - TREETRACKER-API-KEY
&nbsp; - wallet</c> <c>name
&nbsp; - wallet</c> <c>password</c>

All API requests need two headers:
<code>&nbsp; - TREETRACKER-API-KEY:&lt;<i>api-key</i>&gt;
&nbsp; - Content-Type:application/json</code>

Your first API request--your <a href='#authentication'>authentication</a> request--uses your 
<c>wallet</c> <c>name</c> and <c>password</c> to get another key: 
<c>&nbsp; - bearer</c> <c>token</c>

All subsequent requests need the bearer token in a third header:
<code>&nbsp; - Authorization:Bearer &lt;<i>token</i>&gt;</code>
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='sampleJavaScript'>Sample JavaScript</h2>
These instructions describe HTTP methods, URL paths, and HTTP message bodies.
For example, send an authentication request like this:
<div class='code'>Method: POST
Path: /wallet/auth
Body: {"wallet": "&lt;name>", "password": "&lt;password>"}</div>
You can substitute those values into the following sample 
of JavaScript code for a NodeJS environment.
<div class='code more' onclick='deltaShow(this);'><span class='plus'>+ </span>//-- JavaScript for NodeJS ----------------
<div>// Set 5 variables below.
// For the body, sometimes supply a JSON data object. 
//   Sometimes supply six characters: "null"
// bearerToken is the value returned by your first request:
//   POST /wallet/auth {"wallet": "&lt;name>", "password": "&lt;password>"}
// A bearerToken remains valid for about one year.
//
// Modify 2 functions below to suit your need: 
//   handleReply() and handleError()

//-- Set 5 variables ----------------------
var config={
  method:"&lt;Method>",
  path:"&lt;Path>",
  body:&lt;Body>,
  apikey:"&lt;yourApiKeyFromGreenstand>",
  bearerToken:"&lt;bearerToken>",
  host:"prod-k8s.treetracker.org"
} // end config

//-- Handle reply -------------------------
const handleReply=function(code,msg,obj){
  console.log(code+': '+msg);
  console.log(obj);
} // end handleReply

//-- Handle error -------------------------
const handleError=function(src,code,msg,body){
  console.log(src);
  console.log(code+': '+msg);
  console.log(body);
} // end handleError

//-- Function to send request -------------
const https=require('https');
const sendRequest=function(){
  try{

    //-- Define request -------------------
    let options={
      "method":config.method,
      "hostname":config.host,
      "path":config.path,
      "headers":{ 
        "TREETRACKER-API-KEY":config.apikey,
        "Content-Type":"application/json",
        "Authorization":"Bearer "+config.bearerToken
      },
      "maxRedirects":20
    };
    var req = https.request(options,function(reply){

      //-- Handle response ----------------
      reply.on("error",function(err){handleError('Reply error',499,err,null);});
      var chunks = [];
      reply.on("data",function(chunk){chunks.push(chunk);});
      reply.on("end",function(){
        let code=parseInt(reply.statusCode);
        let msg=reply.statusMessage;
        let body=Buffer.concat(chunks).toString();
        let obj=null;
        try{obj=JSON.parse(body);} 
        catch(e){handleError('JSON parse error',code,msg,body);return;}
        if((code<200)||(code>299)){handleError('Reply code error',code,msg,obj);return;}
        handleReply(code,msg,obj);
      });
    });
    
    //-- If request has a body, send it ---
    if((config.body)&&(typeof config.body=='object')){
      req.write(JSON.stringify(config.body));
    }//if

    //-- end ------------------------------
    req.end();
  }//try
  catch(err){handleError('sendRequest() error',499,err,null);}
}// end sendRequest

//-- Execute ------------------------------
sendRequest();

//-- End JavaScript -----------------------
//-----------------------------------------
</div></div><!-- --------------------------------------------------------------------------------------- -->
<h2 id='sampleBash'>Sample Bash and cURL</h2>
For Bash and cURL on Mac or Linux, here is sample code.
<div class='code more' onclick='deltaShow(this);'><span class='plus'>+ </span>#-- Bash and cURL -------------------------
<div># Set 5 variables below.
# Path values usually need 'quotes.' 
# For the body, sometimes supply a JSON-formatted string 
#   inside single quotes: '{"key":"value"}'
#   Sometimes supply four characters: null
#   Boolean values need quotes '{"name":"true"}'
# bearerToken is the value returned by your first request: 
#   POST /wallet/auth {"wallet": "&lt;name>", "password": "&lt;password>"}
#   A bearerToken remains valid for about one year.

#-- Set 5 variables -----------------------
method=&lt;Method>
path='&lt;Path>'
body='&lt;Body>'
#body=null
apikey='TREETRACKER-API-KEY:'&lt;yourApiKeyFromGreenstand>
bearerToken=&lt;bearerToken>
host='https://prod-k8s.treetracker.org'
type='Content-Type:application/json'

#-- Send request --------------------------
if [[ $body == "null" ]]; then
  curl -L -X $method $host$path -H $apikey -H $type -H 'Authorization: Bearer '${bearerToken} 
fi

if [[ $body != "null" ]]; then
  curl -L -X $method $host$path -H $apikey -H $type -H 'Authorization: Bearer '${bearerToken} -d $body
fi

#-- End Bash ------------------------------
#------------------------------------------</div></div>
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='authentication'>Authentication</h2>
Every new user of the API needs to start with an authentication request.

That request returns a "bearer token," a string of 852 characters that goes in the header of all subsequent requests. 
Without it, requests return an error. A bearer token is valid for about one year.

Send this request:
<div class='code'>Method: POST
Path: /wallet/auth
Body: {"wallet": "&lt;nameOfYourTreetrackerWallet>", "password": "&lt;yourWalletPassword>"}</div>
The API responds with:
<div class='code'>200: OK
{ token: "&lt;852characters>" }</div>
In subsequent requests, include this header
<div class='code'>"Authorization":"Bearer &lt;852characters>"</div>
If you do not, or if the bearer token has expired, the API responds with:
<div class='code'>403: ERROR: Authentication, token not verified.</div>
Or simply:
<div class='code'>{"code":500,"message":"Unknown error (undefined)"}</div>
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='listTrees'>List Your Trees</h2>
Treetracker describes trees in data objects called <i>tree tokens</i>.

Tokens for your trees are stored in your wallets.

To get a list of the tokens in a given wallet, send this request:
<div class='code'>Method: GET
Path: /wallet/tokens?limit=999&wallet=&lt;walletName></div>
The API responds with an array of token objects:
<div class='code'>200: OK
{ tokens: [ {&lt;token>},{&lt;token>},{&lt;token>}, ... ] }</div>
Each token object looks like this:
<div class='code'>{
  id: '2d36cf63-8cb5-4067-8d5e-faa392eb5306',
  capture_id: '3cbdcc97-e4fc-433b-b3bb-521847d19c84',
  wallet_id: 'f2832ab6-cc58-4922-920a-568a3b63e247',
  transfer_pending: false,
  transfer_pending_id: null,
  created_at: '2021-08-26T20:19:06.089Z',
  updated_at: '2021-08-26T20:19:06.089Z',
  origin: null,
  claim: false,
  links: {capture: "/webmap/tree?uuid=6fdd1365-dae5-465c-af6d-4e87e3f25634"}
}</div>
The links.capture value is the path to more complete data about the tree, for example:
<div  class='code'><a onclick='goto(this)'>https://prod-k8s.treetracker.org/webmap/tree?uuid=6fdd1365-dae5-465c-af6d-4e87e3f25634</a></div>
Note that the tree ID in the link is different than the token ID.
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='passTrees'>Pass Trees to a Client or Friend</h2>
Suppose Alice runs a landscaping business, and she wants to encourage a favorite customer, Bob, 
by giving him some of her Greenstand trees.

Alice's task is to create a wallet, put some tree tokens into it, and give Bob the link to view them.

First, Alice creates Bob's wallet with this API request:

<div class='code'>Method: POST 
Path:   /wallet/wallets
Body:   {"wallet": "BobsWallet"}</div>
The API responds thus:
<div class='code'>200: OK
{wallet: "BobsWallet"}</div>
Second, Alice moves three of her tokens into Bob's Wallet:
<div class='code'>Method: POST
Path: /wallet/transfers
Body: 
{
  "sender_wallet": "AlicesWallet",
  "receiver_wallet": "BobsWallet",
  "tokens": ["&lt;token_id>","&lt;token_id>","&lt;token_id>"]
}</div>
The API responds with a <i>transfer object</i>:
<div class='code'>201: Created
{
  id: '47c3e3b6-b2be-41e4-8264-37df44df66a6',
  type: 'send',
  parameters:{ tokens: ["&lt;token_id>","&lt;token_id>","&lt;token_id>"] }
  state: 'completed',
  created_at: '2021-10-01T12:27:17.940Z',
  closed_at: '2021-10-01T12:27:17.940Z',
  active: true,
  claim: false,
  originating_wallet: 'AlicesWallet',
  source_wallet: 'AlicesWallet',
  destination_wallet: 'BobsWallet'
}</div>
Now Alice can direct Bob (or anyone else) to find his trees on the map:
<a onclick='goto(this)'>https://map.treetracker.org/?wallet=BobsWallet</a>

Note that Bob does not <i>manage</i> his wallet. Alice does. 
BobsWallet does not have its own password. Bob cannot use the API.
Only Greenstand administrators can create a new user account with a new managed wallet.
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='sendTrees'>Send Trees to a New Manager</h2>
Alice and Bob are generous people who support tree farmers.
They use Treetracker tokens and wallets to measure their success.

Alice and Bob both manage their own wallets. 
Alice wants to transfer 200 tokens from Alice's wallet to Bob's.

It's a two-stop process: 
1. Alice requests the transfer.
2. Bob <i>accepts</i> it.

1. First, Alice posts this request:
<div class='code'>Method: POST
Path: /wallet/transfers
Body: 
{
  "sender_wallet": "AlicesWallet",
  "receiver_wallet": "BobsWallet",
  "bundle":{"bundle_size": 200}
}</div>
The API replies with a <i>transfer object</i>:
<div class='code'>202: Accepted
{
  id: '<b>47c3e3b6-b2be-41e4-8264-37df44df66a6</b>',
  type: 'send',
  parameters: { bundle: { bundleSize: 200 } },
  state: '<b>pending</b>',
  created_at: '2021-11-01T12:27:17.940Z',
  closed_at: '2021-11-01T12:27:17.940Z',
  active: true,
  claim: false,
  originating_wallet: 'AlicesWallet',
  source_wallet: 'AlicesWallet',
  destination_wallet: 'BobsWallet'
}</div>
Note the <code>state</code> of that transfer: <code>pending</code>.
The transfer is not complete, despite the response message: <code>Accepted</code>.
Also note the <code>id</code> of that transfer.

2. Second, Bob reads that same transfer object with this request:
<div class='code'>Method: GET
Path: /wallet/transfers?limit=1&wallet=BobsWallet&state=pending</div>
The API replies with an array of transfer objects.
<div class='code'>200: OK
{ transfers: [ {&lt;transfer>},{&lt;transfer>},{&lt;transfer>}, ... ] }</div>
In that array, Bob finds the transfer request that originated with Alice:
<div class='code'>id: '<b>47c3e3b6-b2be-41e4-8264-37df44df66a6</b>',
...
state: <b>pending</b>,
...
<b>originating_wallet: 'AlicesWallet'</b>,
source_wallet: 'AlicesWallet',
destination_wallet: 'BobsWallet'</div>
Bob completes the transfer by copying the id and sending this request:
<div class='code'>Method: POST
Path: /wallet/transfers/47c3e3b6-b2be-41e4-8264-37df44df66a6/<b>accept</b></div>
The API responds with a revised transfer request object. 
The <code>state</code> is now <code>completed</code>.
<div class='code'>200 OK
{
  id: '47c3e3b6-b2be-41e4-8264-37df44df66a6',
  type: 'send',
  parameters: { bundle: { bundleSize: 200 } },
  state: '<b>completed</b>',
  created_at: '2021-11-01T22:27:17.940Z',
  closed_at: '2021-11-01T22:27:17.940Z',
  active: true,
  claim: false,
  originating_wallet: 'AlicesWallet',
  source_wallet: 'AlicesWallet',
  destination_wallet: 'BobsWallet'
}</div>
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='askForTrees'>Ask for More Trees</h2>
Alice and Bob are generous people who support tree farmers.
They use Treetracker tokens and wallets to measure their success.

Alice and Bob both manage their own wallets. 
Bob wants Alice to give him 200 of her tokens.

It's a two-stop process: 
1. Bob requests the transfer.
2. Alice <i>fulfills</i> it.

1. First, Bob posts this request:
<div class='code'>Method: POST
Path: /wallet/transfers
Body: 
{
  "sender_wallet": "AlicesWallet",
  "receiver_wallet": "BobsWallet",
  "bundle":{"bundle_size": 200}
}</div>
The API replies with a <i>transfer object</i>:
<div class='code'>202: Accepted
{
  id: '<b>47c3e3b6-b2be-41e4-8264-37df44df66a6</b>',
  type: 'send',
  parameters: { bundle: { bundleSize: 200 } },
  state: '<b>requested</b>',
  created_at: '2021-11-01T12:27:17.940Z',
  closed_at: '2021-11-01T12:27:17.940Z',
  active: true,
  claim: false,
  originating_wallet: 'BobsWallet',
  source_wallet: 'AlicesWallet',
  destination_wallet: 'BobsWallet'
}</div>
Note the <code>state</code> of that transfer: <code>requested</code>.
The transfer is not complete, despite the response message: <code>Accepted</code>.
Also note the <code>id</code> of that transfer.

2. Second, Alice reads that same transfer object with this request:
<div class='code'>Method: GET
Path: /wallet/transfers?limit=1&wallet=AlicesWallet&state=requested</div>
The API replies with an array of transfer objects.
<div class='code'>200: OK
{ transfers: [ {&lt;transfer>},{&lt;transfer>},{&lt;transfer>}, ... ] }</div>
In that array, Alice finds the transfer request that originated with Bob:
<div class='code'>id: '<b>47c3e3b6-b2be-41e4-8264-37df44df66a6</b>',
...
state: <b>requested</b>,
...
<b>originating_wallet: 'BobsWallet'</b>,
source_wallet: 'AlicesWallet',
destination_wallet: 'BobsWallet'</div>
Alice completes the transfer by copying the id and sending this request:
<div class='code'>Method: POST
Path: /wallet/transfers/47c3e3b6-b2be-41e4-8264-37df44df66a6/<b>fulfill</b>
Body: {"implicit":true}</div>
The API responds with a revised transfer request object. 
The <code>state</code> is now <code>completed</code>.
<div class='code'>200 OK
{
  id: '47c3e3b6-b2be-41e4-8264-37df44df66a6',
  type: 'send',
  parameters: { bundle: { bundleSize: 200 } },
  state: '<b>completed</b>',
  created_at: '2021-11-01T22:27:17.940Z',
  closed_at: '2021-11-01T22:27:17.940Z',
  active: true,
  claim: false,
  originating_wallet: 'BobsWallet',
  source_wallet: 'AlicesWallet',
  destination_wallet: 'BobsWallet'
}</div>
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='trustSomeone'>Trust Someone to Give You Tokens Anytime</h2>
Alice is Bob's business partner. She often transfers tokens to Bob's wallet.
So often, that it is a nuisance for Bob to explicitly accept each and every transfer.

So Alice and Bob create a <i>trust relationship</i>, as follows.

1. Bob sends a request to create the trust:
<div class='code'>Method: POST
Path: /wallet/trust_relationships
Body: 
{
  "trust_request_type": "receive",
  "requestee_wallet": "AlicesWallet"
}</div>
The API replies with a <i>trust relationship object</i>:
<div class='code'>200: OK
{
  id: <b>b6b9ed89-5bd4-4b53-9b60-609fb78dc119</b>
  type: send
  request_type: receive
  state: <b>requested</b>
  created_at: 2021-11-24T14:59:38.783Z
  updated_at: 2021-11-24T14:59:38.783Z
  originating_wallet: BobsWallet
  actor_wallet: BobsWallet
  target_wallet: AlicesWallet
}</div>
Note the <code>state</code> of that trust: <code>requested</code>.
Also note the <code>id</code> of that trust.

2. Alice reads that same trust object with this request:
<div class='code'>Method: GET
Path: /wallet/trust_relationships?limit=99&state=requested</div>
The API replies with an array of trust objects.
<div class='code'>200: OK
{ trust_relationships: [ {&lt;trust_relationship>},{&lt;trust_relationship>},{&lt;trust_relationship>}, ... ] }</div>
In that array, Alice finds the trust request that originated with Bob:
<div class='code'>id: '<b>b6b9ed89-5bd4-4b53-9b60-609fb78dc119</b>',
...
request_type: receive
state: <b>requested</b>,
...
originating_wallet: BobsWallet
actor_wallet: BobsWallet
target_wallet: AlicesWallet</div>
Alice creates the trust relationship by copying the id and sending this request:
<div class='code'>Method: POST
Path: /wallet/trust_relationships/b6b9ed89-5bd4-4b53-9b60-609fb78dc119/<b>accept</b></div>
The API responds with a revised trust object. 
The <code>state</code> is now <code>trusted</code>.
<div class='code'>200: OK
{
  id: <b>b6b9ed89-5bd4-4b53-9b60-609fb78dc119</b>
  type: send
  request_type: receive
  state: <b>trusted</b>
  created_at: 2021-11-24T14:59:38.783Z
  updated_at: 2021-11-24T14:59:38.783Z
  originating_wallet: BobsWallet
  actor_wallet: BobsWallet
  target_wallet: AlicesWallet
}</div>
From now on, Alice can transfer tokens to Bob without Bob's explicit permission.
Alice can <c>POST /wallet/transfers</c> and the tokens will immediately move to BobsWallet.
Bob does not need to find the transfer id and <c>POST /wallet/transfers/&lt;transfer_id>/accept</c>.
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='giveOrTake'>Give or Take, Trust or Ask for Trust</h2>
In the instructions above, <a href='#trustSomeone'>Trust Someone to Give You Tokens Anytime</a>,
Bob wanted to let Alice transfer tokens to Bob. So he sent:
<div class='code'>Method: POST
Path: /wallet/trust_relationships
Body: 
{
  "trust_request_type": "receive",
  "requestee_wallet": "AlicesWallet"
}</div>
In other words, Bob, the <i>request<b>er</b></i>, wants to receive tokens from Alice, the <i>request<b>ee</b></i>.

There are four <c>trust_request_types</c>. They allow transfers in either direction or both: 
from Alice to Bob, from Bob to Alice, or both. As follows:

<c>receive</c>: The requester (Bob) lets the requestee (Alice) give him tokens.

<c>send</c>: The requester (Bob) can give tokens to the requestee (Alice).

<c>manage</c>: The requester (Bob) can both give tokens to, and take tokens from, the requestee (Alice).

<c>yield</c>: The requester (Bob) allows the requestee (Alice) to both give tokens to him and take tokens from him.

<div class='code'><b>What trust_request_types mean:</b>

Requestee/target gets to transfer tokens this way:
receive:    origin's wallet <--- requestee's token
yield:      origin's wallet <--- requestee's token
             origin's token ---> requestee's wallet

Originator/requester gets to transfer tokens this way:
send:         origin's token ---> requestee's wallet
manage:       origin's token ---> requestee's wallet
             origin's wallet <--- requestee's token</div>
<!-- --------------------------------------------------------------------------------------- -->
<h2 id='stopTrusting'>Stop Trusting</h2>
For a long time, Bob has trusted Alice to transfer tokens into his wallet whenever she wants.
But Alice and Bob have moved on to different businesses. They need to break that trust relationship.

Either of them can do so:

1. Either of them finds the necessary trust relationship ID:
<div class='code'>Method: GET
Path: /wallet/trust_relationships?limit=99&state=trusted</div>
The API replies with an array of trust objects:
<div class='code'>200: OK
{ trust_relationships: [ {&lt;trust_relationship>},{&lt;trust_relationship>},{&lt;trust_relationship>}, ... ] }</div>
In that array, they find the trust that let's Bob receive transfers from Alice:
<div class='code'>
{
  id: <b>b6b9ed89-5bd4-4b53-9b60-609fb78dc119</b>
  type: send
  request_type: receive
  state: <b>trusted</b>
  created_at: 2021-11-24T14:59:38.783Z
  updated_at: 2021-11-24T14:59:38.783Z
  originating_wallet: BobsWallet
  actor_wallet: BobsWallet
  target_wallet: AlicesWallet
}</div>
They copy the id of that trust, then Bob uses it one way, Alice another:
Bob originated the trust; he sent the request that started it. So Bob can <c>DELETE</c> the trust:
<div class='code'>Method: DELETE
Path: /wallet/trust_relationships/&lt;trust_relationship_id></div>
The API's response is a revised trust relationship object. It says:
<div class='code'>state: cancelled_by_originator</div>
Alice accepted the trust; she agreed to Bob's request. So Alice can now <c>decline</c> the trust:
<div class='code'>Method: POST
Path: /wallet/trust_relationships/&lt;trust_relationship_id>/decline</div>
The API's response is a revised trust_relationship object. It says:
<div class='code'>state: cancelled_by_target</div>

<p id='end'><a href='#grnd2'>^ back to top ^</a></p>

<!-- STANDARD PHP FOOTER --------------- -->
<?php require($_SERVER['DOCUMENT_ROOT'].'/docs/aparts/south.php');?>

