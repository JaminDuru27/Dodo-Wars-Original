import { Keybinder } from "../plugins/keybinder.js"
import { Rect } from "../plugins/rect.js"

export function DodoMan(playerInfo, socket, io, Game, Player){
    const res = {
        load(){
            this.rect= Rect(Game)
            this.keybinder = Keybinder(socket, io)
            this.keybinder.onkeydown({key: 'ArrowUp',cb:()=>{
                this.rect.vy = -15
            }})
            .onkeydown({key: 'ArrowLeft',cb:()=>{
                this.rect.vx = -5
            }})
            .onkeyup({key: `ArrowLeft`, cb:()=>{
                this.rect.vx = 0
            }})
            .onkeydown({key: `ArrowRight`, cb:()=>{
                this.rect.vx = 5
            }})
            .onkeyup({key: `ArrowRight`, cb:()=>{
                this.rect.vx = 0
            }})
        },
    }
    res.load()
    return res
}