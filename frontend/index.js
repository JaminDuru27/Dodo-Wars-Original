import { Menu } from "./components/menu.js"

const socket = io()

socket.on('connect', ()=>{
    Menu(socket)
})