
// import { query } from 'express';
// import productsService from '../services/productsService.js';
import productsManager from '../dao/Mongo/ProductManager.js';
import usersService from '../services/usersService.js';

import { logger } from '../utils/logger.js';

const ProductsManager = new productsManager()
const UsersService = new usersService()


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

export const getProducts = async (req, res) => {
  try {
    console.log("entro")
    let limit = 0;
    let page = 0
    let sort_ = null
    let query = null
    let swWeb = false
    if (req.limit != undefined) {

      swWeb = true
      limit = req.limit;
      page = req.page;
      sort_ = req.sort;
      query = req.query;

    } else {
      limit = parseInt(req.query.limit, 10) == 0 || req.query.limit == null ? 50 : parseInt(req.query.limit, 10);
      page = parseInt(req.query.page, 10) == 0 || req.query.page == null ? 1 : parseInt(req.query.page, 10);
      sort_ = req.query.sort;
      query = req.query.query;

    }

    const products = await ProductsManager.getProductWpaginviaService(limit, page, sort_, query)

    const isString = (value) => typeof value === 'string';
    if (isString(products)) {
      console.log("entro en string")
      const arrayAnswer = ManageAnswer(products)
      return res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      })
    }
    // console.log("products")
    // console.log(products)

    console.log(swWeb)
    // swWeb = false
    // console.log(swWeb)

    return swWeb ? products : res.send(products);

  } catch (error) {
    logger.error("Error en ProductManager/getProducts: " + error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const addProduct = async (req, res) => {
  try {

    let swWeb = false
    let newproduct = {}
    if (req.body == undefined) {
      swWeb = true
      newproduct = req
    } else {

      newproduct = req.body
    }

    const answer = await ProductsManager.addProductviaService(newproduct);

    const arrayAnswer = ManageAnswer(answer)
    const anwserObject = {
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    }

    return swWeb ? anwserObject : res.send(anwserObject);

  } catch (error) {
    logger.error("Error en ProductManager/addProduct: " + error)
    return res.send({
      status: "500",
      message: `Se ha arrojado una exepcion: ${error} `
    })
  }
}
export const getProducts_ = async (req, res) => {
  try {

    const products = await ProductsManager.getProductNpaginviaService();

    const isString = (value) => typeof value === 'string';

    if (isString(products)) {
      const arrayAnswer = ManageAnswer(products)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return error

    }

    return res.send(products);

  } catch (error) {
    logger.error("Error en ProductManager/getProducts_: " + error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const getProductById = async (req, res) => {
  try {
    const pid = req.params.pid

    const found = await ProductsManager.getProductbyIDviaService({ _id: pid });

    const isString = (value) => typeof value === 'string';

    if (isString(found)) {
      const arrayAnswer = ManageAnswer(found)
      const error = {
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      }
      return res.send(error);
    }
    return res.send(found);
  } catch (error) {
    logger.error("Error en ProductManager/getProductById: " + error)
    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const updateProduct = async (req, res) => {
  try {

    let pid = 0
    let swINtern = false
    let updatedproduct = {}

    if (req.params == undefined) {
      console.log("entro en el if")
      swINtern = true
      if (req.newProduct != undefined) {
        console.log("entro en el if 1")
        pid = req.pid;
        updatedproduct = req.newProduct; // cuando actualiza el producto por metod de update product
      } else {
        console.log("entro en el if 2")
        pid = req.productToUpdate._id
        updatedproduct = req.productToUpdate // cuando actualiza el stock que envia el correo
      }
    } else {
      console.log("entro en el else")
      pid = req.params.pid
      updatedproduct = req.body
    }



    let answer = await ProductsManager.updateProductviaService(pid, updatedproduct);
    const arrayAnswer = ManageAnswer(answer)
    return swINtern ? answer : res.status(arrayAnswer[0]).send({
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    })
  } catch (error) {
    logger.error("Error en ProductManager/updateProduct: " + error)

    return res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}
export const deleteProduct = async (req, res) => {
  let swWeb = false
  try {
    let pid = 0
    let uid = 0

    if (req.params == undefined) {
      swWeb = true
      pid = req.pid
      uid = req.uid

    } else {
      pid = req.params.pid
      uid = req.query.uid
    }

    var swSuccess = await UsersService.verifyProductPermission(uid, pid)

    if (!swSuccess) {

      return swWeb ? swSuccess : res.status(arrayAnswer[0]).send({
        status: arrayAnswer[0],
        message: arrayAnswer[1]
      })
    }

    let answer = await ProductsManager.deletProductviaService({ _id: pid });
    const arrayAnswer = ManageAnswer(answer)
    return swWeb ? swSuccess : res.status(arrayAnswer[0]).send({
      status: arrayAnswer[0],
      message: arrayAnswer[1]
    })
  }
  catch (error) {
    logger.error("Error en ProductManager/deleteProduct: " + error)
    return swWeb ? `ERR|Error generico. Descripcion :${error}` : res.status(500).send({
      status: "500",
      message: `Se ha arrojado una exepcion: error`
    })
  }
}





