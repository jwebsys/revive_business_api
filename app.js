const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
// Importar as rotas aqui
const pessoaRoutes = require('./api/routes/pessoa')
const enderecoRoutes = require('./api/routes/endereco')
const solucaoRoutes = require('./api/routes/solucao')
const paisRoutes = require('./api/routes/pais')
const estadoRoutes = require('./api/routes/estado')
const cidadeRoutes = require('./api/routes/cidade')
const palavraChaveRoutes = require('./api/routes/palavra_chave')
const externo = require('./api/routes/externo')
const forum = require('./api/routes/forum')
const noticiaRoutes = require('./api/routes/noticia')
const destaqueRoutes = require('./api/routes/destaque')
const coronaNoticias = require('./api/routes/corona_noticia')
const acessoNoticias = require('./api/routes/acesso')
const enviarEmailRoutes = require("./api/routes/enviarEmail");
const oauthRouter = require('./oauth/route')
const senha_banco = 'portifolio-corona-api'

const { protect } = require('./oauth')

mongoose.connect(
  'mongodb+srv://REVIVE-BUSINES-API:' +
  senha_banco +
  '@cluster0-iddjy.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// Usar as rotas aqui
app.use('/oauth', oauthRouter)
app.use('/pessoa', protect, pessoaRoutes)
app.use('/endereco', protect, enderecoRoutes)
app.use('/solucao', protect, solucaoRoutes)
app.use('/pais', protect, paisRoutes)
app.use('/palavra_chave', protect, palavraChaveRoutes)
app.use('/estado', protect, estadoRoutes)
app.use('/cidade', protect, cidadeRoutes)
app.use('/externo', protect, externo)
app.use('/forum', protect, forum)
app.use('/noticia', protect, noticiaRoutes)
app.use('/destaque', protect, destaqueRoutes)
app.use('/corona_noticia', protect, coronaNoticias)
app.use('/acesso', protect, acessoNoticias)
app.use("/enviarEmail", protect, enviarEmailRoutes);


app.get('/senhas', async () => {
  const users = await Pessoa.find()

  for (const user of users) {
    user.senha = b
  }
})

app.use((req, res, next) => {
  const error = new Error('Não encontrado')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
