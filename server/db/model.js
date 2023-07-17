const { Sequelize } = require("sequelize");
const sequelize = require("./config");

exports.Orders = sequelize.define('orders', {
  nama_pembeli: Sequelize.STRING,
  order_id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  ubah: Sequelize.STRING,
  total_harga: Sequelize.INTEGER,
  updatedAt: Sequelize.DATE,
  untung: Sequelize.INTEGER
});

exports.Note = sequelize.define('notes', {
  notes_id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  judul: Sequelize.STRING,
  catatan: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

exports.Products = sequelize.define('products', {
  kode_barang: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  nama_barang: Sequelize.STRING,
  stok: Sequelize.INTEGER,
  kategori: Sequelize.STRING,
  beli: Sequelize.INTEGER,
  jual: Sequelize.INTEGER,
  // createdAt: false,
  // updatedAt: false,
}, {
  // timestamps: false // Disable createdAt and updatedAt fields
});

exports.Users = sequelize.define('users', {
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}, {
  timestamps: false // Disable createdAt and updatedAt fields
});

exports.DetailOrders = sequelize.define('detailorders', {
  order_id: {
    primaryKey: true,
    type: Sequelize.STRING
  },
  id_barang: Sequelize.STRING,
  nama_barang: Sequelize.STRING,
  nama_pembeli: Sequelize.STRING,
  jumlah: Sequelize.INTEGER,
  harga: Sequelize.INTEGER,
  untung: Sequelize.INTEGER,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}, {
  // timestamps: false // Disable createdAt and updatedAt fields
});

exports.Points = sequelize.define('points', {
  id_pembeli: {
    primaryKey: true,
    type: Sequelize.STRING
  },
  nama_pembeli: Sequelize.STRING,
  alamat: Sequelize.STRING,
  total_point: Sequelize.INTEGER,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
}, {
  // timestamps: false // Disable createdAt and updatedAt fields
});
