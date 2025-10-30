import { Animate } from "../plugins/animation.js"
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
        falsestate: false,
        load(){
            //RECT
            this.rect= Rect(Game)
            this.rect.name = `player-${socket.id}`
            this.rect.exception.push(`bomb${socket.id}`, `bullet-${socket.id}`, `damage`)
            this.rect.oncollisionwith(`damage`, (rect)=>{
                if(rect.id === socket.id)return
                this.health.decrement = rect.damage
                this.health.decrease()
            })
            
            this.rect.oncollisionbottom(()=>{
                if(this.hardlanding){
                    const hard = {
                        number: 100, size: 20, type: `rect`, 
                        wb: 500, hb: 5, 
                        dec:0.03, offx: -250,offy: this.rect.h - 5,}

                    this.particles.populate(hard)
                    this.hardlanding = false
                }
            })

            //TEXT
            this.text = Text(this.rect).set(player.name)
            this.text.offy =-30
            //KEYBINDER
            this.keybinder = Keybinder(socket, io)
            this.keybinder.onkeydown({key: 'ArrowUp',cb:()=>{
                this.rect.vy = -15
            }})
            .onkeydown({key: 'a',cb:()=>{
                player.loadouts?.weapon?.shoot()
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
            .onkeyup({key: `s`, cb:()=>{
                this.stateManager.setstate(`Roll`)
            }})
            .onkeyup({key: `d`, cb:()=>{
                this.stateManager.setstate(`Slam`)
            }})

            //PAN
            this.pan = Pan(socket, player, this.rect)
            this.sprite = Sprite(socket, this.rect, Game)
            .setname('dodoman').set(8, 8).loadImage('/public/players/dodoman.png')
            this.sprite.offx = -40
            this.sprite.offy = -57
            this.sprite.offw = 75
            this.sprite.offh = 70
            this.sprite.zIndex = 2
            let count = 0
            this.sprite.addclip(`Idle`).from(0).to(3).loop().delay(2).play()
            this.sprite.addclip(`Run`).from(17).to(31).loop().delay(1)
            this.sprite.addclip(`Roll`).from(40).to(48).loop().delay(1)
            .onframe(48,()=>{
                if(this.rolling){
                    this.rolling = false
                    this.stateManager.setstate(`Idle`)
                    this.rect.vx = 0
                }
                if(this.isslamming)
                if(count === 2){
                    this.rect.vy  = 25
                }
                if(this.slamming){
                    count = (count + 1) % 4
                    if(count >= 3){
                        this.slammin = false
                        this.stateManager.setstate(`Idle`)
                    }
                                       
                }
            })
            this.sprite.addclip(`Hit`).from(49).to(51).loop().delay(0).
            onframe(50, ()=>{
                this.sprite.playclip(`Idle`)
                this.stateManager.setstate(`Idle`)
            })
            
            this.sprite.addclip(`Death`).from(56).to(58).loop(false).delay(5)
 
            //HEALTH
            this.health = Health(this.rect)
            this.health.addbar().color(`green`).health(100)
            this.health.addbar().color(`green`).health(100)
            this.health.addbar().color(`green`).health(100)
            this.health.addbar().color(`green`).health(100)
            this.health.ondecrement(()=>{
                this.falsestate = true
                this.sprite.playclip(`Hit`)
            })
            this.health.onhealthempty(()=>{
                this.falsestate = true
                this.keybinder.shouldupdate = false
                this.controls.shouldupdate = false
                this.stateManager.shouldupdate = false
                this.particles.shouldupdate = false
                this.animator.playAnimation(`Death`)
            })

            //PARTICLES
            this.particles = Particles(this.rect)
            this.runparticlesdata = {number: 3, size: 10, type: `rect`, wb: this.rect.w, hb: 5, dec:0.09, offy: this.rect.h - 5,}
            this.stopparticlesdata = {number: 5, size: 15, type: `rect`, wb: this.rect.w, hb: 5, dec:0.01, offy: this.rect.h - 5,}
 
            //MANAGER
            this.stateManager = StateManager()
             this.stateManager.add().name('Idle').cond(()=>!this.slamming && !this.rolling && !this.falsestate && this.rect.vx === 0 && (this.rect.vy === this.rect.weight || this.rect.vy === 0))
            .cb(()=>{
                this.sprite.playclip('Idle')
            })
            this.stateManager.add().name('RunLeft').cond(()=>!this.slamming && !this.rolling && !this.falsestate && this.rect.vx < 0)
            .cb(()=>{
                this.sprite.playclip('Run')
                this.sprite.flip = true
            })
            this.stateManager.add().name('RunRight').cond(()=>!this.slamming && !this.rolling && !this.falsestate && this.rect.vx > 0)
            .cb(()=>{
                this.sprite.playclip('Run')
                this.sprite.flip = false
            })
            this.stateManager.add().name('Fall').cond(()=>!this.slamming && !this.rolling && !this.falsestate && this.rect.vy > this.rect.weight)
            .cb(()=>{
                this.sprite.playclip('Roll')
                this.sprite.flip = false
            })

            this.stateManager.add().name('Roll').cond(()=>false)
            .cb(()=>{
                this.rolling = true
                this.rect.vx = (!this.sprite.flip)?15:-15
                this.sprite.playclip('Roll')
            })
            this.stateManager.add().name('Slam').cond(()=>false)
            .cb(()=>{
                this.slamming = true
                this.rect.vy =  -20
                this.sprite.playclip('Roll')
                this.hardlanding = true

            })

            //CONTROLS
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
            this.controls.createjoystick({style:'bottom: 10%; right: 10%;', maxdist:70, size: `8rem`})
            .axischange(({angle, dist})=>{
                if(dist > 0){
                    player.aimangle = angle
                }
                if(dist === 0){
                    player.shoot = false
                }
                if(dist > 30){
                    if(!player.shoot){
                        player.loadouts?.weapon?.shoot()
                        player.shoot = true
                    }

                }
            })

            this.animator = Animate()
            this.animator.addAnimation(`Intro`) 
            .from(this.rect)
            .key(0,{vx: 1})
            .key(10,{vy: -10})
            .key(15,{vx: -1})
            .key(20,{vx: 0})
            .from(this.sprite)
            .key(0, ()=>{
                this.sprite.playclip(`Run`)
                this.sprite.flip = false
            })
            .key(15, ()=>{
                this.sprite.playclip(`Run`)
                this.sprite.flip = true
            }).play()

            this.animator.addAnimation(`Death`) 
            .from(this.rect)
            .key(0, ()=>{
                this.rect.vx = (this.sprite.flip)?-1.5:1.5
            })
            .key(10,{vy: -18})
            .key(11,{vy: 10})
            .key(12,()=>{
                this.hardlanding = true
                this.sprite.playclip(`Death`)
                this.rect.vx= 0
                this.rect.remove()
            })
            
        },
    }
    res.load()
    return res
}