import { response } from 'express';
import bcryptjs from 'bcryptjs';

import Usuario from '../models/usuario.js';


const usuariosGet = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.status(200).json({
        total,
        usuarios
    });

};

const usuariosPost = async (req, res = response) => {

    
    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role });    

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en DB
    await usuario.save();

    res.json({
        usuario
    });
};

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar contra base de datos

    if( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario)
};  

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;
    const query = { estado: false };

    const usuario = await Usuario.findByIdAndUpdate( id, query );
 
    res.json({
        usuario
    })
};

export {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
} 