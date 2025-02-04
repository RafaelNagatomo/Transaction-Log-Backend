# Transaction-Log-Backend

## 📌 Descrição
O **Transaction-Log-Backend** é uma API com princípios de Clean Arch e SOLID da aplicação de transação financeira, com a funcionalidade de registrar ações de um usuário para cada ação feita (CREATE, UPDATE, DELETE), permitindo também, ser visualizado em forma de histórico de ações.

## 🚀 Executar Projeto
- Requisitos:
  - `Node.js V18+`

- Clone o repositório git:
```
git clone https://github.com/RafaelNagatomo/Transaction-Log-Backend.git
```
- Instale as dependências:
```
npm install
```
- Inicie em modo de desenvolvimento:
```
npm run dev
```
- Abra o navegador:
  - Abra o navegador com a url `http://localhost:4000`

## 🛠 Tecnologias Utilizadas

- Node.js ⚙️ + TypeScript 🟦
- Express 🔗
- JWT
- Mongoose 🚏
- Bcrypt ⚡
- Jest 📝
- Supertest 📝

### 📡 Infra
- Docker 🐳
- MongoDB 📈

## 📂 Estrutura do Projeto
```
TransferX/
├── backend/  # Node/TypeScript
│   ├── src/
|   |   ├──__testes__/  # Testes com Jest
│   │   ├── application/  # Regras de negócio
│   │   ├── domain/  # Modelos e entidades
│   │   ├── infra/  # Configuração de banco de dados e EventEmitter
│   │   ├── presentation/  # Controllers, rotas e middlewares
│   │   └── ...
└── README.md  # Documentação
```

## 🧪 Testes
```sh
npm run test:coverage
```
---

👨‍💻 **Desenvolvido por [Rafael Nagatomo](https://github.com/RafaelNagatomo)**
