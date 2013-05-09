# Ember.js & Grunt Template

This repo is my quick start Ember.js template.

Clone and make something people want.


## Update Vendor Dependencies

``` sh
script/update_vendor
```

## API Proxy

Our client code has  been seperated from our server code.  Therefore we
need a way to access our api as if it were in production durring
development.

To do this we use grunt-connect-proxy which routes all incoming
requests to /api to our backend server.

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
