import { tx, ty } from "./game.js"

export function AddLaptopControls(socket, room, Game, Controller){
    const res ={
        angle: 0,
        load(){
            this.events()
        },
        events(){
            window.addEventListener(`keydown`, (e)=>{
                // Controller.call(`keyactiveevents`, {key: e.key, angle: this.angle})
            })
            window.addEventListener(`keyup`, (e)=>{
                // Controller.call(`keyinactiveevents`, {key: e.key, angle: this.angle})
            })
            window.addEventListener(`pointerdown`, (e)=>{
                console.log(`down`)
            })
            window.addEventListener(`pointermove`, (e)=>{
                const rect = Game.canvas.getBoundingClientRect()
                this.mx = e.clientX - rect.x - tx
                this.my = e.clientY - rect.y - ty
                let r =this?.player?.character?.rect
                if(r)
                this.angle = Math.atan2(this.my - r.y, this.mx - r.x) 
                // console.log(`move`, this.angle, Math.cos(this.angle) * 12)
                Controller.call(`keyactiveevents`, {key: e.key, aimangle: this.angle})
            })
            window.addEventListener(`pointerup`, (e)=>{
                console.log(`up`)
            })
        },
    }
    res.load()
    socket.on(`player-update`, (p)=>{
        res.player = p
    })
    return res
}
