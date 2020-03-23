Scripts and co is based on the steps described [here](https://gist.github.com/Soarez/9688998)

This folder should eventually hold the CA and component certificates necessary to establish
two-way ssl between the components.

Storing certificates inside VCS is a bad practices, so I created these little scripts that
helps generating the necessary certificates and co.

To simulate the PKI
- first we should create the CA key and certificate
- then we can create the keys for each component that will be signed with the previously created CA private key



	cd <local_checkout>/ssl 
	./create_ca_certificate.sh
	Generating RSA private key, 2048 bit long modulus
	.............+++
	......................+++
	e is 65537 (0x10001)
	writing RSA key
	./create_component_certificates.sh
	Generating RSA private key, 2048 bit long modulus
	..............+++
	..................+++
	e is 65537 (0x10001)
	writing RSA key
	Signature ok
	subject=/C=HU/ST=Budapest/L=Budapest/O=CyberSecurity/OU=Proxy/CN=proxy
	Getting CA Private Key
	Generating RSA private key, 2048 bit long modulus
	......................+++
	...........................+++
	e is 65537 (0x10001)
	writing RSA key
	Signature ok
	subject=/C=HU/ST=Budapest/L=Budapest/O=CyberSecurity/OU=Authentication/CN=auth
	Getting CA Private Key

| CA entity         | Country       | Location      | Organization      | Organization Unit     | Common Name   |
| :--------------:  | :-----------: | :-----------: | :---------------: | :-------------------: | :-----------: |
| CA                | HU            | Budapest      | CyberSecurity CA  | CyberSecurity CA      | N/A           |
| Proxy             | HU            | Budapest      | CyberSecurity     | Proxy                 | proxy         |
| Authentication    | HU            | Budapest      | CyberSecurity     | Authentication        | auth          |
