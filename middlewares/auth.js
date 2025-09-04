import jwt from 'jsonwebtoken'

const jwt_secret = process.env.jwt_secret

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ message: 'Access denied' })
        }

        const decoded = jwt.verify(token.replace('Bearer ', ''), jwt_secret)
        req.userId = decoded.id  
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Access denied' })
    }
}

export default auth