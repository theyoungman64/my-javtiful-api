const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const javSchema = new Schema({
    code: { type: String },
    actress: [String],
    javtiful: {},
    dateCreated: {type: Date, default: Date.now},
});

const jav = mongoose.model('jav', javSchema);

module.exports = jav;