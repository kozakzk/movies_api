import express from 'express'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const router = express.Router()


router.get("/list-users", async (req, res)=> {

    try {
        const user = await prisma.user.findMany(req.body)
        res.status(200).json({message: "Users listed"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Server error"})
    }

})

export default router