
import productsManager from '../dao/Mongo/ProductManager.js';
import userManager from '../dao/Mongo/UserManager.js';
import cartManager from '../dao/Mongo/CartManager.js';
// import usersService from '../services/usersService.js';
import { logger } from '../utils/logger.js';

const ProductsManager = new productsManager()
const UserManager = new userManager()
const CartManager = new cartManager()
// const UsersService = new usersService()

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

export const realTimeProducts = async (req, res) => {
    try {
        var email = req.session.user.email
        var id = req.session.user.id
        res.render("realTimeProducts", {
            title: "Real Time Products",
            style: "home.css",
            email, id
        })
    } catch (error) {
        logger.error("Error en viewsController/realTimeProducts: " + error)
        return 'ERR|Error occured in viewsController in realTimeProducts'
    }
}
export const loggerTest = async (req, res) => {

    try {
        logger.debug("prueba de debug")
        logger.error("prueba de error")
        logger.http("prueba de http")
        logger.info("prueba de info")
        logger.warn("prueba de warning")
        res.send('prueba exitosa');

    } catch (error) {
        logger.error("Error en viewsController/loggerTest: " + error)
        return 'ERR|Error occured in viewsController in loggerTest'
    }
}
export const home = async (req, res) => {

    try {
        const allProducts = await ProductsManager.getProductNpaginviaService()
        res.render("home", {
            title: "Cards Products",
            style: "home.css",
            Products: allProducts

        })

    } catch (error) {
        logger.error("Error en viewsController/home: " + error)
        return 'ERR|Error occured in viewsController in home'
    }
}
export const UploaderView = async (req, res) => {

    try {
        const id = req.session.user.id;
        let user = await UserManager.obtainuser(id)

        const firstname = req.session.user.firstname;
        const lastname = req.session.user.lastname;
        const age = req.session.user.age;
        const email_ = req.session.user.email;
        const cart = req.session.user.cart;
        const role = user[0].role;
        req.session.user.role = role

        res.render("UploadViewer", {
            title: "Uploader",
            style: "home.css",
            uid: id, firstname, lastname, age, email_, cart, role,
        })

    } catch (error) {
        logger.error("Error en viewsController/UploaderView: " + error)
        return 'ERR|Error occured in viewsController in UploaderView'

    }
}
export const PersonalCart = async (req, res) => {
    try {
        const cid = req.session.user.cart;
        res.render("cart", {
            title: "Personal Shooping Cart",
            style: "home.css",
            cid: cid
        })
    } catch (error) {
        logger.error("Error en viewsController/PersonalCart: " + error)
        return 'ERR|Error occured in viewsController in PersonalCart'
    }
}
export const PersonalCartStatic = async (req, res) => {
    try {
        const cid = req.session.user.cart;
        const allProducts = await CartManager.getProductsinCartbyIDviaService(cid)
        res.render("cartStatic", {
            title: "Personal Shooping Cart",
            style: "catalog.css",
            cid: cid,
            allProducts: allProducts,
        })
    } catch (error) {
        logger.error("Error en viewsController/PersonalCartStatic: " + error)
        return 'ERR|Error occured in viewsController in PersonalCartStatic'
    }
}
export const products = async (req, res) => {

    try {
        let user = {
            firstname: req.session.user.firstname,
            lastname: req.session.user.lastname,
            age: req.session.user.age,
            email_: req.session.user.email,
            cart: req.session.user.cart,
            role: req.session.user.role,
            id: req.session.user.id,
        }

        const firstname = req.session.user.firstname;
        const lastname = req.session.user.lastname;
        const age = req.session.user.age;
        const email_ = req.session.user.email;
        const cart = req.session.user.cart;
        const role = req.session.user.role;
        const uid = req.session.user.id;
        const swAdmin = role === 'Admin' || role === 'admin' ? true : false;
        const swUser = role === 'User' || role === 'user' ? true : false;
        const swPremium = role === 'Premium' || role === 'premium' ? true : false;

        res.render("catalog", {
            title: "Catalog",
            style: "catalog.css",
            firstname, lastname, age, email_, role, swAdmin, swUser, cart, user, swPremium, uid
        })
    } catch (error) {
        logger.error("Error en viewsController/products:" + error)
        return 'ERR|Error occured in viewsController in products'
    }
}
export const getCartbyID = async (req, res) => {
    try {
        const cid = req.params.cid

        const allProducts = await CartManager.getProductsinCartbyIDviaService(cid)
        const isString = (value) => typeof value === 'string';
        if (isString(allProducts)) {
            const arrayAnswer = ManageAnswer(allProducts)
            return res.status(arrayAnswer[0]).send({
                status: arrayAnswer[0],
                message: arrayAnswer[1]
            })
        }

        res.render("cart", {
            title: "Cart Products",
            style: "home.css",
            Products: allProducts, cid
        })
    } catch (error) {
        logger.error("Error en viewsController/getCartbyID: " + error)
        return 'ERR|Error occured in viewsController in getCartbyID'
    }
}
export const login = async (req, res) => {

    try {
        res.render("login", {
            title: "Login Form",
            style: "login.css"
        })

    } catch (error) {
        logger.error("Error en viewsController/login: " + error)
        return 'ERR|Error occured in viewsController in login'
    }
}
export const adminManagerView = async (req, res) => {
    try {
        res.render("adminManager", {
            title: "Admin Manager Form",
            style: "home.css"
        })
    } catch (error) {
        logger.error("Error en viewsController/adminManagerView: " + error)
        return 'ERR|Error occured in viewsController in adminManagerView'
    }
}
export const recoverSendEmail = async (req, res) => {

    try {
        res.render("passwordRecovSendMail", {
            title: "Recover Form",
            style: "recover.css"
        })
    } catch (error) {
        logger.error("Error en viewsController/recoverSendEmail:" + error)
        return 'ERR|Error occured in viewsController in recoverSendEmail'
    }
}
export const recover = async (req, res) => {
    try {
        res.render("recover", {
            title: "Recover Form",
            style: "recover.css"
        })
    } catch (error) {
        logger.error("Error en viewsController/recover: " + error)
        return 'ERR|Error occured in viewsController in recover'
    }
}
export const logout = async (req, res) => {
    try {
        req.session.destroy()
        await UserManager.updatelastConnection(req.user._id)
        res.render("login", {
            title: "Login Form",
            style: "login.css"
        })
    } catch (error) {
        logger.error("Error en viewsController/logout: " + error)
        return 'ERR|Error occured in viewsController in logout'
    }
}
export const signup = async (req, res) => {
    try {
        res.render("signup", {
            title: "Signup Form",
            style: "signup.css"
        })
    } catch (error) {
        logger.error("Error en viewsController/signup: " + error)
        return 'ERR|Error occured in viewsController in signup'
    }
}
export const profile = async (req, res) => {
    try {
        const firstname = req.session.firstname;
        const lastname = req.session.lastname;
        const age = req.session.age;
        const email_ = req.session.email;
        const role = req.session.admin ? "Admin" : "User"

        res.render("catalog", {
            title: "Catalog",
            style: "home.css",
            firstname, lastname, age, email_, role
        })
    } catch (error) {
        logger.error("Error en viewsController/profile: " + error)
        return 'ERR|Error occured in viewsController in profile'
    }
}
export const failsignup = async (req, res) => {
    try {
        res.render("failsignup", {
            title: "failinf page",
            style: "failsignup.css"
        })

    } catch (error) {
        logger.error("Error en viewsController/failsignup: " + error)
        return 'ERR|Error occured in viewsController in failsignup'
    }
}
export const failogin = async (req, res) => {
    try {
        res.render("faillogin", {
            title: "fail Login page",
            style: "failLogin.css"
        })
    } catch (error) {
        logger.error("Error en viewsController/failogin: " + error)
        return 'ERR|Error occured in viewsController in failogin'
    }
}
export const generalFailform = async (req, res) => {
    try {
        var { message } = req.body
        res.render("generalFailform", {
            title: "General FailForm",
            style: "failLogin.css",
            message
        })
    } catch (error) {
        logger.error("Error en viewsController/generalFailform: " + error)
        return 'ERR|Error occured in viewsController in generalFailform'

    }
}