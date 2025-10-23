export function Sprite(socket, rect, Game){
    const res ={
        name: `Sprite`,
        offx: 0, offy: 0, offw: 0, offh: 0,
        nx: 8, ny: 8, deltime: 0, 
        frame: 0, min: 0, framex: 0, framey: 0, max:1,
        loop: true, globaldelay: 10, clips: [],
        flip: false, zIndex: 1,
        name(name){
            this.name = name
            return this
        },
        set(nx, ny){
            this.nx = nx
            this.ny = ny
            this.sw = this.imgw / this.nx 
            this.sh = this.imgh / this.ny
            return this 
        },
        loadImage(src){
            socket.emit(`load-image`,{src, id: this.name})
            socket.on(`loaded-image-${this.name}`,({imgw, imgh})=>{
                this.imgw = imgw
                this.imgh = imgh
                this.sw = this.imgw / this.nx 
                this.sh = this.imgh / this.ny
                this.loaded = true
            })
            return this
        },
        load(){
            if(!Game.sprites.find(e=>e === this))
            Game.sprites.push(this)
        },
        calcframe(){
            this.frame += 1

            if(this.loop){
                if(this.frame >= this.max)this.frame = this.min
            }else{
                if(this.frame >= this.max)this.frame = this.max
            }
            this.framex = this.frame % this.nx
            this.framey = Math.floor(this.frame / this.ny)
        },
        delay(cb, time){
            if(this.deltime > time){
                cb()
                this.deltime = 0
            }
            else this.deltime ++
        },
        createclip(name = 'clip'){
            const data  = {
                $name: name,
                $loop: false,
                $from: 0,
                $to: 10,
                $delay: 10,
                $onframeevents:[],
                name(v){
                    this.$name = v
                    return this
                },
                delay(v){
                    this.$delay = v
                    return this
                },
                to(v){
                    this.$to = v
                    return this
                },
                from(v){
                    this.$from = v
                    return this
                },
                loop(v = true){
                    this.$loop = v
                    return this
                },
                play: ()=>{
                    this.play(data)
                },
                onframe:(frame, callback)=>{
                    data.$onframeevents.push({cond: ()=>this.frame >= frame, callback})
                    return data
                },
                update(){
                    this.$onframeevents.forEach(({cond, callback}, x)=>{
                        if(cond()){
                            callback()
                            this.$onframeevents.splice(x, 1)
                        }
                    })
                }
                
            }
            return data
        },
        play(clip){
            this.loop = clip.$loop
            this.frame = clip.$from -1
            this.min = clip.$from
            this.max = clip.$to + 1
            this.globaldelay = clip.$delay
            this.currentclip = clip
        },
        playclip(name){
            this.clips.forEach(clip=>{
                if(clip.$name === name)this.play(clip)
            })
        },
        addclip(name){
            const data  = this.createclip(name)
            this.clips.push(data)
            return data
        },
        calcdim(){
            this.x  = rect.x + this.offx
            this.y  = rect.y + this.offy
            this.w  = rect.w + this.offw
            this.h  = rect.h + this.offh
        },
        update(){
            if(!this.loaded)return
            this.delay(()=>{
                this.calcframe()
            }, this.globaldelay)
            this?.currentclip?.update()
            this.calcdim()
        },
    }
    res.load()
    return res
}