const { options } = require('./options/db.js')
//const knex = require('knex')(options)

//clase para control de lista de productos
class Productos {

    constructor(nombreTabla) {
        this.tabla = nombreTabla
        this.knex = require('knex')(options)
    }

    /*async existeTabla(tabla) {
        const existe = await knex.schema.hasTable(tabla);
        return existe;
    }*/

    async nuevaTablaProductos() {
        await this.knex.schema.createTableIfNotExists(this.tabla, table => {
            table.increments('id')
            table.string('nombre', 50)
            table.string('descripcion', 200)
            table.integer('codigo')
            table.integer('precio')
            table.integer('stock')
            table.string('foto', 50)
            table.string('timestamp', 50)
        })
    }

    /*async limpiaTabla(tabla) {
        const limpia = await knex(tabla).del()
        return limpia
    }*/


    async nuevo(objetoProducto) {

        try {
            return await this.knex(this.tabla).insert(objetoProducto)
        }
        catch (err) {
            return ({ error: -1, descripcion: `detalle del error ${err}` })
        }

    }

    /*async lista(){
        const listaProductos = await knex.from('productos').select('id', 'nombre', 'descripcion', 'codigo', 'precio', 'stock', 'foto', 'timestamp')
        .catch((err) => { console.log({ error: -1, descripcion: `detalle del error ${err}` }) })
        //.finally(knex.destroy())
        return listaProductos
    }*/

    async getAll() {
        try {
            return await this.knex.from(this.tabla).select("*")
        }
        catch (err) {
            return ({ error: -1, descripcion: `detalle del error ${err}` })
        }
    }






}

module.exports = Productos