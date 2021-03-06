const express = require("express");
const server = express();
const routes = require("./routes");
const path = require("path")

server.set('view engine', 'ejs')

//mudar a localização da pasta views
server.set('views', path.join(__dirname, 'views'))

//user req body
server.use(express.urlencoded({extended: true}))

//habilitar arquivos statics
server.use(express.static("public"))
server.use(routes)
server.listen(3000, ()=>(console.log("Servidor rodando na porta 3000 ")))