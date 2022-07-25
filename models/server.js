const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../config/mongo_conn');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 5000;

        //middlewares
        this.middlewares();

        //connection
        this.connectDB()
        //routes
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(cors())

        this.app.use(express.json())
    }

    routes(){
        this.app.use('/', require('../routes'))
    }

    listen(){
        this.app.listen(this.port, ()=> console.log(`Server is running on port: ${this.port}`))
    }

}


module.exports = Server;