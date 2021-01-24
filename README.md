# Express demo project

Playground project to play with [Express](https://expressjs.com/) & [Google Cloud Run](https://cloud.google.com/run).

## 📓 Features

- Use GET & POST parameters
- Write to a file & read from a file
  - On first usage, the read operation will fail because the file does not exist. Just try again 😉
  - The error message is `Error: ENOENT: no such file or directory, open '/tmp/.express-demo-storage'`
- Run system commands
- Run Gulp tasks

## 💻 Local environment

### 🖱️ Local environment without Docker

- Clone the project & change to the project directory
- Install the dependencies
- Run the server
- Open http://localhost:8080/ in the browser

```bash
git clone git@github.com:aanton/express-demo.git
cd <project>

npm install

npm start # or ...
npm run dev # to start the server using Nodemon
```

### 🐋 Local environment with Docker

Docker must be installed locally 😉

- Clone the project & change to the project directory
- Check Docker is available
- Build a Docker image
- Start a contaniner using the created Docker image
  - Bind the port used in the container (8080) to a port available in your local machine (9090)
  - Configure the container to be removed when stopped (flag `--rm`)
- Open http://localhost:9090/ in the browser

```bash
git clone git@github.com:aanton/express-demo.git
cd <project>

docker --version

# docker build . -t <image-name>:<image-tag>
docker build . -t docker-express-demo:0.0.1

# docker run -p <local-port>:<container-port> --rm --name <container-name> -d <image-name>:<image-tag>
docker run -p 9090:8080 --rm --name playground -d docker-express-demo:0.0.1
```

- Stop the container
  - The container will be also removed if it is runned with the `--rm` flag
- 🗑️ Clean up the Docker images
  - List the images
  - Remove the created image & optionally the `node:12-slim` image used as the base image
  - Display docker disk usage

```bash
# docker stop <container-name>
docker stop playground

docker image list
# docker rmi <image-name>:<image-tag>
docker rmi docker-express-demo:0.0.1
docker rmi node:12-slim

docker system df -v
```

## ☁️ Cloud Run environment

Use the [Quickstart guide](https://cloud.google.com/run/docs/quickstarts/build-and-deploy#node.js) as a reference.

- Meet the requirements to use Google Cloud (see the Quickstart guide)
- Clone the project & change to the project directory
- Check the Google Cloud CLI
  - Get the Google Project identifier (required for the commands)
- Build the image using Cloud Build
  - Permissions may be required
  - Permissions can be given when building the image, but some of them must require using the Google Console (the Storage permission requires accessing the Storage in the Console)
- Deploy the image in Cloud Run
  - On first usage, set the region & allow anonymous access
  - Copy the service URL provided
- Open the service URL in the browser

```bash
git clone git@github.com:aanton/express-demo.git
cd <project>

gcloud --version
gcloud config get-value project

# gcloud builds submit --tag gcr.io/<project-id>/<image-name>
gcloud builds submit --tag gcr.io/<project-id>/express-demo

# gcloud run deploy <service-name> --image gcr.io/<project-id>/<image-name> --platform managed
gcloud run deploy express-demo --image gcr.io/<project-id>/express-demo --platform managed
```

- Check the service in the [Cloud Run Console](https://console.cloud.google.com/run)
- 🗑️ Clean up
  - Remove the Google project
