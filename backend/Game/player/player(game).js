import { DodoMan } from "../characters/DodoMan.js"

export function Player(playerInfo, socket, io, Game){
    const res = {
        load(){
            //plugins go here
            this.character = DodoMan(playerInfo, socket, io, Game, this)
        },
        update(){
            this?.character?.rect?.update()
        },
    }
    res.load()
    return res
}