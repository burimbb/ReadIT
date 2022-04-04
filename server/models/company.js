const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanySchema = new Schema(
    {
        name: { type: String, required: true },
        filename: { type: String },
        labels: [
            { 
                name: String, 
                rect: { 
                    startX: String, 
                    startY: String, 
                    w: String, 
                    h: String 
                }, 
                color: String,
                innerLabels: [
                    {
                        name: String, 
                        cropedImage: String, 
                        text: String, 
                        rect: { 
                            startX: String, 
                            startY: String, 
                            w: String, 
                            h: String 
                        },
                    }
                ] 
            }
        ]
    },
    { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;
