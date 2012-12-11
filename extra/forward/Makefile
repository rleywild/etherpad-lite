NODE_PKGS=express
install:
	npm install $(NODE_PKGS)

USER=etherpad
SERVICE=forward
FWD_DIR=/home/$(USER)/epl-live/extra/forward
# sysvinit file
SYSV_SRC=sysvinit.sh
SYSV_DIR=/etc/init.d
SYSV_FILE=$(SERVICE)-$(SYSV_SRC)
# log file
LOG_DIR=/var/log/$(SERVICE)
LOG_FILE=$(SERVICE).log
# must run as root:
sysvinit:
# log dir
	mkdir $(LOG_DIR)
	chown $(USER) $(LOG_DIR)
	chgrp $(USER) $(LOG_DIR)
# sysvinit file
	cat $(SYSV_SRC) | sed \
	-e 's|\(LOGFILE=\)|\1"$(LOG_DIR)/$(LOG_FILE)"|' \
	-e 's|\(SVC_DIR=\)|\1"$(FWD_DIR)"|' \
	-e 's|\(USER=\)|\1"$(USER)"|' \
	-e 's|\(GROUP=\)|\1"$(USER)"|' \
	-e 's|\(NAME=\)|\1"$(SERVICE)"|' \
	> $(SYSV_DIR)/$(SYSV_FILE)
	chmod +x $(SYSV_DIR)/$(SYSV_FILE)
# start
# http://manpages.ubuntu.com/manpages/hardy/man8/update-rc.d.8.html
	update-rc.d $(SYSV_FILE) defaults
	sh $(SYSV_DIR)/$(SYSV_FILE) start
