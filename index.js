require('dotenv').config()

const express = require("express");
const app = express();
const {typeError} = require('./middleware/errors');
const cors = require('cors')
const path = require('path');

const PORT = process.env.PORT || 3001;

// Configurar las rutas estáticas para las imágenes
app.use('/public/images/user/products', express.static('/public/images/user/products'));

// Configurar el middleware para servir archivos estáticos desde la carpeta "public"
app.use('/public', express.static(path.join(__dirname, 'public')));

//MIDDLEWARE (funcion que ejecutas antes de las rutas)
app.use(express.json());
app.use(cors())

//ROUTES /prefix
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/categories", require("./routes/categories"));
app.use("/orders", require("./routes/orders"));


// Ruta para servir imágenes
app.get('/public/images/user/products/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/images/user/products', imageName);
    
    console.log(`Serving image: ${imagePath}`);
    
    res.sendFile(imagePath);
});

// app.get('/public/images/user/products/:imageName'), (req, res) => {
//     const imageName = req.params.imageName;
//     console.log(`Serving image: ${imageName}`)};

//MIDDLEWARE ERRORS
app.use(typeError)

//LISTEN 
app.listen(PORT,() => {
    console.log("Server is up and running on port " + PORT)
})
