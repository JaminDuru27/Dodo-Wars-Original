import { World } from "./plugins/world.js"

export function Game(socket, io, Room){
    const res ={
        players: [],
        rects: [],
        sprites: [],
        load(){
            this.world = World(socket, io,Room,this)
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
                const h = p.character.health
                const pr = p.character.particles
                pp.text = {content: txt.text, x:txt.x, y: txt.y}
                pp.health = {x:h.x, y: h.y, w:h.w, bars: []}
                pp.rect = {x: r.x, y: r.y, w: r.w, h: r.h,}
                h.bars.forEach((bar)=>{
                    pp.health.bars.push({color: bar.$color,health: bar.$health})
                })
                pp.particles = pr.array.filter(prt=>{return{color:prt.color, x: prt.x, alpha: prt.alpha, size: prt.size, type: prt.type}})
                pp.aimangle = p.aimangle
                pp.bombs = p.loadouts.arsenal.bombs
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