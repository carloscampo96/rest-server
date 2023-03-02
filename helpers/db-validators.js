import Role from '../models/role.js';
import { Categoria, Producto, Usuario } from '../models/index.js';

const esRoleValido = async (role = '') => {
    
    const existeRol = await Role.findOne({ role });

    if( !existeRol ) {
        throw new Error(`El role ${ role } no está registrado en la BD`);
    }
}

const emailExiste = async (correo = '') => {

    const existeEmail = await Usuario.findOne({ correo });

    if( existeEmail ) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

const existeUsuarioPorId = async ( id ) => {

    const existeUsuario = await Usuario.findById( id );

    if( !existeUsuario ) {
        throw new Error(`El ID ${id} no existe`);
    }
}

const existeCategoria = async ( id ) => {
        
    const categoria = await Categoria.findById( id ); 

    if( !categoria ) {
        throw new Error(`La categoria con id ${id} no existe`);
    }
}

const existeProducto = async ( id ) => {
        
    const producto = await Producto.findById( id ); 

    if( !producto ) {
        throw new Error(`El producto con id ${id} no existe`);
    }
}

export {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
}