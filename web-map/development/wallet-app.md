# Wallet app

The wallet app for the wallet operations, by connecting to Wallet API

The wallet API documentation is here:

{% embed url="https://github.com/Greenstand/treetracker-wallet-api/blob/master/docs/api/spec/treetracker-wallet-api.yaml" %}

The GitHub project:

{% embed url="https://github.com/orgs/Greenstand/projects/67/views/1" %}

## Design & Plan

{% embed url="https://www.figma.com/file/HCoiw3jQvKt4vF3P1bZQMp/Wallet?node-id=0:1&t=t0ZZuShhzAoIf5pA-1" %}

## Stories

#### Login/Registration/user profile

For the first visit of a user, a login/register page shows up. Refer to [user profile in web map](user-profile.md)

#### Wallet creation

Users can create a new wallet, by providing a unique name of the wallet. On Greenstand, every wallet got a unique name.

#### Wallet info

A user can check his/her wallet info, including:

* Name
* Creation time
* Tokens in the wallet
* Token details:
  * ID
  * claim: boolean
  * created at
  * capture id
  * status: pending/normal
  * transaction detail:
    * transaction list
    * transaction details:
      * source wallet
      * destination wallet
      * processed at
      * claim: boolean

#### Request sending token

Users can send a set of tokens to a specified wallet.

First, user should choose a wallet, to do so, user can either:

* input the wallet name, there should be an auto-completion to suggest possible candidates, if the user inputs an unexisting name, then an error message shows up to warn the problem.
* input the email address of the user, the app should list the wallets belonging to that user who registered using the email.

Then, user can select tokens, either:

* Select tokens in the token list.
* Set the size of the bundle of token
* Select tokens on the map:
  * Select token one by one on the map, or
  * Draw a closure polygon on the map

Confirm the operation

#### Notification

After logging in, there should be a notification icon to indicate new messages.

By clicking the icon, goes to the notification center, and list all the things.

#### Receive tokens

User can check pending request that sends tokens to him/her.

User can check the details of the request:

* The originator of this request
* The date
* The token info

User can either:

* Accept the request
* Decline

#### Manage the requests

Users can check the requests owned by him/her.

For a sending request, before the destination user responds, the user who originated the request can cancel the request.

#### Token filter

Sometimes we need to filter token, for example, to send tokens, when we select tokens, we don't want to select token that is in `pending` status, because that kind of token can not be sent.

The possible criteria for the filter:

* Created time: range
* Status: pending/normal
* Claim: boolean

#### Invitation

User can send an invitation to others by email address.

The invitation receiver clicks the link in the email to jump to the register page.

Once he/she finished the registration, the invitation sender should receive a notification.

#### Managed wallet

The managed wallet, all known as a sub-wallet, a wallet can create/manage sub-wallet, and transfer tokens between them without any limitation, we could put this as the next stage of the feature for the wallet web app.

## UI/UX consideration

* The design should be responsive and can be used on both mobile and desktop devices.
* About the Login, and Registration part, we need to share the same pages with the web map client (and admin panel, possible) [check it here](user-profile.md)
* Because we have tech accumulation on Material-UI ([https://mui.com/](https://mui.com/)) so we hope the design can follow the principle of Material Design, ([https://m3.material.io/](https://m3.material.io/)) so we can get good productivity in development.

## Resources

A previous design for the wallet app [https://www.figma.com/file/YqfFmqTpo60j5g0OAcw9cx/Wallet-Web-App---Master-(Copy)?node-id=7%3A71\&t=ATGa0LHqr7Zorzqc-0](https://www.figma.com/file/YqfFmqTpo60j5g0OAcw9cx/Wallet-Web-App---Master-\(Copy\)?node-id=7%3A71\&t=ATGa0LHqr7Zorzqc-0), but we need to change the UX to align with our requirements and adapt to our current situation regarding integration with the web map client, and interaction with the map.

A wallet operation UI/UX design for the admin panel, there might be some common, similar operations with the wallet web app, [https://www.figma.com/file/kXhFReuUVcqQonIgl59On3/Wallet-admin-module-UX?node-id=615%3A492\&t=b902U7VjqgOnd1RR-4](https://www.figma.com/file/kXhFReuUVcqQonIgl59On3/Wallet-admin-module-UX?node-id=615%3A492\&t=b902U7VjqgOnd1RR-4)



