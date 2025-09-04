import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()


router.get('/movies', async (req, res) => {
  try {
    const movies = await prisma.movies.findMany()
    res.json(movies)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/movies', async (req, res) => {
  try {
    const movie = await prisma.movies.create({
      data: {
        movie_name: req.body.movie_name,
        director: req.body.director,
        release_yr: req.body.release_yr,
        genre: req.body.genre,
        description: req.body.description,
      },
    })
    res.status(201).json(movie)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.put('/movies/:id', async (req, res) => {
  try {
    const movie = await prisma.movies.update({
      where: { id: (req.params.id) },
      data: {
        movie_name: req.body.movie_name,
        director: req.body.director,
        release_yr: req.body.release_yr,
        genre: req.body.genre,
        description: req.body.description,
      },
    })
    res.status(200).json(movie)
  } catch (error) {
    res.status(404).json({ error: 'Movie not found' })
  }
})

router.patch('/movies/:id', async (req, res) => {
  try {
    const movie = await prisma.movies.update({
      where: { id: (req.params.id) },
      data: {
        ...(req.body.movie_name && { movie_name: req.body.movie_name }),
        ...(req.body.director && { director: req.body.director }),
        ...(req.body.release_yr && { release_yr: req.body.release_yr }),
        ...(req.body.genre && { genre: req.body.genre }),
        ...(req.body.description && { description: req.body.description }),
      },
    })
    res.status(200).json(movie)
  } catch (error) {
    res.status(404).json({ error: 'Movie not found or invalid update' })
  }
})


router.delete('/movies/:id', async (req, res) => {
  try {
    await prisma.movies.delete({
      where: { id: (req.params.id) },
    })
    res.status(200).json({ message: 'Movie deleted' })
  } catch (error) {
    res.status(404).json({ error: 'Movie not found' })
  }
})

export default router
