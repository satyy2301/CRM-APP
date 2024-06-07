const { verifyToken } = require('../config/googleAuth');

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authenticate;
