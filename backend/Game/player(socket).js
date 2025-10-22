import {DodoMan} from './characters/DodoMan.js'
export function Player(socket, io){
    const res ={
        name: 'Ddddvxx27',
        loadouts: {},
        level: 1,
        badges:[],
        characters:['DodoMan'],
        id: socket.id,
        load(Room, Game){  
            this.character = DodoMan(this, socket, io, Game)
        },
        update(){
            this?.character?.rect?.update()
        },
        
        getInfo(){
            return this
        }
    }
    return res
}