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

* Grunt with compass, jshint and that does foreman start/npm start
* convert PHP features
* add Angular. implement routing with Angular for admin/client pages
* show id
* send messages
* set stocks
* add Google analytics
# use sails.js?
