export function Pan(socket, Game,rect){
    const res ={
        offx: 0, offy: 0, offw: 400, offh: 300,
        centerX(){this.offx = (-this.offw/2 + rect.w/2)},
        centerY(){this.offy = (-this.offh/2 + rect.h/2)},
        center(){
            this.centerX()
            this.centerY()
        },
        checkleft(){return this.x < -this.tx},
        checktop(){return this.y < -this.ty},
        checkright(){return this.x + this.offw + this.tx > Game.W },
        checkbottom(){return this.y + this.offh + this.ty> Game.H },
        checkoutsideveiwport(){
            return (
                this.checkleft() ||
                this.checkright() ||
                this.checkbottom() ||
                this.checktop()
            )
        },
        load(){
            this.center()
        },
        resolve(){
            if(rect.vy < 0 && this.checktop()){
                socket.emit(`translate-y`, (rect.vy))
            }
            if(rect.vy > 0 && this.checkbottom()){
                socket.emit(`translate-y`, (rect.vy))
            }
            if(rect.vx > 0 && this.checkright()){
                socket.emit(`translate-x`, (rect.vx))
            }
            if(rect.vx < 0 && this.checkleft()){
                socket.emit(`translate-x`, (rect.vx))
            }
        },
        update(){
            this.x = rect.x + this.offx 
            this.y = rect.y + this.offy 
            this.resolve()
        }
    }
    res.load()
    socket.on(`translate`, ({tx, ty})=>{
        res.tx = tx
        res.ty = ty
    })
    return res
}