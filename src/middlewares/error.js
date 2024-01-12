
import {logger} from "../utils/logger.js"

const now = new Date();
export const errors = async (req, res, next) => {
    try {
        logger.info(`${req.method} en ${req.url}`)
        await next()
    } catch (error) {
        logger.info("hubo un error:" + error)
     }
}