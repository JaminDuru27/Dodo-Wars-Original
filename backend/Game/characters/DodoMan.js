import { Rect } from "../plugins/rect.js"

export function DodoMan(socket, io){
    const res = {
        load(){
            this.rect= Rect()
        },
    }
    res.load()
    return res
}