const chai = require('chai');
const chaiHttp = require('chai-http');
const { generateKeyPairSync } = require('crypto');
const { authenticator } = require('otplib');
const rsaUtils = require('../utils/rsaUtils');
const expect = chai.expect;

chai.use(chaiHttp);

// TODO figure out how to handle self signed certificates in tests
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

describe('Sample', function () {
    it('true should always be equal to true', function (done) {
        expect(true).to.be.equal(true);
        done();
    });
});

const secret = authenticator.generateSecret(32);

describe('Proxy', function () {
    const requester = chai.request('https://localhost:8080').keepOpen();
    let testPrivateKey;

    describe('#GET checkUsername', function () {
        it('should check if the given username is already occupied', function (done) {
            requester
                .get('/user/testuser')
                .then((res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    expect(res.body.sessionId).not.to.be.null;
                    done();
                })
        });
    });

    describe('#post totpSecret', function () {
        it('is not allowed to be called before the username check', function (done) {
            requester
                .post('/user/testuser/totpSecret')
                .type('json')
                .send({
                    sessionId: '1',
                    totpSecret: secret
                })
                .then((res) => {
                    expect(res.status).to.be.eq(400);
                    done();
                })
        });

        it('can be called with a session Id retrieved from checkUser call', function (done) {
            requester
                .get('/user/testuser')
                .then((res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    expect(res.body.sessionId).not.to.be.null;
                    return requester.post('/user/testuser/totpSecret')
                        .type('json')
                        .send({
                            sessionId: res.body.sessionId,
                            totpSecret: secret
                        })
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    done();
                });
        });
    });

    describe('#post finalize', function () {

        it('can be called also after submitting a public key.', function (done) {
            let sessionId;
            const { publicKey, privateKey } = generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: rsaUtils.PUBLIC_KEY_ENCODING,
                privateKeyEncoding: rsaUtils.PRIVATE_KEY_ENCODING
            });
            testPrivateKey = privateKey;
            requester
                .get('/user/testuser')
                .then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    return requester.post('/user/testuser/totpSecret')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            totpSecret: secret
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    return requester.post('/user/testuser/publicKey')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            publicKey: Buffer.from(publicKey).toString('base64')
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    return requester.post('/user/testuser/finalize')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            preferredAuthType: 'MFA'
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    done();
                });
        });

    });

    describe("#LOGIN", function() {

    });

    describe('#GET ping', function () {
        it('should always return status OK', function (done) {
            requester
                .get('/ping')
                .then(function (res) {
                    expect(res.body.status).to.be.eq('OK');
                    done();
                });
        });
    });

    xdescribe('#POST protected', function () {
        it('is not allowed to be called without a valid token', function (done) {
            requester
                .post('/protected')
                .type('json')
                .send({
                    token: 'whatever'
                })
                .then(function (res) {
                    expect(res.status).to.be.eq(401);
                    done();
                });
        });

        it('should return the protected resource with a valid token.', function (done) {
            requester
                .post('/protected')
                .type('json')
                .send({
                    token: 'authToken'
                })
                .then(function (res) {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.secure).to.be.eq(true);
                    done();
                });
        });
    });
});
