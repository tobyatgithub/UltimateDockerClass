# UltimateDockerClass

Code_with_mosh_course

## Section 1, Getting Started (install)

Check out docker official documents.

## Section 2, Introduction

1.  Benefit of using Docker:

    - Allowing users to run multiple projects with different dependencies on one machine.
    - It allows your program to run anywhere (insid e a docker container)
    - It saves your teammates time and they won't need to spend days on configuring their local development environment.
    - Docker isloate your environment out so that you will never worry about messing some parts of your local machine. (for example, mess your python on your mac.)
    - **In short, docker helps you consistently build, run and ship application.**

2.  Container vs. Virtual Machine.  
    Container == An isolated environment for running an application  
    Virtual Machine == An abstraction of a machine (physical hardware). For example, you can run a windows VM and a linux VM on a Mac at the same time via a "Hypervisor".

        VM:
        - Each VM needs a full-blown OS, so its slow to start
        - Resource intensive, each VM will occupy one of your hardware resources (cpu, memory, disk)

        Containers:
        - Allow running multiple apps in isolation
        - Are lightweight (share OS of the host)
        - Start quickly, and need less hardware resoureces (such as cpu core)

3.  More about Container:  
    It's a client process that uses Rest API to talk with the Docker engine (server).  
    All containers share the kernel of the host. And windows, linux, and mac have different kernels. That's why you can only run linux container on a linux machine.

    > kernel = manages applications and hardware resources

4.  What is a Docker Image?

- A cut-down OS
- A runtime environment
- Application files
- Third-party libraries
- Environment variables
  > Docker image is a receipt based on which we will build a docker container.

---

## Section 3 The Linux

Example, enter a docker container version of ubuntu interactively:

```bash
docker run -it <image_name>
docker run -it ubuntu
```

Later, if we wish to enter the image we created and interact with it:

```bash
docker ps # need to check that the image is running.

docker exec -it <image id> bash
```

Inside the deocker, we can add, modify, and delete users.

```bash
useradd -m <name>  # create user with home
cat /etc/passwd # show user info

usermod -s /bin/bash <name>  # let this user use shell instead of default bash

cat /etc/shadow # show passwords

userdel <name> # to delete a user
```

Now we have added user, how do we log into the docker container as that user?

```bash
docker exec -it -u <name> <image id> bash

# for example
docker exec -it -u john 1ba bash
```

You can also add groups:

```bash
groupadd <group name>
cat /etc/group # check groups in this image

usermod -G <group name> <username> # add secondary group to this user
grep john /etc/passwd # example to check group status of john
groups john # show the groups info of john.
```

Lastly, different groups will have different file permissions:

```bash
ls -l # to check the permissions of files in current directory

drwxr--r-- # d == directory, first rwx = permission of creator, second = permission of creator's group, third = everyone else

chmod u+x <file name> # assign execute permission to the current user
chmod u-x <file name> # remove execute permission to the current user

chmod o+x <file name> # assign execute permission to the everyone else
chmod og+x+w-r *.sh # og = everyone else + creator's group.
```

---

## Section 3 Building Images

To build a docker image, you will need a `Dockerfile` in a local directory to serve as a receipt for the container.
After that, call this line to execute the build

```bash
docker build -t <container name> . # use the current path docker file to build image.
docker image ls # display all the images on current machine

docker run -it <container name> # to enter into a container in interactive mode
docker run -it <container name> bash # enter interactive with bash
```

For example, here in our react-app-docker-tutorial image, after you enter it interactively, it will be running js code, where you can define `const x = 1` and `console.log(x)`.

Now if you want to copy from you local file to the docker container, here are two ways:

```docker
COPY package.json /app/ # copy package.json to docker /app/

WORKDIR /app
COPY . . # copy everything here to docker workdir
COPY ["hello world.txt", "."]  # copy hello world.txt to docker workdir
```

`ADD` is another command that's similar to `COPY`. However, `ADD` allows you to add/copy things from url, or zip file (and it will be automatically unzipped.) Which are the two major reason why you would use `ADD` instead of `COPY` (otherwise stick with `COPY`)

### Exclude package to make image size smaller!

In this react-app example, much space is occupied by the node modules. And it will get worse when we use more and more librarys in the future. This will make our docker image huge and slow to upload and share.  
However, we don't have to it this way, all these package info are actually available in the package.json file. We don't have to include them, they can redownload it when a new container starts running.

```docker
RUN npm install
# and add node_modules/ into a .dockerignore file
```

Now, we want to expose our webapp from the container to the browser users. Usually we will specify in the `Dockerfile` the `EXPORT`, but that variable itself doesn't finish the job. It's more like a documentation.

