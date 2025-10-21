import { Game } from "./game.js"

export function Room(roomid, socket, io, updates){
    const res ={
        roomid,
        hostid: socket.id,
        players : [],
        add(playerinfo){
            if(!this.players.find(p=>p.id === playerinfo.id))
            this.players.push(playerinfo)
        },
        getInfo(){
            return {
                name: this.name, 
                id: this.roomid, 
                hostid: this.hostid,
                players: this.players,
                add: this.add,
                load: this.load
            }
        },
        load(){
            this.game = Game(socket, io, this)
            updates.push(this.game)
        }
    }
    return res
}