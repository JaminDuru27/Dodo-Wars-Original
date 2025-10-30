export function Animate(){
    const res = {
        animations:[],
        globaldelay: 10,
        t:0,
        playAnimation(name){
            this.animations.forEach(a=>{
                if(a.$name === name)a.play()
            })
        },
        addAnimation(name){
            const animation ={
                $heads:[],
                $time: 0,
                $loop: false,
                $delay: 0,
                $name: name,
                $savedheads:[],
                $getmaxtime(){
                    let max = 0
                    this.$heads.forEach(head=>{
                        head.array.forEach(item=>{
                            max = Math.max(max, item.time)
                        })
                    })
                    return max
                },
                loop(v = true){this.$loop = v;return this},
                delay(v){this.$delay = v;return this},
                name(v){this.$name = v;return this},
                from(obj){
                    const head = {object: obj, array:[]}
                    this.currenthead = head
                    this.$heads.push(head)
                    return this
                },
                key(time,vars={}){
                    this.currenthead.array.push({time, vars})
                    return this
                },
                
                saveinit(){
                    this.$heads.forEach(head=>{
                        const ref = head.object
                        const data = {}
                        head.array.forEach(item=>{
                            if(typeof item.vars === `object`){
                                for(let x in item.vars){
                                    const key = x 
                                    const value = ref[x]
                                    data[key] = value
                                }
                            }
                        })
                        this.$savedheads.push({vars:data})
                    })
                },
                $revertheads(){
                    this.$time = 0
                    this.$savedheads.forEach((savedheads,n)=>{
                        for(let x in savedheads.vars){
                            if(this.$heads[n])
                            this.$heads[n].object[x] = savedheads.vars[x]

                        }
                    })
                },
                play:()=>{
                    animation.$revertheads()
                    animation.saveinit()
                    this.animation = animation
                    return animation
                },
                update(){
                    this.$heads.forEach(head=>{
                        const ref = head.object
                        head.array.forEach(item=>{
                            if (this.$time === item.time){
                                if(typeof item.vars === `object`){
                                    for(let x in item.vars){
                                        const v = item.vars[x]
                                        ref[x] = v
                                    }
                                }
                                if(typeof item.vars === `function`){
                                    item.vars()
                                }
                            }
                        })
                    })
                    this.$time ++
                    if(this.$time > this.$getmaxtime()){
                        if(this.$loop){
                            this.$revertheads()
                        }
                    }
                }
            }
            this.animations.push(animation)
            return animation
        },
        load(){},
        delay(cb){
            if(this.t > this.globaldelay){
                this.t = 0
                cb()
            }
            this.t ++
        },
        update(){
            if(!this.animation)return
            this.delay(()=>{
                this.animation.update()
            })
        }
    }
    res.load()
    return res
}