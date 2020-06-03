const mongoose = require('mongoose')
const endereco = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Cidade', required: true },
    cep: { type: String },
    bairro: { type: String },
    logradouro: { type: String },
    numero: { type: String }
})

module.exports = mongoose.model('Endereco', endereco)