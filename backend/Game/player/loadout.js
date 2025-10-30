import { Grenade } from "../weapons/grenade.js"
import { Rifle } from "../weapons/rifle.js"

export function Loadouts(socket, player, Game){
    const res = {
        arsenal: {
            assault: [Rifle(socket, player, Game)],
            bombs:[Grenade(socket, player, Game)],
        },
        
        load(){
            this.array= [
                {
                    id: 0,
                    primary_assault: 'Rifle',
                    secondary_assault: undefined,
                    primary_bomb: 'Grenade',
                    secondary_bomb: undefined,
                    primary_meelee: undefined,
                    secondary_meelee: undefined,
                },
            ]
            this.loadout = this.array[0]
            this.setWeapon(`Rifle`)
            
        },
        setWeapon(name){
            for(let x in this.arsenal){
                const find = this.arsenal[x].find(e=>e.name === name)
                if(find){
                    this.weapon = this.arsenal[x][this.arsenal[x].indexOf(find)]
                }
            }
        },
        setLoadout(id){
            this.loadout = this.array[id]
        },
        update(){
            if(player.character.falsestate)return
            this?.weapon?.update()
        },
    }
    res.load()
    return res
}