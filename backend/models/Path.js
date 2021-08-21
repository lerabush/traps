const mongoose = require("mongoose")

const PathSchema = new mongoose.Schema({
    x1: {
        type:String,
        require: true
    },
    x2: {
        type: String,
        unique:true,
        require: true
    },
    y1: {
        type: String,
        require: true
    },
    y2: {
        type: String,
        require: true
    },
    matrixKey:{
        type:String,
        require:true,
    },
    trace: {
        type: [],
        require: true,
    },
    time: {
        type: Number,
        require: true
    },
    IP: {
        type: String,
        require: true
    }
}, {timestamps: true});
module.exports = mongoose.model("Path", PathSchema)