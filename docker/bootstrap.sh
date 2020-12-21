#!/bin/bash
sed -i -e 's/\r$//' /usr/share/nginx/html/assets/config.sh
/usr/share/nginx/html/assets/config.sh

exec "$@"