require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const projectRoutes = require('./router');
const authRoutes = require('./router/auth'); 

const allowedOrigins = [
  'http://localhost:5173',
  'https://arqjanainapossamai.com.br',
  'https://www.arqjanainapossamai.com.br',
  'https://arqjanainapossamai.vercel.app',
  'https://arqjanainapossamai-git-main-daniel-de-souzas-projects.vercel.app'
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'O CORS não permite essa origem.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes); 
app.use('/', projectRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando`);
    });
  })
  .catch((error) => {
    console.error('Erro na conexão com MongoDB Atlas:', error);
  });
