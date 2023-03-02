import { response } from "express";
import { Categoria } from "../models/index.js"

const obtenerCategorias = async (req, res = response ) => {

    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };
    
        const [ total, categorias ] = await Promise.all([
            Categoria.countDocuments( query ),
            Categoria.find( query )
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario', 'nombre')
        ])
    
        if ( total === 0 ) {
            res.status(200).json({
                msg: 'No existen categorías en la BD'
            })
        }
        res.status(200).json({
            total,
            categorias
        });
        
    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error interno. Por favor intente más tarde'
        })
    }

}


const obtenerCategoria = async ( req, res = response ) => {
    
    try {
        const { id } = req.params;

        const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

        res.status(200).json({
            categoria
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error. Intente más tarde',
            error
        })
    }
}



const crearCategoria = async (req, res = response) => {

    try {
        const nombre = req.body.nombre.toUpperCase();
        
        const categoriaDB = await Categoria.findOne({ nombre });
    
        if ( categoriaDB ) {
            return res.status(400).json({
                msg: `La categoria ${ categoriaDB.nombre } ya existe`
            });
        }
    
        const data = {
            nombre,
            usuario: req.usuario._id
        }
    
        const categoria = new Categoria( data );
    
        //Guardar en DB 
        await categoria.save();    
        
        res.status(201).json( categoria ); 

    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error. Intente más tarde',
            error
        })
    }

}

// actualizarCategoria

const actualizarCategoria = async ( req, res = response ) => {
    
    try {
        const { id } = req.params;
        const { estado, usuario, ...data } = req.body;

        if ( data.nombre ) {
            data.nombre = data.nombre.toUpperCase();
        }
        data.usuario = req.usuario._id; 
    
        let categoria = await Categoria.findByIdAndUpdate( id, data, { new: true });

        res.status(200).json({
            msg: 'Se ha actualizado correctamente',    
            categoria 
        }); 
        
    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error. Intente más tarde',
            error
        })
    }
}

// borrarCategoria

const borrarCategoria = async ( req, res = response ) => {

    try {
        const { id } = req.params;
        const query = { estado: false };
    
        let categoria = await Categoria.findByIdAndUpdate( id, query, { new: true } );

        res.status(200).json({
            msg: 'Se ha eliminado correctamente',    
            categoria 
        }); 

        
    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error. Intente más tarde',
            error
        })
    }
}


export {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}