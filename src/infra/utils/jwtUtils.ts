import jwt from 'jsonwebtoken'

const generateToken = (payload: object) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })
}

const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.verify(token, process.env.JWT_SECRET)
}

export default { generateToken, verifyToken }
