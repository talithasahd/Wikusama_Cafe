const express = require(`express`)
const app = express()
const cors = require(`cors`)
app.use(cors())

/** define port for the server */
const PORT = 8000

/** load a route of meja */
const mejaRoute = require(`./routes/meja.route`)

/** load a route of menu */
const menuRoute = require(`./routes/menu.route`)

/** load a route of user */
const userRoute = require(`./routes/user.route`)

/** load a route of transaksi */
const transaksiRoute = require(`./routes/transaksi.route`)

/** load a route of route */
const authRoute = require(`./routes/auth.route`)

/** register route of meja */
app.use(mejaRoute)

/** register route of menu */
app.use(menuRoute)

/** register route of user */
app.use(userRoute)

/** register route of transaksi */
app.use(transaksiRoute)

/** register route of auth */
app.use(authRoute)

app.use(express.static(__dirname))

/** run teh server */
app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`)
})