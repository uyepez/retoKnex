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
let tablas = new Productos("productos")
tablas.nuevaTablaProductos()


let listaMensajes = [];
let listaProductos = [];
const listaBaseProductos = tablas.getAll().then(respLista => { 
    listaProductos= JSON.parse(JSON.stringify(respLista))
    console.log("lista productos cargada");     
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
        listaMensajes.push(data);
        console.log("data mensaje: ", data);
        io.sockets.emit("mensajes", [data])
    })

})