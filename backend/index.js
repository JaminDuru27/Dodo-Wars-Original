const express = require('express')
const { default: SocketFunctions } = require('./socket/socketFunctions')
const app = express()
const http = require('http').createServer(app)
const env = require('dotenv').config()

app.use(express.static('../frontend'))

const io = require('socket.io')(http, {
    cors:{
        origin: '*',
        methods: ['GET', 'POST']
    }
})

SocketFunctions(io)

app.get('/', (req, res)=>{
    res.json({message: `idj`})
})
const port = process.env.PORT || 8000
http.listen(port, ()=>console.log(`Server Running on port ${port}`))