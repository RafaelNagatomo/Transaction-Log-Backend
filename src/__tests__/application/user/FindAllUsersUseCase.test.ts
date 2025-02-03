import UserRepositoryMongo from '~/infrastructure/repositories/UserRepositoryMongo'
import User from '~/domain/entities/User'
import FindAllUsersUseCase from '~/application/user/FindAllUsersUseCase';

jest.mock('~/infrastructure/repositories/UserRepositoryMongo')

describe('FindAllUsersUseCase', () => {
  let findAllUsersUseCase: FindAllUsersUseCase;
  let mockUserRepositoryMongo: jest.Mocked<UserRepositoryMongo>

  beforeEach(() => {
    mockUserRepositoryMongo = new UserRepositoryMongo() as jest.Mocked<UserRepositoryMongo>
    findAllUsersUseCase = new FindAllUsersUseCase(mockUserRepositoryMongo)
  })

  it('should return an array of users', async () => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John',
        email: 'john@jane.com',
        password: 'senha123'
      },
      {
        id: '2',
        name: 'Jane',
        email: 'jane@jane.com',
        password: 'sena456'
      },
    ]

    mockUserRepositoryMongo.findAllUsers.mockResolvedValue(mockUsers)
    const result = await findAllUsersUseCase.execute()

    expect(mockUserRepositoryMongo.findAllUsers).toHaveBeenCalled()
    expect(result).toEqual(mockUsers)
  })

  it('should handle an empty array if no users are found', async () => {
    mockUserRepositoryMongo.findAllUsers.mockResolvedValue([])
    const result = await findAllUsersUseCase.execute()

    expect(mockUserRepositoryMongo.findAllUsers).toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('should handle errors thrown by the repository', async () => {
    const mockError = new Error('Database error')
    mockUserRepositoryMongo.findAllUsers.mockRejectedValue(mockError)

    await expect(findAllUsersUseCase.execute()).rejects.toThrow('Database error')
    expect(mockUserRepositoryMongo.findAllUsers).toHaveBeenCalled()
  })
})
