// import express, { Router, json } from "express"
import express from "express"
import { logger } from "../utils/logger.js"
// import cartsManager from "../dao/Mongo/CartManager.js";
// import productsManager from "../dao/Mongo/ProductManager.js";
import publicRoutes from "../middlewares/publicRoutes.js"
import privateRoutes from "../middlewares/privateRoutes.js"
import permissionsRoutes from "../middlewares/adminpermissionsRoutes.js"

import {
    realTimeProducts,
    loggerTest,
    home,
    UploaderView,
    PersonalCart,
    PersonalCartStatic,
    products,
    getCartbyID,
    login,
    adminManagerView,
    recoverSendEmail,
    recover,
    logout,
    signup,
    profile,
    failsignup,
    failogin,
    generalFailform,
}from '../controller/viewsController.js'

// import usersService from "../services/usersService.js"

// const CartsManager = new cartsManager()
// const ProductsManager = new productsManager()
// const UsersService = new usersService()

const ViewsRoutes = express.Router()



ViewsRoutes.get('/realTimeProducts', privateRoutes, permissionsRoutes, realTimeProducts);
ViewsRoutes.get('/loggerTest', loggerTest)
ViewsRoutes.get('/home',  home)
ViewsRoutes.get('/UploaderView', UploaderView)
ViewsRoutes.get('/PersonalCart',  PersonalCart);
ViewsRoutes.get('/PersonalCartStatic', PersonalCartStatic)
ViewsRoutes.get('/products',  privateRoutes, products)
ViewsRoutes.get('/carts/:cid', getCartbyID)
ViewsRoutes.get('/login', publicRoutes, login)
ViewsRoutes.get('/adminManagerView',permissionsRoutes,  adminManagerView)
ViewsRoutes.get('/recoverSendEmail', publicRoutes,  recoverSendEmail)
ViewsRoutes.get('/recover',  publicRoutes, recover)
ViewsRoutes.get('/logout', privateRoutes, logout)
ViewsRoutes.get('/signup', publicRoutes, signup)
ViewsRoutes.get('/profile', privateRoutes,  profile)
ViewsRoutes.get('/failsignup', publicRoutes, failsignup)
ViewsRoutes.get('/failogin', publicRoutes,  failogin)
ViewsRoutes.post('/generalFailform', generalFailform)


export default ViewsRoutes
