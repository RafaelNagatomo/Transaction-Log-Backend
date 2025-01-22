import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  // Inicia o servidor MongoDB em memória
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()

  // Conecta o Mongoose ao banco de dados em memória
  await mongoose.connect(uri)
})

afterAll(async () => {
  // Desconecta o Mongoose e para o servidor em memória
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  // Limpa todas as coleções após cada teste
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})