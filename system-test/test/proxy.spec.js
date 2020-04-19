const chai = require('chai');
const chaiHttp = require('chai-http');
const { generateKeyPairSync } = require('crypto');
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

    describe('#post setPassword', function () {
        it('is not allowed to be called before the username check', function (done) {
            requester
                .post('/user/testuser/setPassword')
                .type('json')
                .send({
                    sessionId: '1',
                    password: 'password'
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
                    return requester.post('/user/testuser/setPassword')
                        .type('json')
                        .send({
                            sessionId: res.body.sessionId,
                            password: 'password'
                        })
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    done();
                });
        });
    });

    describe('#post confirmPassword', function () {
        it('is not allowed to be called before the setting the password', function (done) {
            requester
                .post('/user/testuser/setPassword')
                .type('json')
                .send({
                    sessionId: '1',
                    password: 'password'
                })
                .then((res) => {
                    expect(res.status).to.be.eq(400);
                    done();
                })
        });

        it('the confirmed password should match the previously set one', function (done) {
            var sessionId;
            requester
                .get('/user/testuser')
                .then((res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    return requester.post('/user/testuser/setPassword')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            password: 'password'
                        })
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    return requester.post('/user/testuser/confirmPassword')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            confirmPassword: 'password1'
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(400);
                    done();
            });
        });

        it('the confirmed password should match the previously set one to get HTTP OK', function (done) {
            var sessionId;
            requester
                .get('/user/testuser')
                .then((res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    return requester.post('/user/testuser/setPassword')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            password: 'password'
                        })
                }).then(res => {
                expect(res.status).to.be.eq(200);
                return requester.post('/user/testuser/confirmPassword')
                    .type('json')
                    .send({
                        sessionId: sessionId,
                        confirmPassword: 'password'
                    });
            }).then(res => {
                expect(res.status).to.be.eq(200);
                expect(res.body.status).to.be.eq('OK');
                done();
            });
        });
    });

    describe('#post finalize', function () {
        xit('the confirmed password should match the previously set one to get HTTP OK', function(done) {
            var sessionId;
            requester
                .get('/user/testuser')
                .then((res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    return requester.post('/user/testuser/setPassword')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            password: 'password'
                        })
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    return requester.post('/user/testuser/confirmPassword')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            confirmPassword: 'password'
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    return requester.post('/user/testuser/finalize')
                        .type('json')
                        .send({
                            sessionId: sessionId
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    done();
                });
        });

        it('can be called also after submitting a public key.', function (done) {
            let sessionId;
            const { publicKey, _ } = generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: rsaUtils.PUBLIC_KEY_ENCODING,
                privateKeyEncoding: rsaUtils.PRIVATE_KEY_ENCODING
            });

            requester
                .get('/user/testuser')
                .then((res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    return requester.post('/user/testuser/publicKey')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            publicKey: Buffer.from(publicKey).toString('base64')
                        })
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    return requester.post('/user/testuser/finalize')
                        .type('json')
                        .send({
                            sessionId: sessionId
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    done();
                });
        });

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

    describe('#GET auth', function () {
        it('should always return an authentication token', function (done) {
            requester
                .get('/auth')
                .then(function (res) {
                    expect(res.body.authorizationToken).to.be.eq('authToken');
                    done();
                });
        });
    });

    describe('#POST protected', function () {
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