```docker
EXPORT 3000 # this container will listen to port 3000
```

And before we continue, we shall create `groups` and `users` for file permission purposes.

```docker
RUN addgroup app && adduser -S -G app app # create group, and add user into it
USER app # set user for this container
```

### Use of `CMD`

As soon as we have the container ready, we can start it and hold website via it. Here are two ways:

```bash
#METHOD ONE
docker run <image name> npm start
docker run react-app npm start # example
```

METHOD TWO == start the container interactively and run.

### `CMD` vs. `RUN`

`RUN` is executed during the container construction.
`CMD` is a run-time instruction, only executed after the container is built.

### Shell form vs. Exec form for CMD

Shell form == `CMD npm start`  
Exec form == `CMD ["npm", "start"]`

Shell is run from `/bin/sh` (or `cmd` on windows.) The usual best practice is to use Exec form for cleaner and quicker execution (no need to start another shell). Exec form also makes it easier for clean up.

### `ENTRYPOINT` vs. `CMD`

Similar but `ENTRYPOINT` is slightly harder to override than `CMD`.

```bash
# To over ride a CMD:
docker run react-app <override message>
docker run react-app echo hello

# To override an ENTRYPOINT
docker run react-app --entrypoint echo hello
```

-> So... use `ENTRYPOINT` if you for sure this is the command we want to execute when spinning up this docker container.

### Speading Up Builds! (CACHE!)

Each line in the `Dockerfile` == a `layer`. And an image is created by several `layers`  
And we shall organize the `Dockerfile` in a way such that Stable instructions are on the top, and the Changing instructions are at the bottom.  
The Docker will then automatically figure out how to cache the layers and make it fast!

### Removing/Cleaning up Images:

Run this to see all the images you have

```bash
docker images
```

Very often, you will see a lot of losse images (the ones with no TAG and no REPOSITORY). Those are the layers with no relationship with TAG images.  
An easy way to clean them is this:

```bash
docker image prune
# OR you can remove it by specifing
docker image rm <REPOSITORY>
docker image rm <IMAGE ID>
```

And similarly for containers:

```bash
docker ps -a # to see all the containers
docker container prune # to remove all the unnecessary ones
```

### Tagging your Images correctly

-> "latest"  
It is fine to use "latest" in development, but it won't be a good idea for production. Using it in production can confuse you about which version you are really running (esp during upgrade and roll-back.)
So, always use an explicit tag:

```bash
# tag it in build
docker build -t <REPOSITORY NAME>:<tag> .
docker build -t react-app:1 . # for example

# or tag it after build
docker image tag <REPO NAME>:<current Tag> <REPO NAME>:<new Tag>
docker image tag react-app:latest react-app:10 # example

# untag
docker image remove <REPOSITORY NAME>:<tag to remove>
```

### Share Your Image Via Docker Hub

1. Create a repository on your hub.docker.com
2. Update your tag

```bash
docker image tag <IMAGE ID> <hub repo name>/<REPO NAME>:<tag>
# for example
docker image tag 5228 tobyatlarge/react-app:1
```

3. Login and push to hub

```bash
docker login
docker push tobyatlarge/react-app:1
```

If in the future you want to update and repush:
update the file -> update the tag -> docker push

### Saving and Loading

Another way to share your image without docker hub is by zip:

```bash
# 1. save the image into a tar file
docker image save -o react-app.tar  react-app:3

# 2. to load:
docker image load -i react-app.tar
```

---

## Section 5, Working With Container

> Menu:
>
> - Starting and stopping containers
> - Publishing ports
> - Viewing logs
> - Executing commands in containers
> - Removing containers
> - Persisting data using volumes
> - Sharing source codee
> - Copying Files between the Host and Containers

### Start and stopping contains

In short, to start == `docker run` OR `docker start`, and to stop == `docker stop`  
But there is a difference between `docker run` and `docker start`:  
In `docker run`, we start a new container.  
In `docker start`, we start a stopped container.

```bash
# first, we can check what container process is running:
docker ps

# to start a container process (by default looking for :latest)
docker run <IMAGE NAME>
# or run it in the background -d = detached
docker run -d <IMAGE NAME>
# and you can add a name to it
docker run -d --name <name> <IMAGE NAME>
# for example
docker run -d --name blue_sky react-app:1
# OR
docker start <IMAGE NAME>
docker start test1


# to stop a running container
docker stop <container name>
```

### Publising Ports

When you call `docker ps`, you will see the `PORTS` attribute of each container, and that is the port of that inside the container. To access it from outside of the container, you will need to map it:

```bash
# port mapping:
docker run -d -p <local port>:<container port> <REPO NAME>

# for example
docker run -d -p 80:3000 --name test1 react-app:1
```

