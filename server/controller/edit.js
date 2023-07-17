const model = require("../db/model");
const moment = require('moment');

exports.dataProduct = async (req, res) => {
  const { kode_barang } = req.params
  const { nama_barang, stok, kategori, jual, beli } = req.body;

  try {
    const product = await model.Products.findOne({ where: { kode_barang } });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Update the product with the new values
    if (nama_barang != null) product.nama_barang = nama_barang;
    if (stok != null) product.stok = +stok;
    if (kategori != null) product.kategori = kategori;
    if (jual != null) product.jual = jual;
    if (beli != null) product.beli = beli;

    // Update the updatedAt field with the current timestamp
    product.updatedAt = moment().format('DD:MM:YYYY HH:mm:ss');

    // Save the changes to the database
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.dataPoint = async (req, res) => {
  const { total_point } = req.body;
  const { id_pembeli } = req.params

  try {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    const point = await model.Points.findOne({
      where: { id_pembeli: id_pembeli },
    });

    if (point) {
      point.total_point += total_point;
      point.updatedAt = currentDate;
      await point.save();
    } else {
      await model.Points.create({
        id_pembeli: id_pembeli,
        total_point: total_point,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.send(error);
  }
};
