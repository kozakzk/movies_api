import express from 'express'
import { PrismaClient } from '@prisma/client'
import auth from '../middlewares/auth.js';


const router = express.Router()
const prisma = new PrismaClient()


router.post('/movies/:movieId/reviews', auth, async (req, res) => {
  try {
    const { movieId } = req.params
    const { content, rating } = req.body
    const userId = req.userId

    
    const movie = await prisma.movies.findUnique({
      where: { id: movieId }
    })

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1-5' })
    }

    const review = await prisma.review.create({
      data: {
        content,
        rating,
        movieId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        movie: {
          select: {
            id: true,
            movie_name: true
          }
        }
      }
    })

    res.status(201).json(review)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
})


router.get('/movies/:movieId/reviews', async (req, res) => {
  try {
    const { movieId } = req.params

    const reviews = await prisma.review.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    })

    res.json(reviews)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})


router.get('/reviews/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        movie: {
          select: {
            id: true,
            movie_name: true
          }
        }
      }
    })

    if (!review) {
      return res.status(404).json({ error: 'Review not found' })
    }

    res.json(review)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})


router.put('/reviews/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params
    const { content, rating } = req.body
    const userId = req.userId

    
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' })
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({ error: 'Cant edit someone elses review' })
    }

    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1-5' })
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        content,
        rating
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        movie: {
          select: {
            id: true,
            movie_name: true
          }
        }
      }
    })

    res.json(updatedReview)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})


router.patch('/reviews/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params
    const userId = req.userId

    
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' })
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({ error: 'Cant edit someone elses review' })
    }

 
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1-5' })
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(req.body.content && { content: req.body.content }),
        ...(req.body.rating && { rating: req.body.rating })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        movie: {
          select: {
            id: true,
            movie_name: true
          }
        }
      }
    })

    res.json(updatedReview)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})


router.delete('/reviews/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params
    const userId = req.userId

  
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' })
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({ error: 'Cant delete someone elses review' })
    }

    await prisma.review.delete({
      where: { id: reviewId }
    })

    res.json({ message: 'Review sucessfully deleted' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router