#!/bin/bash

# Typical Usage: 
#    find ../images -name *.jpg | xargs addImagesToDb.sh
#
#
i=0
for arg in $*
do
   i=$((i+1))
   filename=$(cd $(dirname "$arg"); pwd)/$(basename "$arg")
   echo "adding $i : $filename"
   curldata="{\"origin\":\"$filename\"}"
   cmd="curl -X PUT http://127.0.0.1:5984/rop_images/$i -d $curldata"
   echo $cmd
   res=$($cmd) 
done
