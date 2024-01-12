import dotenv from 'dotenv'
import { Command } from "commander"
const program = new Command();
//obtenemos desde nuestro package.json del script el modo
program
.option('--mode <mode>', 'Enviroment', 'production')
program.parse()

//Asignamos el ambiente a una constante
const enviroment =program.opts().mode

//configuramos dicho ambiente para obtener los datos del archivo env correspondiente
dotenv.config({
    path:enviroment==="development"?"./.env.development":"./.env.production"
})


export default{
    port:process.env.PORT,
    mongourl:process.env.MONGO_URL,
    adminName:process.env.ADMIN_NAME,
    adminPassword:process.env.ADMIN_PASSWORD,
    enviroment: process.env.ENVIROMENT,
}
