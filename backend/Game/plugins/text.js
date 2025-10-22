export function Text(rect){
    const res ={
        text: '',
        x: 0, y: 0,
        offx: 0, offy: -15,
        set(text){
            this.text = text
            return this
        },
        load(){},
        update(){
            this.x = rect.x  + rect.w /2
            this.y = rect.y + this.offy
        },
    }
    res.load()
    return res
}