import cartsRepositories from '../../repositories/cartRepositories.js'
const CartsRepositories = new cartsRepositories()

class CartManager {
    async addCartviaService(){
        return await CartsRepositories.addCartviaService()
    }

    async addCartProductsviaService(pid, cid, uid){
        return await CartsRepositories.addCartProductsviaService({pid, cid, uid})
    }

    async getcartsviaService(){
        return await CartsRepositories.getcartsviaService()
    }

    async getCartbyIDviaService(cid){
        return await CartsRepositories.getCartbyIDviaService(cid)
    }

    async getProductsinCartbyIDviaService(cid){
        return await CartsRepositories.getProductsinCartbyIDviaService(cid)
    }

    async getProductsinCartByIdPagination(cid){
        return await CartsRepositories.getProductsinCartbyIDviaServicePagination(cid)
    }

    async deleteCartviaService(cid ){
        return await CartsRepositories.deleteCartviaService(cid)
    }

    async deleteCartProductviaService(pid, cid){
        return await CartsRepositories.deleteCartProductviaService(pid, cid)
    }

    async deleteAllCartProducts(cid){
        return await CartsRepositories.deleteAllCartProductsviaService(cid)
    }

    async updateProductQuantityviaService(pid, cid, quantity_){
        return await CartsRepositories.updateProductQuantityviaService(pid, cid, quantity_)
    }

    async updateCartProducstviaService(cid, products){
        return await CartsRepositories.updateCartProducstviaService(cid, products)
    }

}

export default CartManager

