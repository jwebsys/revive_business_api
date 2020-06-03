const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Forum = require("../models/forum");
const emailService = require("../services/sendEmail");

router.get("/", (req, res, next) => {
  Forum.find()
    .sort({ nome: "asc" })
    .populate("responsavel")
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/buscarPorPessoa", (req, res) => {
  Forum.find()
    .sort({ nome: "asc" })
    .populate("responsavel")
    .exec()
    .then((foruns) => {
      let foruns_por_pessoa = [];
      foruns.forEach(async forum => {
        if (forum.responsavel._id == req.query.pessoaId)
          await foruns_por_pessoa.push(forum);
      });
      if (foruns_por_pessoa[0]) res.status(200).json(foruns_por_pessoa);
      else res.status(404).json([]);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/pagina/:page&:limit", (req, res, next) => {
  var page = parseInt(req.params.page) || 1;
  var limit = parseInt(req.params.limit) || 10;

  Forum.find({})
    .skip(page * limit - limit)
    .limit(limit)
    .sort({ nome: "asc" })
    .populate("responsavel")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:forumId", (req, res, next) => {
  Forum.findById(req.params.forumId)
    .sort({ nome: "asc" })
    .populate("responsavel")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/cont/cont/", (req, res, next) => {
  Forum.find()
    .countDocuments(function (err, count) {
      if (count) res.status(200).json(count);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  console.log(req.body);

  const forum = new Forum({
    _id: new mongoose.Types.ObjectId(),
    responsavel: req.body.responsavel,
    nome: req.body.nome,
    descricao: req.body.descricao,
    link: req.body.link,
    status: true,
    en_nome: req.body.en_nome,
    en_descricao: req.body.en_descricao
  });

  forum
    .save()
    .then(() => {
      emailService.send(req.body.nome);
      res.status(201).json({
        message: "Salvo com sucesso! Email de solicitação enviado com sucesso.",
        _id: forum._id,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:forumId", (req, res, next) => {
  Forum.update({ _id: req.params.forumId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.forumId }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:forumId", (req, res, next) => {
  Forum.remove({ _id: req.params.forumId })
    .exec()
    .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.forumId }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
