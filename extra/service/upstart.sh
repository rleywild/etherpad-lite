description "etherpad-lite"

start on started networking
stop on runlevel [!2345]

env EPHOME=/home/epl/etherpad-lite.git #aka EPHOME/EPLITE_DIR
env EPLOGS=/var/log/etherpad-lite #aka EPLOGS/LOGFILE
env EPUSER=epl #aka EPUSER/USER

respawn

pre-start script
    cd $EPHOME
    mkdir $EPLOGS                              ||true
    chown $EPUSER:admin $EPLOGS                ||true
    chmod 0755 $EPLOGS                         ||true
    chown -R $EPUSER:admin $EPHOME/var         ||true
    $EPHOME/bin/installDeps.sh >> $EPLOGS/error.log || { stop; exit 1; }
end script

script
  cd $EPHOME/
  exec su -s /bin/sh -c 'exec "$0" "$@"' $EPUSER -- node node_modules/ep_etherpad-lite/node/server.js \
                        >> $EPLOGS/access.log \
                        2>> $EPLOGS/error.log
end script
