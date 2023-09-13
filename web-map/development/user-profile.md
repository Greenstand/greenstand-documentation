# User profile

The pages and service let users register, log in, and edit their profile on the web map.

## Github project:

{% embed url="https://github.com/orgs/Greenstand/projects/66" %}

## Design:

{% embed url="https://www.figma.com/file/xlKOJwO1c49Hijcg3kGPQF/User-profile?node-id=0:1&t=nk3ijxE5ESpQAmxm-1" %}

On the web map, logged user can:

* Like capture, planter, org
* Set their profile: avatar, name

## Stories

#### Story for sign-up

* There is a sign-up button/link, by clicking it, the web map will bring the user to the signup page, and guide people to finish the registration.
  * The user can choose an email address + password to register.
  * The user can choose Gmail to register
  * The user can choose Facebook to register
  * The user can choose Github to register
* After registration, the web map will present the status of the user logged in.

#### Story for login

* There is a sign-in (login) button/link on the web map.
* By clicking it, a login page shows up, and the user can fill out the form to log in, or by clicking the social media options to log in.

#### Story for like things

* There should be a `like` button on capture, tree pages
* By clicking the button, the web map adds one count of like
* By clicking the button again,the web map reduces one count.

#### Story for profile modify

* Once the user logged in, there is a button/link, by clicking it, app jumps to the profile page
* The profile page presents the user's information.
* User can edit their information:
  * User first name
  * User last name
  * User avatar
  * User bio

#### Story : forgot password

* There is a button/link, by clicking it app jumps to forgot password page, and user can input their email address to reset their password.

## Some UI/UX principle

* We need to support both **mobile** and **desktop** devices.
* For the web apps, we are considering that we can reuse this user profile feature in multiple apps ( we are not sure about this, maybe there are some difficulties) :&#x20;
  * web map client: [https://beta-map.treetracker.org/](https://beta-map.treetracker.org/)
  * admin panel: [https://admin.treetracker.org/](https://admin.treetracker.org/)
  * wallet app: [https://www.figma.com/file/YqfFmqTpo60j5g0OAcw9cx/Wallet-Web-App---Master-(Copy)?node-id=0%3A1\&t=4y0mXFgFSUf9f6qs-0](https://www.figma.com/file/YqfFmqTpo60j5g0OAcw9cx/Wallet-Web-App---Master-\(Copy\)?node-id=0%3A1\&t=4y0mXFgFSUf9f6qs-0)

## Resources

* The original web map design file: [https://www.figma.com/file/T8l81aGsnYD0fyhjrlUiZ5/Greenstand-Webmap?node-id=2497%3A9322\&t=yjJ7vqWVW0IV3tMu-1](https://www.figma.com/file/T8l81aGsnYD0fyhjrlUiZ5/Greenstand-Webmap?node-id=2497%3A9322\&t=yjJ7vqWVW0IV3tMu-1)

The online version: [https://beta-map.treetracker.org/](https://beta-map.treetracker.org/)
