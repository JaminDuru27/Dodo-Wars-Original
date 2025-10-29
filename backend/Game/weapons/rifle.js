import { Rect } from "../plugins/rect.js"
import { Sprite } from "../plugins/sprite.js"

export function Rifle(socket, player, Game){
    const res = {
        name: `Rifle`,
        src: '',
        bullets: [],
        t:10, firetime: 3,
        load(){
            this.rect = Rect(Game, false)
            this.rect.w = 60
            this.rect.h = 60
            this.rect.shouldresolve = false
            this.rect.updateall = ()=>{
                this.rect.update(``)
            }
            this.sprite = Sprite(socket, this.rect, Game).setname('rifle').set(1, 1).loadImage(`/public/weapons/Glock.png`)
            player.character.keybinder.onkeyup({key:'a',cb:()=>{
                this.t = 10
            }})
        },
        createBullet(){
            const rect = Rect(Game)
            rect.vx = Math.cos(player.aimangle)
            rect.vy = Math.sin(player.aimangle)
            rect.x = player.character.rect.x
            rect.y = player.character.rect.y
            rect.speed =  10
            rect.weight =  0
            rect.exception = [`player-${socket.id}`, `self`, `damage`]
            rect.l = 0
            rect.name = `bullet-${socket.id}`
            rect.damage = 2
            rect.vx *= rect.speed
            rect.vy *= rect.speed
            rect.shouldresolve = false
            const sprite = Sprite(socket, rect, Game).setname('bullet').set(1, 1)
            .loadImage(`/public/weapons/bomb.png`)
            const spritedust = Sprite(socket, rect, Game).setname('bullet-dust')
            .set(4, 4).loadImage(`/public/effects/bulletcollision.png`)
            spritedust.addclip(`explode`).from(0).to(15).loop(false).delay(0)
            .onframe(15, ()=>{
                rect.remove()
                rect.delete = true
                spritedust.remove()
            }).play()
            spritedust.offw = -10
            spritedust.offh = -10
            
            sprite.offw = -20
            sprite.offh = -20
            rect.updateall = ()=>{
                rect.update()
                sprite.update()
                rect.x += rect.vx
                rect.y += rect.vy
                rect.l += rect.vx
                if(rect.l > 350){
                    // rect.shouldresolve = true
                    rect.vx =0
                    rect.vy =0
                    rect.remove()
                    sprite.remove()
                    rect.delete = true
                }
                if(rect.iscolliding){
                    rect.shouldresolve = false
                    spritedust.update()
                    rect.name = `damage`
                    rect.vx =0
                    rect.vy =0
                    sprite.remove()

                }
            }
            return rect
        },
        shoot(){
            this.t ++
            if(this.t >= this.firetime){
                const bullet = this.createBullet()
                this.bullets.push(bullet)
                this.t  = 0
            }
        },
        update(){
            this?.rect?.updateall()
            this.rect.x = player.character.rect.x
            this.rect.y = player.character.rect.y
            this.sprite.update()
            this.sprite.rotation = player.aimangle
            this.sprite.flip = player.character.sprite.flip

            this.bullets.forEach(b=>b.updateall())
            this.bullets = [...this.bullets.filter(bullet=>!bullet.delete)]
            
        },
    }
    res.load()
    return res
}