const socket = io();
let usuario = '';


//incluimos lista con fetch
let contenido = document.querySelector('#listaTodosProductos');
//fetch api
fetch('./lista')
    .then(res => res.text())
    .then(data => {
        contenido.innerHTML = data
    })
    .catch(err => console.log(err));

// Escuchando el evento 'diego'
socket.on("productos", data => {
    console.log("data productos: ", data);

    data.forEach(producto => {
        console.log(producto);

        var tr = `<tr>
          <td>`+ producto[1] + `</td>
          <td>`+ producto[4] + `</td>
          <td><img src="`+ producto[6] + `" alt="" height="60px"></td>
        </tr>`;
        $("#cuerpoTabla").append(tr)
    });
    //$("#chat").append(data + "<br>")
})




socket.on("mensajes", dataMessajes =>{
    console.log("data messajes: ", dataMessajes);

    dataMessajes.forEach(mensaje => {
        console.log(mensaje.text);
        if(mensaje.author == usuario){
            var tr = `<div class="alert alert-success mt-3"><strong>${mensaje.author}</strong><small>[${mensaje.fecha}]</small><em>: ${mensaje.text}</em></div>`;
        }else{
            var tr = `<div class="alert alert-secondary mt-3"><strong>${mensaje.author}</strong><small>[${mensaje.fecha}]</small><em>: ${mensaje.text}</em></div>`;
        }

        $("#listaMensajes").prepend(tr)
    });
})


//post de formulario
$("#productoForm").submit(e =>{
    e.preventDefault();

    const producto = {
        title: $("#title").val(),
        price: $("#price").val(),
        thumbnail: $("#thumbnail").val()
    }

    socket.emit('new-product', producto);
    $('#productoForm')[0].reset()
    nuevaFoto()
    return false;
})


//login para chat
$('#loginForm').submit(e => {
    e.preventDefault();

    usuario = $("#correo").val();
    if (valEmail(usuario)) {
        $("#miAlert").hide();
        $("#btEntrar").hide();
        $("#mensajeForm").show();
        $("#correo").attr("readonly", true);
        $("#mensaje").focus();

    }else{
        alert("introduce un correo valido")
    }

    return false;
})

//envio de mensaje
$('#enviaMensaje').click(e => {
    e.preventDefault();

    const mensaje = $("#mensaje").val();
    let fecha = new Date().toLocaleString();
    if (mensaje != '') {
        const newMessaje = {
            author: usuario,
            text: mensaje,
            fecha
        }
        socket.emit('new-mensaje', newMessaje);
        $("#mensaje").val('');
    }
    
    return false;
})




//funciones

function nuevaFoto() {
    //URL de imagenes
    const listaImagenes = [
        { foto: "https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/019_-_Star-128.png" },
        { foto: "https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/006_-_Present-128.png" },
        { foto: "https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/025_-_Mince_Pie-128.png" },
        { foto: "https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/018_-_Candle-128.png" },
        { foto: "https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/007_-_Present-128.png" },
        { foto: "https://cdn1.iconfinder.com/data/icons/christmas-flat-4/58/015_-_Stocking-128.png" },
        { foto: "https://cdn1.iconfinder.com/data/icons/christmas-flat-4/59/026_-_Baubles-128.png" }
    ]
    
    const randomElement = listaImagenes[Math.floor(Math.random() * listaImagenes.length)];
    $('#thumbnail').val(randomElement.foto)
    $('#imgFoto').attr("src", randomElement.foto);
    
}

nuevaFoto()

function permite(elEvento, permitidos) {

    var numeros = "0123456789";
    var caracteres = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚáéíóú´ñÑ!-#";
    var numeros_caracteres = numeros + caracteres;
    var teclas_especiales = [8, 37, 39, 46, 9];

    // 8 = BackSpace, 46 = Supr, 37 = flecha izquierda, 39 = flecha derecha, 9 = tabulador

    // Seleccionar los caracteres a partir del parametro de la funcion

    switch (permitidos) {

        case 'num':
            permitidos = numeros;
            break;
        case 'car':
            permitidos = caracteres;
            break;
        case 'num_car':
            permitidos = numeros_caracteres;
            break;
    }

    // Obtener la tecla pulsada
    var evento = elEvento || window.event;
    var codigoCaracter = evento.charCode || evento.keyCode;
    var caracter = String.fromCharCode(codigoCaracter);
    var tecla_especial = false;

    for (var i in teclas_especiales) {
        if (codigoCaracter == teclas_especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    return permitidos.indexOf(caracter) != -1 || tecla_especial;
}

function valEmail(valor) {

    re = /^[_a-zA-Z0-9-]+(.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*(.[a-zA-Z]{2,3})$/;
    if (!re.exec(valor)) {
        //alert("El correo no es correcto");
        return false;
    } else {
        return true;
    }
}