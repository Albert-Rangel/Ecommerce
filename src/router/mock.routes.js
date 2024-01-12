import { Router } from 'express'
import  {generateProduct}  from "../services/mock.Service.js"

const mockRouter = new Router()

mockRouter.get("/mockingproducts", async (req, res) => {
    let mockProducts = []
    for (let i = 0; i < 100; i++) {
        mockProducts.push(generateProduct())
    }
    res.send(
        {status:"success",
        message: "Products",
        payload: mockProducts}
    )

})

export default mockRouter