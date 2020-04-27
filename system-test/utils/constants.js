'use strict';

module.exports.TOTP_SECRET = 'FZSSOZRABY3WYOBXAAVSY4B2EQYUS4BBGFNVCEQQAUVREISNAU3A';
module.exports.RSA = {
    PUBLIC_KEY: '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5/rLeb8rs4XYt6aui7i6\n' +
        'h4UqP3g+OZXvKWYfSrkURX7Dq2Qw2erlODSxvwCa/xlVqh2WRmBN8oV1V5KFKtBs\n' +
        '31owFKl/TvreKyNSq3IoHdQ1fMojtFvqTi6ryuIBbFO2xTJ+lx29oL7wf//ly5Ck\n' +
        'JnMGu8tSE3KudCVdRHqV0GdB+UrnK938oJIqZ9+xC2o65t4P4VwDcRPIXUnA9uvP\n' +
        'sW3vomp1E0EU7Hf2R5oq5uNF26BgBDziUyozv7v2GzcuB2rSagfLP4L9cK3dWFCR\n' +
        'ALSyaRE7ifoPUx6puk6ArqDQ+e90Q+3WsEhBgymKAlaeMGluKy9taCx6TnfESn06\n' +
        '5wIDAQAB\n' +
        '-----END PUBLIC KEY-----',
    PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\n' +
        'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDn+st5vyuzhdi3\n' +
        'pq6LuLqHhSo/eD45le8pZh9KuRRFfsOrZDDZ6uU4NLG/AJr/GVWqHZZGYE3yhXVX\n' +
        'koUq0GzfWjAUqX9O+t4rI1Krcigd1DV8yiO0W+pOLqvK4gFsU7bFMn6XHb2gvvB/\n' +
        '/+XLkKQmcwa7y1ITcq50JV1EepXQZ0H5Sucr3fygkipn37ELajrm3g/hXANxE8hd\n' +
        'ScD268+xbe+ianUTQRTsd/ZHmirm40XboGAEPOJTKjO/u/YbNy4HatJqB8s/gv1w\n' +
        'rd1YUJEAtLJpETuJ+g9THqm6ToCuoND573RD7dawSEGDKYoCVp4waW4rL21oLHpO\n' +
        'd8RKfTrnAgMBAAECggEBAK8XCycMFHb+ajFLXGjW9+q7psSbBBRAx2+uxaWHhfZi\n' +
        'FFuzVm/ULEg89X+dfF9YhuDMThU2MP8Ani2HyH0lLVdzYeDmgdFh5fgXRBllI0RI\n' +
        'XEqg40wJKBL0hPOvm7Vghg3W69cxOmQuWaWyxoXb2RmwLf/mGT/Wijfdz8SU5aiS\n' +
        'Ju9UUlecPEEBDNxdKBSrm5VMmbivCMKzJSDrEikpOKermiBaRm7QgTfnMiiaA1Ee\n' +
        'wd5R+NXy0WmhI15PJd3HMi4ewf/XJjteDHALh++DFbF/tz5R3eLWdOa3afYUaxEe\n' +
        'Sffe6JtaXNlgvelI43GCe9VS6S9BixCaGqXc0Esv3eECgYEA/qDTW6N0PleMy9b/\n' +
        '4M/Z1GUdHnVqNTtg2ce255js800iGX0b09cm6iWDnZFNRjTVevMT6rExZGT0FOQO\n' +
        'FOzWl69dfWslkN7ZAL1Armk4uPj4mlkw/z6jA2pLhS6I86m8AZ0jKvf74Ra95YDy\n' +
        'o/RxhvNKQybXrbbx8fjIXdeMRlECgYEA6Tq7rOdvZpOvPyThLWqNjCcsXPGdjaH+\n' +
        'g5k7SVclhElnVZbw2RJKaWr1w6bnGWqY2ZCNdNKinxOUd7jh6sgoed9gzhdXfcjB\n' +
        'QbF/CdonST+4R/Rrg6Iaev4r7D7lCX6XRvmXgrIGQZNc+ZvsljoqWd9q7tOTnFf+\n' +
        'cfTgmggux7cCgYBIp4MnhsBIeZrHHxXsA+LX4/InGsGvZr3/5iiedNhHpB6yvywN\n' +
        'ijqkXQftEeTGv5SafHmWYfECAHxU6a3K8rlYlsVKYCRb7fplZ5rpKUTyIrhs8j40\n' +
        '1p6U/uOFoP2a6TeoDjpWrGPGmkKdFeomNj2ekBUEjDTGcIkgzif9/t8bwQKBgDit\n' +
        'MypDW4j73pxjo+zbdeZXJqq3dGgUs7rbI9MgwFczV08vTPwTO83+VhbjmklM5DQK\n' +
        'srVu8mHh6jRl01Cwr1VeeTHb7kD85inGrm6AeweL2oZx2Sa13+V/msDgT9xMzQpM\n' +
        'YQs7o9WPsApgX8/p9py8dEnxVG+r2oNq1KHZ1zRlAoGBAM2l52Tsnzy4NuUVRXtU\n' +
        'v1FFIdQeyhyIFUVFlQEaXyNAk2w/qL5RQtRalx5+r+YVccgydHI+x7lsItLTOJRC\n' +
        'qHDNrFj6O6px7+RxbIUeakJZVyYeWizBc73cRXC8z917+9D7X2676LpIk8AFJdUS\n' +
        'f9yijceS42N+1HnI2jX44QcD\n' +
        '-----END PRIVATE KEY-----',
    SIGNATURE_ALGORITHM: 'SHA256',
    ENCODING: 'base64'
};
module.exports.AUTH_TYPE = {
    RSA: 'RSA',
    TOTP: 'TOTP',
    MFA: 'MFA'
};
