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
})
