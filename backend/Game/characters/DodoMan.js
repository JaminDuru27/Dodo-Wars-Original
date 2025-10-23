import { Controls } from "../plugins/controls(phone).js"
import { Health } from "../plugins/health.js"
import { Keybinder } from "../plugins/keybinder.js"
import { Pan } from "../plugins/pan.js"
import { Particles } from "../plugins/particles.js"
import { Rect } from "../plugins/rect.js"
import { Sprite } from "../plugins/sprite.js"
import { StateManager } from "../plugins/stateManager.js"
import { Text } from "../plugins/text.js"

export function DodoMan(player, socket, io, Game){
    const res = {
        load(){
            this.rect= Rect(Game)
            this.text = Text(this.rect).set(player.name)

            this.keybinder = Keybinder(socket, io)
            this.keybinder.onkeydown({key: 'ArrowUp',cb:()=>{
                this.rect.vy = -15
            }})
            .onkeydown({key: 'ArrowLeft',cb:()=>{
                this.rect.vx = -5
                this.particles.populate(this.runparticlesdata)

            }})
            .onkeyup({key: `ArrowLeft`, cb:()=>{
                this.rect.vx = 0
                this.particles.populate(this.stopparticlesdata)
            }})
            .onkeydown({key: `ArrowRight`, cb:()=>{
                this.rect.vx = 5
                this.particles.populate(this.runparticlesdata)

            }})
            .onkeyup({key: `ArrowRight`, cb:()=>{
                this.rect.vx = 0
                this.particles.populate(this.stopparticlesdata)
            }})
            .onkeydown({key: `ArrowDown`, cb:()=>{
                this.slamming = true
            }})
            .onkeydown({key: `ArrowDown`, cb:()=>{
                this.slamming = true
            }})
            .onkeyup({key: `ArrowUp`, cb:()=>{
                this.slamming = false
            }})
            this.pan = Pan(socket, player, this.rect)
            this.sprite = Sprite(socket, this.rect, Game)
            .name('dodoman').set(8, 8).loadImage('/public/players/dodoman.png')
            this.sprite.offx = -20
            this.sprite.offy = -27
            this.sprite.offw = 40
            this.sprite.offh = 40
            this.sprite.zIndex = 2
            this.sprite.addclip(`Idle`).from(0).to(3).loop().delay(2).play()
            this.sprite.addclip(`Run`).from(17).to(31).loop().delay(1)
            this.sprite.addclip(`Roll`).from(40).to(48).loop().delay(1)
            this.sprite.addclip(`Hit`).from(49).to(52).loop().delay(0)
            this.sprite.addclip(`Death`).from(56).to(50).loop().delay(1)
 
            this.health = Health(this.rect)
            
            this.health.addbar().color(`green`).health(100)
            this.health.addbar().color(`green`).health(100)
            this.health.addbar().color(`green`).health(100)
            this.health.addbar().color(`green`).health(100)

            this.particles = Particles(this.rect)
            this.runparticlesdata = {number: 3, size: 10, type: `rect`, wb: this.rect.w, hb: 5, dec:0.09, offy: this.rect.h - 5,}
            this.stopparticlesdata = {number: 5, size: 15, type: `rect`, wb: this.rect.w, hb: 5, dec:0.01, offy: this.rect.h - 5,}
 
            this.stateManager = StateManager()
             this.stateManager.add().name('Idle').cond(()=>this.rect.vx === 0 && (this.rect.vy === this.rect.weight || this.rect.vy === 0))
            .cb(()=>{
                this.sprite.playclip('Idle')
            })
            this.stateManager.add().name('RunLeft').cond(()=>this.rect.vx < 0)
            .cb(()=>{
                this.sprite.playclip('Run')
                this.sprite.flip = true
            })

            this.stateManager.add().name('RunRight').cond(()=>this.rect.vx > 0)
            .cb(()=>{
                this.sprite.playclip('Run')
                this.sprite.flip = false
            })
            this.stateManager.add().name('Fall').cond(()=>this.rect.vy > this.rect.weight)
            .cb(()=>{
                this.sprite.playclip('Roll')
                this.sprite.flip = false
            })

            this.controls = Controls(socket)
            this.controls.createbtn({style:'bottom: 31%; left: 13%;', size:`4rem`, src: '/public/buttons/DodoMan/jump.png'})
            .cbdown(()=>{
                this.rect.vy = -15
            })
            this.controls.createbtn({style:'bottom: 10%; left: 5%;', size:`4rem`,src: '/public/buttons/DodoMan/run-left.png'})
            .cbdown(()=>{
                this.rect.vx = -5
            })
            .cbup(()=>{
                this.rect.vx = 0
            })
            this.controls.createbtn({style:'bottom: 10%; left: 21%;', size:`4rem`, src: '/public/buttons/DodoMan/run-right.png'})
            .cbdown(()=>{
                this.rect.vx = 5
            })
            .cbup(()=>{
                this.rect.vx = 0
            })
            this.controls.createjoystick({style:'bottom: 10%; right: 10%;', size: `8rem`})
            .axischange(({angle})=>{
                player.aimangle = angle
            })
        },
    }
    res.load()
    return res
}