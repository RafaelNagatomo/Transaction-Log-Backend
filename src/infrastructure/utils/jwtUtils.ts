import jwt from 'jsonwebtoken'

const generateToken = (payload: object) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  )
}

export default { generateToken }
