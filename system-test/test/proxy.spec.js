const chai = require('chai');
const chaiHttp = require('chai-http');
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

    describe('#GET sessionTest', function () {
        it('should propagate session to the registration component and send it back in the payload', function (done) {
            requester
                .get('/sessionTest')
                .then((_) => {
                    return requester.get('/sessionTest2');
                })
                .then((res) => {
                    expect(res.statusCode).to.be.eq(200);
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
