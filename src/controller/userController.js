
import { use } from 'chai';
import usersManager from '../dao/Mongo/UserManager.js';
import { logger } from '../utils/logger.js';
import usersService from '../services/usersService.js';

const UsersManager = new usersManager()
const UsersService = new usersService()

function ManageAnswer(answer) {
    const arrayAnswer = []
    if (answer) {
        const splitString = answer.split("|");
        switch (splitString[0]) {
            case "E01":
                arrayAnswer.push(400)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "E02":
                arrayAnswer.push(404)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "SUC":
                arrayAnswer.push(200)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "ERR":
            default:
                arrayAnswer.push(500)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
        }
    }
}

export const changeRol = async (req, res) => {

    try {

        let uid = req.uid
        console.log("uid")
        console.log(uid)

        let answerDoc = await UsersManager.verifyUserDocumentation(uid)
        const arrayAnswerVerify = ManageAnswer(answerDoc)

        console.log("answerDoc")
        console.log(answerDoc)

        if (arrayAnswerVerify[0] != 200) {
            return answerDoc;
        }

        let answer = await UsersManager.changeRol(uid)
        const arrayAnswer = ManageAnswer(answer)

        return answer

    } catch (error) {
        logger.error("Error en userController/changeRol: " + error)
        // return res.status(500).send({
        //     status: "500",
        //     message: `Error occured in userController in changeRol`
        // })
        return 'ERR|Error occured in userController in changeRol'
        // res.redirect("/products") // crear error form para user
    }
}
export const uploadFile = async (req, res) => {

    try {
        console.log("entro en el controlador de user uploadFile")
        var uid = req.params.uid
        console.log("uid" + uid)
        // if (!req.file) {
        //  console.log("es nulo")4
        // }

        let answer = await UsersManager.uploadFile(uid)

        // const arrayAnswer = ManageAnswer(answer)

        // req.session.user.role = arrayAnswer[1]

        res.redirect("/UploaderView")

    } catch (error) {
        logger.error("Error en userController/uploadFile: " + error)
        return swWeb ? error : res.status(500).send({
            status: "500",
            message: `Se ha arrojado una exepcion: error`
        })
    }
}





