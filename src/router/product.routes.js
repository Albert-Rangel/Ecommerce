import Router from "express"
import ProductManager from '../dao/fs/ProductManager.js'
const productManager = new ProductManager('./src/dao/models/productos.json');
const ProductRoute = Router();



ProductRoute.get('/', async function (req, res) {
    const limit = parseInt(req.query.limit, 10) == 0 || req.query.limit == null ? 10 : parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10) == 0 || req.query.page == null ? 1 : parseInt(req.query.page, 10);
    const sort = req.query.sort;
    const query = req.query.query;

    const productObject = await productManager.getProducts(limit, page, sort, query);


    const isString = (value) => typeof value === 'string';

    if (isString(productObject)) {
        const arrayAnswer = ManageAnswer(productObject)
        return res.status(arrayAnswer[0]).send({
            status: arrayAnswer[0],
            message: arrayAnswer[1]
        })
    }
    return res.send(productObject.sort((a, b) => a.id - b.id).slice(0, limit));
});

ProductRoute.get('/:pid', async function (req, res) {
    const pid = parseInt(req.params.pid, 10)
    const productObject = await productManager.getProductById(pid);
    const isString = (value) => typeof value === 'string';
    if (isString(productObject)) {
        const arrayAnswer = ManageAnswer(productObject)
        return res.status(arrayAnswer[0]).send({
            status: arrayAnswer[0],
            message: arrayAnswer[1]
        })
    }
    return res.send(productObject);
});

ProductRoute.post('/', async function (req, res) {
    let newproduct = req.body
    const answer = await productManager.addProduct(newproduct)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})

ProductRoute.put('/:pid', async function (req, res) {
    const pid = parseInt(req.params.pid, 10)
    let updatedproduct = req.body;
    const answer = await productManager.updateProduct(pid, updatedproduct)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})

ProductRoute.delete('/:pid', async function (req, res) {
    const pid = parseInt(req.params.pid, 10)
    const answer = await productManager.deleteProduct(pid)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})


function ManageAnswer(answer) {
    const arrayAnswer = []
    if (answer) {
        const splitString = answer.split("|");
        switch (splitString[0]) {
            case "E01":
                arrayAnswer.push(400)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "E02":
                arrayAnswer.push(404)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "SUC":
                arrayAnswer.push(200)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
            case "ERR":
            default:
                arrayAnswer.push(500)
                arrayAnswer.push(splitString[1])
                return arrayAnswer
                break;
        }
    }
}
export default ProductRoute;