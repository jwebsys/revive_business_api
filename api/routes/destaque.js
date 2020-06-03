const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Destaque = require("../models/destaque");

router.get("/", (req, res, next) => {
  Destaque.find()
    .populate("solucao")
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:destaqueId", (req, res, next) => {
  Destaque.findById(req.params.destaqueId)
    .populate("solucao")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  const destaque = new Destaque({
    _id: new mongoose.Types.ObjectId(),
    solucao: req.body.solucao,
    descricao: req.body.descricao,
  });
  destaque
    .save()
    .then(() => {
      res
        .status(201)
        .json({ message: "Salvo com sucesso!", _id: destaque._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:destaqueId", (req, res, next) => {
  Destaque.update({ _id: req.params.destaqueId }, { $set: req.body })
    .exec()
    .then((x) =>
      res
        .status(200)
        .json({ message: "Editado com sucesso!", _id: req.params.destaqueId })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:destaqueId", (req, res, next) => {
  Destaque.remove({ _id: req.params.destaqueId })
    .exec()
    .then((x) =>
      res
        .status(200)
        .json({ message: "Excluído com sucesso!", _id: req.params.destaqueId })
    )
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
