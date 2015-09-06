#!/bin/bash

./config.sh


echo "Récupération des données"
wget -q -O client/data.js http://www.danceornothing.com/ws/adh/getall?key=$apiKey
echo "Donnée OK"

cd servers

nodejs nfc.js &
echo "Lancement NFC deamon OK"

nodejs local.js &
echo "Lancement Serveur Local OK"

cd ..
