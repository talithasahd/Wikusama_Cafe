/** load express library */
const express = require(`express`)

/** create object of express */
const app = express()

/** allow to read a request from body with json format */
app.use(express.json())

/** load controller of user */
const userController = require(`../controllers/user.controller`)

/** call authorization method */
const {authorization} = require(`../controllers/auth.controller`)

/** create routefor get all user */
app.get(`/user`, authorization(["admin","kasir"]),userController.getUser)

/** create route for search user */
app.post(`/user`, authorization(["admin","kasir", "manajer"]),userController.findUser)

/** create route for add user */
app.post(`/user`, authorization(["admin","kasir"]),userController.addUser)

/** create route for edit user */
app.put(`/user/:id_user`, authorization(["admin","kasir"]),userController.updateUser)

/** create route for delete user */
app.delete(`/user/:id_user`, authorization(["admin","kasir"]),userController.deleteUser)

/** export app object */
module.exports = app