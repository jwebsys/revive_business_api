const mongoose = require('mongoose')
const acesso = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    solucoes: { type: String },
})

module.exports = mongoose.model('Acesso', acesso)