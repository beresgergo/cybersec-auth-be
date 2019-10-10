# Thesis work
This is the github repo where my thesis work is stored. The topic is **Assessment of authentication methods on mobile platforms**.
The project is heavily work in progress, initial focus is on architecture over business logic.

## Installation
### Application dependencies
The backend is running inside multiple Docker container, following the microservice architecture, orchestration is done with docker-compose. You only need these two components to start up the application.
- (Docker Desktop)[https://docs.docker.com/docker-for-mac/install/]
- (docker-compose)[https://docs.docker.com/compose/install/]

### System tests
Until the client is implemented, the backend functionality is verified with unit and system tests. In order to run the system tests, you should have the containers running (see below).
To launch the tests follow the steps below

	$ cd <local_checkout>/system-test
	$  npm install --only=dev
	npm WARN deprecated superagent@3.8.3: Please note that v5.0.1+ of superagent removes User-Agent header by default, therefore you may need to add it yourself (e.g. GitHub blocks requests without a User-Agent header).  This notice will go away with v5.0.2+ once it is released.
	npm notice created a lockfile as package-lock.json. You should commit this file.
	npm WARN test@1.0.0 No repository field.

	added 128 packages from 607 contributors and audited 223 packages in 3.196s
	found 0 vulnerabilities

	⋊> $ npm test
	> test@1.0.0 test /Users/gergob/git_projects/private/cybersec-auth-be-github/cybersec-auth-be/system-test
	> mocha

	  Sample
	    ✓ true should always be equal to true

	  Proxy
	    #GET ping
	      ✓ should always return status OK (46ms)
	    #GET auth
	      ✓ should always return an authentication token
	    #POST protected
	      ✓ is not allowed to be called without a valid token
	      ✓ should return the protected resource with a valid token.


	  5 passing (125ms)

## Usage
To start the docker containers execute the following commands in your console

	$ docker-compose build
	....
	$ docker-compose up
	Creating network "cybersec-auth-be_node_net" with driver "bridge"
	Creating cyber-auth-be-auth ... done
	Creating cyber-auth-be-proxy ... done
	Attaching to cyber-auth-be-auth, cyber-auth-be-proxy
	cyber-auth-be-auth |
	cyber-auth-be-auth | > cyber-auth-be-auth@1.0.0 start /usr/src/app
	cyber-auth-be-auth | > node express-auth.js
	cyber-auth-be-auth |
	cyber-auth-be-proxy |
	cyber-auth-be-proxy | > cyber-auth-be-proxy@1.0.0 start /usr/src/app
	cyber-auth-be-proxy | > node express-proxy.js
	cyber-auth-be-proxy |

## Components
### Entrypoint
This component is responsible for exposing REST endpoints of the servers and acts as an entrypoint. Other components are only allowed to be called by this component and each other.
This is achieved by implementing mutual SSL authentication. The CA and component certificates are also checked in. Generally this considered to be the BADEST practice, however
for demonstration purposes this should be fine. Additional responsibilites besides
Implementation in progress

### Authentication
Component is responsible for creating and validating JWT tokens which is necessary to reach the services provided by the **Protected** component.
Implementation in progress

### Protected
Component provides protected services, only accessible with valid JWT tokens.
To be implemented

### Registration
Components provides services for user management and enrollment.
To be implemented
