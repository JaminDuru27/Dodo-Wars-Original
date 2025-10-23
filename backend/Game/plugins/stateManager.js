export function StateManager(){
    const res = {
        states: [],
        load(){},
        createstateobj(){
            const data ={
                $name: `state`,
                $conds:[],
                $cbs:[],
                $call: 0,
                $maxcalls: 0,
                name(v){this.$name = v;return this},
                call(v){this.$maxcall = v;return this},
                cond(cb){this.$conds.push(cb);return this},
                cb(cb){this.$cbs.push(cb);return this},
                conds(){
                    return (this.$conds.every(cond=>cond() === true))
                },
                callcbs(){this?.$cbs.forEach(cb=>cb())},
                update(){
                    if(this.$call <= this.$maxcalls){
                        this.callcbs() 
                    }
                    this.$call ++
                }
            }
            return data
        },
        add(){
            const state = this.createstateobj()
            this.states.push(state)
            return state
        },
        update(){
            this.states.forEach(state=>{
                if(state.conds() && this?.state !== state){
                    this.state = state
                    this.state.$call = 0
                }
            })
            this?.state?.update()
        }
    }
    res.load()
    return res
}