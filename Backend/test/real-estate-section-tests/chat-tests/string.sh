#!/bin/bash

str1="tests/setup-close.js" at the absolute path "/home/lucy/Documents/Projects/Websiten/WebDevProjektOfficial/Backend/luca/tests/setup-close.js"
str2="/home/lucy/Documents/Projects/Websiten/WebDevProjektOfficial/Backend/luca/tests/chat-tests/setup-close2.js"

len1=${#str1}
len2=${#str2}
maxlen=$(( len1 > len2 ? len1 : len2 ))

for ((i=0; i<maxlen; i++)); do
    if [[ "${str1:i:1}" != "${str2:i:1}" ]]; then
        echo "Unterschied an Position $i: '${str1:i:1}' vs. '${str2:i:1}'"
        exit 0
    fi
done

echo "Strings sind gleich"

