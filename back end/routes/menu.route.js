const express  = require(`express`)
const app = express()

/** load controller of menu */
const menuController = require(`../controllers/menu.controller`)

/** call authorization method */
const {authorization} = require(`../controllers/auth.controller`)

/** create route for add menu */
app.post(`/menu`, authorization(["admin","kasir"]),menuController.addMenu)

/** craete route for get all menu */
app.get(`/menu`, authorization(["admin","kasir"]),menuController.getMenu)

/** crete route for search menu */
app.post(`/menu/find`, authorization(["admin","kasir"]),menuController.findMenu)

/** create route for edit menu */
app.put(`/menu/:id_menu`, authorization(["admin","kasir"]),menuController.updateMenu)

/** create route for delete menu */
app.delete(`/menu/:id_menu`, authorization(["admin","kasir"]),menuController.deleteMenu)

/** export app */
module.exports = app