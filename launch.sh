#!/bin/bash

./getdata.sh

cd servers

nodejs nfc.js &
echo "Lancement NFC deamon OK"

nodejs local.js &
echo "Lancement Serveur Local OK"

cd ..
