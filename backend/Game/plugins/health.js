export function Health(rect){
    const res ={
        bars:[],
        decrement: 10, 
        offx: 0, offy: -20,
        w: 100,
        $onincrement:[],$ondecrement:[],
        $onbarfull:[],$onbarempty:[],
        $onhealthfull:[],$onhealthempty:[],
        center(){
            this.offx = -this.w/2 + rect.w/2
        },
        
        onincrement(cb){this.$onincrement.push(cb);return this},
        ondecrement(cb){this.$ondecrement.push(cb);return this},
        onbarfull(cb){this.$onbarfull.push(cb);return this},
        onbarempty(cb){this.$onbarempty.push(cb);return this},
        onhealthfull(cb){this.$onhealthfull.push(cb);return this},
        onhealthempty(cb){this.$onhealthempty.push(cb);return this},

        call(array){this[`$${array}`].forEach(cb=>cb())},
        increase(){
            let firstbar
            for(let x = 0; x <= this.bars.length-1; x++){
                if(this.bars[x].$health < 100){
                    firstbar = this.bars[x]
                    break
                }
            }
            if(!firstbar)return
            firstbar.$health +=  this.decrement

            if(firstbar.$health >= 100){
                this.call('onbarfull')
                firstbar.$health = 100
            }
            this.call('onincrement')
            if(this?.bars[this.bars.length-1].$health >= 100){
                this.call('onhealthfull')
            }
        },
        decrease(){
            let lastbar
            for(let x = this.bars.length-1; x > -1; x--){
                if(this.bars[x].$health > 0){
                    lastbar = this.bars[x]
                    break
                }
            }
            if(!lastbar)return
            lastbar.$health -=  this.decrement 
            
            if(lastbar.$health <= 0)
            this.call('onbarempty')
            this.call('ondecrement')
            if(this?.bars[0].$health === 0){
                this.call('onhealthempty')
            }
        },
        createbar(){
            const data = {
                $health: 100,
                $color: 'red',
                health(v){
                    this.$health = v
                    return this
                }, 
                color(v){
                    this.$color = v
                    return this
                }, 
            }   
            return data
        },
        addbar(){
            const bar  = this.createbar()
            this.bars.push(bar)
            return bar
        },
        calcdim(){
            this.x  = rect.x + this.offx
            this.y  = rect.y + this.offy
        },
        load(){
            this.center()
        },
        update(){
            this.calcdim()
        }
    }
    res.load()
    return res
}