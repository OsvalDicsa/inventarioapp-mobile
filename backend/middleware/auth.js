import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      throw new Error('No se envió header Authorization');
    }
    const token = header.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    } catch (errVerify) {
      if (errVerify.name !== 'TokenExpiredError') {
        throw errVerify;
      }
      decoded = jwt.decode(token);
      if (!decoded) {
        throw new Error('No se pudo decodificar el JWT vencido');
      }
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error en authMiddleware (ignorar expiración):', err.stack);
    return res.status(401).json({
      message: 'Token inválido o no enviado',
      error: err.message,
      stack: err.stack
    });
  }
};

export default authMiddleware;
