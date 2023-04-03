import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
const monitores: string[] = [];
let orden: string[] = ["","","","","",""];

let turno = 0;
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




  socket.on("monitor", (data) => {
    turno=data.turno
    usuario=data.id
    //añadir a orden el usuario en el turno que le toca
    orden[turno-1]=usuario
    console.log('Orden: ', orden)
    Ws.io.emit("usando", turno);
  });

  Ws.io.emit("orden", orden);


  socket.on("prueba1", (data) => {
    console.log('Prueba 1: ', data)
    Ws.io.emit("pruebas1", data);}
  );

  socket.on("cambio", (data) => {
    orden = orden.filter(elemento => elemento !== "");
    for (let i = 0; i < orden.length; i++) {
      Ws.io.emit("cambio", orden[i]);
    }
    console.log('Turno: ', data)
  } );


});
