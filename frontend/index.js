import { Menu } from "./components/menu.js"

const socket = io()

socket.on('connect', ()=>{
    Menu(socket)
    
})
socket.on('init-keys',()=>{
    console.log(`lklk`)
})
window.onkeydown = (e)=>{
    socket.emit('keydown', ({key:e.key}))
    console.log(`keydown`)
}
window.onkeyup = (e)=>{
    socket.emit('keyup', ({key:e.key}))
}

