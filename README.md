# Arq

Arq é um site para uma arquiteta expor seu portfólio e captar clientes. O sistema permite que a arquiteta faça o CRUD (Criar, Ler, Atualizar e Deletar) dos projetos do portfólio através de um painel de administração com login exclusivo.

---

## Tecnologias utilizadas

### Frontend

- React
- Vite
- Axios
- React Router Dom
- Framer Motion
- React Helmet Async

### Backend

- Node.js
- Express
- MongoDB (com Mongoose)
- JWT (Json Web Token) para autenticação
- Cloudinary para upload e gerenciamento de imagens
- Multer para upload de arquivos
- Bcryptjs para hash de senhas
- CORS

---

## Funcionalidades

- CRUD completo para os projetos do portfólio
- Login e autenticação segura para o painel de administração
- Upload de imagens integrado com Cloudinary
- Paginação para exibição dos projetos no frontend
- Proteção das rotas administrativas com JWT

---

## Instalação e execução local

### Backend

1. Navegue até a pasta `backend`:

```bash
cd backend
npm install
npm run dev
```

2. Navegue até a pasta frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Este projeto é exclusivo para uso pessoal da arquiteta, portanto, contribuições externas não são previstas.

Daniel Souza

GitHub: https://github.com/daniielsouz
LinkedIn: https://www.linkedin.com/in/daniel-souza-66ab0729a/
Email: danielsouz.dev@gmail.com

Este projeto está sob a licença MIT.
