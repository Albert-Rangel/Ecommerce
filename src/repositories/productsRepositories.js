
import { productsModel } from '../dao/models/products.model.js';
import { logger } from '../utils/logger.js';

class productRepositories {

    async addProductviaService(ObjectProduct) {
        try {

            const { description, title, price, thumbnail, code, stock, status, category, owner } = ObjectProduct;

            const product = await productsModel.create({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status,
                category,
                owner
            });
            return `SUC|Producto agregado con el id ${product._id}`
        } catch (error) {
            logger.error("Error en ProductsService/addProductviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getProductNpaginviaService() {
        try {
            const products = await productsModel.find().lean();
            return products;

        } catch (error) {
            logger.error("Error en ProductsService/getProductNpaginviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getProductWpaginviaService(limit, page, sort_, query) {
        try {
            let key = "";
            let value = "";
            let products;

            if (query != undefined) {
                const queryObject = query.split(":")
                key = queryObject[0];
                value = queryObject[1];
            }

            products = await productsModel.paginate(
                query == undefined ? undefined : generateKeyValue(key, value)
                ,
                {
                    page: page,
                    limit: limit,
                    sort: sort_ == undefined ? undefined : { price: sort_ },
                    lean: true
                });

            function generateKeyValue(key, value) {
                return {
                    [key]: value
                };
            }

            const keyValue = generateKeyValue(key, value);

            return products

        } catch (error) {
            logger.error("Error en ProductsService/getProductWpaginviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async getProductbyIDviaService(pid) {
        try {
            const found = await productsModel.find({ _id: pid });
            if (found === undefined || found == [] || found == null || Object.keys(found).length === 0) {
                return `E02|El producto con el id ${pid._id} no se encuentra agregado.`;
            }
            return found;

        } catch (error) {
            logger.error("Error en ProductsService/getProductbyIDviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }
    }

    async updateProductviaService(pid, product) {
        try {

            const { title, description, price, thumbnail, code, stock, status, category, owner } = product;

            const found = await productsModel.find({ _id: pid });
            
            if (found == undefined || Object.keys(found).length === 0) return `E02|El producto con el id ${pid} no se encuentra agregado.`;

            for (const [key, value] of Object.entries(product)) {
                found[key] = value;
            }

            await productsModel.updateOne(
                { _id: pid },
                {
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    status,
                    category,
                    owner
                });

            return `SUC|El producto con el id : ${pid} fue actualizado.`;

        } catch (error) {
            logger.error("Error en ProductsService/updateProductviaService: " + error)

            return `ERR|Error generico. Descripcion :${error}`
        }

    }

    async deletProductviaService(pid) {
        try {
            const found = await productsModel.find({ _id: pid });
            if (found == undefined || Object.keys(found).length === 0) return `E02|El producto con el id ${pid._id} no se encuentra agregado.`;
            await productsModel.deleteOne({ _id: pid });

            return `SUC|El producto con el id ${pid._id} fue eliminado.`
        }
        catch (error) {
            logger.error("Error en ProductsService/deletProductviaService: " + error)
            return `ERR|Error generico. Descripcion :${error}`
        }

    }

}

export default productRepositories