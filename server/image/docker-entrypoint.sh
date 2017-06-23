#!/bin/bash
# do not uncomment this - it will spoil the $? handling
#set -e

#ansi colors
#http://www.csc.uvic.ca/~sae/seng265/fall04/tips/s265s047-tips/bash-using-colors.html
blue='\e[0;34m'
red='\e[0;31m'
green='\e[0;32m' # '\e[1;32m' is too bright for white bg.
endColor='\e[0m'

#
# a colored message 
#   params:
#     1: l_color - the color of the message
#     2: l_msg - the message to display
#
color_msg() {
  local l_color="$1"
	local l_msg="$2"
	echo -e "${l_color}$l_msg${endColor}"
}

#
# error
#
#   show an error message and exit
#
#   params:
#     1: l_msg - the message to display
error() {
  local l_msg="$1"
	# use ansi red for error
  color_msg $red "Error: $l_msg" 1>&2
  exit 1
}

install_server(){
    color_msg $blue "Installing server"
    mkdir -p /opt/wedding-site

    mv /tmp/views /opt/wedding-site/
    mv /tmp/package.json /opt/wedding-site/
    mv /tmp/Server /opt/wedding-site/

    cd /opt/wedding-site
    color_msg $blue "Installing node dependencies..."
    npm install 1> /dev/null
    color_msg $green "Done!"
}

start_server(){
    color_msg $blue "Starting server"
    cd /opt/wedding-site

    npm start
    color_msg $green "Done!"
}

#
# Start of Docker Entrypoint
#
# start of script
# check arguments
option=""
installed=""
# get the hostname
#hostname=`hostname`
hostname=$IMAGEHOSTNAME

while test $# -gt 0
do
  case $1 in
    # -h|--help|usage|show this usage
    -h|--help) 
      usage;;
      
    -npm|--npm) 
      npm=true;;
      
    *) 
      params="$params $1"
  esac
  shift
done

# install server
install_server "$option"

# start server
start_server "$option"

exec $params
