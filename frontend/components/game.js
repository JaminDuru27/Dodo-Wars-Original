import { images } from "../index.js"
import { domextract } from "../utils/domextract.js"

let animates
let tx  = 0
let ty = 0
let ltx = 0
let lty = 0
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
            this.ctx.save()
            this.ctx.scale(1, 1)
            this.ctx.translate(tx, ty)
            this.ctx.imageSmoothingEnabled = false

            this?.game?.sprites?.forEach(sp=>{
                const img = images.find(img=>img.name === sp.name)
                if(!img)return
                // this.ctx.save()  
                
                if(!sp.flip){
                    this.ctx.drawImage(
                        img.img,
                        sp.sw * sp.framex,
                        sp.sh * sp.framey,
                        sp.sw,
                        sp.sh,
                        sp.x,sp.y,sp.w,sp.h,
                    )
                 }else{
                    this.ctx.save()
                    this.ctx.translate(sp.x + sp.w/2, sp.y + sp.h/2) //x + w/2, y+ w/2
                    this.ctx.scale(-1, 1)//scale-x = -1
                    this.ctx.drawImage(
                        img.img,
                        sp.sw * sp.framex,
                        sp.sh * sp.framey,
                        sp.sw,
                        sp.sh,
                        -sp.w /2,//-w/2
                        -sp.h /2, //-h/2
                        sp.w,sp.h,
                    )
                    this.ctx.restore()
                }
                // this.ctx.restore()
            })
        
            // this.game?.rects?.forEach(rect=>{
            //     this.ctx.fillStyle = ` #ff000040` 
            //     this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h) 
            // })
            
            this.game.players.forEach(player=>{
                this.ctx.fillStyle = `#fff` 
                this.ctx.lineWidth = 1
                this.ctx.font =`12px Arial` 
                this.ctx.textAlign = `center`
                this.ctx.fillText(player?.text.content, player?.text?.x, player?.text?.y) 
            })
            this.ctx.restore()
            socket.emit(`translate`, ({tx, ty}))
        },    
    }
    res.load()
    socket.on(`translate-x`, (vx)=>{
        if(tx >= 0 && vx < 0){
            tx = 0 
            return
        }
        if(vx > 0 && tx <= -(res.game.world.w - window.innerWidth)){
            tx = -(res.game.world.w - window.innerWidth)
            return
        }
        tx -= vx
    })
    socket.on(`translate-y`, (vy)=>{
        if(ty >= 0 && vy < 0){
            ty = 0 
            return
        }
        if(vy > 0 && ty <= -(res.game.world.h - window.innerHeight)){
            ty = -(res.game.world.h - window.innerHeight)
            return
        }
        ty -= vy
    })
    return res
}
function animate(){
    animates?.update()
    requestAnimationFrame(animate)
}
animate()