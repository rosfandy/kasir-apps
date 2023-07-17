const model = require("../db/model");
const moment = require('moment');

exports.dataProduct = async (req, res) => {
  const data = req.body

  try {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const product = await model.Products.create({
      ...data,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    res.json(product);
  } catch (error) {
    res.send(error);
  }

};

exports.dataNotes = async (req, res) => {
  const data = req.body
  const notesId = generateOrderId()
  try {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const product = await model.Note.create({
      ...data,
      notes_id: notesId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    res.json(product);
  } catch (error) {
    res.send(error);
  }

};

exports.dataOrder = async (req, res) => {
  const data = req.body;
  try {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const orderId = generateOrderId(); // Function to generate random 10-digit order_id

    const product = await model.Orders.create({
      ...data,
      order_id: orderId,
      ubah: currentDate,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    res.json(product);
  } catch (error) {
    res.send(error);
  }
};

function generateOrderId() {
  const min = 1000000000; // Minimum 10-digit number
  const max = 9999999999; // Maximum 10-digit number
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}


exports.detailOrder = async (req, res) => {
  const data = req.body

  try {
    const items = Object.values(data.detailOrder);
    items.forEach(async (item) => {
      console.log(`Order ID: ${data.order_id}`);
      console.log(`ID Barang: ${item.id_barang}`);
      console.log(`Nama Barang: ${item.nama_barang}`);
      console.log(`Jumlah: ${item.jumlah}`);
      console.log(`Harga: ${item.harga}`);
      console.log(`Nama Pembeli: ${item.nama_pembeli}`);
      console.log(`Untung: ${item.untung}`);
      console.log('-----------------------------------');
      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const product = await model.DetailOrders.create({
        ...item,
        order_id: data.order_id,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    });

    res.json(data);
  } catch (error) {
    res.send(error);
  }
};

exports.dataPoint = async (req, res) => {
  const data = req.body

  try {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const product = await model.Points.create({
      ...data,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    res.json(product);
  } catch (error) {
    res.send(error);
  }
};
