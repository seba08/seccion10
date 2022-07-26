const { request, response } = require('express')

const bcryptjs = require('bcryptjs')

const User = require('../models/users');
const { generarJWT } = require('../helpers/generar-jwt');


const getAuth = async(req, res = response)=>{
    const users = await User.find({})
    res.json(users)
}
const postAuth = async(req, res = response)=>{

    const { email, password } = req.body;
    try {

        //Verificar si existe el email
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                msg: "Usuario / Password no son correcto - email"
            })
        }
        
        //Verficar si el usuario está activo
        if(!user.status){

            return res.status(400).json({
                msg: "Usuario / Password no son correcto - status"
            })
        }
        
        //Verificar si las contraseña coinciden
        const validPassword = bcryptjs.compareSync(password, user.password);
        
        if(!validPassword){
            return res.status(400).json({
                msg: "Usuario / Password no son correcto - password"
            })

        }
        //Generar toke jwt

        const token = await generarJWT(user._id);
        
        res.json({
            msg:"Usuario logueado",
            token
        })
    } catch (error) {
        console.log(error)

        res.status(500).send("Error en el servidor")
    }
}


module.exports = {
    getAuth,
    postAuth
}