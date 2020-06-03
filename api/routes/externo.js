const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  axios
    .get("http://prpi.ifce.edu.br/nl/acoescovidws/?num=100000")
    .then((docs) => {
      solucoes = [];
      docs.data.posts.forEach((element) => {
        let solucao = {
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
      res.status(200).json(solucoes);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
