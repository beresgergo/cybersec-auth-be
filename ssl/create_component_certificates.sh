#!/bin/bash

create_key_and_certificate_for_component () {
# create RSA private key
openssl genrsa -out "$1.key" 2048
# subtract the public key
openssl rsa -in "$1.key" -pubout -out "$1.pubkey"
# create ceritifcate signing request
openssl req -new -key "$1.key" -out "$1.csr" -subj "/C=HU/ST=Budapest/L=Budapest/O=CyberSecurity/OU=$2/CN=$3"
# sign it with the CyberAuth CA certificate
openssl x509 -req -in "$1.csr" -CA cyberauth_ca.crt -CAkey cyberauth_ca.key -CAcreateserial -out "$1.crt"
}

create_key_and_certificate_for_component "cyberauth_proxy" "Proxy" "proxy"
create_key_and_certificate_for_component "cyberauth_auth" "Authentication" "auth"
create_key_and_certificate_for_component "cyberauth_registration" "Registration" "registration"
