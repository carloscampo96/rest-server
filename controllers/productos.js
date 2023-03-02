import { response } from "express";
import { Producto } from "../models/index.js";



const obtenerProductos = async ( req, res = response ) => {

    try {
        const { limite = 5, desde = 0 } = req.query;
        const query = { estado: true };
    
        const [ total, productos ] = await Promise.all([
            Producto.countDocuments( query ),
            Producto.find( query )
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ])
    
        if ( total === 0 ) {
            res.status(200).json({
                msg: 'No existen productos en la BD'
            })
        }
        res.status(200).json({
            total,
            productos
        });
        
    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error interno. Por favor intente más tarde'
        })
    }
}

const obtenerProducto = async ( req, res = response ) => {
    
    try {
        const { id } = req.params;

        const producto = await Producto
                                .findById( id )
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');
        
        res.status(200).json({
            msg: `Se encontró el producto con id: ${id}`,
            producto
        })
        
    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error interno. Por favor intente más tarde'
        })
    }
}


const crearProducto = async ( req, res = response ) => {

    try {
        
        const { nombre, usuario, estado, ...prod} = req.body;

        nombre = nombre.toUpperCase();
        
        const productoDB = await Producto.findOne({ nombre });

        if ( productoDB ) {
            return res.status(400).json({
                msg: `El producto ${nombre} ya existe`
            })
        }
    
        const data = {
            nombre,
            usuario: req.usuario._id,
            ...prod
        }

        const producto = new Producto( data );

        await producto.save();

        res.status(201 ).json({
            msg: `El producto ${nombre} se creó exitosamente`,
            producto
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error. Intente más tarde',
            error
        })
    }

}

const actualizarProducto = async ( req, res = response ) => {

    try {
        const { id } = req.params;
        const { usuario, estado, ...data } = req.body;

        if ( data.nombre ) {
            data.nombre = data.nombre.toUpperCase();
        }
        data.usuario = req.usuario._id;

        const producto = await Producto.findByIdAndUpdate( id, data, { new: true });

        res.status(200).json({
            msg: `Se actualizó correctamente el producto con id ${id}`,
            producto
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error. Intente más tarde',
            error
        })
    }
}

const borrarProducto = async ( req, res = response ) => {

    try {

        const { id } = req.params;
        const query = { estado: false };

        const producto = await Producto.findByIdAndUpdate( id, query, { new: true });

        res.status(200).json({
            msg: `El producto con id ${id} se ha eliminado`,
            producto
        })
        
    } catch (error) {
        res.status(500).json({
            msg: 'Ha ocurrido un error. Intente más tarde',
            error
        })
    }
}


export {
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    borrarProducto  
}