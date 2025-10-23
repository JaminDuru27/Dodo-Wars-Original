import { Menu } from "./components/menu.js"

const socket = io()
export let images = []
socket.on('connect', ()=>{
    images =[]
    Menu(socket)
    window.onkeydown = (e)=>{
        socket.emit('keydown', ({key:e.key}))
        console.log(e.key)
    }
    window.onkeyup = (e)=>{
        socket.emit('keyup', ({key:e.key}))
    }
    socket.on(`load-image`, ({src, id})=>{
        const img = new Image()
        img.onload = ()=>{
            const data = {}
            data.imgw = img.width
            data.imgh = img.height
            socket.emit(`loaded-image-${id}`, (data))
            console.log(images)
        }
        if(!images.find(m=>m.name === id))
        images.push({img, name: id})
        img.src= src
    })
})

window.oncontextmenu = (e)=>{
    e.preventDefault()
}
