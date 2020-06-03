const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Endereco = require("../models/endereco");

router.get("/", (req, res, next) => {
  Endereco.find()
    .populate("cidade")
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:enderecoId", (req, res, next) => {
  Endereco.findById(req.params.enderecoId)
    .populate("cidade")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  const endereco = new Endereco({
    _id: new mongoose.Types.ObjectId(),
    cidade: req.body.cidade,
    cep: req.body.cep,
    bairro: req.body.bairro,
    logradouro: req.body.logradouro,
    numero: req.body.numero,
  });
  endereco
    .save()
    .then(() => {
      res
        .status(201)
        .json({ message: "Salvo com sucesso!", _id: endereco._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:enderecoId", (req, res, next) => {
  Endereco.update({ _id: req.params.enderecoId }, { $set: req.body })
    .exec()
    .then((x) =>
      res
        .status(200)
        .json({ message: "Editado com sucesso!", _id: req.params.enderecoId })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:enderecoId", (req, res, next) => {
  Endereco.remove({ _id: req.params.enderecoId })
    .exec()
    .then((x) =>
      res
        .status(200)
        .json({ message: "Excluído com sucesso!", _id: req.params.enderecoId })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
