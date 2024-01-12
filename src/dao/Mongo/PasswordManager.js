
import passwordService from '../../services/PasswordService.js';
import { logger } from '../../utils/logger.js';


const PasswordService = new passwordService()

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

export const sendEmailToResetPassword = async (req, res) => {

  try {
    var email = req.body

    let answer = await PasswordService.sendEmailToResetPassword(email)

    const arrayAnswer = ManageAnswer(answer)
    var message = arrayAnswer[1]
    if (arrayAnswer[0] != 200) {
      return res.render("generalFailform", {
        title: "failinf page",
        style: "failsignup.css",
        message
      })

    }

    return res.render("generalFailform", {
      title: "failinf page",
      style: "failsignup.css",
      message
    })

  } catch (error) {
    logger.error("Error en PasswordManager/initRecovery: " + error)
    return res.render("generalFailform", {
      title: "failinf page",
      style: "failsignup.css",
      message
    })
  }
}

export const resetPassword = async (req, res) => {

  try {

    var { password, password2, token_ } = req.body
  
    let answer = await PasswordService.resetPassword({ token_, password, password2 })

    const arrayAnswer = ManageAnswer(answer)


    var message = arrayAnswer[1]
    if (arrayAnswer[0] != 200) {
      return res.render("generalFailform", {
        title: "failinf page",
        style: "failsignup.css",
        message
      })
    }

    return res.render("login", {
      title: "Login Form",
      style: "login.css"
    })

  } catch (error) {
    logger.error("Error en PasswordManager/initRecovery: " + error)
    return res.render("generalFailform", {
      title: "failinf page",
      style: "failsignup.css",
      error
    })

  }
}