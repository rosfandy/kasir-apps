const model = require("../db/model");
const moment = require('moment');

exports.dataProduct = async (req, res) => {
  const { kode_barang } = req.params;
  try {
    // Find the data point to delete
    const product = await model.Products.findOne({ where: { kode_barang } });

    if (!product) {
      return res.status(404).json({ message: 'Data barang not found' });
    }

    // Delete the data product
    await product.destroy();

    res.json({ message: 'Data barang deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data product', error: error.message });
  }

};

exports.dataOrder = async (req, res) => {
  const { order_id } = req.params

  try {
    const product = await model.Orders.findOne({ where: { order_id } });
    if (!product) {
      return res.status(404).json({ message: 'Data order not found' });
    }

    // Delete the data product
    await product.destroy();
    res.json("Data Sukses Terhapus")
  } catch (error) {
    res.send(error);
  }
};

exports.dataPoint = async (req, res) => {
  const { id_pembeli } = req.params;
  try {
    // Find the data point to delete
    const point = await model.Points.findOne({ where: { id_pembeli } });

    if (!point) {
      return res.status(404).json({ message: 'Data pelanggan not found' });
    }

    // Delete the data point
    await point.destroy();

    res.json({ message: 'Data pelanggan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data point', error: error.message });
  }
};

exports.dataNotes = async (req, res) => {
  const { notes_id } = req.params;
  try {
    // Find the data point to delete
    const point = await model.Note.findOne({ where: { notes_id } });

    if (!point) {
      return res.status(404).json({ message: 'Data notes not found' });
    }

    // Delete the data point
    await point.destroy();

    res.json({ message: 'Data notes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data notes', error: error.message });
  }
};
