#!/bin/bash

openssl req -new -x509 -key cyberauth_ca.key -out cyberauth_ca.crt -subj "/C=HU/ST=Budapest/L=Budapest/O=CyberSecurity CA/OU=CyberSecurity CA/"
openssl x509 -req -in cyberauth_proxy.csr -CA cyberauth_ca.crt -CAkey cyberauth_ca.key -CAcreateserial -out cyberauth_proxy.crt
openssl x509 -req -in cyberauth_auth.csr -CA cyberauth_ca.crt -CAkey cyberauth_ca.key -CAcreateserial -out cyberauth_auth.crt
