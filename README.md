# Mdworld Stox demo

Stox websockets demo, hosted on Heroku: [http://mdworld-stox.herokuapp.com/](http://mdworld-stox.herokuapp.com/)

Based on:
A tiny demo using the [einaros/ws](http://einaros.github.io/ws/) WebSockets implementation.

# Running Locally

``` bash
npm install
npm start
```
or instead of npm start, run

``` bash
foreman start
```

# Running on Heroku

``` bash
heroku create
git push heroku master
heroku open
```

# Useful commands

* heroku logs --tail
* heroku restart (restart _ALL_ apps)
* heroku ps:scale web=0 / heroku ps:scale web=1 (disable/enable app)
* heroku maintenance:on / heroku maintenance:off

* git commit . -m "comment" (commit changes)
* git push origin master (submit to github)

# TODO

* add Google analytics
* Stox: when updating in admin, then opening a client, the default values are shown instead of the values selected at admin. This is because the admin doesn't update the model but directly sends the values to the node server. This should be converted to the Angular approach.
* inheritance
* amount of clients via angular in title
* angular websockets, see AdminSocket
* feature: messaging (multiple messages)
* other features (mirror, icons behind connected clients, limit admin to 1 logged in?)
* when opening client first and then in another window admin, only admin shows under connected clients
* Grunt with compass, jshint and that does foreman start/npm start
* convert PHP features
* add Angular. implement routing with Angular for admin/client pages
* show id
* send messages
* set stocks
* use sails.js?
* add "kicking" of specific clients from Admin page
* restyle sliders on Admin page to look like barchart
* longpoll polyfill for browsers without websocket support (IE < 10, android stock)
* Multiplayer Pong!


# Changelog

* Admin should have diagonal background
* Stox (Initrode, CollaboSmart, Umbrella Co.)
* first features: -connected clients-, log, 
* feature: messaging (basic)
