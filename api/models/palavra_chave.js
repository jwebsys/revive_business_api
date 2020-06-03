const mongoose = require('mongoose')
const palavra_chave = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
})

module.exports = mongoose.model('Palavra_chave', palavra_chave)