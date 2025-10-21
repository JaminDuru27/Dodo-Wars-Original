export function domextract(element, by = 'classname', obj){
    const res = {
        object: {},
        load(){
            const all = element.querySelectorAll('*')
            all.forEach((e)=>{
                //THREE OPTIONS BY ID, CLASSNAME OR BY ATTRIBUTE VALUE OF EXT
                if(e.getAttribute('ext')){
                    this.object[e.getAttribute('ext')] = e
                }
                if(by === `classname`){
                    if(e.classList.length > 0)
                    this.object[e.classList[0]] = e
                }
                if(by === `id`){
                    this.object[id] = e
                }
            })
            if(obj){
                if(!obj.dom)obj.dom = {}
                for(let x in this.object)
                obj.dom[x] = this.object[x]
                this.object = {}
            }
            
            
        }
    }
    res.load()
    return res
}