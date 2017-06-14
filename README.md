# CloudFlow
A workflow visualization tool for OpenStack Mistral (https://github.com/openstack/mistral)

## Limitations

### OpenStack Pike only
This branch support OpenStack Pike *only*.

### Non-secured Mistral
Currently there is no support for authorization (like password, keystone, etc.). Make sure your Mistral doesn't require authentication to perform REST API requests.  

## Development
* Clone this repo
* `yarn install` (preferred) or `npm install`
* Edit `proxy.conf.json` to point your Mistral instance.

## Building
* Clone this repo
* `yarn install` (preferred) or `npm install`
* `ng build`

## Installing on Mistral machine
TBD