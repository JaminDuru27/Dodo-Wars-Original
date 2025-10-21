export function Rect(){
    const res = {
        x: 0, y: 0, w: 50, h: 50,
        vx: 0, vy: 0,color: ' #fb000049',
        weight: 10,
        load(){

        },
        updateGravity(){
            this.x += this.vx
            this.y += this.vy
            this.vy += this.weight
            console.log(this.vy)

        },
        update(){
            this.updateGravity()
        },
    }
    res.load()
    return res
}