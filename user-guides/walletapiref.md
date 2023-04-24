
# Treetracker Wallet API Reference

*Contents:*
- [Introduction](#introduction)
- [Authenticate](#authenticate)
- [Get Wallets](#get-wallets)
- [Post Wallet](#post-wallet)
  
- [Get Tokens by Wallet](#get-tokens-by-wallet)
- [Get Token by ID](#get-token-by-id)
- [Get Transactions by Token ID](#get-transactions-by-token-id)
  
- [Transfers Explained](#transfers-explained)
- [Get Transfers by Wallet](#get-transfers-by-wallet)
- [Get Transfer Details by ID](#get-transfer-details-by-id)
- [Get Tokens by Transfer](#get-tokens-by-transfer)
  
- [Post Transfers](#post-transfers)
- [Accept Transfer](#accept-transfer)
- [Decline Transfer](#decline-transfer)
- [Fulfill Transfer](#fulfill-transfer)
- [Delete Transfer](#delete-transfer)
  
- [Trust Relationships Explained](#trust-relationships-explained)
- [Get Trusts](#get-trusts)
- [Post Trust Request](#post-trust-request)
- [Accept Trust](#accept-trust)
- [Decline Trust](#decline-trust)
- [Delete Trust](#delete-trust)

## Introduction

API requests need three headers:
- `TREETRACKER-API-KEY:<api-key>`
- `Authorization:Bearer <token>`
- `Content-Type:application/json`

Every user's first request to the API is [Authenticate](#authenticate).
     That returns a Bearer token good for about one year.
  
Do not confuse the `Bearer <token>` with the other use of *token* in the API.
    In all other cases, a *token* is a data object that describes a tree.

[^ back to top ^](#treetracker-wallet-api-reference)

## Authenticate

Provide a wallet's name or ID, and its password. Receive a bearer token to go in the header of subsequent API requests. Without the bearer token, requests return `403: ERROR: Authentication, token not verified.`
```
POST /wallet/auth
```
#### Request body: 
```
{"wallet": "nameOrID", "password": "string"}
```
#### Response:
```
200: OK
{token: string}
```
#### Errors:
```
200: OK: 1.10.3
```
> *fix:* Use `POST`, not `GET`
```
404: Not Found
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre>Cannot POST /authnot</pre></body></html>
```
> *fix:* Post your request to `https://prod-k8s.treetracker.org/wallet/auth`
```
404: Not Found
404: Could not find entity by wallet name: <name>
```
> *fix:* Correct the value of `wallet` in the request body.
```
415: Unsupported Media Type
415: Invalid content type. API only supports application/json
```
> *fix:* Provide the header: `Content-Type:application/json`
```
401: Unauthorized
401: Invalid access - no API key
401: Invalid API access
```
> *fix:* Provide a correct header: `'TREETRACKER-API-KEY:<api-key>'`
```
422: Unprocessable Entity
422: "wallet" is required
422: "password" is required
```
> *fix:* Provide the request body: `{"wallet": "name", "password": "value"}`
```
401: Unauthorized
401: Invalid credentials
```
> *fix:* Correct the value of `password` in the request body.

#### Authorization errors in subsequent requests:
```
500: Internal Server Error
500: Unknown error (undefined)
403: Forbidden
403: ERROR: Authentication, token not verified
```
> *fix:* Provide a correct header: `Authorization: Bearer <bearerToken>`

[^ back to top ^](#treetracker-wallet-api-reference)

## Get Wallets

Get information regarding this session's authenticated wallet and the wallets it manages.
```
GET /wallet/wallets?limit=n&start=n
```
> limit: Required integer. The maximum number of wallet objects to return.

> start: Optional integer, defaults to 1, the beginning. Of the tokens in the wallet, the one to start the list. But the precise order of wallet records is unpredictable.

#### Response, an array of wallet objects: 
```
200: OK
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
]}
```
#### Errors:
```
422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1
```
> *fix:* The path must end with `?limit=n` or `?limit=n&start=n`, where `n` is an integer

[^ back to top ^](#treetracker-wallet-api-reference)

## Post Wallet

Create a new wallet that is managed by this session's authenticated wallet.
```
POST /wallet/wallets
```
#### Request body: 
```
{"wallet": "nameOrID"}
```
#### Response:
```
200: OK
{"wallet": "nameOrID"}
```
#### Errors:
```
500: Unknown error (Unexpected token c in JSON at position n)}
```
> *fix:* Provide valid JSON format in the request body.
```
400: invalid wallet name:<badname>
```
```
403: Forbidden
403: The wallet '<duplicateName>' has been existed
```
> *fix:* A new wallet name must be unique to Greenstand. We suggest an email address.

[^ back to top ^](#treetracker-wallet-api-reference)

## Get Tokens by Wallet

Get a list of the tokens in this session's authenticated wallet or any wallet it manages.
```
GET /wallet/tokens?limit=n&start=n&wallet=name
```
> limit: Required integer. The maximum number of tokens to return.

> start: Optional integer, defaults to 1, the beginning. Of the tokens in the wallet, the one to start the list. Within a wallet, token number 1 is the one that most recently arrived.

> wallet: Optional name or ID, defaults to this session's authenticated wallet.

#### Response, an array of token objects:
```
200: OK
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
]}
```
> links.capture: Path to tree data

#### Errors:
```
404: Not Found
404: Could not find entity by wallet name: <badName>
```
>  *fix:* The wallet you specified does not exist. See [Get Wallets](#get-wallets), above, for a list of existing wallets.
```
422: Unprocessable Entity
422: "wallet" is not allowed to be empty
```
> *fix:* The path need not include `wallet=`, but if it does, wallet must have a value: `wallet=<value>`
```
403: Forbidden
403: Wallet do not belongs to wallet logged in
```
> *fix:* You can only view tokens in wallets that you manage. See [Get Wallets](#get-wallets), above, for a list.
```
422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1
```
> *fix:* The path must include `limit=n`. It may include `start=n`. In either case, `n` must be an integer

[^ back to top ^](#treetracker-wallet-api-reference)

## Get Token by ID

Get details about one specified token in this session's authenticated wallet or a wallet it manages.
```
GET /wallet/tokens/<token_id>
```
> <token_id>: Replace with a token ID.

#### Response, a token object:
```
200: OK
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
```
> links.capture: Path to tree data

#### Errors:
```
500: Internal Server Error
500: Unknown error (select * from "token" ... invalid input syntax for type uuid: "<bad_token_id")
```
> *fix:* Copy the <token_id> accurately. Token IDs comform to the rules of *universally unique identifiers (UUIDs)*: 32 hex digits and 4 hyphens in a specific pattern. Though the request will work if any or all of the hyphens are removed.
```
404: Not Found
404: can not found token by id:<token_id>
```
> *cause:* The specified token_id does not exist.
```
401: Unauthorized
401: Have no permission to visit this token
```
> *cause:* You can only read tokens that reside in wallets that you manage.

[^ back to top ^](#treetracker-wallet-api-reference)

## Get Transactions by Token ID

For a specified token, get a history of all transfers.
```
GET /wallet/tokens/<token_id>/transactions?limit=n&start=n
```
> <token_id>: Replace with a token ID.

> limit: Required integer. The maximum number of transfer objects to return.

> start: Optional integer, defaults to 1, the beginning. Of the transfer objects in the wallet, the one to start the list. But the order of transfer records is unpredictable.

#### Response, an array of history objects: 
```
200: OK
{ history: [
  {
    processed_at: date
    sender_wallet: string
    receiver_wallet: string
  }
] }
```
#### Errors:
```
500: Internal Server Error
500: Unknown error (select * from "token" ... invalid input syntax for type uuid: "<bad_token_id")
```
> *fix:* Copy the <token_id> accurately. Token IDs comform to the rules of *universally unique identifiers (UUIDs)*: 32 hex digits and 4 hyphens in a specific pattern. Though the request will work if any or all of the hyphens are removed.
```
404: Not Found
404: can not found token by id:<token_id>
```
> *cause:* The specified token_id does not exist.
```
401: Unauthorized
401: Have no permission to visit this token
```
> *cause:* You can only read the history of tokens that reside in wallets that you manage.
```
422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1
```
> *fix:* The path must include `limit=n`. It may include `start=n`. In either case, `n` must be an integer

[^ back to top ^](#treetracker-wallet-api-reference)

## Transfers Explained

A *transfer* moves tokens from one wallet to another by a variety of paths. It is easy to confuse them. This section explains the process and terminology.

#### Post a transfer:

The `originating` user or wallet posts the initial transfer request.
That request asks to move tokens from the `source` wallet to the `destination` wallet. 
Understand that the originator can be either the source or destination. In other words,
tokens may move towards the originator, or away from the originator.

#### Accept or fulfill a transfer:

The `target` is the other party to the transfer. The target may be the source or destination of the tokens, depending on the request.

In some cases, the origin and target wallets are `managed` (belong to) the same user. In some cases, the origin and target have previously established a `trust` `relationship`. In those cases, the transfer will execute and complete immediately after the origin posts it.

But when the origin and target are relative strangers, the transfer does not complete until the target agrees to it. If the target is the destination, the target posts an `accept` request to the API. If the target is the source, the target posts a `fulfill` request to the API.

#### Decline or delete a transfer:

In the event that a target objects to a transfer, the target can post a `decline` request to the API.

The originator may withdraw a request before the target accepts, fulfills, or declines. To do that, the originator sends a `DELETE` request to the API.

#### Transfer states:

Every transfer data object includes a `state` property. Here's what it means:

`requested`: The origin of the request is the destination of the transfer. It awaits the target/source's request to fulfill the transfer.

`pending`: The origin of the request is the source of the transfer and awaits the target/destination's request to accept the transfer.

`cancelled`: The target of a transfer request has declined to accept or fulfill it. Or the originator of the transfer request has deleted it.

`failed`:

`completed`: The transfer has been accepted or fulfilled by the target. Or the transfer simply moved tokens between two wallets both managed by the originator of the request.

[^ back to top ^](#treetracker-wallet-api-reference)

## Get Transfers by Wallet

For a specified wallet, get a list of the transfers in a specified state. The transfers available are those for which the origin, source, or destination is the currently authenticated wallet or any wallet it manages.
```
GET /wallet/transfers?limit=n&start=n&wallet=nameOrID&state=value
```
> limit: Required integer. The maximum number of transfer objects to return.

> start: Optional integer, defaults to 1, the beginning. Of the transfer objects in the wallet, the one to start the list. But the order of the transfers is unpredictable.

> wallet: Optional string or ID, defaults to currently logged-in wallet. List transfers to, from, or requested by this wallet.

> state: Optional string, defaults to * (all). Possible values: `requested, pending cancelled, failed, completed`.

#### Response, an array of transfer objects:
```
200: OK
{ transfers: [
  {
    id: transfer_id
    type: send, deduct, or managed
    parameters: {
      tokens: [token_id,token_id,token_id]
      |or|
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
] }
```
#### Errors:
```
422: Unprocessable Entity
422: "state" must be one of [requested, pending, completed, cancelled, failed]
```
> Fix the value of `state` in the request.
```
422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1
```
> *fix:* The path must include `?limit=n` or `?limit=n&start=n`, where `n` is an integer
```
404: Not Found
404: Could not find entity by wallet name: <badName>
```
> *fix:* The wallet you specified does not exist. See [Get Wallets](#get-wallets), above, for a list of existing wallets.
```
422: Unprocessable Entity
422: "wallet" is not allowed to be empty
```
> *fix:* The path need not include `wallet=`, but if it does, wallet must have a value: `wallet=<value>`

[^ back to top ^](#treetracker-wallet-api-reference)

## Get Transfer Details by ID

Get details for one specific transfer.
```
GET /wallet/transfers/<transfer_id>
```
> <transfer_id>: Replace with a transfer ID.

#### Response, a transfer object: 
```
200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    |or|
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
```
#### Errors:
```
404: Not Found
404: Can not find this transfer or it is related to this wallet
```
> You can only read details of transfers to or from the wallets you manage.
```
422: Unprocessable Entity
422: "transfer_id" must be a valid GUID
```
> *fix:* Copy the <transfer_id> accurately. Transfer IDs comform to the rules of *globally unique identifiers (GUIDs)*: 32 hex digits and 4 hyphens in a specific pattern.

[^ back to top ^](#treetracker-wallet-api-reference)

## Get Tokens by Transfer

Get a list of the tokens moved by a given transfer.
```
GET /wallet/transfers/<transfer_id>/tokens?limit=n&start=n
```
> <transfer_id>: Replace with a transfer ID.

> limit: Required integer. The maximum number of tokens to return.

> start: Optional integer, defaults to 1, the beginning. Of the tokens in the transfer, the one to start the list. But the precise order of token records is unpredictable.

#### Response:
```
500: Internal Server Error
{
  code: 500,
  message: Unknown error (result is not iterable)
}
```
[^ back to top ^](#treetracker-wallet-api-reference)

## Post Transfers

Send a request to move tokens from one wallet to another, as allowed by the wallets' trust relationships. Specify tokens by their IDs, or specify a number of tokens.

The session's authenticated wallet makes the request--it is the *originating_wallet*.

The other party to the request is the *requestee* or *target*.

Tokens are *debited* from from the *sender_wallet* and *credited* to the *receiver_wallet*.

If the wallets share the right [*trust relationship*](#trust-relationships-explained), transfers take place immediately and automatically. Otherwise, the server stores the request and waits for the requestee to accept or decline it.
```
POST /wallet/transfers
```
#### Request body: 
```
{
  "sender_wallet": "nameOrID",
  "receiver_wallet": "nameOrID",
  "bundle":{"bundle_size": integer}
}
```
#### or
```
{
  "sender_wallet": "nameOrID",
  "receiver_wallet": "nameOrID",
  "tokens": ["token_id","token_id"]
}
```
#### Response: 
  
```
201: Created
202: Accepted
```
`Created` means the transfer is complete.
`Accepted` means it awaits an accept or fulfill request from the target.

#### Response body, a transfer object:
```
200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    |or|
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
}
```
#### Errors
```
404: Not Found
404: Could not find entity by wallet name:<wallet_name>
404: can not found token by id:<token_id>
```
> Fix the wallet names and/or token IDs in the request body.
```
403: Forbidden
403: Do not have enough tokens to send
```
> Decrease the value of `bundle_size` in the request body.
```
403: Forbidden
403: The token <token_id> can not be transfer for some reason, 
     for example, it's been pending for another transfer
```
> Change the list of token IDs in the request body. 
Or replace the list with `bundle: { bundle_size: n }`.
If you own the token, you can learn what has happened by posting a
request to [get transactions by token ID](#get-transactions-by-token-id). 
When a transfer request asks you to send tokens, 
respond by posting a request to [fulfill the transfer](#fulfill-transfer), 
not by posting a new transfer.
```
403: Forbidden
403: The token <token_id> do not belongs to sender wallet
```
> Fix the list of token IDs in the request body. 
Or write `bundle: { bundle_size: n }`. 
You can get a list of the tokens you own with a request to 
[get tokens by wallet](#get-tokens-by-wallet).
```
422: Unprocessable Entity
422:"tokens[n]" contains a duplicate value
```
> Do not list the same token twice in the request body.
```
422: Unprocessable Entity
422: "bundle.bundle_size" must be a number
422: "bundle.bundle_size" must be greater than or equal to 1
```
> For the value of `bundle_size`, provide a positive integer,
with or without quotes.

[^ back to top ^](#treetracker-wallet-api-reference)

## Accept Transfer

A destination wallet completes a pending transfer by accepting in-coming tokens.
```
POST /wallet/transfers/<transfer_id>/accept
```
> <transfer_id>: Replace with a transfer ID.

#### Response, a transfer object:
```
200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    |or|
    bundle: { bundle_size: integer }
  }
  state: completed
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}
```
#### Errors:
```
403: Forbidden
403: Current account has no permission to accept this transfer
```
> Only the target destination can accept a transfer. The originating wallet is not allowed to.
```
403: Forbidden
403: The transfer state is not pending
```
> *cause:* The transfer state is `requested`.
The transfer asks the target wallet to *send* tokens, not receive them.
The target source can either fulfill or decline. It cannot accept.

[^ back to top ^](#treetracker-wallet-api-reference)

## Fulfill Transfer

A source wallet completes a requested transfer by sending out-going tokens to their destination.
```
POST /wallet/transfers/<transfer_id>/fulfill
```
> <transfer_id>: Replace with a transfer ID.

#### Request body:
```
{"implicit":true}
```
> `implicit` sends the tokens requested, whether the transfer specifies
 a bundle size or literal token IDs. When a transfer specifies a bundle size, the fulfill request may 
 instead specify literal token IDs with a message body like this:
```
{ tokens: [ token_id, token_id, token_id ] }
```
#### Response, a transfer object:
```
200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    |or|
    bundle: { bundle_size: integer }
  }
  state: completed
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}
```
#### Errors:
```
404: Not Found
<!DOCTYPE html><html lang="en">Error ... Cannot POST /transfers/<transfer_id>/fullfill
```
> In the path, spell *fulfill* with 3 ells, not 4.
```
403: Forbidden
403: Current account has no permission to fulfill this transfer
```
> *cause:* The target destination can either accept or decline. It cannot fulfill.
The transfer asks the target wallet to *receive* tokens, not send them.
The transfer state is `pending`, not `requested`. 
```
403: Forbidden
403: Operation forbidden, the transfer state is wrong
```
> *cause:* The transfer has already been completed, declined, or cancelled
```
422: Unprocessable Entity
422: "implicit" is required
```
> Add the missing message body, probably: `{"implicit":"true"}`
```
422: Unprocessable Entity
422: "implicit" is not allowed
```
> In the message body, do not write *both* literal token IDs 
and the implicit property. Use one or the other, most likely `implicit:true`
```
403: Forbidden
403: No need to specify tokens
```
> In the message body, write `implicit:true`, not a list of token IDs. The transfer request already specifies token IDs. The API does not allow them to be specified again.
```
404: Not Found
404: can not found token by id:<token_id>
```
> In the message body, revise the list of token IDs, or write `implicit:true`.
```
403: Forbidden
403: Too few tokens to transfer, please provide n tokens for this transfer
403: Too many tokens to transfer, please provide n tokens for this transfer
```
> You provided fewer or more token IDs than the transfer requested in the `bundle_size` property. In the message body, write `implicit:true`. Or provide an array with the correct number of valid token IDs.
```
500 Internal Server Error
500: Unknown error (... invalid input syntax for type uuid: "$tokenid")
```
> You probably wrote a bad token ID. In the message body, write `implicit:true`. 
Or provide an array of valid token IDs.

## Decline Transfer

The target wallet of a transfer--whether its the source or destination--refuses to complete the transfer.
```
POST /wallet/transfers/<transfer_id>/decline
```
> <transfer_id>: Replace with a transfer ID.

#### Response, a transfer object:
```
200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    |or|
    bundle: { bundle_size: integer }
  }
  state: cancelled
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}
```
#### Errors:
```
403: Forbidden
403: The transfer state is not pending and requested
```
> *cause:* The transfer has already been either completed, deleted, or declined.
```
403: Forbidden
403: Current account has no permission to decline this transfer
```
> *cause:* Only the target wallet can decline a transfer. 
The originating wallet can only `DELETE`.
```
404: Not Found
404: Can not found transfer by id:<transfer_id>
```
> *fix:* Fix the transfer ID in the path.

[^ back to top ^](#treetracker-wallet-api-reference)

## Delete Transfer

The originator cancels a transfer before target accepts or fulfills it.
```
DELETE /wallet/transfers/<transfer_id>
```
> <transfer_id>: Replace with a transfer ID.

#### Response, a transfer object:
```
200: OK
{
  id: transfer_id
  type: send, deduct, or managed
  parameters: {
    tokens: [token_id,token_id,token_id]
    |or|
    bundle: { bundle_size: integer }
  }
  state: cancelled
  created_at: date
  closed_at: date
  active:true
  claim:false
  originating_wallet: walletNameOrID
  source_wallet: walletNameOrID
  destination_wallet: walletNameOrID
}
```
#### Errors:
```
403 Forbidden
403:The transfer state is not pending and requested
```
> *cause:* The transfer has already been either completed, deleted, or declined.
```
403: Forbidden
403: Current account has no permission to cancel this transfer
```
> *cause:* Only the originating wallet can delete a transfer. 
The target wallet can accept, fulfill, or decline.
```
404: Not Found
404: Can not found transfer by id:<transfer_id>
```
> *fix:* Fix the transfer ID in the path.

[^ back to top ^](#treetracker-wallet-api-reference)

## Trust Relationships Explained

A *trust relationship* allows one wallet to move tokens
to or from another without getting permission for each individual transfer.
It can let Alice transfer tokens to Bob, for example, without Bob posting his acceptance.

#### Who Trusts Who?

GET [`/wallet/trust_relationships`](#get-trusts) lists the trust 
relationships that your wallets are party to.

#### Request and Accept Trust

To create a trust relationship, the `originating` wallet posts a message 
that specifies the other party to the relationship, called the `requestee`. Then the
requestee either accepts or declines the arrangement.

Once accepted, a trust remains in effect indefinitely, until either party cancels it.

#### Trust Relationship Roles

`Originator, requester, actor`: These three terms mean the same 
thing and have the same value. A trust relaionship begins with the origin's
request to create it.

`Requestee, target`: These two terms mean the same thing and
have the same value. A trust takes effect when the requestee accepts it.

#### Decline or Delete a Trust

The originator can cancel a trust at any time--before or after acceptance--with a `DELETE` request.

The requestee can refuse at any time--before or after acceptance--with a `decline` request.

#### Trust Request Types

Four kinds of trust request allow tokens to move to or from either party, under the control of either party, as follows:

`send`: The originating wallet can transfer its tokens to the requestee's wallet.

`manage`: The originating wallet can transfer its tokens to the requestee's wallet.
The originating wallet can also transfer the requestee's tokens to itself.

`receive`: The requestee's wallet can transfer its tokens to the originating wallet.

`yield`: The requestee wallet can transfer its tokens to the originating wallet.
The requestee wallet can also transfer the originator's tokens to itself.
```
Origin gets to transfer this way:
send:         origin's token ---> requestee's wallet
deduct:      origin's wallet <--- requestee's token
manage:      both send and deduct
         Requestee gets to transfer this way:
receive:    origin's wallet <--- requestee's token
release:     origin's token ---> requestee's wallet
yield:      both receive and release
```
[^ back to top ^](#treetracker-wallet-api-reference)

## Get Trusts

Get a list of requested, established, and/or cancelled trust relationships related to the currently authorized wallet and any wallets it manages.
```
GET /wallet/trust_relationships?limit=n&start=n&state=string&request_type=string&type=string
```
> limit: Required integer. The maximum number of trust objects to return.

> start: Optional integer, defaults to 1, the beginning. Of the trust objects on the server, the one to start the list. But the precise order of trust records is unpredictable.

> state: Optional string:

- `trusted`: Active trust relationship

- `requested`: Trust relationship awaiting acceptance by the requestee.

- `cancelled_by_originator`: Trust relationship cancelled by the wallet that posted the initial request to create the trust.

- `cancelled_by_target`: Trust relationship was cancelled by the requestee.

> request_type: Optional string

- `send`: The originating wallet can transfer its tokens to the requestee's wallet.

- `manage`: The originating wallet can transfer its tokens to the requestee's wallet.
The originating wallet can also transfer the requestee's tokens to itself.

- `receive`: The requestee's wallet can transfer its tokens to the originating wallet.

- `yield`: The requestee wallet can transfer its tokens to the originating wallet.
The requestee wallet can also transfer the originator's tokens to itself.

> type: Optional string

- `send`: One wallet can give tokens to the other.

- `manage`: One wallet can both give and take tokens to and from the other.

#### Response, an array of trust relationship objects:
```
200: OK
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
] }
```
#### Errors:
```
500: Internal Server Error
500: Unknown error (...invalid input value for...trust_state_type: "<value>")
500: Unknown error (...invalid input value for...trust_request_type: "<value>")
500: Unknown error (...invalid input value for...trust_type: "<value>")
```
> *fix:* In the request path, provide a value for `state`, `request_type`, or `type` from the list above.
```
422: Unprocessable Entity
422: "limit" is required
422: "limit" must be a number
422: "start" must be a number
422: "start" must be greater than or equal to 1
```
> *fix:* The path must include `?limit=n` or `?limit=n&start=n`, where `n` is an integer

[^ back to top ^](#treetracker-wallet-api-reference)

## Post Trust Request

Request a new trust relationship from another wallet.
```
POST /wallet/trust_relationships
```
#### Request body:
```
{
  "trust_request_type": "string",
  "requestee_wallet": "nameOrID"
}
```
> trust_request_type:

- `send`: The originating wallet can transfer its tokens to the requestee's wallet.

- `manage`: The originating wallet can transfer its tokens to the requestee's wallet.
The originating wallet can also transfer the requestee's tokens to itself.

- `receive`: The requestee's wallet can transfer its tokens to the originating wallet.

- `yield`: The requestee wallet can transfer its tokens to the originating wallet.
The requestee wallet can also transfer the originator's tokens to itself.

#### Response, a trust relationship object:
```
200: OK
{
  id: uuid
  type: string
  request_type: string
  state: requested
  created_at: date
  updated_at: date
  orginating_wallet: <currently logged-in wallet>
  actor_wallet: string
  target_wallet: string
}
```
#### Errors:
```
403: Forbidden
403: The trust relationship has been requested or trusted
```
> *fix:* Trust relationship requests cannot be duplicated. 
Use [`GET /wallet/trust_relationships`](#get-trusts) to get the ID of
the existing trust relationship (the state is `requested` or `trusted`) 
that matches your request. Then the requestee can accept or decline it. 
Or you can DELETE it.
```
422: Unprocessable Entity
422 "trust_request_type" must be one of [send, receive, manage, yield, deduct, release]
```
> *fix:* Revise the message body to use a valid request type.
```
500: Internal Server Error
500: Unknown error (Class constructor HttpError cannot be invoked without 'new')
```
> *fix:* Request types `deduct` and `release` are not yet implemented. 
Use `manage` or `yield`.
```
404: Not Found
404: Could not find entity by wallet name: <wallet_name>
```
> *fix:* In the message body, fix the value of `requestee_wallet`.

[^ back to top ^](#treetracker-wallet-api-reference)

## Accept Trust

With the accept message, the requestee allows a trust to take effect.
The accept message will re-instate a trust relationship that was previously declined or DELETEd
```
POST /wallet/trust_relationships/<trust_relationship_id>/accept
```
> <trust_relationship_id>: Replace with a trust relationship ID.

#### Response, a trust relationship object:
```
200: OK
{
  id: uuid
  type: string
  request_type: string
  state: trusted
  created_at: date
  updated_at: date
  orginating_wallet: string
  actor_wallet: string
  target_wallet: <currently logged-in wallet>
}
```
#### Errors:
```
403: Forbidden
403: Have no permission to accept this relationship.
```
> *fix:* Check the `trust_relationship_id` in your request. You may have provided the wrong one.
Or you are not this trust's requestee. Only the requestee can accept a trust request.

[^ back to top ^](#treetracker-wallet-api-reference)

## Decline Trust

With the decline message, the requestee cancels a previously accepted trust relationship, or refuses to 
let a new one take effect.
```
POST /wallet/trust_relationships/<trust_relationship_id>/decline
```
> <trust_relationship_id>: Replace with a trust relationship ID.

#### Response, a trust relationship object:
```
200: OK
{
  id: uuid
  type: string
  request_type: string
  state: cancelled_by_target
  created_at: date
  updated_at: date
  orginating_wallet: string
  actor_wallet: string
  target_wallet: <currently logged-in wallet>
}
```
#### Errors:
```
403: Forbidden
403: Have no permission to decline this relationship.
```
> *fix:* Check the `trust_relationship_id` in your request. You may have provided the wrong one.
Or you are not this trust's requestee. Only the requestee can decline a trust request.

[^ back to top ^](#treetracker-wallet-api-reference)

## Delete Trust

With the DELETE message, the originator of a trust relationship cancels it,
regardless of whether the requestee has already accepted it.
```
DELETE /wallet/trust_relationships/<trust_relationship_id>
```
> <trust_relationship_id>: Replace with a trust relationship ID.

#### Response, a trust relationship object:
```
200: OK
{
  id: uuid
  type: string
  request_type: string
  state: cancelled_by_originator
  created_at: date
  updated_at: date
  orginating_wallet: <currently logged-in wallet>
  actor_wallet: string
  target_wallet: string
}
```
#### Errors:
```
404: Not Found
404: Can not found wallet_trust by id:<trust_relationship_id>
500: Internal Server Error
500: Unknown error (...invalid input syntax for type uuid: "<trust_relationship_id>")
```
> *fix:* In your request path, provide the correct trust ID.
```
403: Forbidden
403: Have no permission to cancel this relationship
```
> *fix:* Check the `trust_relationship_id` in your request. You may have provided the wrong one.
Or you are not this trust's originator. Only the originator can DELETE a trust request.

[^ back to top ^](#treetracker-wallet-api-reference)

-- end --