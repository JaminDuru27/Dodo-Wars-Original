export function Rect(Game){
    const res = {
        x: Math.random() * 400, 
        y: 100, 
        w: 50, h: 50,
        vx: 0, vy: 0,color:  "#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0"),
        weight: 1, shouldresolve: true,
        buoyancy: 0,
        load(){
            Game.rects.push(this)
        },
        check(){
            Game.rects.forEach(rect=>{
                if(rect === this)return
                this.resolveCollision(rect)
            })
        },
        resolveCollision(rect){
            if(!this.shouldresolve)return
            
            const overlapX  = Math.max(0, Math.min(this.x + this.w, rect.x + rect.w) - Math.max(this.x, rect.x))
            const overlapY  = Math.max(0, Math.min(this.y + this.h, rect.y + rect.h) - Math.max(this.y, rect.y))

            if(overlapX > 0 && overlapY > 0){
                this.iscolliding = true
                    if(overlapX > overlapY){
                    if(this.y < rect.y){
                        if(this.vy > 0)this.vy = 0
                        this.y -= overlapY


                    }else{
                        if(this.vy < 0)this.vy = 0
                        this.y += overlapY 
                        
                        
                    }
                }else if(overlapX < overlapY){
                    if(this.x  < rect.x){
                        this.x -= overlapX
                    }else{
                        this.x += overlapX
                    }
                }
            }

        },
        updateGravity(){
            this.x += this.vx

            this.y += this.vy
            this.vy += this.weight
        },
        update(){
            this.updateGravity()
            this.check()
        },
    }
    res.load()
    return res
}