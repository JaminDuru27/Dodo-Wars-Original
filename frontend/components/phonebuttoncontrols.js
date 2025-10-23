import { domextract } from "../utils/domextract.js"

export function AddPlayerControlBtns(socket, room, Game, Controller){
    const res = {
        btnstyle(){return `cursor: pointer;position: absolute;background: #00000021;border-radius: 50%;overflow: hidden;border: 2px solid #ffffff2b;display: flex;justify-content: center;align-items: center;`},
        imgstyle(){return `width: 80%; height: 80%`},
        joystickstyle(){return `position: absolute;display:flex;justify-content:center;align-items:center;background: #00000073;border-radius: 50%;overflow: visible;border: 2px solid #ffffff2b;display: flex;justify-content: center;align-items: center;bottom: 2rem;right: 5rem;`},
        thumbstyle(){return `width: 50%;height: 50%;background: #ffffff87;border: 2px solid #00000057;border-radius: 50%;`},
        addjoystick({xpos, ypos, size = `5rem`, maxdist = 50, style = '', eventname}){
            const btn = document.createElement(`div`)
            btn.setAttribute(`style`, this.joystickstyle() + style)
            btn.innerHTML += `
            <div draggable = "false" style='${this.thumbstyle()}' class='thumb'/>
            `
            Game.dom.game.append(btn)
            const dom = domextract(btn).object
            
            if(ypos)
            btn.style.top = ypos
            if(xpos)
            btn.style.left = xpos
            btn.style.width = size
            btn.style.height = size
            let dragging = false
            const centerX = btn.getBoundingClientRect().width / 2
            const centerY = btn.getBoundingClientRect().height / 2
            btn.onpointerdown= ()=>{
                dragging = true
            }
            btn.onpointerup= (e)=>{
                dragging = false
                dom.thumb.style.transform = `translate(0px, 0px)`
                const rect = btn.getBoundingClientRect()
                calcjoystick(e, 0, 0)
                
            }
            
            btn.onpointermove = (e)=>{
                if(!dragging)return
                calcjoystick(e)
            }
            function calcjoystick(e, xp, yp){
                const rect = btn.getBoundingClientRect()
                const x = (xp || xp === 0)?xp:e.clientX - rect.left - centerX 
                const y = (yp || yp === 0)?yp: e.clientY - rect.top - centerY 
                const maxRadius = maxdist
                const dist = Math.min(Math.sqrt(x*x + y*y), maxRadius)
                let angle = Math.atan2(y, x)
                dom.thumb.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle)* dist}px)`
                socket.emit(`on-axis-change-${eventname}`, {angle, dist})
            }
        },

        addbtn({xpos, ypos, size = `2rem`, src, style = '', eventname}){
            const btn = document.createElement(`btn`)
            btn.setAttribute(`style`, this.btnstyle() + style)
            btn.innerHTML += `
            <img src ='${src}' draggable = "false" style='${this.imgstyle()}' />
            `
            Game.dom.game.append(btn)

            if(ypos)
            btn.style.top = ypos
            if(xpos)
            btn.style.left = xpos
            btn.style.width = size
            btn.style.height = size
            btn.onpointerdown = ()=>{
                socket.emit(`on-button-down-${eventname}`)
            }
            btn.onpointerup = ()=>{
                socket.emit(`on-button-up-${eventname}`)
            }
        },

        load(){}
    }
    res.load()
    console.log(`conntrollerloadeds`)
    socket.emit(`controller-loaded`)
    socket.on(`create-button`, (props)=>{
        res.addbtn(props)
    },)
    socket.on(`create-joystick`, (props)=>{
        res.addjoystick(props)
    },)
    return res
}