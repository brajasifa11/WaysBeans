const { User } = require('../../../models');
const joi = require('joi');
const { generateToken } = require('../../helpers/jwt');

exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    const data = req.body;
    const scheme = joi.object({
      email: joi.string().email().min(8).required(),
      password: joi.string().min(5).required(),
      fullname: joi.string().min(5).required(),
    });

    const { error } = scheme.validate(data)
    if (error) {
      return res.status(400).json({
        status: 'Validation Failed',
        message: error.details[0].message
      });
    };

    const userCheck = await User.findOne({
      where: {
        email
      },
    });
    if (userCheck) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Email already Registered'
      });
    };

    const userData = await User.create(data);
    const token = generateToken(userData);
    res.status(201).send({
      status: 'Success',
      data: {
        user: {
          fullname: userData.fullname,
          token,
        },
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};