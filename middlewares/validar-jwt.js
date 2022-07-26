const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/users')


const validarJWT = async(req = request, res = response, next)=>{

    const token = req.header('x-token')

    if(!token){
        res.status(401).json({
            msg: "No hay token en la petición"
        })
    }

    try {

       const { uid } = jwt.verify(token, process.env.SECRETORPRIVITEKEY)

       const user = await User.findById( uid )

       if(!user){
        return res.status(401).json({
            msg: "Token no válido - Usuario no existe en BD"
        })
    }
    
    if(!user.status){
        return res.status(401).json({
            msg: "Token no válido - Status: false"
        })
        
       }

       req.user = user;

        next();
        
    } catch (error) {
        console.log(error)

        res.status(401).json({
            msg: "Token no válido"
        })
    }
}

module.exports = {
    validarJWT
}