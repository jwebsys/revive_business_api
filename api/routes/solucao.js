const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const Solucao = require("../models/solucao");
const Pessoa = require("../models/pessoa");

get_externo_ifce = async () => {
  return axios
    .get("http://prpi.ifce.edu.br/nl/acoescovidws/?num=100000")
    .then((docs) => {
      let solucoes = [],
        solucao = {};
      docs.data.posts.forEach((element) => {
        solucao = {
          nome: element.row.NomeDaAcao,
          tipo: element.row.TipoDeAcao,
          responsavel: element.row.Responsavel,
          instituicao: element.row.Instituicao,
          descricao: element.row.MaisInformacoes,
          status: element.row.StatusAcao,
          link_web: element.row.LinkWeb,
          link_youtube: element.row.LinkYoutube,
          base: "prpi.ifce.edu.br",
        };
        solucoes.push(solucao);
      });
      return solucoes;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
};

router.get("/", (req, res, next) => {
  Solucao.find()
    .sort({ nome: "asc" })
    .populate("responsavel")
    .populate("cidade")
    .exec()
    .then(async (x) => {
      x = x.concat(await get_externo_ifce());
      res.status(200).json(x);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/buscarPorPessoa", (req, res) => {
  Solucao.find()
    .sort({ nome: "asc" })
    .populate("responsavel")
    .populate("cidade")
    .exec()
    .then(solucoes => {
      let solucoes_por_pessoa = [];
      solucoes.forEach(async solucao => {
        if (solucao.responsavel._id == req.query.pessoaId) {
          await solucoes_por_pessoa.push(solucao);
        }
      });
      if (solucoes_por_pessoa[0]) res.status(200).json(solucoes_por_pessoa);
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
}


// Paginação
//http://localhost:3000/solucao/pagina/2&3
router.get('/pagina/:page&:limit', (req, res, next) => {

  var page = parseInt(req.params.page) || 1
  var limit = parseInt(req.params.limit) || 10

  Solucao.find({})
    .skip((page * limit) - limit)
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

router.get("/busca", (req, res, next) => {
  // router.get("/busca/:busca&:page&:limit", (req, res, next) => {
  console.log('req.query')
  console.log(req.query)
  // req.query = JSON.parse(req.query);
  // var page = parseInt(req.params.page) || 1
  // var limit = parseInt(req.params.limit) || 10

  Solucao.find()
    // .skip((page * limit) - limit)
    // .limit(limit)
    .sort({ nome: "asc" })
    .populate("responsavel")
    .populate("cidade")
    .exec()
    .then(async (solucoes) => {
      solucoes = solucoes.concat(await get_externo_ifce());

      if (req.query.status && req.query.status != "")
        solucoes =
          (await solucoes.filter(
            (obj) =>
              obj.status &&
              removeAcento(obj.status).includes(
                removeAcento(req.query.status)
              )
          )) || [];

      if (
        req.query.area_aplicacao &&
        req.query.area_aplicacao != ""
      )
        solucoes =
          (await solucoes.filter(
            (obj) =>
              obj.area_aplicacao &&
              removeAcento(obj.area_aplicacao).includes(
                removeAcento(req.query.area_aplicacao)
              )
          )) || [];

      if (
        req.query.negocio &&
        req.query.negocio != ""
      )
        solucoes =
          (await solucoes.filter(
            (obj) =>
              obj.negocio &&
              removeAcento(obj.negocio).includes(
                removeAcento(req.query.negocio)
              )
          )) || [];

      if (req.query.busca && req.query.busca != "")
        solucoes =
          (await solucoes.filter(
            (obj) =>
              (obj.nome &&
                removeAcento(obj.nome).includes(
                  removeAcento(req.query.busca)
                )) ||
              (obj.en_nome &&
                removeAcento(obj.en_nome).includes(
                  removeAcento(req.query.busca)
                )) ||
              (obj.tipo &&
                removeAcento(obj.tipo).includes(
                  removeAcento(req.query.busca)
                )) ||
              (obj.status &&
                removeAcento(obj.status).includes(
                  removeAcento(req.query.busca)
                )) ||
              (obj.area_aplicacao &&
                removeAcento(obj.area_aplicacao).includes(
                  removeAcento(req.query.busca)
                )) ||
              (obj.negocio &&
                removeAcento(obj.negocio).includes(
                  removeAcento(req.query.busca)
                )) ||
              (obj.cidade && obj.cidade.nome &&
                removeAcento(obj.cidade.nome).includes(
                  removeAcento(req.query.busca)
                ))
              ||
              (obj.en_pais &&
                removeAcento(obj.en_pais).includes(
                  removeAcento(req.query.busca)
                ))
          )) || [];

      res.status(200).json({ solucoes });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/LinksAndEmails", async (req, res, next)=>{
  let saidas = []; 
  Solucao.find()
              .sort({ nome: "asc" })
              .populate("responsavel")
              .exec()
              .then(async (x) => {
                x = x.concat(await get_externo_ifce());
                for(let i = 0; i < x.length; i++) {
                  
                  let obj = {};
                  
                  if (x[i].en_nome == undefined || x[i].en_nome == null || x[i].en_nome == '' || x[i].en_nome == "") obj.en_nome = "Não informado";
                  else obj.en_nome = x[i].en_nome;
                  if (x[i].nome == undefined || x[i].nome == null || x[i].nome == '' || x[i].nome == "") obj.nome = "Não informado";
                  else obj.nome = x[i].nome;
                  if (x[i].responsavel == null || x[i].responsavel == undefined) obj.email = "Não informado"
                  else obj.email = x[i].responsavel.email;
                  if (x[i].link_web == null || x[i].link_web == undefined || x[i].link_web == '' || x[i].link_web == "") obj.link_web = "Não informado"
                  else obj.link_web = x[i].link_web;
                  saidas.push(obj);
                }
                res.status(200).json(saidas);
              })
              .catch((err) => res.status(500).json({ error: err }));

})

router.get("/:solucaoId", (req, res, next) => {
  Solucao.findById(req.params.solucaoId)
    .populate("responsavel")
    .populate("cidade")
    .exec()
    .then((x) => {
      if (x) res.status(200).json(x);
      else res.status(404).json({ message: "Registro não encontrado!" });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.get("/cont/cont/", (req, res, next) => {
  Solucao.find().countDocuments(function (err, count) {
    if (count) res.status(200).json(count);
    else res.status(404).json({ message: "Registro não encontrado!" });
  })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/", (req, res, next) => {
  const solucao = new Solucao({
    _id: new mongoose.Types.ObjectId(),
    responsavel: req.body.responsavel,
    nome: req.body.nome,
    tipo: req.body.tipo,
    instituicao: req.body.instituicao,
    descricao: req.body.descricao,
    status: req.body.status,
    link_web: req.body.link_web,
    link_youtube: req.body.link_youtube,
    area_aplicacao: req.body.area_aplicacao,
    negocio: req.body.negocio,
    cidade: req.body.cidade,
    en_nome: req.body.en_nome,
    en_descricao: req.body.en_descricao,
    en_pais: req.body.en_pais,
  });
  solucao
    .save()
    .then(() => {
      res.status(201).json({ message: "Salvo com sucesso!", _id: solucao._id });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.put("/:solucaoId", (req, res, next) => {
  Solucao.update({ _id: req.params.solucaoId }, { $set: req.body })
    .exec()
    .then((x) => res.status(200).json({ message: "Editado com sucesso!", _id: req.params.solucaoId }))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/:solucaoId", (req, res, next) => {
  Solucao.remove({ _id: req.params.solucaoId })
    .exec()
    .then((x) => res.status(200).json({ message: "Excluído com sucesso!", _id: req.params.solucaoId }))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
