import { images } from "../index.js"
import { domextract } from "../utils/domextract.js"
import { Controller } from "./controller.js"

let animates
export let tx  = 0
export let ty = 0
let ltx = 0
let lty = 0
export function Game(roomid, socket){
    const res = {
        gamestyle(){return `position: absolute;top: 0;left: 0;z-index: 10;width: 100%;height: 100%;`},
        style(){return `width: 100%; height: 100%; position: absolute; top: 0; left:0;`},
        canvasstyle(){return ``},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`game`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div style='${this.gamestyle()}' class='game'></div>
            <canvas style='${this.canvasstyle()}' class='canvas'></canvas>
            `
            domextract(this.element, 'classname',this)
            document.body.append(this.element)
            this.canvas = this.dom.canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
        },
        events(){
            window.addEventListener(`resize`, ()=>{
                this.canvas.setAttribute(`style`,this.canvasstyle())
                this.canvas = this.dom.canvas
                this.canvas.width = this.canvas.clientWidth
                this.canvas.height = this.canvas.clientHeight
            })
        },
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
            this.controls = Controller(socket, roomid, this)
            this.controls.setForThisDevice()
            .onkeyactive((props)=>{
                // console.log(props)
                socket.emit(`set-aim-angle`, props.aimangle)
                this.aimangle  = props.aimangle
            })
            .onkeyinactive((props)=>{
                // console.log(props)
                socket.emit(`set-aim-angle`, props.aimangle)
                this.aimangle = props.aimangle
            })
            this.events()

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
                
                this.ctx.save()
                if(!sp.flip){
                    this.ctx.translate(sp.x,sp.y)
                    this.ctx.rotate(sp.rotation)
                    // this.ctx.fillStyle = ` #ffffff3e`
                    // this.ctx.fillRect(
                    //     (sp.rotaton > 0)?-sp.w/2:0,
                    //     (sp.rotaton > 0)?-sp.h/2:0,
                    //     sp.w,sp.h,)
                    this.ctx.drawImage(
                        img.img,
                        sp.sw * sp.framex,
                        sp.sh * sp.framey,
                        sp.sw,
                        sp.sh,
                        (sp.rotaton > 0)?-sp.w/2:0,
                        (sp.rotaton > 0)?-sp.h/2:0,
                        sp.w,sp.h,
                        
                    )
                 }else{
                    this.ctx.translate(sp.x + sp.w/2, sp.y + sp.h/2) //x + w/2, y+ w/2
                    if(sp.rotation === 0)
                    this.ctx.scale(-1, 1)//scale-x = -1
                    if(sp.rotation !== 0)
                    this.ctx.scale(1, -1)//scale-x = -1

                    this.ctx.rotate(-sp.rotation)
                    // this.ctx.fillStyle = ` #ffffff3e`
                    // this.ctx.fillRect(-sp.w /2,//-w/2
                    //     -sp.h /2, //-h/2
                    //     sp.w,sp.h,)
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
                }
                this.ctx.restore()

            })
            this.ctx.globalAlpha = 1
            this.game.players.forEach(player=>{
                this.ctx.fillStyle = `#fff` 
                this.ctx.lineWidth = 1
                this.ctx.font =`12px Arial` 
                this.ctx.textAlign = `center`
                this.ctx.fillText(player?.text.content, player?.text?.x, player?.text?.y) 
            
                //health
                this.ctx.lineWidth = 1
                player?.health?.bars.forEach((bar, x)=>{
                    const w = player.health.w / player?.health?.bars.length
                    const ww =  bar.health/100 * w
                    if(ww === 0)return
                    const gap = 2   
                    this.ctx.strokeStyle = `#fff`
                    this.ctx.fillStyle = bar.color
                    this.ctx.fillRect(player?.health?.x + w * x + (gap * x), player?.health?.y, ww - gap, 6)
                    this.ctx.strokeRect(player?.health?.x + w * x + (gap * x), player?.health?.y, ww - gap, 6)
                })
                //particles
                this.ctx.save()
                player.particles.forEach(particle=>{
                    this.ctx.fillStyle = particle.color
                    this.ctx.globalAlpha = particle.alpha
                    this.ctx.fillRect(+(particle.x), +(particle.y), +(particle.size), +(particle.size))
                })
                this.ctx.restore()
                //aimangle
                this.ctx.save()
                this.ctx.beginPath()
                this.ctx.lineWidth = 4
                this.ctx.setLineDash([9, 6])
                this.ctx.strokeStyle = `red`
                this.ctx.globalAlpha = .4
                // this.ctx.translate(this.player.x, this.player.y)
                this.ctx.moveTo(player.rect.x + player.rect.w/2, player.rect.y + player.rect.h/2)
                const length = window.innerHeight
                const endX =Math.cos(player.aimangle) * length
                const endY =Math.sin(player.aimangle) * length
                this.ctx.lineTo(player.rect.x + endX, player.rect.y +endY)
                this.ctx.stroke()
                this.ctx.closePath()
                this.ctx.restore()

                //WEAPONS
                //Bombs
                player.bombs.forEach(bomb=>{
                    bomb.array.forEach(b=>{
                        this.ctx.fillStyle = `transparent`
                        this.ctx.fillRect(b.x,b.y,b.w, b.h)
                    })
                })

                // this.ctx.fillStyle = ` #ff000031`
                // this.ctx.fillRect(player.rect.x, player.rect.y, player.rect.w, player.rect.h)
            })
            this.ctx.restore()
            socket.emit(`translate`, ({tx, ty}))
            socket.emit(`update-game-size`, ({W: this.canvas.clientWidth, H: this.canvas.clientHeight}))
        },    
    }
    res.load()
    socket.on(`player-update`, (p)=>{
        res.player = p
    })
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