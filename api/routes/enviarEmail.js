const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const nodemailer = require('nodemailer');
const Pessoa = require("../models/pessoa");

const transporte = nodemailer.createTransport({
    service: 'gmail', // Como mencionei, vamos usar o Gmail
    auth: {
      user: 'contato.revive@ifce.edu.br', // Basta dizer qual o nosso usuário
      pass: 'ConR530-@d#'             // e a senha da nossa conta
    } 
  });

  router.post("/:forgotPassword", async(req, res, next) => {

    const email = req.body.email;
 
    try {

      if (await Pessoa.findOne({email})) {
        res.status(201).json({ message: "E-mail encontrado!" });

        senha = (await Pessoa.find({email : email} , {_id:0, senha:1})).toString();
        
        var emailEnviar = {
          from: 'endereco@gmail.com', // Quem enviou este e-mail
          to: email, // Quem receberá
          subject: 'Recuperação de Senha - REVIVE',  // Um assunto bacana :-) 
          html: 'Recuperação de senha da plataforma REVIVE.</strong> <br><br> E-mail: ' + email  + '<br><br>' + 'Sua senha: ' + senha  // O conteúdo do e-mail
        };        
        
        transporte.sendMail(emailEnviar, function(err, info){
          if(err)
            throw err; // Oops, algo de errado aconteceu.
                  //console.log('Email enviado! Leia as informações adicionais: ', info);
        });
       
      }
      else{
        res.status(400).send({ error: 'E-mail não encontrado!'});  
      }
    
    } catch (err){
      res.status(400).send({ error: 'Erro na recuperação de senha'});
    }
  
  });

  module.exports = router;
