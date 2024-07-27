const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors({
    origin: '*'
}))

const server = http.createServer(app)
const io = socketIO(server)
app.get("/", (req, res) => {
    res.send("Server is running.")
})

io.on('connection', (socket) => {
    socket.on('audioStream', (audioData) => {
        writeFileBuffer(audioData);
        socket.broadcast.emit('audioStream', audioData);
    })
    socket.on('disconnect', () => {
    })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})