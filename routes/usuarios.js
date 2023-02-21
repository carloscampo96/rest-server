import { Router } from 'express'
import { check } from 'express-validator';

import {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} from '../middlewares/index.js'

import { usuariosDelete, 
         usuariosGet, 
         usuariosPost, 
         usuariosPut } from '../controllers/usuarios.js';
import { emailExiste, esRoleValido, existeUsuarioPorId } from '../helpers/db-validators.js';

const routerUser = Router();

routerUser.get('/', usuariosGet);

routerUser.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').custom( esRoleValido ),
    validarCampos
], usuariosPut);

routerUser.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    check('role').custom( esRoleValido ),
    validarCampos 
], usuariosPost);

routerUser.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);

export {
    routerUser  
}