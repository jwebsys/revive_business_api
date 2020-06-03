const mongoose = require('mongoose')
const cidade = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    estado: { type: mongoose.Schema.Types.ObjectId, ref: 'Estado', required: true },
    nome: { type: String, required: true },
})

module.exports = mongoose.model('Cidade', cidade)