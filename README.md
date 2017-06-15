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
CloudFlow has no dedicated backend service and passes the API calls to Mistral via Proxy settings.

In the `scripts` folder there are 2 configuration files: one for when using **ngnix** and one for **apache**.

To run CloudFlow on your Mistral instance:
* Clone this repo into a permanent location (i.e.: `/opt/CloudFlow`). You're interested in the `dist` folder (Note: it will be provided in the near future. In the meanwhile you can clone and build the project manually).
* Copy the appropriate configuration file to the configuration directory
   * nginx usually `/etc/nginx/conf.d/http/servers/`
   * for devstack that uses apache2 use `/etc/apache2/sites-enabled/`. Note that for apache2 several modules need to be enable. See file for more info.
* Update the path `/opt/CloudFlow` in the configuration file(s) to point to the location where you cloned the project.
* Restart nginx/apache.
* Whenever there is an update to CloudFlow, simply `git pull`!

A Dockerfile will be provided in future release.

![CloudFlow](Demo/main.png)