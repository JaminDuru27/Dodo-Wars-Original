import { Player } from "../Game/player(socket).js"
import { Room } from "../Game/room.js"

const Players = {} 
const Rooms = {} 
const updates = []
let interval = setInterval(()=>{
    updates.forEach(obj=>obj.update())
}, 50)
function generateRoomId(){
    return Date.now() + 'Room'
}
export function SocketFunctions(io){
    io.on('connect', (socket)=>{
        // socket.on('connected', ()=>{
            const player = Player(socket, io)
            Players[socket.id] = player
            console.log(`player ${socket.id} connected successfully, Players Remaining: ${Object.keys(Players).length}`)
        // })
        socket.on('disconnect', ()=>{
            delete Players[socket.id]
            Object.values(Rooms).forEach((room, x)=>{
                const find =  room.players.find(p=>p.id === socket.id)
                if(find)room.players.splice(room.players.indexOf(find), 1)
                if(room.players.length <= 0){
                    console.log(`Removed Room ${room.id}-No Players Present`)
                    room.players.splice(x, 1)
                }
                console.log(`Found and Deleted From Room ${room.id}, remaining: ${room.players.length}`)

            })

            console.log(`player ${socket.id} disconnected, Players Remaining: ${Object.keys(Players).length}, Rooms: ${Object.keys(Rooms).length}`)

        })
        socket.on('host', ()=>{
            const roomid = generateRoomId()
            const room = Room(roomid, socket, io, updates).getInfo()
            Rooms[roomid] = room
            room.add(Players[socket.id]) //just add player data
            socket.join(roomid)

            socket.emit('hosted-room', room)
            console.log(`Player ${Players[room.hostid].name}(${socket.id}) Hosted a Room , JOINED(${room.players.length})`)

        })
        socket.on('join', (rmid)=>{
            const roomid = Object.values(Rooms)[0].id
            socket.join(roomid)
            const room = Rooms[roomid]
            room.add(Players[socket.id]) //just add player data
            socket.emit('joined-room', room)
            console.log(`joined (${socket.id}) ${Players[room.hostid].name}'s Room , JOINED(${room.players.length})`)
        })

        socket.on('tell-room-to-start-game', (roomid)=>{
            io.to(roomid).emit('start-game')
            Rooms[roomid].load()
        })

    })
    
}

export default SocketFunctions