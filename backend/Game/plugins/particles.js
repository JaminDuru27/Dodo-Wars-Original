export function Particles(rect){
    const res ={
        shouldupdate: true,
        vx:0, vy: 0,
        array:[],
        createparticle({size,weight, type, offx,offy, wb, hb, dec}){
            const data = {
                type,
                vx: +(Math.random().toFixed(1)),
                vy: +(Math.random().toFixed(1)),
                size: +((Math.random() * size).toFixed(1)),
                color: ` #fff`,
                alpha: +(Math.random().toFixed(1)),
                dec: dec,
                weight: +((Math.random() * weight).toFixed(1)),
                update(){
                    this.x += this.vx
                    this.y += this.vy
                    this.vy += this.weight
                    this.alpha -= this.dec/2
                    if(this.alpha <= 0)this.alpha = 0
                    this.size -= this.dec 
                    if(this.size <= -this.originalSize){
                        res.array.splice(res.array.indexOf(this), 1)
                    }
                }
            }
            data.originalSize = data.size
            data.x = +((rect.x + Math.random() * wb + offx).toFixed(1))
            data.y = +((rect.y + Math.random() * hb + offy).toFixed(1))
            data.vx = (Math.random() > 0.5)? -data.vx: data.vx
            data.vy = (Math.random() > 0.5)? -data.vy: data.vy
            return data 
        },
        populate({number  = 0, size = 0, type = 'rect', weight=0.01, wb = 0, hb = 0, offx = 0, offy = 0, dec= 0.02}){
            if(!this.shouldupdate)return
            for(let x = 0; x<number;x++){
                this.array.push(this.createparticle({size, type, weight, offx, offy, wb, hb, dec}))
            }
            return this
        },
        load(){},
        update(){
            if(!this.shouldupdate)return
            this?.array?.forEach(p=>{
                p.update()
            })
        }
    }
    res.load()
    return res
}