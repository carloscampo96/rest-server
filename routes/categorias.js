import { Router } from 'express'
import { check } from 'express-validator'
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from '../controllers/index.js';
import { existeCategoria } from '../helpers/db-validators.js';

import { tieneRole, validarCampos, validarJWT } from '../middlewares/index.js';

const routerCategories = Router();

routerCategories.get('/', obtenerCategorias);

routerCategories.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
] , obtenerCategoria);

routerCategories.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos 
], crearCategoria)

routerCategories.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria)

routerCategories.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    tieneRole('ADMIN_ROLE'),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria)

export {
    routerCategories  
} 