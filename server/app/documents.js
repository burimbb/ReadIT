const Document = require("../models/document")
const Company = require("../models/company")
const Jimp = require('jimp')
const { createWorker } = require('tesseract.js')
var sizeOf = require('image-size')
const excel4node = require('excel4node')
const fs = require('fs')
const archiver = require('archiver')


const read = async(filename, path = './uploads/documents/') => {
    const worker = createWorker()
    await worker.load()
    await worker.loadLanguage('deu')
    await worker.initialize('deu')
    const { data: { text } } = await worker.recognize(path + filename)
    await worker.terminate()
    return text
}

const getCoordinates = (w, h, square, dimensions) => {
    const left = 0
    const right = w
    const top = 0
    const bottom = h
    const photoWidth = dimensions.width
    const photoHeight = dimensions.height

    const oldX = parseInt(square.startX)
    const oldY = parseInt(square.startY)

    const newX = Math.round(((oldX - left) / (right - left)) * photoWidth)
    const newY = Math.round(((oldY - top) / (bottom - top)) * photoHeight)

    const tempX = Math.abs(((oldX + parseInt(square.w) - left) / (right - left)) * photoWidth)
    const tempY = Math.abs(((oldY + parseInt(square.h) - top) / (bottom - top)) * photoHeight)

    const width = parseInt(Math.abs(tempX - newX))
    const height = parseInt(Math.abs(tempY - newY))

    return {
        newX,
        newY,
        width,
        height
    }
}

// Route Methods
const upload = async (req, res) => {
    const { text } = req.body

    let documents = [];
    req.files.forEach(file => {
        req.files

        const document = new Document({
            filename: file.filename,
            text,
        })
        document.save();
        documents.push(document)
    });

    return res.json(documents)
}

const getAll = async (req, res) => {
    const resPerPage = 12;
    const page = req.query.page || 1
    let allDocsCount = await Document.countDocuments({}).exec()
    const allPages = Math.ceil(allDocsCount / (resPerPage * page))
    const docs = await Document.find({})
        .limit(resPerPage * page)
        .sort({ createdAt: -1 })
        .exec()
    return res.json({ docs, meta: { last_page: allPages, current_page: page, docs_count: allDocsCount } })
}

const getById = async(req, res) => {
    const { id } = req.params
    const docs = await Document.findById(id).exec()
    return res.json({ docs })
}

const readCropedInnerLabelFile = async (document, company, labelName, innerLabelObj) => {
    const currentLabel = company.labels.find(label => label.name == labelName)
    const label = company.labels.map((label) => {
        return label.name == labelName
    })
    const documentLabel = document.labels.find((label) => {
        return label.name == labelName
    })

    /* const innerLabelCompany = label.innerLabels.find((innerLabel) => {
        return innerLabel.name == innerLabelObj.name
    }) */

    const innerLabelExists = documentLabel.innerLabels.map((innerLabel) => {
        return innerLabel.name
    }).includes(innerLabelObj.name)
    
    if (innerLabelExists) {
        /* return {
            label: innerLabelObj.name,
            scannedData: innerLabelDoc.text
            
        } */
        return {
            name: innerLabelObj.name,
            rect: innerLabelObj.rect,
            cropedImage: innerLabelObj.filename,
            text: documentLabel.innerLabels.find((innerLabel) => {
                return innerLabel.name == innerLabelObj.name
            }).text,
        }
    }
    // return "Test"

    const dimensions = sizeOf(`./uploads/documents/${document.filename}`)
    const originalSquare = getCoordinates(650, 920, innerLabelObj.rect, dimensions)

    const photo = await Jimp.read(`./uploads/documents/${document.filename}`)
    const filename = Date.now() + '.' + photo.getExtension(photo.getMIME());
    photo
        .crop( parseInt(originalSquare.newX), parseInt(originalSquare.newY), parseInt(originalSquare.width), parseInt(originalSquare.height) )
        .write(`./uploads/croped/${filename}`)

    const response = await read(filename, './uploads/croped/')

    return {
        name: innerLabelObj.name,
        rect: innerLabelObj.rect,
        cropedImage: filename,
        text: response
    }
}

