import { Router, json } from 'express';
import publicRoutes from "../middlewares/publicRoutes.js"
import passport from 'passport';
import privateRoutes from '../middlewares/privateRoutes.js';
import usersService from "../services/usersService.js"
import userdto from '../dto/userdto.js'
const router = Router();
const UsersService = new usersService()


router.post('/login', publicRoutes,
  passport.authenticate('login', { failureRedirect: '/failogin' }),
  async (req, res) => {
    if (!req.user) {
      res.status(400).send();
    }
    const objectId_ = req.user.cart[0]._id;

    // Extract the hexadecimal representation
    const hexString = objectId_.toHexString();

    req.session.user = {
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      age: req.user.age,
      cart: hexString,
      admin: false,
      role: req.user.role,
      id: req.user._id,
    };

    req.session.isLogged = true;

    await UsersService.updatelastConnection(req.user._id)

    res.redirect('/products');
  }
);

router.post('/loginandlogoutTest',
  passport.authenticate('login'),
  async (req, res) => {
    if (!req.user) {
      console.log("entro en el false de re.user")

      res.status(400).send();
    }

    const objectId_ = req.user.cart[0]._id;

    // Extract the hexadecimal representation
    const hexString = objectId_.toHexString();

    req.session.user = {
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      age: req.user.age,
      cart: hexString,
      admin: false,
      role: req.user.role,
      id: req.user._id,
    };

    req.session.isLogged = true;

    var user = req.session.user
    console.log("llegp hasta el session router")
    req.session.destroy()

    return res.status(200).send(user)
  }
);

router.post('/signup', publicRoutes, passport.authenticate("register",
  { failureRedirect: "/failsignup" }),
  async (req, res) => {
    res.redirect('/login');
  });

router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] }))

router.get("/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {

    const objectId_ = req.user.cart[0]._id;

    // Extract the hexadecimal representation
    const hexString = objectId_.toHexString();

    req.session.user = {
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      age: req.user.age,
      cart: hexString,
      role: req.user.role,
      admin: false,
      id: req.user._id,
    };
    req.session.isLogged = true;
    await UsersService.updatelastConnection(req.user._id)


    res.redirect("/products")
  })

router.get(
  '/current', privateRoutes,
  async (req, res) => {
    const objectId_ = req.user.cart[0]._id;

    // Extract the hexadecimal representation
    const hexString = objectId_.toHexString();

    // const dtouser = {
    //   _id: req.user._id,
    //   firstname: req.user.firstname,
    //   lastname: req.user.lastname,
    //   age: req.user.age,
    //   email: req.user.email,
    //   cart: hexString,
    //   role: req.user.role,
    // }

    const dtouser = userdto.getUserInputFrom(req.user)

    res.send(dtouser);
  }
);

export default router;