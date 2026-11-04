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

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
    
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

