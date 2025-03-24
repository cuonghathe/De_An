import jwt from 'jsonwebtoken';
import userDB from '../models/users/userModel.js';

const adminAuthenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userDB.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user || !user.isAdmin) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Không phải admin.' });
  }
};

export default adminAuthenticate;