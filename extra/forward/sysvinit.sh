#! /bin/sh
### BEGIN INIT INFO
# Provides:          forward
# Required-Start:    $local_fs $remote_fs $network $syslog
# Required-Stop:     $local_fs $remote_fs $network $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Forward HTTP to HTTPS
# Description:       Forward HTTP to HTTPS
### END INIT INFO

PATH=/sbin:/usr/sbin:/bin:/usr/bin
LOGFILE=
SVC_DIR=
SVC_BIN="forward.sh"
USER=
GROUP=
DESC="HTTP to HTTPS forward"
NAME=
PIDFILE=/var/run/$NAME.pid

set -e

. /lib/lsb/init-functions

start()
{
  echo "Starting $DESC... "
  
  start-stop-daemon --start --chuid "$USER:$GROUP" --background --make-pidfile --pidfile $PIDFILE --exec $SVC_DIR/$SVC_BIN -- $LOGFILE || true
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
  status_of_proc -p $PIDFILE "" "forward" && exit 0 || exit $?
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

