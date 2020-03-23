'use strict'

const fs = require('fs');

module.exports.authBaseConfig = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt'),
    uri: 'https://auth:8000/auth',
    json: true
};

module.exports.getProtectedResourceConfig = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt'),
    uri: 'https://auth:8000/protected'
};
