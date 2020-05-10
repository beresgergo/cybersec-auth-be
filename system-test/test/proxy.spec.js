const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const { createSign, constants } = require('crypto');
const { totp } = require('otplib');

const { TOTP_SECRET, RSA, AUTH_TYPE } = require('../utils/constants');

chai.use(chaiHttp);

// TODO figure out how to handle self signed certificates in tests
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

describe('Proxy', function () {
    const requester = chai.request('https://localhost:8080').keepOpen();

    const preferredAuthType = AUTH_TYPE.TOTP;

    describe('#registration workflow', function () {

        it('should work', function (done) {
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
                            totpSecret: TOTP_SECRET
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.status).to.be.eq('OK');
                    return requester.post('/user/testuser/publicKey')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            publicKey: Buffer.from(RSA.PUBLIC_KEY).toString('base64')
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

    describe('login with TOTP', function() {
        it('should work', function (done) {
            let sessionId;
            requester
                .get('/login/testuser')
                .then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.preferredAuthType).to.be.eq(preferredAuthType);
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    const token = totp.generate(TOTP_SECRET);
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
                    done();
                });
        });
    });

    describe('change preferred auth type to RSA', function() {
        it('should work', function (done) {
            let sessionId;
            requester
                .get('/login/testuser')
                .then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.preferredAuthType).to.be.eq(preferredAuthType);
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    const token = totp.generate(TOTP_SECRET);
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
                return requester.post('/management/preferredAuthType')
                    .type('json')
                    .send({
                        token: jwt,
                        preferredAuthType: AUTH_TYPE.RSA
                    });
            }).then(res => {
                expect(res.status).to.be.eq(200);
                expect(res.body.status).to.be.equal('OK');
                done();
            });
        });
    });

    describe('login with RSA signature', function() {
        it('should work', function (done) {
            let sessionId;
            requester
                .get('/login/testuser')
                .then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.preferredAuthType).to.be.eq(AUTH_TYPE.RSA);
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    return requester.post('/login/challenge')
                        .type('json')
                        .send({
                            sessionId: sessionId
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.challenge).not.to.be.null;
                    const challenge = res.body.challenge;
                    const sign = createSign(RSA.SIGNATURE_ALGORITHM);
                    sign.update(challenge);
                    const signedChallenge = sign.sign({
                        key: RSA.PRIVATE_KEY,
                        padding: constants.RSA_PKCS1_PSS_PADDING}, RSA.ENCODING);
                    console.log(Buffer.from(signedChallenge).toString('base64').length);
                    return requester.post('/login/signedChallenge')
                        .type('json')
                        .send({
                            sessionId: sessionId,
                            signedChallenge: Buffer.from(signedChallenge).toString('base64')
                        });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.message).to.be.equal('OK');
                    return requester.post('/login/retrieveToken')
                        .type('json')
                        .send({ sessionId: sessionId });
                }).then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.token).not.to.be.null;
                    done();
                });
        });
    });

    describe('delete the test user registration', function() {
        it('should work', function (done) {
            let sessionId;
            requester
                .get('/login/testuser')
                .then(res => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body.preferredAuthType).to.be.eq(AUTH_TYPE.RSA);
                    expect(res.body.sessionId).not.to.be.null;
                    sessionId = res.body.sessionId;
                    return requester.post('/login/challenge')
                        .type('json')
                        .send({
                            sessionId: sessionId
                        });
                }).then(res => {
                expect(res.status).to.be.eq(200);
                expect(res.body.challenge).not.to.be.null;
                const challenge = res.body.challenge;
                const sign = createSign(RSA.SIGNATURE_ALGORITHM);
                sign.update(challenge);
                const signedChallenge = sign.sign({
                    key: RSA.PRIVATE_KEY,
                    padding: constants.RSA_PKCS1_PSS_PADDING}, RSA.ENCODING);
                return requester.post('/login/signedChallenge')
                    .type('json')
                    .send({
                        sessionId: sessionId,
                        signedChallenge: Buffer.from(signedChallenge).toString('base64')
                    });
            }).then(res => {
                expect(res.status).to.be.eq(200);
                expect(res.body.message).to.be.equal('OK');
                return requester.post('/login/retrieveToken')
                    .type('json')
                    .send({ sessionId: sessionId });
            }).then(res => {
                expect(res.status).to.be.eq(200);
                expect(res.body.token).not.to.be.null;
                const jwt = res.body.token;
                return requester.delete('/management/user')
                    .type('json')
                    .send({
                        token: jwt
                    });
            }).then(res => {
                expect(res.status).to.be.eq(200);
                expect(res.body.status).to.be.equal('OK');
                done();
            });
        });
    });
});
