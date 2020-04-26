const chai = require('chai');
const chaiHttp = require('chai-http');
const { generateKeyPairSync } = require('crypto');
const { authenticator, totp } = require('otplib');
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

const secret = 'FZSSOZRABY3WYOBXAAVSY4B2EQYUS4BBGFNVCEQQAUVREISNAU3A';
const { publicKey, _ } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: rsaUtils.PUBLIC_KEY_ENCODING,
    privateKeyEncoding: rsaUtils.PRIVATE_KEY_ENCODING
});
const preferredAuthType = 'RSA';

describe('Proxy', function () {
    const requester = chai.request('https://localhost:8080').keepOpen();

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
                            preferredAuthType: preferredAuthType
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    done();
                });
        });
    });

    describe("#startAuthentication", function() {
        it('be called as a first step to start the login procedure', function (done) {
            requester
                .get('/login/testuser')
                .then((res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.preferredAuthType).to.be.eq(preferredAuthType);
                    expect(res.body.sessionId).not.to.be.null;
                    done();
                })
        });
    });

    describe("#verifyTotpToken", function() {
        it('can be called second with the token', function (done) {
            let sessionId;
            requester
                .get('/login/testuser')
                .then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.preferredAuthType).to.be.eq(preferredAuthType);
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    const token = totp.generate(secret);
                    return requester.post('/login/otpToken')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            token: token
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.equal('OK');
                    return requester.post('/login/retrieveToken')
                        .type('json')
                        .send({ sessionId: sessionId });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.token).not.to.be.null;
                    const jwt = res.body.token;
                    return requester.post('/login/verifyToken')
                        .type('json')
                        .send({ token: jwt });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.equal('OK');
                    done();
            });
        });
    });
});
