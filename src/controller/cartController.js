
import { ticketsModel } from '../dao/models/tickets.model.js';
import {
  updateProduct,
} from './productController.js'
import cartsManager from '../dao/Mongo/CartManager.js';
import emailsService from '../services/emailService.js';
import { logger } from '../utils/logger.js';

const emailService = new emailsService()
const CartsManager = new cartsManager()

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

export const addCart = async (req, res) => {

  try {

    let carnew = await CartsManager.addCartviaService()
    const arrayAnswer = ManageAnswer(carnew)

    return res.status(arrayAnswer[0]).send({
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    })

  } catch (error) {
    logger.error("Error en CartManager/addCart: " + error)
    return res.status(500).send({
      status: "500",
      message: `Error occured in CartManager in AddProduct`
    })
  }
}
export const addCartProducts = async (req, res) => {
  let swWeb = false
  try {
    let pid = 0
    let cid = 0
    let uid = 0

    if (req.params != undefined) {
      console.log("entro en diferente de web")

      pid = req.params.pid
      cid = req.params.cid
      uid = req.query.uid
    } else {
      swWeb = true
      console.log("entro en web")
      cid = req.cid
      pid = req.pid
      uid = req.uid
    }

    console.log("CART CONTROLLER ")
    //console.log(req)//SI FUNCIONA ES MUY LARGO
    console.log(cid)
    console.log(pid)
    console.log(uid)

    const answer = await CartsManager.addCartProductsviaService(pid, cid, uid)
    const arrayAnswer = ManageAnswer(answer)
    return swWeb ? answer : res.status(arrayAnswer[0]).send({
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    });

  } catch (error) {
    logger.error("Error en CartManager/addCartProducts: " + error)
    return swWeb ? error : res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getCarts = async (req, res) => {
  try {
    const limit = req.query.limit;

    const allCarts = await CartsManager.getcartsviaService();

    if (allCarts == undefined) return res.status().send({
      status: "404",
      message: `E02|No existen carros actualmente.`
    })

    const isString = (value) => typeof value === 'string';

    if (isString(allCarts)) {
      const arrayAnswer = ManageAnswer(allCarts)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return res.status(404).send(error)
    }

    if (limit) return res.status().send(allCarts.slice(0, limit));

    return res.send(allCarts.sort((a, b) => a.id - b.id))

  } catch (error) {
    logger.error("Error en CartManager/getCarts: " + error)

    return res.status().send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid

    const CartById = await CartsManager.getCartbyIDviaService(cid)

    if (CartById == undefined) return res.status().send({
      status: "404",
      message: `E02|El carro con el id ${cid} no se encuentra agregado.`
    })

    const isString = (value) => typeof value === 'string';
    if (isString(CartById)) {
      const arrayAnswer = ManageAnswer(CartById)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return res.status(404).send(error)
    }
    return res.send(CartById);

  } catch (error) {
    logger.error("Error en CartManager/getCartById: " + error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getProductsinCartById = async (req, res) => {
  try {
    let cid = 0
    let swWeb = false
    if (req.params != undefined) {
      cid = req.params.cid
    } else {
      swWeb = true
      if (req.cid == undefined) {
        cid = req
      } else {
        cid = req.cid
      }
    }

    const answer = await CartsManager.getProductsinCartbyIDviaService(cid)
    const isString = (value) => typeof value === 'string';
    if (isString(answer)) {
      const arrayAnswer = ManageAnswer(answer)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return swWeb ? answer : res.send(error)
    }
    return swWeb ? answer : res.send(answer);
  } catch (error) {
    logger.error("Error en CartManager/getProductsinCartById: " + error)

    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getProductsinCartByIdPagination = async (req, res) => {
  try {
    const cid = req.params.cid
    const answer = await CartsManager.getProductsinCartbyIDviaServicePagination(cid)
    const isString = (value) => typeof value === 'string';
    if (isString(answer)) {
      const arrayAnswer = ManageAnswer(answer)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }

      return res.send(answer);
    }
  } catch (error) {
    logger.error("Error en CartManager/getProductsinCartByIdPagination: " + error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const deleteCart = async (req, res) => {
  try {
    const cid = req.params.cid
    const answer = await CartsManager.deleteCartviaService({ _id: cid })
    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }
    return res.send(anwserObject);
  }
  catch (error) {
    logger.error("Error en CartManager/deleteCart: " + error)

    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const deleteCartProduct = async (req, res) => {
  try {
    let cid = 0
    let pid = 0
    let swWeb = false

    if (req.params != undefined) {
      cid = req.params.cid
      pid = req.params.pid
    } else {
      swWeb = true
      cid = req.cid
      pid = req.pid
    }

    const answer = await CartsManager.deleteCartProductviaService(pid, cid)
    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }
    return swWeb ? anwserObject : res.send(anwserObject);
  }
  catch (error) {
    logger.error("Error en CartManager/deleteCartProduct: " + error)

    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const deleteAllCartProducts = async (req, res) => {
  try {
    const cid = req.params.cid
    const answer = await CartsManager.deleteAllCartProductsviaService(cid)
    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }
    return res.send(anwserObject);
  }
  catch (error) {
    logger.error("Error en CartManager/deleteAllCartProducts: " + error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const updateCartProductQuantity = async (req, res) => {
  try {
    let cid = 0
    let pid = 0
    let quantity_ = 0
    let swWeb = false

    if (req.params != undefined) {


      cid = req.params.cid
      pid = req.params.pid
      quantity_ = req.body.quantity

    } else {

      swWeb = true
      cid = req.cid
      pid = req.pid
      quantity_ = req.finalqtt
    }
    const answer = await CartsManager.updateProductQuantityviaService(pid, cid, quantity_)

    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }

    return swWeb ? anwserObject : res.send(anwserObject);
  }
  catch (error) {
    logger.error("Error en CartManager/updateCartProductQuantity: " + error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const updateCartProducts = async (req, res) => {
  try {

    let cid = 0
    let products = {}
    let swWeb = false
    if (req.params != undefined) {
      cid = req.params.cid
      products = req.body

    } else {
      swWeb = true
      cid = req.cid
      products = req.body
    }
    const answer = await CartsManager.updateCartProducstviaService(cid, products)
    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }
    return swWeb ? arrayAnswer : res.send(anwserObject);
  }
  catch (error) {
    logger.error("Error en CartManager/updateCartProducts: " + error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const purchaseCart = async (req, res) => {
  try {
    let cid = 0
    let email = ""
    let swWeb = false
    if (req.params != undefined && req.session.user == undefined) {
      console.log("entro en thunderclient")
      cid = req.params.cid
      email = "claudie.funk69@ethereal.email"
    } else {
      console.log("entro en web")
      if (req.params.cid != undefined) { swWeb = false } else { swWeb = true }//esto es en caso que sea swagger es false si es la web es true

      cid = req.session.user.cart
      email = req.session.user.email
    }

    let totalsum = 0
    //obtener los productos dentro del carrito
    const answer = await getProductsinCartById(cid)

    //valido si es un string es caso fallido y retorno
    const isString = (value) => typeof value === 'string';

    if (isString(answer)) {
      const arrayAnswer = ManageAnswer(answer)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return swWeb ? error : res.send(error);
    }

    //itero por cada objeto dentro del array de productos
    for (let i = 0; i < answer.length; i++) {
      let resultQtt = 0
      let swResult = false
      let stock = parseInt(answer[i].id.stock, 10); // Access the stock property within the nested object
      let initialstock = stock
      let endstock = 0
      let pidobject = answer[i].id._id; // Access the stock property within the nested object

      // Extract the hexadecimal representation
      let pid = pidobject.toHexString();

      let quantity = parseInt(answer[i].quantity, 10); // Access the quantity property directly
      let price = answer[i].id.price;
      let sumtotalprice = 0

      let finalqtt = quantity
      console.log("pid:", pid);
      console.log("Stock:", stock);
      console.log("Quantity:", quantity);
      console.log("Price:", price);
      while (!swResult) {
        let resultQtt = stock - quantity
        if (resultQtt >= 0) {
          stock = resultQtt
          swResult = true
          finalqtt = finalqtt - quantity
          break
        } else {

          quantity = quantity - 1
        }
      }
      let amounttisubstract = initialstock - stock
      sumtotalprice = price * amounttisubstract
      totalsum = totalsum + sumtotalprice
      //ya tengo la cantidad de productos que quedan de un producto en especifico en stock
      console.log("FINAL Stock:", stock);
      console.log("FINAL Quantity:", finalqtt);
      console.log("sumatoria de precio", sumtotalprice)
      console.log("suma total", totalsum)

      let productToUpdate = answer[i].id
      productToUpdate.stock = stock

      // //Actualizar el Quantity de ese producto
      // const updateProductQTT = await updateProduct({ pid, stock })
      const updateProductQTT = await updateProduct({ productToUpdate })

      if (isString(updateProductQTT) && updateProductQTT.substring(0, 3) != "SUC") {
        const arrayAnswer = ManageAnswer(updateProductQTT)
        const error = {
          status: arrayAnswer[0],
          message: arrayAnswer[1]
        }
       
        return swWeb ? error : res.send(error);

      }

      //ELIMINAR EL PRODUCTO DEL CARRITO EN CANSO DE QTT = 0 O ACTUAKLIZAR LA CANTIDAD EN CARRITO
      if (finalqtt == 0) {
        //eliminar producto de carrito
        let deletebject = {
          pid,
          cid,
        }
        let eliminateProdinCart = await deleteCartProduct(deletebject)

        
        if (isString(eliminateProdinCart) && eliminateProdinCart.substring(0, 3) != "SUC") {
          const arrayAnswer = ManageAnswer(eliminateProdinCart)
          const error = {
            status: arrayAnswer[0],
            message: arrayAnswer[1]
          }
        
          return swWeb ? error : res.send(error);

        }

      } else {
        let upqttobject = {
          pid,
          cid,
          finalqtt
        }
       
        //Actualizamos la quantity del producto en el carrito
        let updateProdInCart = await updateCartProductQuantity(upqttobject)
        

        if (isString(updateProdInCart) && updateProdInCart.substring(0, 3) != "SUC") {
          const arrayAnswer = ManageAnswer(updateProdInCart)
          const error = {
            status: arrayAnswer[0],
            message: arrayAnswer[1]
          }
          
          return swWeb ? error : res.send(error);

        }
      }
    }

    //Despues de que se actualizaran los productos y se actualizara el carrito correspondiente hay que generar un ticket y despues enviar correo
    const ticket = await ticketsModel.create({
      amount: totalsum,
      purchaser: email
    })

    const emailSend = await emailService.sendEmail(ticket)
    console.log("YA MANDO EL CORREO CON EL TICKETC")
    if (isString(emailSend) && emailSend.substring(0, 3) != "SUC") {
      const arrayAnswer = ManageAnswer(emailSend)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
     

      return swWeb ? error : res.send(error);
    }
    

    return swWeb ? res.redirect('/products') : res.send({ status: 200, message: "ha sido enviado el correo" });

  }
  catch (error) {
    logger.error("Error en CartManager/purchaseCart: " + error)

    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}




