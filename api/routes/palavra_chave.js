const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const PalavraChave = require("../models/palavra_chave");

router.get("/", (req, res, next) => {
  PalavraChave.find()
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:palavra_chaveId", (req, res, next) => {
  PalavraChave.findById(req.params.palavra_chaveId)
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  console.log(req.body);

  const palavra_chave = new PalavraChave({
    _id: new mongoose.Types.ObjectId(),
    nome: req.body.nome,
  });
  palavra_chave
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!", _id: palavra_chave._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:palavra_chaveId", (req, res, next) => {
  PalavraChave.update({ _id: req.params.palavra_chaveId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.palavra_chaveId }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:palavra_chaveId", (req, res, next) => {
  PalavraChave.remove({ _id: req.params.palavra_chaveId })
    .exec()
    .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.palavra_chaveId }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
