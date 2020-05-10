'use strict';

module.exports.JWT_INVALID = 'Token is not a valid JWT.';
module.exports.PREFERRED_AUTH_TYPE_INVALID = 'The requested authentiation type is not supported.';
module.exports.PUBKEY_INVALID_SIZE = 'Public key should belong to a 2048 bit size private key';
module.exports.PUBKEY_INVALID_ENCODING = 'Public key should be base64 encoded.';
module.exports.SESSION_INVALID = 'SessionId is not in valid format.';
module.exports.TOTP_SECRET_INVALID = 'Secret should be base32 encoded with 32 byte length';
module.exports.TOTP_TOKEN_INVALID = 'TOTP token should contain only numbers';
module.exports.TOTP_TOKEN_INVALID_LENGTH = 'TOTP token should contain 6 digits';
module.exports.USERNAME_INVALID_CHARACTERS = 'Username can only contain alphanumeric characters';
module.exports.USERNAME_INVALID_LENGTH = 'Name should be between 4 and 10 characters';

