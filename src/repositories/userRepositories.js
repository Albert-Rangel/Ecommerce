
import { logger } from '../utils/logger.js';
import moment from 'moment';
import usersService from '../services/usersService.js';

const UserService = new usersService()

class usersRepositories {
  async changeRol(uid) {
    try {

      let answer = await UserService.changeRol(uid)
      // console.log("answer " + answer)
      return answer

    } catch (error) {
      logger.error("Error en userRepositories/changeRol: " + error)
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

  async obtainuser(uid) {
    try {

      let answer = await UserService.obtainUser(uid)
      // console.log("answer " + answer)
      return answer

    } catch (error) {
      logger.error("Error en userRepositories/obtainusers: " + error)
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  async deleteUser(uid) {
    try {
      console.log("deleteUser en el repositorio")
      console.log(uid)
      let answer = await UserService.deleteUser(uid)
      // console.log("answer " + answer)
      return answer

    } catch (error) {
      logger.error("Error en userRepositories/deleteUser: " + error)
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
    // Retrieve those users:
    let answer = await UserService.obtainusersToDelte()

    if (typeof answer === 'string') return answer

    let answerDelete = await UserService.deleteUsersLateConn(answer)

    return answerDelete
  }


  async uploadFile(uid) {
    try {

      let user = await UserService.obtainUser(uid)
      console.log(user)

      let userupdated = await UserService.updateUserDocuments(uid)

      return `SUC|Exito`

    } catch (error) {
      logger.error("Error en userRepositories/uploadFile: " + error)
      return `ERR|Error generico. Descripcion :${error}`

    }
  }
}
export default usersRepositories




