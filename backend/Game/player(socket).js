import {DodoMan} from './characters/DodoMan.js'
export function Player(socket, io){
    const res ={
        name: 'Ddddvxx27',
        loadouts: {},
        level: 1,
        badges:[],
        characters:['DodoMan'],
        id: socket.id,
        aimangle: 0,
        load(Room, Game){  
            this.character = DodoMan(this, socket, io, Game)
        },
        update(){
            this?.character?.rect?.update()
            this?.character?.pan?.update()
            this?.character?.sprite?.update()
            this?.character?.text?.update()
            this?.character?.health?.update()
            this?.character?.particles?.update()
            this?.character?.stateManager?.update()
            socket.emit('player-update', {x:this.character.rect.x, y:this.character.rect.y, w: this.character.rect.w, h: this.character.rect.h })

            const c = this.character
            c.sprite.flip = (Math.cos(this.aimangle) > 0 && c.sprite.flip)? c.sprite.flip = false
            :(Math.cos(this.aimangle) < 0 && !c.sprite.flip)? c.sprite.flip = true: c.sprite.flip
        },
        
        getInfo(){
            return this
        }
    }
    socket.on(`set-aim-angle`, (angle)=>{
        res.aimangle = angle
    })
    socket.on(`update-game-size`, ({W, H})=>{
        res.gameW = W
        res.gameH = H
    })

    return res
}