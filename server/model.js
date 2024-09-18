const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const codeBlockSchema = new Schema(
    {
        'id' : {
            type: String,
            required: true
        },
        'code' : {
            type: String,
            required: true
        },
        'solution' : {
            type: String,
            required: true
        },
    }
);

module.exports = {
    'codeBlockSchema' : mongoose.model('codeBlockSchema', codeBlockSchema)
};