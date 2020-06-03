const mongoose = require('mongoose')
const estado = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pais: { type: mongoose.Schema.Types.ObjectId, ref: 'Pais', required: true },
    nome: { type: String, required: true },
})

module.exports = mongoose.model('Estado', estado)