const mongoose = require('mongoose')

const forum = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa', require: true },
    nome: { type: String },
    descricao: { type: String },
    link: { type: String },
    status: { type: Boolean },
    en_nome: { type: String },
    en_descricao: { type: String }
})

module.exports = mongoose.model('Forum', forum)