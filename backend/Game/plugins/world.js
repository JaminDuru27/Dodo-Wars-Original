import { catacombs } from '../maps/catacombs-CollisionDatascript.js'
import { cave } from '../maps/cave-CollisionDatascript.js'
import {dodomap} from '../maps/dodo map-CollisionDatascript.js'
import { Rect } from './rect.js'
import { Sprite } from './sprite.js'
export function World(socket, Game){
    const res = {
        splitby: ['tiles', 'spawn-location', 'weapon-location', 'sprite-location'],
        array: 0,
        cw: 50, ch: 50,
        x: 0, y: 0,
        load(){
            this.data = cave()
            this.w = this.data.griddata.rows * this.cw
            this.h = this.data.griddata.cols * this.ch
            this.splitdata()
            this.sprite = Sprite(socket, this, Game)
            .name('map').set(1, 1).loadImage(this.data.src)
        },
        splitdata(){
            this.splitby.forEach(split=>{
                if(split === 'spawn-location')return
                if(split === 'weapon-location')return
                this[split] = []
                this.data.collision2d.forEach((col, y)=>{
                    col.forEach((row, x)=>{
                        if(row === 0)return
                        if(row.groupname === split){
                            const rect = Rect(Game)
                            rect.x = this.cw * x
                            rect.y = this.ch * y
                            rect.ratio = row.ratio
                            this[split].push(rect)
                        }
                    })
                })
            })
        },
        update(){
            this?.sprite?.update()
        }
    }
    res.load()
    return res
}