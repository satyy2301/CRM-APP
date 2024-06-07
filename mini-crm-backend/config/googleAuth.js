const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '240107929719-5o6cnkht624095mdo5jj7anm0ge0jnha.apps.googleusercontent.com'; // Replace with your actual Google Client ID
const client = new OAuth2Client(CLIENT_ID);

const verifyToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

module.exports = { verifyToken };
