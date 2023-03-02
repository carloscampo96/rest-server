import express from 'express'
import cors from 'cors'
import { dbConnection } from '../database/config.js';
import { 
    routerUser, 
    routerAuth, 
    routerCategories,
    routerProducto,
    routerBusqueda
} from '../routes/index.js';

 
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
        }

        //Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio público
        this.app.use( express.static('public') )
    }

    routes() {
        this.app.use(this.paths.auth, routerAuth);
        this.app.use(this.paths.buscar, routerBusqueda)
        this.app.use(this.paths.categorias, routerCategories);
        this.app.use(this.paths.productos, routerProducto);
        this.app.use(this.paths.usuarios, routerUser);
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

export {
    Server
}