const express = require('express');
const getData = require('../controller/data');
const editData = require('../controller/edit');
const createData = require('../controller/create');
const deleteData = require("../controller/delete")
const router = express.Router();

// GET DATA
router.get('/data/product', getData.dataProduct);
router.get('/data/order', getData.dataOrder);
router.get('/data/point', getData.dataPoint);
router.get('/data/detailorder/:order_id', getData.detailOrder);
router.get('/data/notes', getData.dataNotes);

// EDIT DATA
router.post('/data/product/:kode_barang', editData.dataProduct);
router.post('/data/point/:id_pembeli', editData.dataPoint);


// CREATE DATA
router.post('/data/product', createData.dataProduct);
router.post('/data/point', createData.dataPoint);
router.post('/data/order', createData.dataOrder);
router.post('/data/detailorder', createData.detailOrder);
router.post('/data/notes', createData.dataNotes);


// DELETE DATA
router.delete('/data/product/:kode_barang', deleteData.dataProduct);
router.delete('/data/point/:id_pembeli', deleteData.dataPoint);
router.delete('/data/order/:order_id', deleteData.dataOrder);
router.delete('/data/notes/:notes_id', deleteData.dataNotes);

module.exports = router;
