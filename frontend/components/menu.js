import { domextract } from "../utils/domextract.js"
import { Game } from "./game.js"
let PLAYERS = {}
let ROOMS = {}



export function Menu(socket){
    const res = {
        style(){return `width: 100%;height: 100%;background: red;position: absolute;top: 0;left: 0;display: flex;justify-content: space-between;align-items: center;`},
        menustyle(){return ``},
        canvasstyle(){return `position: absolute; top:0; left:0; width: 100%; height: 100%; background: transparent;`},
        sideleftstyle(){return `padding:.5rem; overflow-y: auto; position: absolute;top: 0;left: 0;width: 15%;height: 100%;background: #ffffff08;backdrop-filter: blur(5px);border-radius: 0 .5rem .5rem 0;`},
        siderightstyle(){return `padding: .5rem;overflow-y: auto;  position: absolute;top: 0;right: 0;width: 15%;height: 100%;background: #ffffff08;backdrop-filter: blur(5px);border-radius: 0 .5rem .5rem 0;`},
        imgstyle(){return `width: 100%; height: 100%`},
        btnstyle(){return `flex-shrink:0;width: 100%; margin-bottom: 1rem;cursor:pointer;height: 4rem;display: flex;align-items: center;justify-content: center;text-align: center;border-radius: .2rem;background: #98154a;color: #460310ff;text-transform: uppercase;`},
        sockettextstyle(){return `position: absolute;bottom: .5rem;right: .2rem;color: #fe5b41;font-size: .7rem;`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`menu`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <img src='public/dodobg.jpg' style='${this.imgstyle()}'/>
            <canvas style='${this.canvasstyle()}'></canvas>            
            <div style='${this.menustyle()} class='menu'></div>
            <div style='${this.sideleftstyle()}'>
                <div style='${this.btnstyle()}' class='host btn'>host</div>
                <div style='${this.btnstyle()}' class='join btn'>join</div>
            </div>            
            <div style='${this.siderightstyle()}'></div>            
            <div style='${this.sockettextstyle()}'>${socket.id}</div>
            `
            document.body.append(this.element)
            domextract(this.element, 'classname',this)
        },
        events(){
            this.dom.host.onclick = ()=>{
                socket.emit(`host`)
            }
            socket.on(`hosted-room`, ({id})=>{
                console.log(`hosted`, id)
                //start wait room and configue game

            })
            this.dom.join.onclick = ()=>{
                socket.emit(`join`)

            }
            socket.on(`joined-room`, ({id})=>{
                console.log(`joined`,id)
                socket.emit(`tell-room-to-start-game`, id)
                

            })
        },
        load(){
            this.ui()
            this.events()
        },
        update(){}
    }
    socket.on(`start-game`, (roomid)=>{
        console.log(`Current Room`,roomid)
        const game = Game(roomid, socket)
    })
    res.load()
    return res
}
