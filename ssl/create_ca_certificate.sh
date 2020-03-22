#!/bin/bash

# generate 2048 bit RSA private key for the CA
openssl genrsa -out cyberauth_ca.key 2048
# substract the public key out of private key
openssl rsa -in cyberauth_ca.key -pubout -out cyberauth_ca.pubkey
# create a self signed certificate to be used later
openssl req -new -x509 -key cyberauth_ca.key -out cyberauth_ca.crt -subj "/C=HU/ST=Budapest/L=Budapest/O=CyberSecurity CA/OU=CyberSecurity CA/"