const readCropedFile = async (document, company, labelName) => {
    const currentLabel = company.labels.find(label => label.name == labelName)

    const labelExists = document.labels.map((label) => {
        return label.name
    }).includes(labelName)

    console.log("current label: "+currentLabel.name)
    if (labelExists && currentLabel.innerLabels.length == 0) {
        console.log("Label Exists and current Label text is not null")
        
        return {
            label: currentLabel,
            scannedData: document.labels.find((label) => {
                return label.name == labelName
            }).text
        }
    }

    if(currentLabel.innerLabels.length > 0){
        console.log("Company has inner labels")
        let currentDocLabel = document.labels.find((lb) => lb.name == currentLabel.name)

        if(currentDocLabel && currentDocLabel.innerLabels.length > 0){
            console.log("If labels has innerlabels saved in DB")
            return {
                label: currentLabel,
                scannedData: currentDocLabel.innerLabels
            };
        }else{
            console.log("If labels has innerlabels and not saved in DB")
            document.labels.push({
                text: null,
                cropedImage: null,
                name: currentLabel.name,
                color: currentLabel.color,
                rect: currentLabel.rect,
                innerLabels: []
            })
            currentDocLabel = document.labels.find((lb) => lb.name == currentLabel.name)

            let promises = []
            currentLabel.innerLabels.forEach((innerLabel) => {
                promises.push(readCropedInnerLabelFile(document, company, labelName, innerLabel));
            })
    
            let response = await Promise.all(promises);
            currentDocLabel.innerLabels = response
            document.save()
    
            return {
                label: currentLabel,
                scannedData: response
            }
        }
    }else{
        console.log("Company has not inner labels")

        const dimensions = sizeOf(`./uploads/documents/${document.filename}`)
        const originalSquare = getCoordinates(650, 920, currentLabel.rect, dimensions)

        const photo = await Jimp.read(`./uploads/documents/${document.filename}`)
        const filename = Date.now() + '.' + photo.getExtension(photo.getMIME());
        photo
            .crop( parseInt(originalSquare.newX), parseInt(originalSquare.newY), parseInt(originalSquare.width), parseInt(originalSquare.height) )
            .write(`./uploads/croped/${filename}`)

        const response = await read(filename, './uploads/croped/')
        document.labels.push({
            text: response,
            cropedImage: filename,
            name: currentLabel.name,
            color: currentLabel.color,
            rect: currentLabel.rect
        })
        document.save()
        return {
            label: currentLabel,
            scannedData: response
        }
    }
}

const filteredCropLabelDocument = async (req, res) => {
    const { documentId, companyId } = req.params
    const document = await Document.findById(documentId).exec()
    const company = await Company.findById(companyId).exec()
    const filters = req.body.filters

    let promises = []

    filters.forEach((labelName) => {
        promises.push(readCropedFile(document, company, labelName));
    })
    Promise.all(promises).then(response => {
        return res.json(response)
    })
}

const exelGenerate = async document => {
    const wb = new excel4node.Workbook()

    let ws = wb.addWorksheet('Sheet 1')

    document.labels.forEach((label, index) => {
        ws.cell(1, index + 1)
            .string(label.name)
        ws.cell(2, index + 1)
            .string(label.text)
    })

    const buffer = await wb.writeToBuffer();
    await fs.writeFile(`uploads/zip/${document.filename.split('.')[0]}.xlsx`, buffer, function(err) {
        if (err) {
            throw err
        }
    })
}
const documentExport = async (req, res) => {
    const {documemntId, labels} = req.body

    const documents = await Document.find({
        '_id': {$in: documemntId}
    }).exec()
    let promises = []
    documents.forEach(document => {
        promises.push(exelGenerate(document))
    })

    Promise.all(promises).then(() => {

        const date = new Date()
        let today = date.toISOString().slice(0, 10)
        let zipName = `Document-${today}-${Date.now()}.zip`

        const output = fs.createWriteStream(__dirname  + '/../uploads/zip/' + zipName)
        const archive = archiver('zip', {
            zlib: { level: 9 }
        })

        archive.pipe(output)

        output.on('close', function() {
            console.log('Package complete!')
        })

        documents.forEach(document => {
            const file1 =__dirname  + `/../uploads/zip/${document.filename.split('.')[0]}.xlsx`
            archive.append(fs.createReadStream(file1), { name: `${document.filename.split('.')[0]}.xlsx` })
            fs.unlink(__dirname  + `/../uploads/zip/${document.filename.split('.')[0]}.xlsx` , function (err) {
                if (err) throw err
                console.log('File deleted!')
            })
        })

        archive.finalize()
        res.json({zip: zipName})
    })

}
const deleteDocument = async(req, res) => {
    const { id } = req.params

    const docs = await Document.findByIdAndDelete(id).exec()
    return res.json({ docs })
}

module.exports = {
    upload,
    getAll,
    getById,
    filteredCropLabelDocument,
    documentExport,
    deleteDocument
};
