// login users 
import express = require('express')
import { Request, Response } from 'express'
import bcrypt = require('bcryptjs')
import User from './user'
import config from '../config/config'
import jwt = require('jsonwebtoken')
const router = express.Router()

router
.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({
                error: 'User with this email does not exist'
            })
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({
                error: 'Incorrect password'
            })
            return;
        }
        jwt.sign(user, config.privateKey, { expiresIn: config.jwt.expiration }, (err, token) => {
            if (err) {
                console.log("Error 1: ", err)
                res.status(500).json({
                    error: err
                })
                return;
            }
            else res.status(200).json({
                token
            })
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
    
})

export default router
