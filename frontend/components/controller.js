import { AddLaptopControls } from "./laptopcontrols.js"
import { AddPlayerControlBtns } from "./phonebuttoncontrols.js"

export function Controller(socket, room, Game){
    const res = {
        keyactiveevents:[],
        keyinactiveevents:[],
        onkeyactive(cb){
            this.keyactiveevents.push(cb)
            return this
        },
        onkeyinactive(cb){
            this.keyinactiveevents.push(cb)
            return this
        },
        call(array, props){this[array].forEach(arr=>arr(props))},
        setForThisDevice(){
            if(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
            this.device = `phone`
            else this.device = `laptop`

            // this.device = `phone`

            if(this.device ===`laptop` && !this.plugin){
                this.plugin = AddLaptopControls(socket, room, Game, this)
            }
            if(this.device === `phone` && !this.plugin){
                console.log(this.device)
                this.plugin = AddPlayerControlBtns(socket, room, Game, this)
            }
            return this
        },
        load(){},  
    }
    res.load()
    return res
}