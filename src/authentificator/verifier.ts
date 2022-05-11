import { Request, Response, NextFunction } from "express";
import jwt = require('jsonwebtoken')
import config from '../config/config';
import { UserType } from "./user";
function verify(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers['x-access-token'] || req.headers['authorization']) as string;
    if (token) {
        jwt.verify(token, config.privateKey, (err, decoded: UserType) => {
            if (err) {
                res.status(401).json({
                    error: 'Failed to authenticate token.'
                })
            } else {
                req.body.user = decoded;
                next()
            }
        })
    } else {
        res.status(401).json({
            error: 'No token provided.'
        })
    }
}

export default verify;