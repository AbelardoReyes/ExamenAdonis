import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
const monitores: string[] = []
let turno = 9
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
    monitores.push(data);
  });

  socket.on("inicio", (data) => {
    if (turno == 9){turno = monitores.indexOf(data)}
    Ws.io.emit("inicio", data);
    console.log(turno, monitores.indexOf(data));
  });

  socket.on("termino", (data) => {
    console.log('Terminado: ', monitores[turno])
    Ws.io.emit("termino", data);
    turno++
    if (turno >= monitores.length) {
      turno = 0
    }
    console.log('Turno: ', monitores[turno])
  } );
});
