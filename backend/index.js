const express = require('express')
const app = express(app)
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors:{
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const port = 5000