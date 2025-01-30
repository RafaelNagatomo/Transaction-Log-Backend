import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { userService } from '~/domain/services/UserService'

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' })
    return
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    res.status(500).json({ message: 'JWT secret not configured' })
    return
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expirado' })
      }
      return res.status(403).json({ message: 'Token inválido', error: err.message })
    }

    if (typeof decoded === 'object' && decoded !== null) {
      userService.setUser(decoded)
    } else {
      return res.status(403).json({ message: 'Token inválido' })
    }

    next()
  })
}
