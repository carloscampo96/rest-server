import { Router } from 'express';
import { check } from 'express-validator';
import { actualizarProducto, crearProducto, obtenerProducto, obtenerProductos } from '../controllers/index.js';
import { borrarProducto } from '../controllers/productos.js';
import { existeCategoria, existeProducto } from '../helpers/db-validators.js';
import { tieneRole, validarCampos, validarJWT } from '../middlewares/index.js';


const routerProducto = Router();


routerProducto.get('/', obtenerProductos)

routerProducto.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto)

routerProducto.post('/', [ 
    validarJWT,
    check('categoria', 'No es un ID válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria').custom( existeCategoria ),
    validarCampos 
], crearProducto)

routerProducto.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarProducto)

routerProducto.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], borrarProducto)

export {
    routerProducto
} 