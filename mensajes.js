const { options } = require('./options/db.js')
const knex = require('knex')(options)

//clase para control de lista de Mensajes
class Mensajes {

    async existeTabla(tabla) {
        const existe = await knex.schema.hasTable(tabla);
        return existe;
    }

    async nuevaTablaMensajes(nombre, tabla) {
        const nueva = await knex.schema.createTable(nombre, table => {
            table.increments('id')
            table.string('author')
            table.string('text')
            table.string('fecha')
        })
            .catch((err) => { console.log({ error: -1, descripcion: `detalle del error ${err}` }) })
            //.finally(knex.destroy())
        return nueva;
    }

    async limpiaTabla(tabla) {
        const limpia = await knex(tabla).del()
        return limpia
    }


    async nuevo(objetoProducto) {
        const nuevoMensaje = await knex('mensajes').insert(objetoProducto)
            .catch((err) => { console.log({ error: -1, descripcion: `detalle del error ${err}` }) })
            //.finally(knex.destroy())
        return nuevoMensaje
    }

    async lista(){
        const listaMensajes = await knex.from('mensajes').select('id', 'author', 'text', 'fecha')
        .catch((err) => { console.log({ error: -1, descripcion: `detalle del error ${err}` }) })
        //.finally(knex.destroy())
        return listaMensajes
    }

}

module.exports = Mensajes