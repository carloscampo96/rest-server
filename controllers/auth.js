import { response } from "express";
import bcryptjs from 'bcryptjs';

import Usuario from '../models/usuario.js'
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Passwords no son correctos - correo'
            })
        }

        // Si el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Passwords no son correctos - estado: False'
            })
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password ); 

        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar El JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            
            const data = {
                nombre,
                correo, 
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
            console.log(usuario)
        }

        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })  
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

export {
    login,
    googleSignIn
}