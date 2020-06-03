const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Estado = require("../models/estado");

router.get("/", (req, res, next) => {
  Estado.find()
    .sort({ nome: "asc" })
    .populate("pais")
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:estadoId", (req, res, next) => {
  Estado.findById(req.params.estadoId)
    .populate("pais")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  const estado = new Estado({
    _id: new mongoose.Types.ObjectId(),
    pais: req.body.pais,
    nome: req.body.nome,
  });
  estado
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!", _id: estado._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:estadoId", (req, res, next) => {
  Estado.update({ _id: req.params.estadoId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.estadoId }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:estadoId", (req, res, next) => {
  Estado.remove({ _id: req.params.estadoId })
    .exec()
    .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.estadoId }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
