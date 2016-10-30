'use strict';

function CustomError(errorCode, errorMessage) {
    var err = new Error(errorMessage);
    err.status = errorCode;
    return err;
}

module.exports = CustomError;
