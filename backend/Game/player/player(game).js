import { DodoMan } from "../characters/DodoMan.js"

export function Player(socket, io){
    const res = {
        load(){
            //plugins go here
            this.character = DodoMan()
        },
        update(){
            this?.character?.rect?.update()
        },
    }
    res.load()
    return res
}