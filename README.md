# UltimateDockerClass
Code_with_mosh_course


### Section 1, Introduction
1. Benefit of using Docker:  
    - Allowing users to run multiple projects with different dependencies on one machine.  
    - It allows your program to run anywhere (insid e a docker container)  
    - It saves your teammates time and they won't need to spend days on configuring their local development environment.
    - Docker isloate your environment out so that you will never worry about messing some parts of your local machine. (for example, mess your python on your mac.)
    - **In short, docker helps you consistently build, run and ship application.**

2. Container vs. Virtual Machine.  
Container == An isolated environment for running an application  
Virtual Machine == An abstraction of a machine (physical hardware). For example, you can run a windows VM and a linux VM on a Mac at the same time via a "Hypervisor".

    VM:
    - Each VM needs a full-blown OS, so its slow to start
    - Resource intensive, each VM will occupy one of your hardware resources (cpu, memory, disk)

    Containers:  
    - Allow running multiple apps in isolation
    - Are lightweight (share OS of the host)
    - Start quickly, and need less hardware resoureces (such as cpu core)


3. More about Container:  
It's a client process that uses Rest API to talk with the Docker engine (server).  
All containers share the kernel of the host. And windows, linux, and mac have different kernels. That's why you can only run linux container on a linux machine.  
    > kernel = manages applications and hardware resources


4. What is a Docker Image?  
- A cut-down OS
- A runtime environment
- Application files
- Third-party libraries
- Environment variables  
> Docker image is a receipt based on which we will build a docker container.

----  
### Section 2 The Linux
Example, enter a docker container version of ubuntu interactively:
```
docker run -it <image_name>
docker run -it ubuntu
```

Later, if we wish to enter the image we created and interact with it:
```
docker ps # need to check that the image is running.

docker exec -it <image id> bash
```

Inside the deocker, we can add, modify, and delete users.
```
useradd -m <name>  # create user with home
cat /etc/passwd # show user info

usermod -s /bin/bash <name>  # let this user use shell instead of default bash

cat /etc/shadow # show passwords

userdel <name> # to delete a user
```

Now we have added user, how do we log into the docker container as that user?
```
docker exec -it -u <name> <image id> bash

# for example
docker exec -it -u john 1ba bash
```

You can also add groups:
```
groupadd <group name> 
cat /etc/group # check groups in this image

usermod -G <group name> <username> # add secondary group to this user
grep john /etc/passwd # example to check group status of john
groups john # show the groups info of john.
```

Lastly, different groups will have different file permissions:
```
ls -l # to check the permissions of files in current directory

drwxr--r-- # d == directory, first rwx = permission of creator, second = permission of creator's group, third = everyone else

chmod u+x <file name> # assign execute permission to the current user
chmod u-x <file name> # remove execute permission to the current user

chmod o+x <file name> # assign execute permission to the everyone else
chmod og+x+w-r *.sh # og = everyone else + creator's group.
```
### Section 3 Building Images
