const crypto = require('crypto');

const tokenSecret = process.env.ADMIN_TOKEN_SECRET || 'change-this-admin-token-secret';

function base64urlEncode(input) {
  return Buffer.from(input).toString('base64url');
}

function base64urlDecode(input) {
  return Buffer.from(input, 'base64url').toString();
}

function createAdminToken(payload = {}, expiresInSeconds = 60 * 60 * 12) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedBody = base64urlEncode(JSON.stringify(body));
  const unsignedToken = `${encodedHeader}.${encodedBody}`;

  const signature = crypto
    .createHmac('sha256', tokenSecret)
    .update(unsignedToken)
    .digest('base64url');

  return `${unsignedToken}.${signature}`;
}

function verifyAdminToken(token = '') {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'Invalid token format' };
  }

  const [encodedHeader, encodedBody, receivedSignature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedBody}`;

  const expectedSignature = crypto
    .createHmac('sha256', tokenSecret)
    .update(unsignedToken)
    .digest('base64url');

  if (receivedSignature !== expectedSignature) {
    return { valid: false, reason: 'Invalid token signature' };
  }

  try {
    const payload = JSON.parse(base64urlDecode(encodedBody));

    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return { valid: false, reason: 'Token expired' };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, reason: 'Invalid token payload' };
  }
}

module.exports = {
  createAdminToken,
  verifyAdminToken,
};
