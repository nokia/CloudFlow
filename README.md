# CloudFlow
A workflow visualization tool for OpenStack Mistral (https://github.com/openstack/mistral)

## Live Demo
http://rawgit.com/nokia/CloudFlow/master/docs/index.html

## Features
* Visualize the flow of workflow executions
* Identify the execution path of a single task in huge workflows
* Easily distinguish between simple task (an action) and a sub workflow execution
* Follow tasks with a `retry` and/or `with-items`
* 1-click to copy task's input/output/publish/params values
* See complete workflow definition and per task definition YAML
* And more...

## Limitations

### OpenStack Pike only
This branch supports OpenStack **Pike** only, as we rely on [new runtime_context](https://docs.openstack.org/developer/mistral/developer/webapi/v2.html#tasks) added to Mistral Pike.

### Authentication-less
Currently there is no support for authentication (like password, KeyStone, etc.).

Make sure your Mistral does not require authentication to perform REST API requests, by setting the following in `/etc/mistral/mistral.conf`:

```
[pecan]
auth_enable=False
```

Authentication features will be added in future releases.

    
## Installing on Mistral machine
CloudFlow has no dedicated backend service and passes the API calls to Mistral via Proxy settings.

In the [`scripts`](scripts/) folder there are 2 configuration files: one for when using **ngnix** and one for **apache**.

To run CloudFlow on your Mistral instance:
* Head over to [releases](https://github.com/nokia/CloudFlow/releases) tab and download the latest release. Untar into a known location (i.e. `/opt`) so you'll have a `/opt/CloudFlow/` folder.
  * There will be 2 folders in there: `dist` which holds the UI application, and `scripts` for the various web servers option.
* Copy the appropriate configuration file to the configuration directory on your Mistral machine:
   * nginx usually: `/etc/nginx/conf.d/http/servers/`
   * apache2 usually: `/etc/apache2/sites-enabled/`. Note that for apache2 several modules need to be enabled. See file for more info.
* Optionally update the path in the configuration file(s) to point to the `dist` folder (i.e. `/opt/CloudFlow/dist`)
* Optionally update the port for which CloudFlow will be served in the browser (currently: 8000)
* Restart nginx/apache.
* Open the browser and navigate to `http://<your_mistral_ip>:8000`.
* Whenever there is an update to CloudFlow, simply download the latest version and untar in the same place.

A Dockerfile will be provided in future release.

## Development
* Clone this repo
* `yarn install` (preferred) or `npm install`
* Edit [`proxy.conf.json`](proxy.conf.json) to point your Mistral instance.
* `npm run start`

## Building
* Clone this repo
* `yarn install` (preferred) or `npm install`
* `npm run build`
* The artifacts will be stored in `dist` folder.


![CloudFlow](docs/main.png "CloudFlow in action")