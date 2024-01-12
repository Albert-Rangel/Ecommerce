import fs from 'fs';
import ProductManager from './ProductManager.js';
const product = new ProductManager('./src/dao/models/productos.json');

class CartManager {

  static id = 1;
  path;
  carts;

  constructor(path) {
    this.path = path,
      this.carts = []
  }

  async readCarts() {
    const answer = await fs.promises.readFile(this.path, "utf-8");
    const ObjectAnswer = answer == '' ? [] : JSON.parse(answer);
    return ObjectAnswer;
  }

  async writeFile(allCarts) {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(allCarts, null, '\t'))

  }

  async validateParameters(product) {

    if (!Array.isArray(product.products) || product.products === null) {

      return false;
    }
    return true;
  };

  async addCart() {
    let cart2 = {}
    try {

      if (!fs.existsSync(this.path)) {

        cart2 = { 'id': CartManager.id, products: [] }
        CartManager.id++
        this.carts.push(cart2);
        await this.writeFile(this.carts);
        return `SUC|Carrito agregado con el id ${cart2.id}`

      } else {
        const allCarts = await this.readCarts();

        if (allCarts.length === 0) {

          cart2 = { 'id': CartManager.id, products: [] }

          CartManager.id++

          allCarts.push(cart2);

        } else {

          let lastObjetid = allCarts[allCarts.length - 1].id === undefined ? 0 : allCarts[allCarts.length - 1].id;

          lastObjetid++

          cart2 = { 'id': parseInt(lastObjetid, 10), products: [] }

          allCarts.push(cart2);
        }
        await this.writeFile(allCarts)
        return `SUC|Carrito agregado con el id ${cart2.id}`
      }
    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }

  }

  async addCartProducts(pid, cid) {
    try {
      let cart2 = {}

      if (!fs.existsSync(this.path)) {

        return `E02|No se encuentra el archivo indicado.`

      } else {

        const cartObject = await this.getCartById(cid)

        if (typeof (cartObject) === "string") {
          return cartObject
        }

        const productObject = await product.getProductById(pid)

        if (typeof (productObject) === "string") {
          return productObject
        }

        const allCarts = await this.readCarts();
        const objectCarts = allCarts.filter(obj => obj.id != cid);


        if (objectCarts === undefined) return `E02|No encontramos carritos con el id ${parseInt(cid, 10)}.`;


        if (allCarts.length === 0) {

          return "E02|No se encontro el pid debido a que El JSON se encuentra vacio."

        } else {

          if (cartObject.products.some(prod => prod.id === pid)) {
              
             let ProductinsideCart = cartObject.products.find(prod => prod.id === pid)

              ProductinsideCart.quantity++

              let productsInsideCart= [cartObject, ...objectCarts]

              await this.writeFile(productsInsideCart)

              return `SUC|Producto sumado al carrito con el producto ya existente`
          }

          cartObject.products.push({ id: pid, quantity: 1 })
          let productsInsideCart= [cartObject, ...objectCarts]
          await this.writeFile(productsInsideCart)
          return `SUC|Producto agregado al carrito ${cid}`
        }
      }
    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }

  }

  /*Debe tener un metodo getProducts que lee el archivo de productos y devuelve los mismos en formato de arreglo*/
  async getCarts() {
    try {
      if (!fs.existsSync(this.path)) await this.writeFile(this.carts);
      const arrayCarts = await this.readCarts();
      return arrayCarts

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  /*Debe tener un metodo getProductById que recibira un id */
  async getCartById(cid) {
    try {
      if (!Number.isInteger(cid)) return "E01|Solo numeros son aceptados como id, ingrese porfavor el id en el formato adecuado.";

      if (!fs.existsSync(this.path)) await this.writeFile(this.products);

      const arrayCarts = await this.readCarts();

      if (arrayCarts.length == 0) return "E02|El JSON se encuentra vacio."

      const objectCarts = arrayCarts.find(obj => obj.id === cid);

      if (objectCarts === undefined) return `E02|No encontramos carritos con el id ${parseInt(cid, 10)}.`;

      return objectCarts

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  /*Debe tener un metodo deleteProduct que recibira un id del producto a eliminar*/
  async deleteProduct(id) {
    try {

      if (!Number.isInteger(id)) return "E01|Solo numeros son aceptados como id, ingrese porfavor el id en el formato adecuado.";

      if (!fs.existsSync(this.path)) await this.writeFile(this.carts);

      const arrayCarts = await this.readCarts();

      if (arrayCarts.length == 0) return "E02|El JSON se encuentra vacio."

      const cartbyid = arrayCarts.find(obj => obj.id === id);

      if (cartbyid == undefined) return `E02|El id ${id} no existe en nuestros registros.`

      const objectCart = arrayCarts.filter(obj => obj.id != id);

      await this.writeFile(objectCart)

      return `SUC|El carrito con el id ${id} fue eliminado.`
    }
    catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }
}

export default CartManager;



