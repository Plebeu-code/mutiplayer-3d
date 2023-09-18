import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
  }
});

io.listen(3001)

const characters = []

function generateRandomPosition() {
  return [Math.random() * 3, 0, Math.random() * 3]
}

function generateRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

io.on("connection", (socket) => {
  console.log("WebSocket conectado");

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  })

  console.log(characters);
  socket.emit("message");

  io.emit("characters", characters);

  socket.on("move", (position) => {
    console.log(position);
    const character = characters.find(c => c.id == socket.id)
    character.position = position
    io.emit("characters", characters);
  })

  socket.on("disconnect", () => {
    console.log("WebSocket desconectado");

    characters.splice(characters.indexOf(characters.find(c => c.id == socket.id)), 1)
    io.emit("characters", characters);
  })
})