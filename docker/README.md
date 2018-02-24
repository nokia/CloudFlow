# Docker helper files

In order to get to development and local running of CloudFlow as fast as possible,
Docker can be used as a trampoline tool.

## Docker image for building

The `Dockerfile.for_build` creates a container image that can be used to start
developing CloudFlow locally.

Run the following command in the root directory of the project to build the image:

```bash
docker build -f docker/Dockerfile.for_build -t cloudflow_build .
```

Then use it:

```bash
# fire up the container
docker run -d --net host -v $PWD:/CloudFlow -w /CloudFlow --name cloudflow_builder --net host -u $(id -u):$(id -g) -t cloudflow_build cat

# run build commands
docker exec -it cloudflow_builder yarn install
docker exec -it cloudflow_builder npm run build

# or do it interactively
docker exec -it cloudflow_builder bash
```

## Docker image for running cloudflow

The `Dockerfile.for_run` creates a container image that can be used to run CloudFlow.
It can build the image for a released version listed in the Github project releases 
or it can run the locally built version.

The image is based on the [nginx docker image](https://hub.docker.com/_/nginx/).

The build can take three optional parameters:
* version - a version number from the Github releases page https://github.com/nokia/CloudFlow/releases
* url - URL to a release archive file
* source - set to '.' to use the locally built version

Examples for building:

```bash
# build a released version
docker build -f docker/Dockerfile.for_run -t cloudflow-v0.5.0-beta.2 --build-arg version=v0.5.0-beta.2

# build from an archive on a url
docker build -f docker/Dockerfile.for_run -t cloudflow-url --build-arg url=https://github.com/nokia/CloudFlow/releases/download/v0.5.0-beta.2/CloudFlow.tar.gz

# build for the local version
# make sure that npm run build was executed before
docker build -f docker/Dockerfile.for_run -t cloudflow-local --build-arg source=. .
```

Example for running:

```bash
docker run --net=host --name clf -d cloudflow-local
```

Then use http://localhost:8000 to access the GUI.
