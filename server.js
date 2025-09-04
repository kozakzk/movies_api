import express from 'express'
import { PrismaClient } from '@prisma/client'
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import movieRoutes from './routes/movies_routes.js'
import reviewRoutes from './routes/reviews.routes.js'

const app = express();
const prisma = new PrismaClient();

app.use(express.json())
app.use('/', publicRoutes)
app.use("/", privateRoutes)
app.use('/', movieRoutes)
app.use('/', reviewRoutes)  

app.listen(3000, () => { console.log("Listening in port 3000") })