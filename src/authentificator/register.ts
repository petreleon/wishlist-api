// user register with email and password

import express = require('express')
import { Request, Response } from 'express'
import bcrypt = require('bcryptjs')
import User from './user'
const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    console.log(req.body)
    const { email, password, username, firstName, lastName} = req.body
    User.findOne({$or: [{ email }, { username }]}, (err, user) => {
        if (err) {
            console.log("Error 1: ", err)
            res.status(500).json({
                error: err
            })
        }
        if (!user) {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    console.log("Error 1: ", err)
                    res.status(500).json({
                        error: err
                    })
                }
                try {
                    const user = await User.create({
                        email,
                        password: hash,
                        username,
                        firstName,
                        lastName
                    })
                    res.status(201).json({
                        user
                    })
                } catch (err) {
                    console.log("Error 2: ", err)
                    res.status(500).json({
                        error: err
                    })
                }
            })
        } else {
            res.status(405).json({
                error: 'User with this email or username already exists'
            })
        }
    })
})

export default router


