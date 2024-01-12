import Router from "express"
import CartManager from '../dao/fs/CartManager.js'
const cartManager = new CartManager('./src/dao/models/carts.json');
const CartRoute = Router();

CartRoute.get('/', async function (req, res) {
    const limit = req.query.limit;
    const cartObject = await cartManager.getCarts();
    const isString = (value) => typeof value === 'string';
    if (isString(cartObject)) {
        const arrayAnswer = ManageAnswer(cartObject)
        return res.status(arrayAnswer[0]).send({
            status: arrayAnswer[0],
            message: arrayAnswer[1]
        })
    }
    if (limit) {

        return res.send(cartObject.slice(0, limit));
    }
    return res.send(cartObject.sort((a, b) => a.id - b.id));
});

CartRoute.get('/:cid', async function (req, res) {
    const cid = req.params.cid
    const allProducts = await cartManager.getProductsinCartById(cid)

    const isString = (value) => typeof value === 'string';
    if (isString(cartObject)) {
        const arrayAnswer = ManageAnswer(cartObject)
        return res.status(arrayAnswer[0]).send({
            status: arrayAnswer[0],
            message: arrayAnswer[1]
        })
    }

    return res.send(cartObject);
});

CartRoute.post('/', async function (req, res) {
    const answer = await cartManager.addCart()
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })
})

CartRoute.post('/:cid/product/:pid', async function (req, res) {
  
    const cid = parseInt(req.params.cid, 10)
    const pid = parseInt(req.params.pid, 10)
    
    const answer = await cartManager.addCartProducts(pid, cid)
    const arrayAnswer = ManageAnswer(answer)
    return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
    })

})

CartRoute.delete('/:cid', async function (req, res) {
    const cid = parseInt(req.params.cid, 10)
    const answer = await cartManager.deleteProduct(cid)
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

export default CartRoute;