import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
const monitores: string[] = []
let turno = 0
Ws.io.on('connection', (socket) => {
  console.log('Nueva Conexión: ', socket.id)



  socket.on('disconnect', () => {
    monitores.splice(monitores.indexOf(socket.id), 1);
    console.log('Desconectado: ', socket.id)
  })
})

Ws.io.on('monitor', (data) => {
  monitores.push(data)
  console.log('Monitores: ', monitores)
})

Ws.io.on('inicio', (data) => {

  console.log('Inicio: ', monitores[turno])
})

Ws.io.on('terminado', (data) => {
  console.log('Terminado: ', monitores[turno])
  turno++
  if (turno >= monitores.length) {
    turno = 0
  }
  console.log('Turno: ', monitores[turno])
})
