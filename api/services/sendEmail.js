require('dotenv').config()
const nodemailer = require('nodemailer')

//Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

//Step 2
exports.send = async(user) => {
    transporter.sendMail({
        from: 'REVIVE <joycequintino11@gmail.com>',
        to: 'joycequintino11@gmail.com',
        subject: 'Solicitação de criação de fórum na Plataforma REVIVE',
        text: 'Olá, o usuário '+ user + ' solicitou a criação de um fórum na plataforma REVIVE.\n'+ 
               'Dirija-se ao REVIVE para ativar o fórum de '+ user+'.'
    })
}
