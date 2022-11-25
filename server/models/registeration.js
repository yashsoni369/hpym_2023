const mongoose = require('mongoose');

var registeration = new mongoose.Schema({
    samparkId: { type: mongoose.Schema.Types.ObjectId, ref: 'sampark' },
    transport: { type: String, enum: ['Bus', 'Self'] },
    isNew: Boolean,
    seva: Number
}, { timestamps: true });

module.exports = mongoose.model("registeration", registeration);