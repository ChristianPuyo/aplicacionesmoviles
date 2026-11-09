const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const SECRET_KEY = "1234567890";

const app = express()
app.use(cors());
app.use(express.json());

const PORT = 3000
const user = {
    id: 1,
    name: "Antoni",
    email: "antoni@gmail.com",
    password: "123456"
}

app.get("/", (req, res)=>{
    res.json({
        mensaje: "API funcionando correctamente"
    })
})



app.post("/login", (req, res)=>{
    const {email, password} = req.body
    if(
        email === user.email &&
        password === user.password
    ){
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            SECRET_KEY,
            {
                expiresIn: "1h"
            }
        )
        return res.json({
            mensaje: "Login correcto",
            token: token
        })
    }
    return res.status(401).json({
        mensaje: "email o password incorrecto"
    })
})

/*
        Middleware para verificar el token
        Esta función comprobará si el usuario envió un jwt válido
*/
function verifyToken(req, res, next){
    //Obtenemos el encabezado de Authorization
    //Enviado por el cliente(React native)
    const authorization = req.headers.authorization
    //Si no existe Authorization,
    //significa que el cliente no envió el token
    if(!authorization){
        //Respondemos con el codigo http 401 (Unauthorized)
        return res.status(401).json({
            mensaje: "No se envió el token"
        })
    }
    //El encabezado normalmente tiene esta forma:
    //"Bearer jsadfljklsdjfejojiosidfjodj"
    //Separamos el texto utilizando el espacio
    const partes = authorization.split(" ")
    //Comprobamos que existan exactamente dos partes,
    //que la primera sea 'Bearer' y que aya un token.
    if(
       partes.length !== 2 ||
       partes[0] !== 'Bearer' ||
       !partes[1]
    ){
        //Si el formato es incorrecto, 
        //rechazamos la petición.
        return res.status(401).json({
            mensaje: "Formato de token incorrecto"
        })
    }
    //Extraemos la segunda parte del encabezado,
    //que contiene el JwT
    const token = partes[1]
    //Intentamos verificar el token
    try{
        //Jwt.verify comprueba la firma del JWT
        //utilizando nuestra clave secreta. 
        //tambien comprueba su expiración.
        const datos = jwt.verify(
            token,
            SECRET_KEY,
            {
                algorithms: ["HS256"]
            }
        )
        //Guardamos el contenido verificado del token 
        //en una nueva propiedad de req
        req.user = datos
        //Permitimos que express continue.
        //ejecutando la siguiente función.
        next()
    }catch(error){
        //Si el token es falso, está modificado
        //o ha expirado, jwt.verify lanzará un error.
        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        })
    }
}

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
    
})