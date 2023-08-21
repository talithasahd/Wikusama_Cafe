/** load express library */
const express = require(`express`)

const app = express()

/** load controller of transaksi */
const transaksiController = require(`../controllers/transaksi.controller`)

/** call authorization method */
const {authorization} = require(`../controllers/auth.controller`)

/** allow to read json on body request */
app.use(express.json())

/** create route to get all transaksi */
app.get(`/transaksi`, authorization(["admin","kasir"]),transaksiController.getTransaksi)

/** create route to add transaksi */
app.post(`/transaksi`, authorization(["admin","kasir"]),transaksiController.addTransaksi)

/** crete route for search transaksi */
app.post(`/transaksi/find`, authorization(["admin","kasir"]),transaksiController.findTransaksi)

/** create route to edit transaksi */
app.put(`/transaksi/:id_transaksi`, authorization(["admin","kasir"]),transaksiController.updateTransaksi)

/** create route to delete transaksi*/
app.delete(`/transaksi/:id_transaksi`, authorization(["admin","kasir"]),transaksiController.deleteTransaksi)

/** export app */
module.exports = app