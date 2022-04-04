const Company = require("../models/company")


const getAll = async (req, res) => {
    let data = await Company.find()
    return res.json({ company: data })
}

const getById = async(req, res) => {
    const { id } = req.params
    const data = await Company.findById(id).exec()
    return res.json({ data })
}

const sendData =  async (req, res) => {
    const { name, filename } = req.body

    const company = new Company({ name, filename })
    let data = await company.save()

    return res.send({ company: data })
}

const deleteData = async(req, res) => {
    const { id } = req.params

    const docs = await Company.findByIdAndDelete(id).exec()
    return res.json({ docs })
}

const uploadTrain =  async (req, res) => {
    const { companyId } = req.body;
    
    let company =  await Company.findByIdAndUpdate(companyId, { filename: req.files[0].filename }, (err, result) => {
        if(err){
            res.send(err)
        }
    });
    return res.json( company )
}

const updateCompanyTrain = (req, res) => {
    const { id } = req.params
    const { name, filename, labels } = req.body
    console.log(req.body)

    let data = {}

    if (name != null){
        data.name = name
    }
    if (filename != null){
        data.filename = filename
    }
    data.labels = labels


    Company.findByIdAndUpdate(id, data, (err, result) => {
        if(err){
            res.send(err)
        } else {
            res.send(result)
        }
    });
}

module.exports = {
    getAll,
    getById,
    sendData,
    deleteData,
    uploadTrain,
    updateCompanyTrain
};
