import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
const monitores: string[] = [];
let turno = 9;

Ws.io.on("connection", (socket) => {
  console.log("Conexion activa", socket.id);
  socket.on("disconnect", () => {
    monitores.splice(monitores.indexOf(socket.id), 1);
    Ws.io.emit("connectedUsers", monitores);
    console.log(monitores);
  });

  Ws.io.emit("connectedUsers", monitores);


  Ws.io.emit("connectedUsers", monitores);

  console.log(monitores);
  socket.on("inicio", (data) => {

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

Ws.io.on("barco", (data) => {
  if (!monitores.includes(data.id)) {
    Ws.io.emit("connectedUsers", monitores);
    monitores.push(data.id);
  }
  console.log(data.id, "se agrego al arreglo: ", monitores);
  Ws.io.emit("barco", monitores);

});
