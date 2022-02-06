const { User } = require('../../models');

exports.authorizaton = (req, res, next) => {
  const { id } = req.userData;

  User.findByPk(id)
    .then(user => {
      if (!user) {
        res.status(404).send({
          status: 'Failed',
          message: 'User not Found',
        });
      } else if (req.userData.role !== 'Admin') {
        res.status(403).send({
          status: 'Failed',
          message: 'Forbidden Access',
        });
      } else { next() }
    });
};