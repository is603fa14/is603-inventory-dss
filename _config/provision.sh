#!/bin/bash
sudo apt-get update
sudo apt-get install git -y
sudo apt-get install curl -y

LOCAL_BIN="/home/vagrant/.localbin"
if [ ! -h $LOCAL_BIN ]; then
  ln -s /vagrant/_config $LOCAL_BIN
fi 
sudo chmod -R +x $LOCAL_BIN

NVM_DIR="/home/vagrant/.nvm"
if [ ! -d $NVM_DIR ]; then
  HOME="/home/vagrant"
  curl https://raw.githubusercontent.com/creationix/nvm/v0.17.3/install.sh | bash
  source /home/vagrant/.nvm/nvm.sh
  nvm install 0.10.33
  sudo chown -R vagrant:vagrant /home/vagrant/.nvm
fi 

RUN_STARTUP="source /home/vagrant/.localbin/startup.sh"
if ! grep 'source /home/vagrant/.localbin/startup.sh' /home/vagrant/.bashrc ; then 
  echo $RUN_STARTUP >> /home/vagrant/.bashrc
fi 