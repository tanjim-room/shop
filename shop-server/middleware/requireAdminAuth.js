const { verifyAdminToken } = require('../utils/adminToken');

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Admin authorization required' });
  }

  const verification = verifyAdminToken(token);

  if (!verification.valid) {
    return res.status(401).json({ message: verification.reason || 'Invalid token' });
  }

  req.admin = verification.payload;
  return next();
}

module.exports = requireAdminAuth;
