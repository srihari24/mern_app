const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: String },
    loginTime: { type: Date },
    logoutTime: { type: Date },
    ipAddress: { type: String },
    token: { type: String }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('LoginHistory', schema);
