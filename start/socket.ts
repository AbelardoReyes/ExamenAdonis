import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
const monitores: string[] = []
let turno = 0
Ws.io.on("connection", (socket) => {
  monitores.push(socket.id);

  socket.on("disconnect", () => {
    monitores.splice(monitores.indexOf(socket.id), 1);
    Ws.io.emit("connectedUsers", monitores);
    console.log(monitores);
  });

  console.log(monitores);

  Ws.io.emit("connectedUsers", monitores);

  socket.on("start", (startPosition: number) => {
    console.log("paso 2", startPosition);
    Ws.io.emit("boatPosition", startPosition);
  });
  socket.on("nextBoat", (nextNumber: number) => {
    Ws.io.emit("boatPosition", nextNumber);
  });
});
