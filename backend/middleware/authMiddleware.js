const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log('🔐 Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Token não fornecido ou mal formatado');
    return res.status(401).json({ message: 'Token não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔑 Token extraído:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado com sucesso:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('❌ Erro ao verificar token:', err.message);
    return res.status(403).json({ message: 'Token inválido.' });
  }
}

module.exports = authMiddleware;
