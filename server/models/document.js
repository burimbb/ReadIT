const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentSchema = new Schema(
  {
    filename: { type: String, required: true },
    labels: [
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

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;
