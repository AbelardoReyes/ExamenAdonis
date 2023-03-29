import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
const monitores: string[] = []
let turno = 0
Ws.io.on("connection", (socket) => {
  console.log("Conexion activa");

  socket.on("disconnect", () => {
    monitores.splice(monitores.indexOf(socket.id), 1);
    Ws.io.emit("connectedUsers", monitores);
    console.log(monitores);
  });

  console.log(monitores);

  Ws.io.emit("connectedUsers", monitores);

  socket.on("monitor", (data) => {
    monitores.push(socket.id);
  });
});
