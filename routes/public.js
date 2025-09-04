import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = express.Router()
const jwt_secret = process.env.jwt_secret


router.post('/signup', async (request, response) => {
    try {
        const user = request.body

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password, salt)

        const userDB = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: hashPassword
            }
        })
        
        
        const { password, ...userWithoutPassword } = userDB
        response.status(201).json(userWithoutPassword)
    } catch (err) {
        console.error(err)
        response.status(500).json({ message: 'Server error, try again' })
    }
})


router.post('/login', async (request, response) => {
    try {
        const userInfo = request.body
        
        const user = await prisma.user.findUnique({ 
            where: { email: userInfo.email } 
        })

        if(!user){
            return response.status(404).json({message:"User not found"})
        }
        
        const isMatch = await bcrypt.compare(userInfo.password, user.password)
        if(!isMatch){
            return response.status(400).json({message:"Wrong password"})
        }
        
        const token = jwt.sign({id: user.id}, jwt_secret, {expiresIn:"1h"})
        
        
        const { password, ...userWithoutPassword } = user
        response.status(200).json({
            user: userWithoutPassword,
            token: token
        })

    } catch (err) {
        console.error(err)
        response.status(500).json({ message: 'Server error' })
    }
})

export default router;