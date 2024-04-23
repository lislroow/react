#!/bin/bash

BASE_DIR=$( cd $( dirname $0 ) && pwd -P )
IMAGE_NAME="admin"
DOCKER_USER="lislroow"
REGISTRY="docker.io"

echo "build $IMAGE_NAME"

#docker image prune -a
docker build -t $IMAGE_NAME .
docker tag $IMAGE_NAME:latest $DOCKER_USER/$IMAGE_NAME:latest
docker login
docker image tag $IMAGE_NAME $DOCKER_USER/$IMAGE_NAME
docker push $REGISTRY/$DOCKER_USER/$IMAGE_NAME:latest
