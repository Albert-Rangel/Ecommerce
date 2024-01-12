import express, { Router } from "express"
import userpermissionsRoutes from '../middlewares/userpermissionsRoutes.js';
import privateRoutes from '../middlewares/privateRoutes.js';

const router = express.Router()

router.get("/", privateRoutes, userpermissionsRoutes,  async (req, res) => {
    res.render("chat",{style: "chat.css"})
})

export default router
