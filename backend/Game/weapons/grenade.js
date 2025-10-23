import { Rect } from "../plugins/rect.js"

export function Grenade(socket,player, Game){
    const res = {
        name: `Grenade`,
        src: '',
        damage: 10,
        size: 10,
        array: [],
        stock: 10,
        load(){},
        update(){
            this?.array?.forEach(arr=>{
                arr.update()
                arr.updatebomb()
            })
        },
        createGrenade(){
            const r = player.character.rect
            const rect = Rect(Game)
            const signx = Math.sign(Math.sin(player.aimangle))
            const signy = Math.sign(Math.cos(player.aimangle))
            rect.vy = Math.sin(player.aimangle) * 10
            rect.vx = Math.cos(player.aimangle) * 15 
            rect.w = this.size
            rect.h = this.size
            rect.weight = 0.5
            rect.x = r.x + r.w /2
            rect.y = r.y + r.h/2
            rect.name = `bomb${socket.id}`
            rect.exception.push(`player`)
            rect.exception.push(rect.name)
            rect.timer = 0
            rect.time = 50
            rect.oncollisionbottom(()=>{
                rect.vy = 0
                rect.vx = 0
            })
            let popped = false
            const pop =()=>{
                rect.x -= this.size * 10
                rect.y -= this.size * 10
                rect.w =  this.size * 20
                rect.h =  this.size * 20
                rect.name = `damage`
                rect.damage = this.damage
            }
            rect.updatebomb = ()=>{
                rect.timer ++
                if(rect.timer > rect.time - 10){
                    if(!popped){
                        pop()
                    }
                    popped = true
                    
                }
                if(rect.timer > rect.time){
                    this.array.splice(this.array.indexOf(rect), 1)
                    rect.remove()
                }

            }
            return rect
        },
        lerp(a, b, t){return a + (b - a) * t},
        shoot(){
            if(this.stock <= 0)return
            this.array.push(this.createGrenade())
            if(this.stock !== Infinity){
                this.stock --            
            }
        },
        getstats(){
            return {
                src: this.src,
                damage: this.damage,

            }
        },
    }
    res.load()
    return res
}