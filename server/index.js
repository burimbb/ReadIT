const cors = require("cors")
const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require('mongoose')

const documentsRoutes = require("./routes/documentsRoutes")
const companiesRoutes = require("./routes/companiesRoutes")

const port = 3000

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('uploads'))

mongoose.connect("mongodb://localhost:27017/read4it", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.set("useCreateIndex", true)
mongoose.set('useFindAndModify', false)

app.use("/", documentsRoutes)
app.use("/", companiesRoutes)

const server = app.listen(port, () => {
    console.log("Server listening on port: " + port)
})
server.timeout = 240000
