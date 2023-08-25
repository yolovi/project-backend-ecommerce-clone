require('dotenv').config()

const express = require("express");
const app = express();
const {typeError} = require('./middleware/errors');
const cors = require('cors')
const path = require('path');

const PORT = process.env.PORT || 3001;

//MIDDLEWARE (funcion que ejecutas antes de las rutas)
app.use(express.json());
app.use(cors())
// Configurar el middleware para servir archivos estáticos desde la carpeta "public"
app.use('/public', express.static(path.join(__dirname, 'public')));

//ROUTES /prefix

// Configurar las rutas estáticas para las imágenes
app.use('/public/images/user/products', express.static('/public/images/user/products'));

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/categories", require("./routes/categories"));
app.use("/orders", require("./routes/orders"));


//MIDDLEWARE ERRORS
app.use(typeError)

//LISTEN 
app.listen(PORT,() => {
    console.log("Server is up and running on port " + PORT)
})
