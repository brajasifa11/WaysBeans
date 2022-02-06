const { verifyToken } = require('../helpers/jwt');
const { User } = require('../../models');

exports.authentication = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(403).send({
      status: 'Failed',
      message: 'Forbidden Access',
    });
  };
  try {
    const token = header.replace('Bearer ', '');
    const verified = verifyToken(token);

    if (verified) {
      User.findOne({
        where: {
          id: verified.id,
        },
      })
        .then((data) => {
          if (data) {
            req.userData = verified;
            next();
          } else {
            res.status(404).send({
              status: 'Failed',
              message: 'User not Found',
            });
          };
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      res.status(401).send({
        status: 'Failed',
        message: 'Unauthorized',
      });
    };
  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error auth'
    });
  };
};