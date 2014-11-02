#!/bin/bash
LOCAL_MODULES="/home/vagrant/.projects/node_modules"
PROJ_MODULES="/vagrant/src/node_modules"

if [ ! -d $LOCAL_MODULES ]; then
  mkdir -p $LOCAL_MODULES
fi 

if [ ! -d $PROJ_MODULES ]; then
  mkdir -p $PROJ_MODULES
fi 

sudo mount --bind $LOCAL_MODULES $PROJ_MODULES

nvm use 0.10.33