// import { images } from "../../../frontend";

export function Rect(Game, push = true){
    const res = {
        x: Math.random() * 400, 
        y: 100, 
        w: 50, h: 50,
        vx: 0, vy: 0,color:  "#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0"),
        weight: 1, shouldresolve: true,
        exception:[],
        buoyancy: 0,
        $oncollisiontop:[],
        $oncollisionleft:[],
        $oncollisionright:[],
        $oncollisionbottom:[],
        $oncollisionwith:[],
        oncollisionwith(name, cb){this.$oncollisionwith.push({name, cb});return this},
        oncollisiontop(cb){this.$oncollisiontop.push(cb);return this},
        oncollisionbottom(cb){this.$oncollisionbottom.push(cb);return this},
        oncollisionleft(cb){this.$oncollisionleft.push(cb);return this},
        oncollisionright(cb){this.$oncollisionright.push(cb);return this},
        call(name, prop){this[`$${name}`].forEach(cb=>cb(prop))},
        load(){
            if(push)
            Game.rects.push(this)
        },
        remove(){
            this.delete = true
            // Game.rects.splice(Game.rects.indexOf(this), 1)
        },
        check(){
            Game.rects.forEach(rect=>{
                if(rect === this)return
                let is= true
                this.exception.forEach(ex=>{
                    
                    if(typeof ex === `string`)if(rect.name === ex)is = false
                    if(typeof ex === `object`)if(rect === ex)is = false
                    if(ex === `self`){
                        if(rect.name === this.name){
                            is = false
                        }
                    }
                })
                this.resolveCollision(rect, is)
            })
        },
        resolveCollision(rect, ifaccepted){
            const overlapX  = Math.max(0, Math.min(this.x + this.w, rect.x + rect.w) - Math.max(this.x, rect.x))
            const overlapY  = Math.max(0, Math.min(this.y + this.h, rect.y + rect.h) - Math.max(this.y, rect.y))
            if(overlapX > 0 && overlapY > 0){
                if(ifaccepted)
                this.iscolliding = true
            
                if(this.$oncollisionwith.find(e=>e.name === rect.name)){
                    this.$oncollisionwith.filter(e=>e.name === rect.name).forEach(({cb})=>{cb(rect)})
                }

                if(overlapX > overlapY){
                    if(this.y < rect.y){
                        if(ifaccepted)
                        if(this.shouldresolve ){
                            if(this.vy > 0)this.vy = 0
                            this.y -= overlapY
                        }
                        if(this.collisiondirection !== `bottom` && (this.vy === this.weight || this.vy === 0))
                        this.call(`oncollisionbottom`, rect)
                        this.collisiondirection = `bottom`

                    }else{
                        if(ifaccepted)
                        if(this.shouldresolve ){
                            if(this.vy < 0)this.vy = 0
                            this.y += overlapY
                        } 
                        if(this.collisiondirection !== `top`)
                        this.call(`oncollisiontop`, rect)
                        this.collisiondirection = `top`
                    }
                }else if(overlapX < overlapY){
                    if(this.x  < rect.x){
                        if(ifaccepted)
                        if(this.shouldresolve ){
                            this.x -= overlapX
                        }
                        if(this.collisiondirection !== `right`)
                        this.call(`oncollisionright`, rect)
                        this.collisiondirection = `right`
                    }else{
                        if(ifaccepted)
                        if(this.shouldresolve ){
                            this.x += overlapX
                        }
                        if(this.collisiondirection !== `left`)
                        this.call(`oncollisionleft`, rect)
                        this.collisiondirection = `left`
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