import { Player } from "./player/player(game).js"

export function Game(socket, io, Room){
    const res ={
        players: [],
        load(){
            this.loadPlayerObject()
        },
        loadPlayerObject(){
            Room.players.forEach(player=>{
                this.players.push(Player(player))
            })
        },
        update(){
            console.log(`ojodd`, this)
            this.players.forEach(p=>p.update())
        }
    }
    res.load()
    return res
}