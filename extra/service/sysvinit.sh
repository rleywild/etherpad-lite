#!/bin/sh
# based on https://github.com/ether/etherpad-lite/wiki/How-to-deploy-Etherpad-Lite-as-a-service

### BEGIN INIT INFO
# Provides:          etherpad-lite
# Required-Start:    $local_fs $remote_fs $network $syslog
# Required-Stop:     $local_fs $remote_fs $network $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts etherpad lite
# Description:       starts etherpad lite using start-stop-daemon
### END INIT INFO

PATH="/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/opt/node/bin"
LOGFILE=
EPLITE_DIR=
EPLITE_BIN="bin/safeRun.sh"
USER=
GROUP=
DESC="Etherpad Lite"
NAME=
PIDFILE=/var/run/$NAME.pid

set -e

. /lib/lsb/init-functions

start() {
  echo "Starting $DESC... "
  
  start-stop-daemon --start --chuid "$USER:$GROUP" --background --make-pidfile --pidfile $PIDFILE --exec $EPLITE_DIR/$EPLITE_BIN -- $LOGFILE || true
  echo "done"
}

#We need this function to ensure the whole process tree will be killed
killtree() {
    local _pid=$1
    local _sig=${2-TERM}
    for _child in $(ps -o pid --no-headers --ppid ${_pid}); do
        killtree ${_child} ${_sig}
    done
    kill -${_sig} ${_pid}
}

stop() {
  echo "Stopping $DESC... "
   while test -d /proc/$(cat $PIDFILE); do
    killtree $(cat $PIDFILE) 15
    sleep 0.5
  done
  rm $PIDFILE
  echo "done"
}

status() {
  status_of_proc -p $PIDFILE "" "$DESC" && exit 0 || exit $?
}

case "$1" in
  start)
    start
      ;;
  stop)
    stop
      ;;
  restart)
    stop
      start
        ;;
  status)
    status
      ;;
  *)
    echo "Usage: $NAME {start|stop|restart|status}" >&2
      exit 1
        ;;
esac

exit 0