const mongoose = require('mongoose')
const solucao = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa' },
    cidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Cidade' },
    nome: { type: String },
    descricao: { type: String },
    area_aplicacao: { type: String },
    instituicao: { type: String },
    negocio: { type: String },
    tipo: { type: String },
    status: { type: String },
    link_web: { type: String },
    link_youtube: { type: String },
    en_nome: { type: String },
    en_descricao: { type: String },
    en_pais: { type: String },
})

module.exports = mongoose.model('Solucao', solucao)