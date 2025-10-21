import { domextract } from "../utils/domextract.js"

let animates
export function Game(roomid, socket){
    const res = {
        gamestyle(){return `position: absolute;top: 0;left: 0;z-index: 10;width: 100%;height: 100%;`},
        style(){return `width: 100%; height: 100vh; position: absolute; top: 0; left:0;`},
        canvasstyle(){return ``},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`game`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div style='${this.gamestyle()} class='menu'></div>
            <canvas style='${this.canvasstyle()}' class='canvas'></canvas>
            `
            domextract(this.element, 'classname',this)
            document.body.append(this.element)
            this.canvas = this.dom.canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
        },
        events(){},
        load(){
            this.ui()
            socket.emit('ui-loaded')
            socket.on('get-canvas-size', ()=>{
                socket.emit('update-canvas-size', ({W:this.canvas.width, H:this.canvas.height}))
            })
            //load static assets
            //animate
            animates = this
            socket?.on('game-update', (game)=>{this.game = game})
        },
        lerp(a,b, t){return a + (b - a) * t},
        update(){
            if(!this?.game)return
            if(!this.ctx)return
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            this.game.players.forEach(player=>{
                this.ctx.fillStyle = player.rect.color 
                this.ctx.fillRect(player.rect.x, player.rect.y, player.rect.w, player.rect.h) 
            })
            this.game?.rects?.forEach(rect=>{
                this.ctx.fillStyle = ` #ff000040` 
                this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h) 
            })
        },    
    }
    res.load()
    
    return res
}
function animate(){
    animates?.update()
    requestAnimationFrame(animate)
}
animate()