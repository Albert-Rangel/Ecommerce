import productRepositories from '../../repositories/productsRepositories.js'
const ProductsRepositories = new productRepositories()

class ProductManager {

    async getProductWpaginviaService(limit, page, sort_, query){
        return await ProductsRepositories.getProductWpaginviaService(limit, page, sort_, query)
    }

    async addProductviaService(newproduct){
        return await ProductsRepositories.addProductviaService(newproduct)
    }

    async getProductNpaginviaService(){
        return await ProductsRepositories.getProductNpaginviaService()
    }

    async getProductbyIDviaService(pid){
        return await ProductsRepositories.getProductbyIDviaService(pid)
    }

    async updateProductviaService(pid, updatedproduct){
        return await ProductsRepositories.updateProductviaService(pid, updatedproduct)
    }

    async deletProductviaService(pid){
        return await ProductsRepositories.deletProductviaService(pid)
    }
}

export default ProductManager

