const {
  Transaction,
  User,
  Product,
  Order,
  Chart,
} = require('../../../models');
const exclude = ['createdAt', 'updatedAt', 'password'];
const PATH_FILE = 'http://localhost:5000/uploads/'
const { Op } = require('sequelize');

exports.getTransactions = async (req, res) => {
  try {
    const data = await Transaction.findAll({
      include:
        [
          {
            model: User,
            as: 'buyer',
            attributes: {
              exclude
            },
          },
          {
            model: Order,
            as: 'TransactionOrder',
            attributes: {
              exclude
            },
            include: [
              {
                model: Product,
                as: 'ProductOrder',
                attributes: {
                  exclude
                },
              },
            ],
          },
        ],
      attributes: {
        exclude
      },
    });

    res.status(200).send({
      status: 'Success',
      data: {
        transaction: data,
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.getDetailTransaction = async (req, res) => {
  try {
    const { id } = req.userData;
    const data = await Transaction.findAll({
      include:
        [
          {
            model: User,
            as: 'buyer',
            attributes: {
              exclude
            },
          },
          {
            model: Order,
            as: 'TransactionOrder',
            attributes: {
              exclude
            },
            include: [
              {
                model: Product,
                as: 'ProductOrder',
                attributes: {
                  exclude
                },
              },
            ],
          },
        ],
      attributes: {
        exclude
      },
      where: {
        userId: id,
      },
    });

    res.status(200).send({
      status: 'Success',
      data: {
        transaction: data,
        // photo: PATH_FILE + product.photo,
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.addTransaction = async (req, res) => {
  try {
    let { orderData } = req.body;
    let { cartList } = req.body;
    const userId = req.userData.id;
    const data = req.body;
    let date = new Date();
    date = date.toDateString();
    cartList = JSON.parse(cartList);
    orderData = JSON.parse(orderData);

    const inputTransaction = {
      ...data,
      userId,
      date,
      attachment: PATH_FILE + req.file.filename,
    };

    const checkCart = await Chart.findAll({
      where: {
        id: {
          [Op.in]: cartList
        },
      },
    });

    if (checkCart.length === 0) {
      return res.status(400).send({
        status: 'Failed',
        message: 'Invalid Cartlist'
      });
    };

    let transaction = await Transaction.create(inputTransaction);
    transaction = transaction.id;

    await Chart.destroy({
      where: {
        id: cartList,
      },
    });

    const inputData = orderData.map(
      (data) => {
        return {
          ...data,
          transactionId: transaction,
        };
      },
    );

    const inputOrder = await Order.bulkCreate(inputData);

    const transactionData = await Transaction.findOne({
      where: {
        id: transaction,
      },
      attributes: {
        exclude
      },
      include: [
        {
          model: User,
          as: "buyer",
          attributes: {
            exclude
          },
        },
        {
          model: Order,
          as: "TransactionOrder",
          attributes: {
            exclude
          },
          include: {
            model: Product,
            as: "ProductOrder",
            attributes: {
              exclude
            },
          },
        },
      ],
    });
    res.status(200).send({
      status: "Success",
      data: {
        transactionData
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userData } = req;
    const dataUpdate = req.body;
    const transactionData = await Transaction.findOne({
      where: {
        id
      },
    });

    if (!transactionData) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Transacation not Found'
      });
    };

    if (userData.role === 'User') {
      if (userData.id !== transactionData.userId) {
        return res.status(401).send({
          status: 'Failed',
          message: 'User Unauthorized'
        });
      };
    };

    const updated = {
      ...dataUpdate,
    }
    await Transaction.update(updated, {
      where: {
        id
      },
    });

    res.status(200).send({
      status: 'Success',
      message: 'Transaction Updated',
      data: updated
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};
