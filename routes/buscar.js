import { Router } from 'express';
import { buscar } from '../controllers/index.js';

const routerBusqueda = Router();

routerBusqueda.get('/:coleccion/:termino', buscar)



export {
    routerBusqueda
}
 