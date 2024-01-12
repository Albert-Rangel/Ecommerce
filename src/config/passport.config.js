import passport from "passport";
import local from "passport-local";
import githubStrategy from "passport-github2"
import { userModel } from '../dao/models/user.model.js';
import { cartsModel } from '../dao/models/carts.model.js';
import bcrypt from 'bcrypt';

const localStrategy = local.Strategy;

const initiaizePassport = () => {
    passport.use(
        'register',
        new localStrategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {

                const { firstname, lastname, email, age } = req.body;

                const userExists = await userModel.findOne({ email })

                if (userExists) {
                    return done(null, false)
                }

                //Creo un carrito 
                let cart1 = {}
                cart1 = { products: [] }
                const cart = await cartsModel.create(cart1)

                //creo el usuario
                const user = await userModel.create({
                    firstname,
                    lastname,
                    email,
                    age,
                    cart,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                    role: email == "adminCoder@coder.com" ? "Admin" : "User",
                });


                return done(null, user)
            }));

    passport.use(
        'login',
        new localStrategy(
            { usernameField: 'email' },
            async (username, password, done) => {
                try {
                    
                    const user = await userModel.findOne({ email: username }).lean();

                    if (!user) {
                        return done(null, false);
                    }

                    if (!bcrypt.compareSync(password, user.password)) {

                        return done(null, false);
                    }

                    return done(null, user);

                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use("github", new githubStrategy(
        {
            clientID: 'Iv1.abfb4e2fbb512adf',
            clientSecret: '5cebb1e4cedf69bf9dfbab76082420b4d62d0b17',
            callbackURL: 'http://localhost:8080/api/githubcallback',
            scope: ['user:email'],
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const fullname = profile._json.name;
                const words = fullname.split(' ');
                const email = profile.emails[0].value;
                const user = await userModel.findOne({ email });
                if (!user) {
                    //Creo un carrito 
                    let cart1 = {}
                    cart1 = { products: [] }
                    const cart = await cartsModel.create(cart1)

                    const newUser = await userModel.create({
                        firstname: words[0],
                        lastname: words[1],
                        age: 18,
                        cart,
                        password: '',
                        email,
                        role: email == "adminCoder@coder.com" ? "Admin" : "User",
                    });

                    done(null, newUser);
                } else {
                    done(null, user);
                }
            } catch (error) {
                done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);

        done(null, user);
    });
}

export default initiaizePassport