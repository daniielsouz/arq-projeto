const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  console.log('BODY RECEBIDO:', req.body);
  const { login, senha } = req.body; 

  if (login === process.env.LOGIN && senha === process.env.PASSWORD) {
    const token = jwt.sign({ login }, process.env.JWT_SECRET);
    return res.json({ token });
  }

  res.status(401).json({ message: 'Login ou senha inválidos' });
});

module.exports = router;
