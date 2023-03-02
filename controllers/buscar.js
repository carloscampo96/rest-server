import { response } from "express";
import moongose from 'mongoose';
import { Categoria, Producto, Usuario } from "../models/index.js";

const { ObjectId } = moongose.Types;

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];

const buscarUsuarios = async ( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino, 'i' ); 
    const query = { 
        $or: [
            { nombre: regex },
            { correo: regex }
        ],
        $and: [
            { estado: true }
        ]
    }

    const [ total, usuarios ] = await Promise.all([
        Usuario.count( query ),
        Usuario.find( query )
    ])

    res.status(200).json({
        results: {
            total,
            usuarios
        }
    })
}

const buscarCategorias = async ( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.status(200).json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    const regex = new RegExp( termino, 'i' ); 
    const query = { 
        $or: [
            { nombre: regex }
        ],
        $and: [
            { estado: true }
        ]
    }

    const [ total, categorias ] = await Promise.all([
        Categoria.count( query ),
        Categoria.find( query )
    ])

    res.status(200).json({
        results: {
            total,
            categorias
        }
    })
}

const buscarProductos = async ( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.status(200).json({
            results: ( producto ) ? [ producto ] : []
        })
    }

    const regex = new RegExp( termino, 'i' ); 
    const query = { 
        $or: [
            { nombre: regex }
        ],
        $and: [
            { estado: true }
        ]
    }

    const [ total, productos ] = await Promise.all([
        Producto.count( query ),
        Producto.find( query ).populate('categoria', 'nombre')
    ])

    res.status(200).json({
        results: {
            total,
            productos
        }
    })
}

const buscar = async ( req, res = response) => {
    
    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res)
        break;
        case 'productos':
            buscarProductos(termino, res)
        break;
        case 'usuarios':
            buscarUsuarios(termino, res)
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta búsqueda'
            })
    }


}


export {
    buscar
}