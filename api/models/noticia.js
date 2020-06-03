const mongoose = require('mongoose')
const noticias = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    titulo: { type: String },
    subtitulo: { type: String },
    descricao: { type: String },
    data_publicacao: { type: Date },
    data_atualizacao: { type: Date },
    responsavel: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa' },
    palavras_chave: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Palavra_chave' }],
    en_titulo: { type: String },
    en_subtitulo: { type: String },
    en_descricao: { type: String },
})

module.exports = mongoose.model('Noticia', noticias)
