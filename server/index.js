const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const config = require("./db/config")
const router = require("./routes/data")
const cors = require('cors');
require('sqlite3')


app.get('/', (req, res) => {
  res.send('Selamat datang di server Express!');
});

app.use(bodyParser.json());
app.use(cors());
app.use(router)

app.listen(port, () => {
  console.log(`====================================================================`);
  console.log(`                             WELCOME                                `);
  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
  console.log(`Kasir Toko Server Running, Buka Aplikasi Kasir Toko Untuk Memulai !`);
  console.log(`\nJANGAN CLOSE SERVER SAMPAI SELESAI MENGGUNAKAN APLIKASI !`);
  console.log(`====================================================================`);
  console.log(`\nRunning on Port 8080`);
});
