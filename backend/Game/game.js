import { Player } from "./player/player(game).js"
import { World } from "./plugins/world.js"

export function Game(socket, io, Room){
    const res ={
        players: [],
        rects: [],
        load(){
            this.world = World(this)
            this.loadPlayerObject()
        },
        loadPlayerObject(){
            Room.players.forEach(player=>{
                this.players.push(Player(player, socket, io, this))
            })
        },
        compileoutput(){
            const data = {}
            data.players = []
            data.world = {src: this?.world?.data?.src, w: this?.world?.w, h: this?.world?.h}
            this.players.forEach(p=>{
                const pp = {
                    rect: {},
                }
                const r = p.character.rect
                pp.rect = {x: r.x, y: r.y, w:r.w, h: r.h, color: r.color}
                data.players.push(pp)
            })
            data.rects  =  []
            this.rects.forEach(rect=>{data.rects.push({x: rect.x, y: rect.y, w: rect.w, h: rect.h})})
            return data
        },
        update(){
            this.players.forEach(p=>p.update())
            io.to(Room.id).emit(`game-update`, {...this.compileoutput()})
        }
    }
    res.load()
    socket.emit(`get-canvas-size`)
    socket.on(`update-canvas-size`, ({W, H})=>{
        res.W = W
        res.H = H
    })

    return res
}