# Ember.js & Grunt Template

This repo is my quick start Ember.js template.

1. Clone.
``` sh
git clone git://github.com/nerdyworm/grunt-ember-template.git project
``` 

2. Install Grunt's dependencies
``` sh
npm install
```

3. Start the preview server
``` sh
grunt server
```

Make something people want.

## Update Vendor Dependencies

``` sh
script/update_vendor
```

## API Proxy

Our client code has  been separated from our server code.  Therefore we
need a way to access our api as if it were in production during
development.

To do this we use grunt-connect-proxy which routes all incoming
requests to /api to our back end server.

## Build

``` sh
grunt build
```

## Deploy

Deployment is a simple shell script.  All we do is build the project and
then rsync it to the server.

``` sh
script/deploy
```
