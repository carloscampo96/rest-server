
import { Schema, model } from 'mongoose'; 

const UsuarioSchema = Schema ({
    nombre : {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    correo : {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password : {
        type: String,
        required: [true, 'La contarseña es obligatorio']
    },
    nombre : {
        type: String
    },
    role : {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado : {
        type: Boolean,
        default: true
    },
    google : {
        type: Boolean,
        default: false
    }
});

UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model( 'Usuario', UsuarioSchema );