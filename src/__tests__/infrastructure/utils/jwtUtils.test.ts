import jwt from 'jsonwebtoken'
import jwtUtils from '~/infrastructure/utils/jwtUtils'

jest.mock('jsonwebtoken')

describe("jwtUtils", () => {
  const mockPayload = { userId: "123" }
  const mockToken = "fake-token"
  const mockDecodedPayload = { userId: "123", iat: 123456, exp: 123456 + 7200 }
  const mockJwtSecret = "secret-key"

  beforeEach(() => {
    process.env.JWT_SECRET = mockJwtSecret
  })

  afterEach(() => {
    jest.clearAllMocks()
    delete process.env.JWT_SECRET
  })

  describe("generateToken", () => {
    it("should generate a token with the correct payload and secret", () => {
      ;(jwt.sign as jest.Mock).mockReturnValue(mockToken)

      const result = jwtUtils.generateToken(mockPayload)

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        mockJwtSecret,
        { expiresIn: '2h' }
      )
      expect(result).toBe(mockToken)
    })

    it("should throw an error if JWT_SECRET is not defined", () => {
      delete process.env.JWT_SECRET

      expect(() => jwtUtils.generateToken(mockPayload)).toThrow("JWT_SECRET is not defined")
      expect(jwt.sign).not.toHaveBeenCalled()
    })
  })

  describe("verifyToken", () => {
    it("should verify a token and return the decoded payload", () => {
      ;(jwt.verify as jest.Mock).mockReturnValue(mockDecodedPayload)

      const result = jwtUtils.verifyToken(mockToken)

      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        mockJwtSecret
      )
      expect(result).toEqual(mockDecodedPayload)
    })

    it("should throw an error if JWT_SECRET is not defined", () => {
      delete process.env.JWT_SECRET

      expect(() => jwtUtils.verifyToken(mockToken)).toThrow("JWT_SECRET is not defined")
      expect(jwt.verify).not.toHaveBeenCalled()
    })

    it("should throw an error if the token is invalid", () => {
      const mockError = new Error("Invalid token")

      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw mockError
      })

      expect(() => jwtUtils.verifyToken(mockToken)).toThrow("Invalid token")
      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        mockJwtSecret
      )
    })
  })
})
