const mongoose = require('mongoose')
const destaque = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    solucao: { type: mongoose.Schema.Types.ObjectId, ref: 'Solucao', required: true },
    descricao: { type: String, required: true }
})

module.exports = mongoose.model('Destaque', destaque)