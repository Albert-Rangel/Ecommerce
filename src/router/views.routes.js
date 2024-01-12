import express, { Router, json } from "express"
import { logger } from "../utils/logger.js"
// import {
//     getProducts_,
// } from '../dao/Mongo/ProductManager.js'
import cartsManager from "../dao/Mongo/CartManager.js";
import productsManager from "../dao/Mongo/ProductManager.js";

import publicRoutes from "../middlewares/publicRoutes.js"
import privateRoutes from "../middlewares/privateRoutes.js"
import permissionsRoutes from "../middlewares/adminpermissionsRoutes.js"
import usersService from "../services/usersService.js"

const CartsManager = new cartsManager()
const ProductsManager = new productsManager()
const UsersService = new usersService()

const router = express.Router()

router.get("/realTimeProducts", privateRoutes, permissionsRoutes, async (req, res) => {

    var email = req.session.user.email
    var id = req.session.user.id
    res.render("realTimeProducts", {
        title: "Real Time Products",
        style: "home.css",
        email, id
    })
})

router.get('/loggerTest',
    async (req, res) => {
        logger.debug("prueba de debug")
        logger.error("prueba de error")
        logger.http("prueba de http")
        logger.info("prueba de info")
        logger.warn("prueba de warning")
        res.send('prueba exitosa');
    });

router.get("/home", async (req, res) => {

    const allProducts = await ProductsManager.getProductNpaginviaService()

    res.render("home", {
        title: "Cards Products",
        style: "home.css",
        Products: allProducts

    })
})

router.get("/UploaderView", async (req, res) => {
    console.log("entro en el view de UploaderView")
    const id = req.session.user.id;

    let user = await UsersService.obtainUser(id)
    
    const firstname = req.session.user.firstname;
    const lastname = req.session.user.lastname;
    const age = req.session.user.age;
    const email_ = req.session.user.email;
    const cart = req.session.user.cart;
    const role = user[0].role;
    req.session.user.role = role
    console.log(role)
    console.log(req.session.user.role)

    res.render("UploadViewer", {
        title: "Uploader",
        style: "home.css",
        uid: id, firstname, lastname, age, email_, cart, role,
    })
})


router.get("/PersonalCart", async (req, res) => {

    const cid = req.session.user.cart;

    res.render("cart", {
        title: "Personal Shooping Cart",
        style: "home.css",
        cid: cid

    })
})

router.get("/PersonalCartStatic", async (req, res) => {

    const cid = req.session.user.cart;
    const allProducts = await CartsManager.getProductsinCartbyIDviaService(cid)

    res.render("cartStatic", {
        title: "Personal Shooping Cart",
        style: "catalog.css",
        cid: cid,
        allProducts: allProducts,
    })
})

router.get("/products", privateRoutes, async (req, res) => {

    let user = {
        firstname: req.session.user.firstname,
        lastname: req.session.user.lastname,
        age: req.session.user.age,
        email_: req.session.user.email,
        cart: req.session.user.cart,
        role: req.session.user.role,
        id: req.session.user.id,
    }

    console.log("req.session.user.role" + req.session.user.role)

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
})

router.get("/carts/:cid", async (req, res) => {

    const cid = req.params.cid
    console.log(cid)
    console.log(typeof cid)

    const allProducts = await CartsManager.getProductsinCartbyIDviaService(cid)
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
})

router.get('/login', publicRoutes, (req, res) => {

    res.render("login", {
        title: "Login Form",
        style: "login.css"
    })
});

router.get('/recoverSendEmail', publicRoutes, (req, res) => {

    res.render("passwordRecovSendMail", {
        title: "Recover Form",
        style: "recover.css"
    })
});

router.get('/recover', publicRoutes, (req, res) => {

    res.render("recover", {
        title: "Recover Form",
        style: "recover.css"
    })
});

router.get('/logout', privateRoutes, async (req, res) => {
    req.session.destroy()
    await UsersService.updatelastConnection(req.user._id)

    res.render("login", {
        title: "Login Form",
        style: "login.css"
    })
});

router.get('/signup', publicRoutes, (req, res) => {

    res.render("signup", {
        title: "Signup Form",
        style: "signup.css"
    })
});


router.get('/profile', privateRoutes, (req, res) => {

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

});

router.get('/failsignup', publicRoutes, (req, res) => {

    res.render("failsignup", {
        title: "failinf page",
        style: "failsignup.css"
    })
});

router.get('/failogin', publicRoutes, (req, res) => {

    res.render("faillogin", {
        title: "fail Login page",
        style: "failLogin.css"
    })
});

router.post('/generalFailform', (req, res) => {

    var { message } = req.body

    res.render("generalFailform", {
        title: "General FailForm",
        style: "failLogin.css",
        message
    })
});


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
export default router