### Viewing logs

However, what we shall do to see what's going on with our running container?

```bash
docker logs <container ID>

# and check help for more info such as -f, -n, and -t
docker logs --help
```

### Executing commands in containers

```bash
docker exec <container name> <command>

# for example
docker exec test1 ls

# or open an interactive shell of a running container
docker exec -it <container name> sh
```

### Removing containers

```bash
docker rm <name>
# for example, can also do -f
docker rm test1

# OR equivalently
docker container rm <name>

# using piping to search
docker ps -a | grep test1
```

### Persisting data using volumes

By default, each container has their own private data storage (even they are built from the same image.)

```bash
# To create volume:
docker volume create <volume name>
# You can check the info of the volume:
docker volume inspect <volume name>

# to mount the volume to a container:
docker run -d -p <local port>:<container port> -v <volume name>:<container data path> <image name>
# for example
docker run -d -p 80:3000 -v app-data:/app/data react-app:2

# then, you can check it via interactive shell
docker exec -it <container id> sh
```

Note that if `<volume name>` or `<container data path>` doesn't exist, docker will create it for you. However, if the `<container data path>` doesn't exist, docker will create under root user, which will prevent other users from reading or writing to it. (So we shall create the data path in the `Dockerfile` to avoid this situation.)  
Another interesting part of this docker volume is that... even you created something in a container on this volume, the file will remain there as far as the volume is there (i.e. if you remove the related docker image and docker container, the file will still be there on the volume!)

### Copying Files between the Host and Containers

You can also copying files inside and out:

```bash
docker cp <path1> <path2>

docker cp <container id>:<full path> <host path>
# for example
docker cp e1c9043ea8ce:/app/data.txt .


```

### Sharing source code

In production, we always want to build a new image for a new update or release.  
However, during development, if we made a minor change on the source code outside of the container, the container won't be updated.  
What shall we do? Re-build the image or manually copy paste are both too time consuming!  
A good **Solution** here is **binding**!

```bash
# here we bind the current directory with the app/data in the container
docker run -d -p 5001:3000 -v $(pwd):/app react-app
```

> It seems that `<container id>`, `<container name>`, and `<image name>:<tag>` are interchangable identifiers for containers.

---

## Section 6, Running Multi-container Applications

Here's a cool trick for cleaning up the workspace (a.k.a. remove all containers and images)

```bash
# remove all the containers q = show hash id, a = all
docker container -f rm $(docker container ls -aq)

# remove all the images, q = show hash id
docker image rm $(docker image ls -q)
```

(or you can do this from the mac docker GUI -> debug button)

Now, in order to run multiple containers at the same time, the easiest way is to use `docker-compose`.

Example: `docker-compose.yml`  
Notice that the `yml` file is whitespace sensitive.

```yml
version: "3.8"

services:
  web:
    # this is the folder for this container that folder
    # shall include everything a docker container will need
    build: ./frontend
    ports:
      # <container>:<local>
      - 3000:3000
    volumes:
      - ./frontend:/app
  # and we can define test for web or api here as well,
  # just notice that it might be a little bit slow.
  web-test:
    # here we don't want to rebuild an image, we want to re-use one
    image: vidly_web
    # and yes we still want quick mount
    volumes:
      - ./frontend:/app
    # this is the line for test
    command: npm test
  api:
    build: ./backend
    ports:
      - 3001:3001
    environment: # set env environment
      DB_URL: mongodb://db/vidly
    volumes: # easy volume mount
      - ./backend:/app
    # you can also overwrite the CMD
    # command: ./wait-for db:27017 && migrate-mongo up && npm start
    # equivalently
    command: ./docker-entrypoint.sh
  db: # the name here can bu changed,
    # but it will be used as the reference to it
    # for example in the DB_URL
    image: mongo:4.0-xenial
    ports:
      # mongo db default port == 27017
      - 27017:27017
    volumes:
      - vidly:/data/db

volumes:
  vidly:
```

After that, in the same directory, run these commands to build, inspect, and tear down.

```bash
# build it
docker-compose build

# start the build
docker-compose up

# and you can combine, -d = detached
docker-compose up --build -d
# show all the docker-compose running
docker-compose ps
# and to turn everything down
docker-compose down

# show logs of our containres
docker-compose logs
# show logs of one container, -f = follow
docker logs <container id> -f
```

### Other things you may want to do:

1. To make the change in your source code quickly being reflected on the `docker-compose`:  
   Run `>$ npm install` in the `/backend` and `/frontend` folders.

2. To make the database show correctly (a.k.a. migrate the database) via `npm run db:up` <- this is an alias defined in our `package.json file`, OR run `migrate-mongo up`.

