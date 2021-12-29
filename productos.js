const { options } = require('./options/db.js')
const knex = require('knex')(options)

//clase para control de lista de productos
class Productos {

    async existeTabla(tabla) {
        const existe = await knex.schema.hasTable(tabla);
        return existe;
    }

    async nuevaTablaProductos(nombre, tabla) {
        const nueva = await knex.schema.createTable(nombre, table => {
            table.increments('id')
            table.string('nombre')
            table.string('descripcion')
            table.integer('codigo')
            table.integer('precio')
            table.integer('stock')
            table.string('foto')
            table.string('timestamp')
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
        const nuevoProducto = await knex('productos').insert(objetoProducto)
            .catch((err) => { console.log({ error: -1, descripcion: `detalle del error ${err}` }) })
            //.finally(knex.destroy())
        return nuevoProducto
    }

    async lista(){
        const listaProductos = await knex.from('productos').select('id', 'nombre', 'descripcion', 'codigo', 'precio', 'stock', 'foto', 'timestamp')
        .catch((err) => { console.log({ error: -1, descripcion: `detalle del error ${err}` }) })
        //.finally(knex.destroy())
        return listaProductos
    }



    /*async nuevo(objetoProducto) {
        //await knex("productos").insert(objetoProducto)
        console.log(objetoProducto);

        try {
            await knex("productos").insert(objetoProducto)
                .then((success) => {
                    console.log(success);
                })

        } catch (err) {
            return { error: -1, descripcion: `error al guardar ${err}` }
        } finally {
            knex.destroy();
        }

    }*/


    /*(async function () {
    const res = await getUsers();
    console.log('KNEX', res);
})()*/





}

module.exports = Productos