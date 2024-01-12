
import { cartsModel } from '../dao/models/carts.model.js';
import { productsModel } from '../dao/models/products.model.js';
import { userModel } from '../dao/models/user.model.js';

import { logger } from '../utils/logger.js';

class cartsRepositories {

    async addCartviaService() {
        let cart2 = {}
        try {
            cart2 = { products: [] }
            const carnnew = await cartsModel.create(cart2)
            return `SUC|Carrito agregado con el id ${carnnew._id}`

        } catch (error) {
            logger.error("Error en CartService/addCartviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async addCartProductsviaService(ids) {
        try {

            
            console.log("ids")
            console.log(ids)

            let pid = ids.pid
            let cid = ids.cid
            let uid = ids.uid

            console.log("pid")
            console.log(pid)
            console.log("cid")
            console.log(cid)
            console.log("uid")
            console.log(uid)


            const cartObject = await cartsModel.findById({ _id: cid })
            if (cartObject == undefined || Object.keys(cartObject).length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const productObject = await productsModel.find({ _id: pid })

            if (productObject == undefined || Object.keys(productObject).length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

            const user = await userModel.find({ _id: uid });
            const userRole = user[0].role
            const userEmail = user[0].email


            if (userRole === "Premium" || userRole === "premium") {
                let productOwner = productObject[0].owner
                if (productOwner == userEmail) {
                    return `E02|No puede agregar este producto debido a que usted lo creo.`;
                }
            }

            if (cartObject.products.find(prod => prod.id == pid)) {
                let ProductinsideCart = cartObject.products.find(prod => prod.id == pid)

                ProductinsideCart.quantity += 1

                cartObject.save();

                return `SUC|Producto sumado al carrito con el producto ya existente`
            }
            cartObject.products.push({ id: pid, quantity: 1 });

            await cartObject.save();

            return `SUC|Producto agregado al carrito ${cid}`

        } catch (error) {
            logger.error("Error en CartService/addCartProductsviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getcartsviaService() {
        try {
            const allCarts = await cartsModel.find();
            return allCarts

        } catch (error) {
            logger.error("Error en CartService/getcartsviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getCartbyIDviaService(cid) {
        try {
            const CartById = await cartsModel.find({ _id: cid }).lean()

            if (CartById == undefined || Object.keys(CartById).length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            return CartById

        } catch (error) {
            logger.error("Error en CartService/getCartbyIDviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getProductsinCartbyIDviaService(cid) {
        try {

            const cartObject = await cartsModel.find({ _id: cid }).lean()
            if (cartObject == undefined || Object.keys(cartObject).length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const products = cartObject[0].products;

            return products

        } catch (error) {
            logger.error("Error en CartService/getProductsinCartbyIDviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getProductsinCartbyIDviaServicePagination(cid) {
        try {
            const cartObject = await cartsModel.paginate(
                { _id: cid }
                ,
                {
                    page: 1,
                    limit: 100,
                    sort: undefined,
                    lean: true
                });

            return cartObject

        } catch (error) {
            logger.error("Error en CartService/getProductsinCartbyIDviaServicePagination: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async deleteCartviaService(cid) {
        try {
            const cartObject = await cartsModel.find({ _id: cid }).lean()

            if (cartObject == undefined || Object.keys(cartObject).length === 0) return `E02|El carro con el id ${cid._id} no se encuentra agregado.`;

            await cartsModel.deleteOne({ _id: cid })

            return `SUC|El carrito con el id ${cid._id} fue eliminado.`
        }
        catch (error) {
            logger.error("Error en CartService/deleteCartviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }

    }

    async deleteCartProductviaService(pid, cid) {
        try {

            const CartById = await cartsModel.findById({ _id: cid })

            //valido si existe el carro
            if (CartById == undefined || Object.keys(CartById).length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            let quantityofobjects = CartById.products.length
            //valido si existe el producto dentro del carro
            let ProductinsideCart = CartById.products.find(prod => prod.id == pid)

            if (ProductinsideCart == undefined || Object.keys(ProductinsideCart).length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado al carrito con el id ${cid}.`;

            let productidinsideCart = CartById.products.find(prod => prod.id == pid)
            let quantity = ProductinsideCart.quantity

            if (quantity == 1 && quantityofobjects == 1) {

                await cartsModel.updateOne(
                    { "_id": cid },
                    { $set: { products: [] } }
                )
                return `SUC|Producto eliminado del carrito`
            }

            if (quantity > 1) {

                await cartsModel.updateOne({
                    "_id": cid,
                    "products.id": pid
                }, {
                    $set: {
                        "products.$.quantity": quantity - 1
                    }
                })
                return `SUC|Producto restado del stock del carrito`
            }

            if (quantity = 1 && quantityofobjects >= 1) {

                await CartById.products.pull(productidinsideCart);
                await CartById.save();
                return `SUC|Producto eliminado del carrito`

            }

            return `SUC|Producto eliminado del carritoo`

        }
        catch (error) {
            logger.error("Error en CartService/deleteCartProductviaService: " + error)
            return `ERR|Error generico. Descripcion :${error}`
        }

    }

    async deleteAllCartProductsviaService(cid) {

        try {
            const CartById = await cartsModel.findById({ _id: cid })
            if (CartById == undefined || CartById.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const response = await cartsModel.updateOne(
                { "_id": cid },
                { $set: { products: [] } }
            )
            return `SUC|Productos eliminados del carrito ${cid}`
        } catch (error) {
            logger.error("Error en CartService/deleteAllCartProductsviaService: " + error)
            return `ERR|Error generico. Descripcion :${error}`

        }
    }

    async updateProductQuantityviaService(pid, cid, quantity_) {
        try {

            let { quantity } = quantity_;

            const cartObject = await cartsModel.findById({ _id: cid })
            if (cartObject == undefined || Object.keys(cartObject).length === 0 || cartObject.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;


            const productObject = await productsModel.find({ _id: pid })
            if (productObject == undefined || Object.keys(productObject).length === 0 || productObject.length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

            //valido si existe el producto dentro del carro
            let ProductinsideCart = cartObject.products.find(prod => prod.id == pid)

            if (ProductinsideCart == undefined || Object.keys(ProductinsideCart).length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado al carrito con el id ${cid}.`;

            let updateObject = await cartsModel.updateOne({
                "_id": cid,
                "products.id": pid
            }, {
                $set: {
                    "products.$.quantity": quantity_
                }
            })
            if (updateObject.modifiedCount > 0) {
                return `SUC|Producto actualizado del carrito`
            } else {
                return `E02|No se pudo actualizar el productocon el id ${cid}`;
            }

        } catch (error) {
            logger.error("Error en CartService/updateProductQuantityviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }

    }

    async updateCartProducstviaService(cid, productsnew) {
        try {
            const CartById = await cartsModel.findById(cid)

            if (CartById == undefined || Object.keys(CartById).length === 0 || CartById.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const response = await cartsModel.updateOne(
                { "_id": cid },
                { $set: { products: [] } }
            )
            CartById.products.push(productsnew)
            await CartById.save()

            return `SUC|Carrito ${cid} actualizado.`
        }
        catch (error) {
            logger.error("Error en CartService/updateCartProducstviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }

    }

    async purchaseCart(cid) {
        try {
            const CartById = await cartsModel.findById(cid)

            if (CartById == undefined || Object.keys(CartById).length === 0 || CartById.length === 0) return `E02|El carro con el id ${cid} no se encuentra agregado.`;

            const response = await cartsModel.updateOne(
                { "_id": cid },
                { $set: { products: [] } }
            )
            CartById.products.push(productsnew)
            await CartById.save()

            return `SUC|Carrito ${cid} actualizado.`
        }
        catch (error) {
            logger.error("Error en CartService/purchaseCart: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }

    }

}

export default cartsRepositories