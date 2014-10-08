#!/bin/bash

# Typical Usage: 
#    find ../images -name *.jpg | xargs addImagesToDb.sh
#
#
i=0
for arg in $*
do
   i=$((i+1))
   filename=$(cd $(dirname "$1"); pwd)/$(basename "$1")
   echo "adding $i : $filename"
   curldata="{\"origin\":\"$filename\"}"
   cmd="curl -vX PUT http://127.0.0.1:5984/rop_images/$i -d $curldata"
   echo $cmd
   $cmd 
done
