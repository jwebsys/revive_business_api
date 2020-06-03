const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const Noticia = require("../models/noticia");

router.get("/", (req, res, next) => {
  Noticia.find()
    .sort({ titulo: "asc" })
    .populate("responsavel")
    .populate("palavras_chave")
    .exec()
    .then((x) => res.status(200).json(x))
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/buscarPorPessoa", (req, res) => {
  Noticia.find()
    .sort({ titulo: "asc" })
    .populate("responsavel")
    .populate("palavras_chave")
    .exec()
    .then((noticias) => {
      let noticias_por_pessoa = [];
      noticias.forEach(async noticia => {
        if (noticia.responsavel._id == req.query.pessoaId)
          await noticias_por_pessoa.push(noticia);
      });
      if (noticias_por_pessoa[0]) res.status(200).json(noticias_por_pessoa);
      else res.status(404).json([]);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

removeAcento = (text) => {
  text = text.toLowerCase();
  text = text.replace(new RegExp("[ÁÀÂÃ]", "gi"), "a");
  text = text.replace(new RegExp("[ÉÈÊ]", "gi"), "e");
  text = text.replace(new RegExp("[ÍÌÎ]", "gi"), "i");
  text = text.replace(new RegExp("[ÓÒÔÕ]", "gi"), "o");
  text = text.replace(new RegExp("[ÚÙÛ]", "gi"), "u");
  text = text.replace(new RegExp("[Ç]", "gi"), "c");
  return text;
};

router.get("/busca/:busca", (req, res, next) => {
  req.params.busca = JSON.parse(req.params.busca);
  Noticia.find()
    .sort({ titulo: "asc" })
    .populate("responsavel")
    .populate("palavras_chave")
    .exec()
    .then(async (noticias) => {
      if (req.params.busca.titulo && req.params.busca.titulo != "")
        noticias =
          (await noticias.filter(
            (obj) =>
              obj.status &&
              removeAcento(obj.titulo).includes(
                removeAcento(req.params.busca.titulo)
              )
          )) || [];

      if (req.params.busca.subtitulo && req.params.busca.subtitulo != "")
        noticias =
          (await noticias.filter(
            (obj) =>
              obj.subtitulo &&
              removeAcento(obj.subtitulo).includes(
                removeAcento(req.params.busca.subtitulo)
              )
          )) || [];

      if (req.params.busca.descricao && req.params.busca.descricao != "")
        noticias =
          (await noticias.filter(
            (obj) =>
              obj.negocio &&
              removeAcento(obj.descricao).includes(
                removeAcento(req.params.busca.descricao)
              )
          )) || [];

      if (req.params.busca.busca && req.params.busca.busca != "")
        noticias =
          (await noticias.filter(
            (obj) =>
              (obj.titulo &&
                removeAcento(obj.titulo).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.subtitulo &&
                removeAcento(obj.subtitulo).includes(
                  removeAcento(req.params.busca.busca)
                )) ||
              (obj.descricao &&
                removeAcento(obj.descricao).includes(
                  removeAcento(req.params.busca.busca)
                ))
            // ||
            // (obj.palavras_chave &&
            //   removeAcento(obj.palavras_chave).includes(
            //     removeAcento(req.params.busca.busca)
            //   ))
          )) || [];

      res.status(200).json({ noticias });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/pagina/:page&:limit", (req, res, next) => {
  var page = parseInt(req.params.page) || 1;
  var limit = parseInt(req.params.limit) || 10;

  Noticia.find({})
    .skip(page * limit - limit)
    .limit(limit)
    .populate("responsavel")
    .populate("palavras_chave")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/:noticiaId", (req, res, next) => {
  Noticia.findById(req.params.noticiaId)
    .populate("responsavel")
    .populate("palavras_chave")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/cont/cont/", (req, res, next) => {
  Noticia.find()
    .countDocuments(function (err, count) {
      if (count) res.status(200).json(count);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  const noticias = new Noticia({
    _id: new mongoose.Types.ObjectId(),
    titulo: req.body.titulo,
    subtitulo: req.body.subtitulo,
    data_publicacao: req.body.data_publicacao,
    data_atualizacao: req.body.data_atualizacao,
    descricao: req.body.descricao,
    responsavel: req.body.responsavel,
    palavras_chave: req.body.palavras_chave,
    en_titulo: req.body.en_titulo,
    en_subtitulo: req.body.en_subtitulo,
    en_descricao: req.body.en_descricao,
  });

  noticias
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!", _id: noticias._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:noticiaId", (req, res, next) => {
  Noticia.update({ _id: req.params.noticiaId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.noticiaId }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:noticiaId", (req, res, next) => {
  Noticia.remove({ _id: req.params.noticiaId })
    .exec()
    .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.noticiaId }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
