import { Router } from 'express'
import { check } from 'express-validator';
import { usuariosDelete, 
         usuariosGet, 
         usuariosPost, 
         usuariosPut } from '../controllers/usuarios.js';
import { emailExiste, esRoleValido, existeUsuarioPorId } from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    check('role').custom( esRoleValido ),
    validarCampos 
], usuariosPost);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete);

export {
    router  
}