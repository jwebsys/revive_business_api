const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Acesso = require("../models/acesso");

router.get("/novo", (req, res) => {
    Acesso.findById('5eb18f8ef0c52b71ec362e60')
        .exec()
        .then(async acesso => {
            acesso.solucoes = await parseInt(acesso.solucoes) + 1
            Acesso.update({ _id: acesso._id }, { $set: acesso })
                .exec()
                .then((x) => res.status(200).json(acesso))
                .catch((err) => res.status(500).json({ error: err }));
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

router.get("/", (req, res, next) => {
    Acesso.find()
        .sort({ nome: "asc" })
        .exec()
        .then((x) => res.status(200).json(x))
        .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:acessoId", (req, res, next) => {
    Acesso.findById(req.params.acessoId)
        .exec()
        .then((x) => {
            if (x) res.status(200).json(x);
            else res.status(404).json({ message: "Registro não encontrado!" });
        })
        .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
    const acesso = new Acesso({
        _id: new mongoose.Types.ObjectId(),
        solucoes: req.body.solucoes
    });
    acesso
        .save()
        .then(() => {
            res.status(201).json({ message: "Salvo com sucesso!", _id: acesso._id });
        })
        .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:acessoId", (req, res, next) => {
    Acesso.update({ _id: req.params.acessoId }, { $set: req.body })
        .exec()
        .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.acessoId }))
        .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:acessoId", (req, res, next) => {
    Acesso.remove({ _id: req.params.acessoId })
        .exec()
        .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.acessoId }))
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
