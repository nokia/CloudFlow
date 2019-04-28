# CloudFlow - Dev Guide
## Requirements
Since CloudFlow doesn't have any backend services, it must connect to a live Mistral instance.

#### Mistral Instance
Thankfully, Mistral can be easily spawned [as a docker container](https://github.com/openstack/mistral/blob/master/tools/docker/DOCKER_README.rst "as a docker container"), or you can use any Mistral instance you have. (Mistral version must be >= Stein).

|  Tip |
| :------------ |
| Make sure Mistral's REST API is reachable from outside the machine it is installed on.  |

#### Authentication Service
CloudFlow was designed to support the OpenId Connect protocol and tested against KeyCloak. This guide will only describe setting up KeyCloak for debugging purposes.

Note: other authentication methods (like KeyStone) are designed for future release and this doc should be adjusted.

```
---------------------------             --------------------
|  Mistral (0.0.0.0:8989)  |            | dev machine      |
|                          |    <-----> | proxy settings   |
|  (opt. auth service)     |            | (opt. auth.json) |
---------------------------             --------------------
```

## Proxy
As the deployed version, your development environment shall proxy all requests starting with `/api/*` to the relevant Mistral endpoint under `:8989/v2/*`.

## KeyCloak Configuration
(You can skip this step if your Mistral doesn't use any authentication).

## Dev Machine
1. `Node JS >= 8.9.0` is required
2. `Yarn >= 1.3.2` is preferred (although NPM >= 5 should also work)
3. Clone this repo and run `yarn` to install all dependencies.
4. Set up the proxy settings and the optional authentication.
5. `yarn start`
5. Browse to `https://<your_dev_machine_ip>:3000` and start exploring CloudFlow. (Note: you must use `https` and your machine IP as set in KeyCloak (and not 0.0.0.0 or localhost) or else the latter will not work.)

#### Proxy Settings
Edit the `proxy.conf.js` file to instruct the dev server to forward all requests starting with `/api` to the Mistral instance:
* You'll probably only need to change the `"host": <IP>` setting. `IP` should be the IP address the Mistral is bound to.
* Other options (port, protocol, pathRewrite) are the default options. If your Mistral is using any different configuration- make the adjustments here.

| Important  |
| :------------ |
| Don't commit your changes to the proxy.conf.js file  |


#### Optional 1: KeyCloak Configuration
Depending on your KeyCloak settings, it might block access/redirection to/from your dev machine.

To whitelist your machine in KeyCloak, do the following:
1. Open KeyCloak admin dashboard and login.
2. Go to Clients -> select the relevant client.
3. Make sure "Implicit Flow" is enabled.
4. Under `Valid Redirect URIs` Add `https://<your_dev_machine_ip>:3000/*`. (3000 is the port the UI is launched. If yours is different- adjust to your port.)
4. Under `Web Origins` Add `https://<your_dev_machine_ip>:3000`.
5. Save the changes.

#### Optional 2: auth.json
The auth.json file tells CloudFlow who is the authentication provider.

This section is fully covered in the [README](README.md "README") file.

|Remember   |
| :------------ |
| If you are not using any authentication, make sure to delete the auth.json file. |

|Important   |
| :------------ |
| Don't check in the auth.json file  |

