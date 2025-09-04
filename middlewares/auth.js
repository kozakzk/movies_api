import jwt from 'jsonwebtoken'
import User from './schema.prisma' 

const jwt_secret = process.env.jwt_secret

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ message: 'Access denied: No token' })
        }

        const token = authHeader.replace('Bearer ', '')
        const decoded = jwt.verify(token, jwt_secret)

        
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: 'Access denied: User not found' })
        }

        
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Access denied', error: error.message })
    }
}

export default auth
