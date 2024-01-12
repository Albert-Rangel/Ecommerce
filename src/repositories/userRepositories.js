
import { logger } from '../utils/logger.js';
import usersService from '../services/usersService.js';

const UserService = new usersService()

class usersRepositories {
  async changeRol(uid) {
    try {

      let answer = await UserService.changeRol(uid)
      console.log("answer " + answer)
      return answer

    } catch (error) {
      logger.error("Error en userRepositories/changeRol: " + error)
      return `ERR|Error generico. Descripcion :${error}`
    }
  }


  async deleteUsersLateConn() {
    try {

      let answer = await UserService.deleteUsersLateConn()
      // console.log("answer " + answer)
      return answer

    } catch (error) {
      logger.error("Error en userRepositories/deleteUsersLateConn: " + error)
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async obtainusers() {
    try {

      let answer = await UserService.obtainusers()
      // console.log("answer " + answer)
      return answer

    } catch (error) {
      logger.error("Error en userRepositories/obtainusers: " + error)
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async verifyUserDocumentation(uid) {
    try {

      let answer = await UserService.verifyUserDocumentation(uid)
      return answer

    } catch (error) {
      logger.error("Error en userRepositories/changeRol: " + error)
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async deleteUsersLateConn() {

    const tenMinutesInMilliseconds = 10 * 60 * 1000; // 10 minutes in milliseconds

    // const time = Date.now();
    const timenew = new Date();

    // console.log(time)
    console.log(timenew)
    // const nowtime = time / 1000;
    // console.log(nowtime)

    if (timenew >= tenMinutesInMilliseconds) {
      console.log("Half an hour has passed!");
    } else {
      // setTimeout(checkTime, 1000); // Check again in 1 second
    }


  }


  async uploadFile(uid) {
    try {
      // if (!req.file) {
      //   return res.status(500).send({
      //     status: "500",
      //     message: `Error occured in UsertManager in uploadFile`
      //   })
      // }

      // var uid = req.params.uid

      let user = await UserService.obtainUser(uid)
      console.log(user)

      let userupdated = await UserService.updateUserDocuments(uid)

      // const arrayAnswer = ManageAnswer(answer)

      // req.session.user.role = arrayAnswer[1]

      return `SUC|Exito`

    } catch (error) {
      logger.error("Error en userRepositories/uploadFile: " + error)
      return `ERR|Error generico. Descripcion :${error}`

    }
  }
}
export default usersRepositories




