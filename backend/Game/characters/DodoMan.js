import { Keybinder } from "../plugins/keybinder.js"
import { Pan } from "../plugins/pan.js"
import { Rect } from "../plugins/rect.js"
import { Sprite } from "../plugins/sprite.js"
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
                this.rect.vx = -15
                this.sprite.flip = true
            }})
            .onkeyup({key: `ArrowLeft`, cb:()=>{
                this.rect.vx = 0
            }})
            .onkeydown({key: `ArrowRight`, cb:()=>{
                this.rect.vx = 15
                this.sprite.flip = false
            }})
            .onkeyup({key: `ArrowRight`, cb:()=>{
                this.rect.vx = 0
            }})

            this.pan = Pan(socket, Game, this.rect)
            this.sprite = Sprite(socket, this.rect, Game)
            .name('dodoman').set(8, 8).loadImage('/public/players/dodoman.png')
            this.sprite.offx = -20
            this.sprite.offy = -27
            this.sprite.offw = 40
            this.sprite.offh = 40
            this.sprite.zIndex = 2
            this.sprite.addclip(`Idle`).from(0).to(3).loop().delay(2).play()
        },
    }
    res.load()
    return res
}