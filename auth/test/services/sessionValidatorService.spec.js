'use strict';

const AUTHENTICATION_CONSTANTS = require('../../utils/authenticationConstants');

const sessionValidatorService = require('../../services/sessionValidatorService');
const sessionMock = require('../utils/sessionMock');

const chai = require('chai');
const expect = chai.expect;

describe('SessionValidatorService', function () {
    describe('#isSessionValid', function () {
        it('should be true if the preferred way is TOTP and totpDone is true', function () {
            const session = sessionMock.createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP,
                totpDone: true
            });
            const result = sessionValidatorService.isSessionValid(session);
            expect(result).to.be.true;
        });

        it('should be true if the preferred way is RSA and rsaDONE is true', function () {
            const session = sessionMock.createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_RSA,
                rsaDone: true
            });
            const result = sessionValidatorService.isSessionValid(session);
            expect(result).to.be.true;
        });

        it('should be true if the preferred way is MTA and rsaDONE is true and totpDone is true', function () {
            const session = sessionMock.createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_MFA,
                rsaDone: true,
                totpDone: true
            });
            const result = sessionValidatorService.isSessionValid(session);
            expect(result).to.be.true;
        });

        it('should be false in other cases', function () {
            let result = sessionValidatorService.isSessionValid(sessionMock.createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_MFA,
                rsaDone: true,
                totpDone: false
            }));

            expect(result).to.be.false;

            result = sessionValidatorService.isSessionValid(sessionMock.createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_MFA,
                rsaDone: false,
                totpDone: true
            }));

            expect(result).to.be.false;

            result = sessionValidatorService.isSessionValid(sessionMock.createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP,
                rsaDone: true
            }));

            expect(result).to.be.false;

            result = sessionValidatorService.isSessionValid(sessionMock.createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_RSA,
                totpDone: true
            }));

            expect(result).to.be.false;

            result = sessionValidatorService.isSessionValid(sessionMock.createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_MFA,
                rsaDone: true,
                totpDone: false
            }));

            expect(result).to.be.false;
        });
    });
});
