const mongoose = require('mongoose')
const pessoa = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    telefone: { type: String, required: true },
    cpf: { type: String },
    cnpj: { type: String },
    tipo: { type: String, required: true },
    senha: { type: String, required: true },
    colaborador: { type: Boolean },
    investidor: { type: Boolean },
    cliente: { type: Boolean },
    whatsapp: { type: String },
    admin: { type: Boolean }
})

module.exports = mongoose.model('Pessoa', pessoa)
