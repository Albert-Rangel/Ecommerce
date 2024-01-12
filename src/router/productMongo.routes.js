import Router from "express"
import {
    getProducts,
    addProduct,
    getProducts_,
    getProductById,
    updateProduct,
    deleteProduct,

}from '../controller/productController.js'
const ProductRoute = Router();

ProductRoute.get('/', getProducts);
ProductRoute.get('/Npagin/', getProducts_)
ProductRoute.get('/:pid',  getProductById);
ProductRoute.post('/', addProduct)
ProductRoute.put('/:pid', updateProduct)
ProductRoute.delete('/:pid', deleteProduct)

export default ProductRoute;