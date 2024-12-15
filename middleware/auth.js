const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET;

const auth = ((req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        res.status(401).json({
            success: false,
            message: "Error! Token was not provided."
        });
    }

    const token = bearerToken.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Error! Token was not provided."
        });
    }

    const decodedToken = jwt.verify(token, secretKey);

    console.log('Token received:', token);
    console.log('Decoded Token:', decodedToken);

    req.user = {
        userId: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role
    };

    next();
});

module.exports = auth;