export function Keybinder(socket){
    const res = {
        shouldupdate: true,
        keydownarray:[],
        keyuparray:[],
        onkeydown({key,cb}){
            this.keydownarray.push({key, cb})
            return this
        },
        onkeyup({key,cb}){
            this.keyuparray.push({key, cb})
            return this
        },
        load(){},
        update(){}
    }
    res.load()
    socket.on('keydown', ({key})=>{
        res.keydownarray.forEach((p)=>{
            if(res.shouldupdate)
            if(key === p.key)p.cb()
        })
    })
    socket.on('keyup', ({key})=>{
        res.keyuparray.forEach((p)=>{
            if(res.shouldupdate)
            if(key === p.key)p.cb()
        })
    })
    return res
}