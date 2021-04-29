const express = require('express')
const cors = require("cors")
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = "/api/usuarios";
        //Middleware
        this.middlewares();
        //Rutas
        this.routes();


    }

    middlewares() {

        //Cors
        this.app.use(cors());
        //Lectura y parseo del body que me envian como res
        this.app.use(express.json());
        //Directorio publico
        this.app.use(express.static("public"));

    }





    routes() {
        this.app.use(this.usuariosPath, require("../routes/user.js"));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor ejecutandose es el puerto: ", this.port)
        })
    }
}
module.exports = Server;