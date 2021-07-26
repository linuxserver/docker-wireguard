#!/bin/bash

SERVER_CONFIG="/config/wg0.conf"

# TIMEOUT defines after which time a client is seen as disconnected
if [ -z "$TIMEOUT" ]; then
    TIMEOUT=600
fi

declare -A connected

while :
do
    while read -r line ; do
        interface=$(cut -d$'\t' -f1 <<<"$line")
        pub_key_hash=$(cut -d$'\t' -f2 <<<"$line")
        preshared_key=$(cut -d$'\t' -f3 <<<"$line")
        endpoint=$(cut -d$'\t' -f4 <<<"$line")
        allowed_ips=$(cut -d$'\t' -f5 <<<"$line")
        last_handshake=$(cut -d$'\t' -f6 <<<"$line")
        transfer_rx=$(cut -d$'\t' -f7 <<<"$line")
        transfer_tx=$(cut -d$'\t' -f8 <<<"$line")
        peer=$(grep -B 1 $pub_key_hash $SERVER_CONFIG | head -n 1 | sed 's/# //')

        diff=`expr $(date +%s) - $last_handshake`

        # if the last handshake is older than the TIMEOUT log the peer as disconnected
        if [ "$diff" -gt "$TIMEOUT" ] && [ "1" == "${connected[$pub_key_hash]}" ]
        then
            echo "time=$(date +%s), event=disconnect, interface=$interface, pub_key_hash=$pub_key_hash, preshared_key=$preshared_key, endpoint=$endpoint, allowed_ips=$allowed_ips last_handshake=$last_handshake, transfer_rx=$transfer_rx, transfer_tx=$transfer_tx, peer=$peer" >> /proc/1/fd/1 # redirect output to stdout of PID 1 (needed to send logs to docker log after docker daemon restart)
            connected[$pub_key_hash]=0 # set the peer as not connected
        fi

        # if the last handshake is younger than the TIMEOUT and the peer is not connected, log the peer as connected 
        if [ "$diff" -lt "$TIMEOUT" ] && ( [ "0" == "${connected[$pub_key_hash]}" ] ||  [ "" == "${connected[$pub_key_hash]}" ] )
        then
            echo "time=$last_handshake, event=connect, interface=$interface, pub_key_hash=$pub_key_hash, preshared_key=$preshared_key, endpoint=$endpoint, allowed_ips=$allowed_ips last_handshake=$last_handshake, transfer_rx=$transfer_rx, transfer_tx=$transfer_tx, peer=$peer" >> /proc/1/fd/1 # redirect output to stdout of PID 1 (needed to send logs to docker log after docker daemon restart)
            connected[$pub_key_hash]=1 # set the peer as connected
        fi
    done <<< $(wg show all dump | tail -n +2)
    sleep 10
done
