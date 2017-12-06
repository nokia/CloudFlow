# CloudFlow
A workflow visualization tool for OpenStack Mistral (https://github.com/openstack/mistral)

## Live Demo
http://rawgit.com/nokia/CloudFlow/master/docs/index.html

## Features
* Visualize the flow of workflow executions
* Identify the execution path of a single task in huge workflows
* Easily distinguish between simple task (an action) and a sub workflow
  execution
* Follow tasks with a `retry` and/or `with-items`
* 1-click to copy task's input/output/publish/params values
* See complete workflow definition and per task definition YAML
* And more...

## Table of Contents
* [Requirements](#requirements)
* [Installation](#installing-cloudflow-on-the-mistral-machine)
* [Authentication](#authentication)
* [Development and Building](#development)

## Requirements

### Mistral >= Pike
CloudFlow requires Mistral **Pike** or greater, as we rely on
new [runtime_context](https://docs.openstack.org/developer/mistral/developer/webapi/v2.html#tasks)
added to Mistral Pike.

    
## Installing CloudFlow on the Mistral machine
CloudFlow has no dedicated backend service and passes the API calls to Mistral
via Proxy settings.

In the [`scripts`](scripts/) folder there are 2 configuration files: one for
when using **ngnix** and one for **apache**.

To run CloudFlow on your Mistral instance:
1. Go to [releases](https://github.com/nokia/CloudFlow/releases) tab and
   download the latest release. Extract into a known location (i.e. `/opt`) so
   you'll have a `/opt/CloudFlow/` folder.
   * There will be 2 folders in there: `dist` which holds the UI application,
     and `scripts` for the various web servers options.
2. Copy the appropriate configuration file to the configuration directory on
   your Mistral machine:
   * nginx: usually: `/etc/nginx/conf.d/http/servers/`
   * Apache2:
      * Linux: `/etc/apache2/sites-enabled/`.
      * Mac: `/etc/apache2/other/`. Also make sure that the environment
        variable APACHE_LOG_DIR is set to the proper value. On Mac computers
        it's usually `/var/log/apache2`.
      * Note that for apache2 several modules need to be enabled. See
           file for more info.
3. Optionally update the path in the configuration file(s) to point to the
  `dist` folder (i.e. `/opt/CloudFlow/dist`)
4. Optionally update the port for which CloudFlow will be served in the browser
  (currently: 8000)
5. Optionally enable HTTPS in the configuration file.
6. Restart nginx/apache.
7. Open the browser and navigate to `http[s]://<your_mistral_ip>:8000`.
8. Whenever there is an update to CloudFlow, simply download the latest version
  and extract it in the same place.

A Dockerfile will be provided in future release.

## Authentication
### OpenID Connect
CloudFlow supports the [OpenID Connect](http://openid.net/connect/) protocol
(and was tested against [KeyCloak](http://www.keycloak.org/)).

If your Mistral requires authentication and uses the OpenID Connect protocol,
create the following `auth.json` file under the `assets/` folder (i.e. `assets/auth.json`):

```json
{
  "_type": "openid-connect",
  "issuer": "<Url of the Identity Provider>",
  "loginUrl": "<Url for login endpoint>",
  "clientId": "<Client Identifier valid at the Authorization Server>"
}
```

You can obtain all the URLs by examining the output of `https://<openid-server-ip>:<port>/auth/realms/<realm>/.well-known/openid-configuration`

### No Authentication 
If you want to work w/o authentication, make sure your Mistral does not require authentication to perform REST API
requests, by setting the following in `/etc/mistral/mistral.conf`:

```
[pecan]
auth_enable=False
```

Also, make sure there is **no** `auth.json` file under the `assets/` directory.

## Development
* Clone this repo
* `yarn install` (preferred) or `npm install`
* Edit [`proxy.conf.json`](proxy.conf.json) to point your Mistral instance.
* Edit the `auth.json` file (if needed)
* `npm run start`

## Building
* Clone this repo
* `yarn install` (preferred) or `npm install`
* `npm run build`
* The artifacts will be stored in `dist` folder.


![CloudFlow](docs/main.png "CloudFlow in action")