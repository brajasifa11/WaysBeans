const { User } = require('../../../models');
const exclude = ['createdAt', 'updatedAt', 'password'];

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const checkId = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude,
      },
    });

    if (!checkId) {
      return res.status(404).send({
        status: 'Failed',
        message: `User ${id} not Found`,
      });
    };
    res.status(200).send({
      status: 'Success',
      message: `User ${id} Successfully Get`,
      data: {
        users: checkId,
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};