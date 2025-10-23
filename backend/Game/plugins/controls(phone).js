let no = 1
let x = 0
export function Controls(socket){
    no ++
    const res = {
        shouldupdate: true,
        joysticks: [],
        buttons: [],
        genId() {
            return 'room-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8);
        },
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
        createjoystick({xpos, ypos, size = `5rem`, maxdist = 50,style = ''}){
            const data ={
                $axischangeev: [],
                axischange(cb){this.$axischangeev.push(cb);return this},
                xpos, ypos, size , style, maxdist,
                eventname : this.genId(),
                
            }
            this.joysticks.push(data) 
            return data
        },
        load(){}
    }
    res.load()
    socket.on(`controller-loaded`, ()=>{
        res.buttons.forEach(btn=>{
            socket.emit(`create-button`, ({xpos:btn.xpos, ypos: btn.ypos, style: btn.style, size: btn.size, src: btn.src, eventname:btn.eventname}))
            socket.on(`on-button-down-${btn.eventname}`, ()=>{
                if(res.shouldupdate)
                btn.$cbsdown.forEach(c=>c())
            })
            socket.on(`on-button-up-${btn.eventname}`, ()=>{
                if(res.shouldupdate)
                btn.$cbsup.forEach(cb=>cb())
            })
        })

        res.joysticks.forEach(j=>{
            socket.emit(`create-joystick`, ({maxdist: j.maxdist,xpos:j.xpos, ypos: j.ypos, style: j.style, size: j.size,  eventname: j.eventname}))
            socket.on(`on-axis-change-${j.eventname}`, (props)=>{
                if(res.shouldupdate)
                j.$axischangeev.forEach(cb=>cb(props))
            })
        })
    })
    return res
}