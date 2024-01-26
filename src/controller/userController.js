
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

        let uid = req
        let answerDoc = await UsersManager.verifyUserDocumentation(uid)
        const arrayAnswerVerify = ManageAnswer(answerDoc)

        if (arrayAnswerVerify[0] != 200) {
            return answerDoc;
        }

        let answer = await UsersManager.changeRol(uid)
        const arrayAnswer = ManageAnswer(answer)

        return answer

    } catch (error) {
        logger.error("Error en userController/changeRol: " + error)
        return 'ERR|Error occured in userController in changeRol'

    }
}
export const uploadFile = async (req, res) => {

    try {
        var uid = req.params.uid
        let answer = await UsersManager.uploadFile(uid)
        res.redirect("/UploaderView")

    } catch (error) {
        logger.error("Error en userController/uploadFile: " + error)
        return swWeb ? error : res.status(500).send({
            status: "500",
            message: `Se ha arrojado una exepcion: error`
        })
    }
}

export const obtainUsers = async (req, res) => {

    try {

        let answer = await UsersManager.obtainusers()

        res.send(answer)

    } catch (error) {
        logger.error("Error en userController/obtainUsers: " + error)
        return swWeb ? error : res.status(500).send({
            status: "500",
            message: `Se ha arrojado una exepcion: error`
        })
    }
}

export const obtainUsersforsockect = async (req, res) => {

    try {

        let answer = await UsersManager.obtainusers()
        return answer

    } catch (error) {
        logger.error("Error en userController/obtainUsers: " + error)
        return error
    }
}

export const obtainUser = async (req, res) => {

    try {

        let uid = req
        let answer = await UsersManager.obtainuser(uid)

        return answer

    } catch (error) {
        logger.error("Error en userController/obtainUser: " + error)

        return answer
    }
}

export const deleteUsersLateConn = async (req, res) => {

    try {
        let answer = await UsersManager.deleteUsersLateConn()
        res.send(answer)

    } catch (error) {
        logger.error("Error en userController/deleteUsersLateConn: " + error)

        return res.status(500).send({
            status: "500",
            message: `Se ha arrojado una exepcion: error`
        })

    }
}

export const deleteUser = async (req, res) => {

    try {

        let uid = req
        let answer = await UsersManager.deleteUser(uid)
        // res.send(answer)
        return answer
    } catch (error) {
        logger.error("Error en userController/deleteUser:" + error)
        return "ERR|" + error
        // return res.status(500).send({
        //     status: "500",
        //     message: `Se ha arrojado una exepcion: error`
        // })

    }
}

export const updatelastConnection = async (req, res) => {

    try {

       
        var uid = req.params.uid
        let answer = await UsersManager.updatelastConnection(uid)
        return answer

    } catch (error) {
        logger.error("Error en userController/uploadFile: " + error)
        return "ERR|" + error
    }
}







