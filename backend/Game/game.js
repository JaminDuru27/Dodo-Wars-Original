import { World } from "./plugins/world.js"

export function Game(socket, io, Room){
    const res ={
        players: [],
        rects: [],
        sprites: [],
        load(){
            this.world = World(socket,this)
            this.loadPlayerObject()
        },
        loadPlayerObject(){
            Room.players.forEach(player=>{
                player.load(Room, this)
                this.players.push(player)
            })
        },
        compileoutput(){
            const data = {}
            data.players = []
            data.world = {src: this?.world?.data?.src, w: this?.world?.w, h: this?.world?.h}
            // data.rects  =  [...this.rects.map(rect=>{return{x: rect.x, y: rect.y, w: rect.w, h: rect.h}})]
            data.sprites = [...this.sprites.map(sp=>{
                return {name: sp.name,flip: sp.flip, x: sp.x, y: sp.y, w:sp.w, h: sp.h, framex: sp.framex, framey: sp.framey, sw:sp.sw, sh: sp.sh,}
            })]
            data.sprites.sort((a, b) => a.zIndex - b.zIndex);
            this.players.forEach(p=>{
                const pp = {
                    rect: {},
                }
                const r = p.character.rect
                const pn = p.character.pan
                const sp = p.character.sprite
                const txt = p.character.text
                pp.text = {content: txt.text, x:txt.x, y: txt.y}
                // pp.rect = {x: r.x, y: r.y, w:r.w, h: r.h, color: r.color}
                // pp.pan = {x: pn?.x, y: pn?.y, w:pn.offw, h: pn.offh,}
                data.players.push(pp)
            })
            return data
        },
        update(){
            this.players.forEach(p=>p.update())
            this?.world?.update()
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