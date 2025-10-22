import { Menu } from "./components/menu.js"

const socket = io()

socket.on('connect', ()=>{
    Menu(socket)
    window.onkeydown = (e)=>{
        socket.emit('keydown', ({key:e.key}))
        console.log(e.key)
    }
    window.onkeyup = (e)=>{
        socket.emit('keyup', ({key:e.key}))
    }
    
})
