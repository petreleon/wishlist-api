// login users 
import express = require('express')
import { Request, Response } from 'express'
import bcrypt = require('bcryptjs')
import User from './user'
import config from '../config/config'
import jwt = require('jsonwebtoken')
import verify from './verifier'
const router = express.Router()

router
.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body
    console.log(req.body)
    try {
        const user = await User.findOne({ email })
        console.log(user)
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
        jwt.sign(user.toJSON(), config.privateKey, { expiresIn: config.jwt.expiration }, (err, token) => {
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

router.get('/refresh', verify, (req: Request, res: Response) => {
    const user = req.body.user
    console.log(user)
    delete user.exp
    delete user.iat
    jwt.sign(user, config.privateKey, { expiresIn: config.jwt.expiration }, (err, token) => {
        if (err) {
            console.log("Error 1: ", err)
            res.status(500).json({
                error: err
            })
        }
        else res.status(200).json({
            token
        })
    })
})

export default router
