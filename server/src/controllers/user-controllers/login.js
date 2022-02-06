const { User } = require('../../../models');
const joi = require('joi');
const { comparePass } = require('../../helpers/bcrypt');
const { generateToken } = require('../../helpers/jwt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    const scheme = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });

    const { error } = scheme.validate(req.body)
    if (error) {
      return res.status(400).json({
        status: 'Validation Failed',
        message: error.details[0].message
      });
    };

    if (!user || !comparePass(password, user.password)) {
      res.status(403).send({
        status: 'Failed',
        message: 'Invalid Email or Password'
      });
    } else {
      const token = generateToken(user);
      res.status(200).send({
        status: 'Success',
        data: {
          user: {
            email: user.email,
            role: user.role,
            token,
          },
        },
      });
    };

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};