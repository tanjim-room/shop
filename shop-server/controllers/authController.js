const { createAdminToken } = require('../utils/adminToken');

function adminLogin(req, res) {
  const { email, password } = req.body || {};

  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim();
  const adminPassword = String(process.env.ADMIN_PASSWORD || '').trim();
  const inputEmail = String(email || '').trim();
  const inputPassword = String(password || '').trim();

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({
      message: 'Admin credentials are not configured on the server',
    });
  }

  if (inputEmail !== adminEmail || inputPassword !== adminPassword) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = createAdminToken({
    role: 'admin',
    email: adminEmail,
  });

  return res.status(200).json({
    message: 'Login successful',
    token,
  });
}

module.exports = {
  adminLogin,
};
