import express from 'express'
import cors from 'cors'
import { dbConnection } from '../database/config.js';
import { routerUser } from '../routes/usuarios.js';
import { routerAuth } from '../routes/auth.js';
 
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

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
        this.app.use(this.authPath, routerAuth);
        this.app.use(this.usuariosPath, routerUser);
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