let no = 1
let x = 0
export function Controls(socket){
    no ++
    const res = {
        joysticks: [],
        buttons: [],
        genId(){return Date.now() + no+ 'ctrls'},
        createbtn({xpos, ypos, size = `2rem`, src, style = ''}){
            const data ={
                $cbsdown: [],
                $cbsup: [],
                cbdown(cb){this.$cbsdown.push(cb);return this},
                cbup(cb){this.$cbsup.push(cb);return this},
                xpos, ypos, size, src, style,
                eventname  : this.genId(),

            }
            this.buttons.push(data) 
            return data
        },
        createjoystick({xpos, ypos, size = `5rem`, style = ''}){
            const data ={
                $axischangeev: [],
                axischange(cb){this.$axischangeev.push(cb);return this},
                xpos, ypos, size , style, 
                eventname : this.genId(),
                
            }
            this.joysticks.push(data) 
            return data
        },
        load(){}
    }
    res.load()
    socket.on(`controller-loaded`, ()=>{
        x++
        if(x > 1)return
        res.buttons.forEach(btn=>{
            console.log(`jiiji`)
            socket.emit(`create-button`, ({xpos:btn.xpos, ypos: btn.ypos, style: btn.style, size: btn.size, src: btn.src, eventname:btn.eventname}))
            socket.on(`on-button-down-${btn.eventname}`, ()=>{
                btn.$cbsdown.forEach(c=>c())
            })
            socket.on(`on-button-up-${btn.eventname}`, ()=>{
                btn.$cbsup.forEach(cb=>cb())
            })
        })

        res.joysticks.forEach(j=>{
            socket.emit(`create-joystick`, ({xpos:j.xpos, ypos: j.ypos, style: j.style, size: j.size,  eventname: j.eventname}))
            socket.on(`on-axis-change-${j.eventname}`, (props)=>{
                j.$axischangeev.forEach(cb=>cb(props))
            })
        })
    })
    return res
}