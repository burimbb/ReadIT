const express = require("express")
const companiesRoutes = express.Router()
const multer = require('multer')
const mime = require("mime")
const companies = require("../app/companies")

const trainStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/trained/')
    },
    filename: function (req, file, cb) {
        cb(null,  Date.now() + '.' + mime.getExtension(file.mimetype))
    }
});
const uploadTrain = multer({ storage: trainStorage })

companiesRoutes.get("/companies", companies.getAll)
companiesRoutes.get("/companies/:id", companies.getById)
companiesRoutes.post("/companies", companies.sendData)
companiesRoutes.delete("/companies/:id", companies.deleteData)
companiesRoutes.post("/upload/train", uploadTrain.array('files', 5), companies.uploadTrain)
companiesRoutes.put("/train/:id", companies.updateCompanyTrain)



module.exports = companiesRoutes;
