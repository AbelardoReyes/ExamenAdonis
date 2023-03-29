import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
const monitores: string[] = [];
const orden: string[] = ["","","","","",""];

let turno = 9;
let usuario = "";


Ws.io.on("connection", (socket) => {
  console.log("Conexion activa", socket.id);
  socket.on("disconnect", () => {
    monitores.splice(monitores.indexOf(socket.id), 1);
    Ws.io.emit("connectedUsers", monitores);
    Ws.io.emit("usuarios", monitores);

    console.log(monitores);
  });

  Ws.io.emit("connectedUsers", monitores);

  socket.on("barco", (data) => {
    if (!monitores.includes(data.id)) {
      Ws.io.emit("connectedUsers", monitores);
      monitores.push(data.id);
    }
    console.log(data.id, "se agrego al arreglo: ", monitores);
    socket.emit("usuarios", monitores);
    Ws.io.emit("usuarios", monitores);

  });
  Ws.io.emit("connectedUsers", monitores);

  console.log(monitores);

  socket.on("iniciar", (data) => {
    if(orden.length<=0){
      let error="No hay usuarios en la cola"
      Ws.io.emit("error",error)
    }

    console.log('Inicio: ', monitores[turno])
    Ws.io.emit("iniciar", data);
  });


  socket.on("monitor", (data) => {
    turno=data.turno
    usuario=data.id
    //añadir a orden el usuario en el turno que le toca
    orden[turno-1]=usuario
    console.log('Orden: ', orden)
    Ws.io.emit("usando", turno);
  });

  Ws.io.emit("orden", orden);


  socket.on("termino", (data) => {
    console.log('Terminado: ', orden[turno])
    Ws.io.emit("termino", data);
    turno++
    if (turno >= monitores.length) {
      turno = 0
    }
    Ws.io.emit("iniciar", turno);
    console.log('Turno: ', orden[turno])
  } );
});
