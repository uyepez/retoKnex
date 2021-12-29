const express = require('express')
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require('socket.io')

const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const Productos = require('./productos.js')

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', './public/views')
app.set('view engine', 'ejs');

const productoNuevo = {
    nombre: "estrella1",
    descripcion: "estrella del arbol de navidad",
    codigo: 1125454,
    precio: 250,
    stock: 20,
    foto: 'https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/019_-_Star-128.png',
    timestamp: Date.now()
}

let tablas = new Productos()
tablas.existeTabla('productos').then(res => {
    const existeTabla = res ? console.log("existe la tabla") : console.log("no existe la tabla se creo una nueva");
    if (!res) {
        tablas.nuevaTablaProductos("productos", "estructuraTabla").then(rest => { `La tabla se creo correctamente` })
    } else {
        //tablas.limpiaTabla("productos").then(rest => { console.log(`La tabla productos ya existe se eliminaron ${rest} productos`); })
    }
})

const listaMensajes = [];
const listaProductos = [];
const listaBase = tablas.lista().then(respLista => { 
    console.log(respLista);
    for(const row of respLista){
        console.log(row);
        listaProductos.push(Object.values(row))
    }
    //listaProductos = JSON.stringify(respLista)
    console.log("lista: ", listaProductos);     
})

//index vista de formulario
app.get('/', function (req, res) {
    let nuevoProducto = tablas.nuevo(productoNuevo).then(respProducto => {
        console.log(respProducto);
    })    

    console.log("lista: ", listaProductos);
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
        //const ultimoProducto = listaProductos.nuevo(data);
        //console.log("data: ", data);
        io.sockets.emit("productos", [])
    })

    socket.on("new-mensaje", data => {
        listaMensajes.push(data);
        console.log("data mensaje: ", data);
        io.sockets.emit("mensajes", [data])
    })

})