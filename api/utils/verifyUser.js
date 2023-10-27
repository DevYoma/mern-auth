import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    // we need cookie parser 👆

    // checking if token is valid
    // if(!token) return res.status(401).json("You need to Login");
    if (!token) return next(errorHandler(401, "You are not authenticated"))

    // verifying the token available
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // if (err) return res.status(403).json("Token is not valid");
        if(err) return next(errorHandler(403, "Token is not valid"))

        req.user = user;
        next();
    })
}