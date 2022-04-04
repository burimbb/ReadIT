const express = require("express")
const documentsRoutes = express.Router()
const multer = require('multer')
const mime = require("mime")
const documents = require("../app/documents")


const scanStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/documents/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '.' + mime.getExtension(file.mimetype))
    }
});
const uploadScan = multer({ storage: scanStorage })

documentsRoutes.post("/upload", uploadScan.array('files', 5), documents.upload)
documentsRoutes.get("/documents", documents.getAll)
documentsRoutes.get("/documents/:id", documents.getById)
documentsRoutes.delete("/document/:id", documents.deleteDocument)
documentsRoutes.post("/documents/:documentId/companies/:companyId", documents.filteredCropLabelDocument)
documentsRoutes.post("/documents/download", documents.documentExport)


module.exports = documentsRoutes;
