class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
const handleError = (err, res) => {
    const { statusCode, message } = err;
    const status = statusCode || 500;
    res.status(status).json({
        status: 'error',
        statusCode: status,
        message,
    });
};

module.exports = {
    ErrorHandler,
    handleError,
};
