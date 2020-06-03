const express = require("express");
const axios = require('axios');
const router = express.Router();

router.get("/", async (req, res) => {
    const url = 'https://api.thevirustracker.com/free-api?countryTotal=BR'
    await axios.get(url)
        .then((response) => {
            // response.data.countrydata.foreach((element) => {
            //     console.log(element.data)
            //     // const dados = {
            //     //     titulo: element.info.title,
            //     //     sigla: element.info.code,
            //     //     fonte: element.info.source,
            //     //     casos: element.total_cases,
            //     //     curas: element.total_recovered,
            //     //     mortes: element.total_deaths,
            //     //     novos_casos_hoje: element.total_new_cases_today,
            //     //     novas_mortes_hoje: element.total_new_deaths_today,
            //     //     casos_ativos: element.total_active_cases,
            //     //     casos_graves: element.total_serious_cases,
            //     //     posicao: element.total_danger_rank,
            //     // }
            //     // console.log(dados)
            // })

            const brasil = {
                titulo: response.data.countrydata[0].info.title,
                sigla: response.data.countrydata[0].info.code,
                fonte: response.data.countrydata[0].info.source,
                casos: response.data.countrydata[0].total_cases,
                curas: response.data.countrydata[0].total_recovered,
                mortes: response.data.countrydata[0].total_deaths,
                novos_casos_hoje: response.data.countrydata[0].total_new_cases_today,
                novas_mortes_hoje: response.data.countrydata[0].total_new_deaths_today,
                casos_ativos: response.data.countrydata[0].total_active_cases,
                casos_graves: response.data.countrydata[0].total_serious_cases,
                posicao: response.data.countrydata[0].total_danger_rank,
            }

            res.status(201).json(brasil)
        })
        .catch((err) => res.status(500).json({ error: err }));
})

module.exports = router;
