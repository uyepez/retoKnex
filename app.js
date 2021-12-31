const express = require('express')
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require('socket.io')

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const Productos = require('./productos.js')
const Mensajes = require('./mensajes.js')

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', './public/views')
app.set('view engine', 'ejs');

/*const productoNuevo = {
    nombre: "estrella1",
    descripcion: "estrella del arbol de navidad",
    codigo: 1125454,
    precio: 250,
    stock: 20,
    foto: 'https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/019_-_Star-128.png',
    timestamp: Date.now()
}*/

//inicializa tabla de productos
let tablas = new Productos()
tablas.existeTabla('productos').then(res => {
    const existeTabla = res ? console.log("existe la tabla") : console.log("no existe la tabla se creo una nueva");
    if (!res) {
        tablas.nuevaTablaProductos("productos", "estructuraTabla")
    } else {
        //tablas.limpiaTabla("productos").then(rest => { console.log(`La tabla productos ya existe se eliminaron ${rest} productos`); })
    }
})

//inicializa tabla de mensajes
let mensajes = new Mensajes()
mensajes.existeTabla('mensajes').then(res => {
    const existeTabla = res ? console.log("existe la tabla") : console.log("no existe la tabla se creo una nueva");
    if (!res) {
        mensajes.nuevaTablaMensajes("mensajes", "estructuraTabla")
    } else {
        //mensajes.limpiaTabla("productos").then(rest => { console.log(`La tabla mensajes ya existe se eliminaron ${rest} mensajes`); })
    }
})

let listaMensajes = [];
let listaProductos = [];
const listaBaseProductos = tablas.lista().then(respLista => { 
    listaProductos= JSON.parse(JSON.stringify(respLista))
    console.log("lista productos cargada");     
})
const listaBaseMensajes = mensajes.lista().then(respLista => { 
    listaMensajes= JSON.parse(JSON.stringify(respLista))
    console.log("lista mensajes cargada");     
})


//index vista de formulario
app.get('/', function (req, res) {
    res.render('layouts/index')
})

app.get('/lista', function (req, res) {
    res.render('layouts/lista')
})

//listen 
httpServer.listen(3000, function () {
    console.log('3000 es mi puerto');
})


io.on('connection', (socket) => {
    //emite lista de productos
    socket.emit('productos', listaProductos)

    //emite mensajes
    socket.emit('mensajes', listaMensajes)

    // escucha registro de productos
    socket.on("new-product", data => {
        const productoNuevo = data;
        let nuevoProducto = tablas.nuevo(productoNuevo).then(respProducto => {
            productoNuevo.id = parseInt(respProducto)
            listaProductos.push(productoNuevo)
            io.sockets.emit("productos", [productoNuevo])
        })
    })

    socket.on("new-mensaje", data => {
        const mensajeNuevo = data;
        listaMensajes.push(data);
        let nuevoMensaje = mensajes.nuevo(mensajeNuevo).then( respMensaje => {
            mensajeNuevo.id = parseInt(respMensaje)
            listaMensajes.push(mensajeNuevo)
            io.sockets.emit("mensajes", [mensajeNuevo])
        })
    })

})