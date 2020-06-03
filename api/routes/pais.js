const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pais = require("../models/pais");

router.get("/", (req, res, next) => {
  Pais.find()
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:paisId", (req, res, next) => {
  Pais.findById(req.params.paisId)
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  console.log(req.body);

  const pais = new Pais({
    _id: new mongoose.Types.ObjectId(),
    nome: req.body.nome,
  });
  pais
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!", _id: pais._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:paisId", (req, res, next) => {
  Pais.update({ _id: req.params.paisId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.paisId }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:paisId", (req, res, next) => {
  Pais.remove({ _id: req.params.paisId })
    .exec()
    .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.paisId }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
