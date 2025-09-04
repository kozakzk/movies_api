import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})


router.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
      },
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})


router.put('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
      },
    })
    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ error: 'User not found' })
  }
})


router.patch('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.password && { password: req.body.password }),
        ...(req.body.name && { name: req.body.name }),
      },
    })
    res.status(200).json(user)
  } catch (error) {
    res.status(404).json({ error: 'User not found or invalid update' })
  }
})


router.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    })
    res.status(200).json({ message: 'User deleted' })
  } catch (error) {
    res.status(404).json({ error: 'User not found' })
  }
})

export default router
