const { User, Product, Chart } = require('../../../models');
const exclude = ['createdAt', 'updatedAt', 'password'];
const PATH_FILE = 'http://localhost:5000/uploads/'

exports.addChart = async (req, res) => {
  try {
    const { qty } = req.body;
    const { userData } = req;
    const productId = req.body.productId;
    let date = new Date();
    date = date.toDateString();
    const inputData = {
      userId: userData.id,
      productId,
      qty,
      date,
    };

    const carts = await Chart.create(inputData);
    res.status(201).send({
      status: 'Success',
      message: 'Carts Created'
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.getUserCharts = async (req, res) => {
  try {
    const { userData } = req;
    let carts = await Chart.findAll({
      include: [
        {
          model: User,
          as: 'userChart',
          attributes: {
            exclude
          },
        },
        {
          model: Product,
          as: 'productChart',
          attributes: {
            exclude
          },
        },
      ],
      attributes: {
        exclude
      },
      where: {
        userId: userData.id,
      },
    });
    carts = JSON.parse(JSON.stringify(carts));
    carts = carts.map((item) => {
      return {
        ...item,
        photo: item.productChart.photo
      };
    });

    res.status(201).send({
      status: 'Success',
      data: {
        carts
      },
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  }
};

exports.editChart = async (req, res) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    const { userData } = req;

    const checkCharts = await Chart.findOne({
      where: {
        id,
      },
    });

    if (!checkCharts) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Charts not Found',
      });
    };

    if (checkCharts.userId !== userData.id) {
      return res.status(401).send({
        status: 'Failed',
        message: 'Forbidden Access'
      });
    };

    const updated = {
      ...dataUpdate,
    };
    await Chart.update(updated, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 'Success',
      message: 'Charts Updated',
      data: updated
    });

  } catch (error) {
    (error, 'errrrrrrrrrrrrrrr')
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};

exports.deleteCharts = async (req, res) => {
  try {
    const { id } = req.params;
    const { userData } = req;

    const checkCharts = await Chart.findOne({
      where: {
        id,
      },
    });

    if (!checkCharts) {
      res.status(404).send({
        status: 'Failed',
        message: `Chart with id ${id} not Found`
      })
    }

    if (checkCharts.userId !== userData.id) {
      return res.status(401).send({
        status: 'Failed',
        message: 'Forbidden Access'
      });
    };

    await Chart.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 'Success',
      message: 'Chart Deleted'
    });

  } catch (error) {
    res.status(500).send({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  };
};
