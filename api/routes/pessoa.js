const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pessoa = require("../models/pessoa");

const bcrypt = require('bcrypt')

router.get("/logar", (req, res) => {
  Pessoa.find()
    .exec()
    .then((pessoas) => {
      let pessoa = {};
      pessoas.forEach((p) => {
        if (p.email == req.query.email && p.senha == req.query.senha)
          pessoa = p;
      });
      if (pessoa._id) res.status(200).json(pessoa);
      else res.status(404).json({});
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/", (req, res, next) => {
  Pessoa.find()
    .sort({ nome: "asc" })
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:pessoaId", (req, res, next) => {
  Pessoa.findById(req.params.pessoaId)
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", async (req, res, next) => {
  
  const pessoa = new Pessoa({
    _id: new mongoose.Types.ObjectId(),
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone,
    cpf: req.body.cpf,
    cnpj: req.body.cnpj,
    tipo: req.body.tipo,
    senha: await bcrypt.hash(req.body.senha, 10),
    colaborador: req.body.colaborador,
    investidor: req.body.investidor,
    cliente: req.body.cliente,
    whatsapp: req.body.whatsapp,
  });

  const email = req.body.email;

  try {

    if (await Pessoa.findOne({email})) {
      return  res.status(400).json({ message: "E-mail já está cadastrado!" });
    }
    else{
      pessoa
      .save()
      .then(() => {
        res.status(201).json({ message: "Salvo com sucesso!", _id: pessoa._id });
      })
      .catch((err) => res.status(500).json({ error: err }));
  }
  } catch (err){
    return res.status(400).send({ error: err});
  }
    
});

router.put("/:pessoaId", (req, res, next) => {
  Pessoa.update({ _id: req.params.pessoaId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.pessoaId }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:pessoaId", (req, res, next) => {
  Pessoa.remove({ _id: req.params.pessoaId })
    .exec()
    .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.pessoaId }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
