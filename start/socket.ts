import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
const monitores: string[] = [];
let turno = 9;

Ws.io.on("connection", (socket) => {
  console.log("Conexion activa", socket.id);
  if (!monitores.includes(socket.id)) {
    Ws.io.emit("connectedUsers", monitores);
    monitores.push(socket.id);
  }


  socket.on("disconnect", () => {
    monitores.splice(monitores.indexOf(socket.id), 1);
    Ws.io.emit("connectedUsers", monitores);
    console.log(monitores);
  });

  Ws.io.emit("connectedUsers", monitores);

  socket.conn.on("connect", ({ type, data }) => {
    console.log(data, "el otro");
    console.log(type);
  });

  socket.on("connect", ({ type, data }) => {
    console.log(data, "sockett");
    console.log(type);
  });

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
