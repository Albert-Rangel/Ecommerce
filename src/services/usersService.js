import { userModel } from '../dao/models/user.model.js';
import { productsModel } from '../dao/models/products.model.js';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';
import __dirname from '../utils.js';
import userdto from '../dto/userdto.js'
import moment from 'moment';
import emailsService from '../services/emailService.js';
const emailService = new emailsService()
export default class usersService {

    async changeRol(uid) {
        try {

            var newRol = ""
            const user = await userModel.find({ _id: uid });
            const role = user[0].role

            if (role === "User" || role === "user") {

                newRol = "Premium"
                await userModel.updateOne(
                    { "_id": uid },
                    { $set: { role: "Premium" } }
                )

            } else if (role === "Premium" || role === "premium") {

                newRol = "User"
                await userModel.updateOne(
                    { "_id": uid },
                    { $set: { role: "User" } }
                )
            }

            return `SUC|` + newRol
        } catch (error) {
            logger.error("Error en UseressService/changeRol: " + error)
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async verifyUserDocumentation(uid) {
        try {

            const user = await userModel.find({ _id: uid });

            if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro el usuario en base de datos.`;

            if (user[0].role == "Premium") {
                // console.log("entro en preimum golden tickect")
                return `SUC|` + 'Posee todos los documentos para cambiarse el rol'
            }
            const documents = user[0].documents

            if (documents.length === 0) return `E02|` + "No posee todos los documentos necesarios"

            const wordsToCheck = ['profileFile', 'addressFile', 'BankFile', 'IDFile'];

            let allDocumentsFound = wordsToCheck.every((word) => {
                return documents.some((item) => item.name.startsWith(word));
            });

            if (!allDocumentsFound) {
                return `E02|` + "No posee todos los documentos necesarios"
            }
            return `SUC|` + 'Posee todos los documentos para cambiarse el rol'
        } catch (error) {
            logger.error("Error en UseresService/verifyUserDocumentation: " + error)
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async verifyProductPermission(uid, pid) {
        try {
            //obtener el email y el role del usuario logeado

            const user = await userModel.find({ _id: uid });
            const role = user[0].role

            const emailuser = user[0].email

            //Si es premium validar que ese email sea el mismo email del producto
            if (role === "Premium" || role === "premium") {
                const product = await productsModel.find({ _id: pid });
                const emailproduct = product[0].owner

                if (emailproduct != emailuser) return false
            }

            //retornar true or false
            return true
        } catch (error) {
            logger.error("Error en UseressService/changeRol: " + error)
            return false
        }
    }

    async changeuserStatus(uid) {
        try {

            // var newRol = ""
            const user = await userModel.find({ _id: uid });

            if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro el usuario en base de datos.`;


            const status = user[0].status

            await userModel.updateOne(
                { "_id": uid },
                { $set: { status: true } }
            )

            return `SUC|` + "Exito."
        } catch (error) {
            logger.error("Error en UseressService/changeuserStatus: " + error)
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async updatelastConnection(uid) {
        try {

            const user = await userModel.find({ _id: uid });

            if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro el usuario en base de datos.`;

            const lastconnection = user[0].lastConnection
            const currentDt = Date.now()
            await userModel.updateOne(
                { "_id": uid },
                { $set: { lastConnection: currentDt } }
            )

            return `SUC|` + "Exito."
        } catch (error) {
            logger.error("Error en UseressService/updatelastConnection: " + error)
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async updatedocuments(uid, newDocuments) {
        try {

            const user = await userModel.find({ _id: uid });

            if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro el usuario en base de datos.`;

            const lastconnection = user[0].documents

            await userModel.updateOne(
                { "_id": uid },
                { $set: { documents: newDocuments } }
            )

            return `SUC|` + "Exito."

        } catch (error) {
            logger.error("Error en UserssService/updatedocuments: " + error)
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async documentsStatus(uid, swbool) {
        try {

            const user = await userModel.find({ _id: uid });

            if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro el usuario en base de datos.`;

            const lastconnection = user[0].status

            await userModel.updateOne(
                { "_id": uid },
                { $set: { status: swbool } }
            )

            return `SUC|` + "Exito."

        } catch (error) {
            logger.error("Error en UserssService/documentsStatus: " + error)
            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async obtainUser(uid) {

        const user = await userModel.find({ _id: uid });
        // console.log("userservice in obtainuser")
        // console.log(user)
        if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro el usuario en base de datos.`;
        return user
    }
    async deleteUser(uid) {
        console.log("deleteUser en el servicio")
        console.log(uid)
        const user = await userModel.find({ _id: uid });

        if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro el usuario en base de datos.`;

        console.log("user")

        console.log(user)
        let emailHTMLTemplate = `
            <form>
              <div>
                <label>Hola ${user[0].email}</label>
                <br>
                <h1>Tu cuenta ha sido eliminada por el administrador</h1>
              </div>
            </form>
            `;
        await emailService.sendEmailNotification(user[0].firstname + " " + user[0].lastname, 'Eliminacion de cuenta ', emailHTMLTemplate);
        await userModel.deleteOne({ _id: uid});
        return 'SUC|El usuario fue eliminado'

        // console.log("userservice in obtainuser")
        // console.log(user)
        // return user
    }

    async obtainusers() {
        var newListUser = []
        // let user = await userModel.find();
        let user = await userModel.find({ role: { $in: ["User", "Premium"] } });

        if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro ningun usuario en base de datos.`;

        user.forEach(a => {
            let dtouser = userdto.getUserInputFrom(a)
            newListUser.push(dtouser)
        })

        return newListUser
    }

    async obtainusersToDelte() {
        //Find users with lastConnection less than 10 minutes ago:
        let TEN_MINUTES = moment().subtract(10, 'minutes').toDate();

        const query = { lastConnection: { $gte: TEN_MINUTES } };

        // Retrieve those users:
        const users = await userModel.find(query).exec();

        // console.log("Retrieved users:", users);

        if (!users || users == null || Object.keys(users).length === 0) return `E02|No se encontro ningun usuario que se halla conectado hace 10 minutos o menos.`;

        return users
    }

    async deleteUsersLateConn(answer) {

        for (const user of answer) {
            const user_ = await userModel.find({ _id: user._id });

            let emailHTMLTemplate = `
            <form>
              <div>
                <label>Hola ${user_[0].email}</label>
                <br>
                <h1>Tu cuenta ha sido eliminada por falta de uso </h1>
              </div>
            </form>
            `;
            await emailService.sendEmailNotification(user_[0].firstname + " " + user_[0].lastname, 'Eliminacion de cuenta ', emailHTMLTemplate);
            await userModel.deleteOne({ _id: user._id });
            return 'SUC|El usuario fue eliminado'
        }

        return answer
    }

    async updateUserDocuments(uid) {
        let swbool = false

        const user = await userModel.find({ _id: uid });

        if (!user || user == null || Object.keys(user).length === 0) return `E02|No se encontro el usuario en base de datos.`;

        // let documents = user[0].documents

        let filesToCheck = ["documents", "profiles"]
        const wordsToCheck = ['profileFile', 'addressFile', 'BankFile', 'IDFile'];

        let newDocuments = []

        for (const element of filesToCheck) {
            try {
                let filePath = path.join(__dirname + '\\public\\' + element);
                const filenames = await fs.readdir(filePath);

                filenames.forEach((filename) => {

                    let splitSection = filename.split(".")[0].split(",")
                    if (splitSection[1] == uid) {
                        newDocuments.push({ name: filename, reference: filePath })
                    }
                });
            } catch (err) {
                console.error("Error reading directory:", err);
            }
        }

        let allDocumentsFound = wordsToCheck.every((word) => {
            return newDocuments.some((item) => item.name.startsWith(word));
        });

        if (allDocumentsFound) {
            swbool = true
        } else {
            swbool = false
        }

        await this.updatedocuments(uid, newDocuments)

        await this.documentsStatus(uid, swbool)

        //no borrar esto sirve si quieres encontrar un file en especifico
        // try {
        //     let answer = await fs.access(filePath, fs.constants.F_OK);
        //     swbool = answer == undefined ? true : false
        // } catch {
        //     swbool = false
        // }

        return "SUC|Exito"


    }
}