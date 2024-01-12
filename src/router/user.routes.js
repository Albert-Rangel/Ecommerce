import Router from "express"
import {
  changeRol,
  uploadFile,
} from "../controller/userController.js";
import { uploader } from "../middlewares/multer.js";

const UserRouter = Router();


// const midd = (req, res, next) => {
//   console.log("req.session en userroutes")
//   console.log(req.session)
//   console.log("req.session.user en userroutes")
//   console.log(req.session.user)
//   next()
// }

// UserRouter.use((req, res, next) => {
//   console.log("req.session en userroutes")
//   console.log(req.session)
//   console.log("req.session.user en userroutes")
//   console.log(req.session.user)
//   next()
// })

// const myMiddleware = (req, res, next) => {
//   // Perform middleware logic here
//   console.log("using middleware")
//   // If successful, call next() to pass control to the next middleware/route handler
//   next();
// };
// UserRouter.use(myMiddleware)

UserRouter.get('/premium/:uid', changeRol)
UserRouter.post('/:uid/profileFile/documents', uploader.single('profileFile'), uploadFile)
UserRouter.post('/:uid/IDFile/documents', uploader.single('IDFile'), uploadFile)
UserRouter.post('/:uid/BankFile/documents', uploader.single('BankFile'), uploadFile)
UserRouter.post('/:uid/addressFile/documents', uploader.single('addressFile'), uploadFile)
UserRouter.post('/:uid/productsFile/documents', uploader.single('productsFile'), uploadFile)

export default UserRouter;