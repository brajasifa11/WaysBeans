const { Order, Transaction, Product } = require('../../../models');
const exclude = ['createdAt', 'updatedAt'];

exports.addOrder = async (req, res) => {
  try {
    const data = req.body;
    const orderData = await Order.create(data);

    const order = await Order.findOne({
      where: {
        id: orderData.id,
      },
      attributes: {
        exclude,
      },
      include: [
        {
          model: Transaction,
          as: 'TransactionOrder',
          attributes: {
            exclude
          },
          model: Product,
          as: 'ProductOrder',
          attributes: {
            exclude
          }
        }
      ]
    })

    res.status(201).send({
      status: 'Success',
      data: {
        order
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};