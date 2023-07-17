const model = require("../db/model");

exports.dataProduct = async (req, res) => {
  try {
    const product = await model.Products.findAll();
    res.json(product);
  } catch (error) {
    res.send(error);
  }
};

exports.dataOrder = async (req, res) => {
  try {
    const order = await model.Orders.findAll();
    res.json(order);
  } catch (error) {
    res.send(error);
  }
};

exports.dataPoint = async (req, res) => {
  try {
    const point = await model.Points.findAll();
    res.json(point);
  } catch (error) {
    res.send(error);
  }
};

exports.detailOrder = async (req, res) => {
  const { order_id } = req.params;
  try {
    const points = await model.DetailOrders.findAll({
      where: {
        order_id: order_id,
      },
    });
    res.json(points);
  } catch (error) {
    res.send(error);
  }
};

exports.dataNotes = async (req, res) => {
  try {
    const points = await model.Note.findAll();
    res.json(points);
  } catch (error) {
    res.send(error);
  }
};
