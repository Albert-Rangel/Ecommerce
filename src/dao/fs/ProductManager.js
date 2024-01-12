/*Implementar programa que contenga una clase llamada ProductManager que reciba el nombre del archivo con el que va a trabajar  */
import { error } from 'console';
import fs from 'fs';

class ProductManager {

  //La clase debe contar con una variable this.path.
  static id = 1;
  path;

  // La variable path se inicializara desde el constructor.
  constructor(path) {
    this.path = path,
      this.products = []
  }

  async readProducts() {
    const answer = await fs.promises.readFile(this.path, "utf-8");
    const ObjectAnswer = answer == '' ? [] : JSON.parse(answer);
    return ObjectAnswer;
  }

  async writeFile(allProducts) {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(allProducts, null, '\t'))

  }
  async validateParameters(product) {

    if (typeof (product.price) !== "number" || product.price === null || typeof (product.stock) !== "number" || product.stock === null) {
      return false;
    }

    if (typeof (product.title) !== "string" || !product.title || typeof (product.description) !== "string" || !product.description || typeof (product.code) !== "string" || !product.code || typeof (product.category) !== "string" || !product.category) {
      return false
    }

    if (typeof (product.status) !== "boolean" || product.status === null) {
      return false;
    }

    return true;
  };
  /*Debe tener un metodo addProduct que recibe un OBJETO*/
  async addProduct(ObjectProduct) {

    try {
      let object2 = {}
      const validatedParams = await this.validateParameters(ObjectProduct);

      if (!validatedParams) return 'E01|Todos los valores del producto tienen que ser enviados a execpcion del Thumbnail y todos tienes que seguir su tipo indicado en la consignia.';

      if (!fs.existsSync(this.path)) {

        object2 = Object.assign({ 'id': ProductManager.id }, ObjectProduct)
        ProductManager.id++
        this.products.push(object2);
        await this.writeFile(this.products);
        return `SUC|Producto agregado con el id ${object2.id}`

      } else {

        const allProducts = await this.readProducts();

        if (allProducts.length == 0) {

          object2 = Object.assign({ 'id': ProductManager.id }, ObjectProduct)
          ProductManager.id++
          allProducts.push(object2);
        } else {
          const found = allProducts.find((element) => element.code === ObjectProduct.code);

          if (found != undefined) return `E01|El producto con el codigo ${ObjectProduct.code} ya se encuentra previamente agregado.`;

          let lastObjetid = allProducts[allProducts.length - 1].id === undefined ? 0 : allProducts[allProducts.length - 1].id;

          lastObjetid++

          object2 = await Object.assign({ 'id': parseInt(lastObjetid, 10) }, ObjectProduct)

          allProducts.push(object2);

        }
        await this.writeFile(allProducts)

        return `SUC|Producto agregado con el id ${object2.id}`
      }

    } catch (error) {

      return `ERR|Error generico. Descripcion :${error}`
    }

  }

  /*Debe tener un metodo getProducts que lee el archivo de productos y devuelve los mismos en formato de arreglo*/
  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) await this.writeFile(this.products);
      const arrayProducts = await this.readProducts();

      return arrayProducts

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }

  /*Debe tener un metodo getProductById que recibira un id */
  async getProductById(id) {

    try {
      if (!Number.isInteger(id)) return "E01|Solo numeros son aceptados como id, ingrese porfavor el id en el formato adecuado.";

      if (!fs.existsSync(this.path)) await this.writeFile(this.products);

      const arrayProducts = await this.readProducts();

      if (arrayProducts.length == 0) return "E02|El JSON se encuentra vacio."

      const objectProduct = arrayProducts.find(obj => obj.id === id);

      if (objectProduct === undefined) return `E02|No encontramos productos con el id ${parseInt(id, 10)}.`;

      return objectProduct

    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }

  }

  /*Debe tener un metodo updateProduct que recibira un id del producto a actualizar y el campo a actualizar*/
  async updateProduct(id, product) {
    try {
      if (!Number.isInteger(id)) return "E01|Solo numeros son aceptados como id, ingrese porfavor el id en el formato adecuado.";


      if (!fs.existsSync(this.path)) await this.writeFile(this.products);

      const arrayProducts = await this.readProducts();

      if (arrayProducts.length == 0) return "E02|El JSON se encuentra vacio."

      const objectProduct = arrayProducts.find(obj => obj.id === id);

      if (objectProduct == undefined) {
        return `E02|El producto no fue actualizado porque no encontramos el id ${parseInt(id, 10)}.`;
      } else {

        for (const [key, value] of Object.entries(product)) {
          objectProduct[key] = value;
        }

        const validatedParams = await this.validateParameters(objectProduct);

        if (!validatedParams) return 'E01|Los parametros no son del tipo correcto.';

        await this.deleteProduct(id)

        const arrayProducts2 = await this.readProducts();

        arrayProducts2.push(objectProduct)

        await this.writeFile(arrayProducts2)

        return `SUC|El producto con el id : ${id} fue actualizado.`;

      }
    } catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }

  }

  /*Debe tener un metodo deleteProduct que recibira un id del producto a eliminar*/
  async deleteProduct(id) {
    try {

      if (!Number.isInteger(id)) return "E01|Solo numeros son aceptados como id, ingrese porfavor el id en el formato adecuado.";

      if (!fs.existsSync(this.path)) await this.writeFile(this.products);

      const arrayProducts = await this.readProducts();

      if (arrayProducts.length == 0) return "E02|El JSON se encuentra vacio."

      const Productbyid = arrayProducts.find(obj => obj.id === id);

      if (Productbyid == undefined) return `E02|El id ${id} no existe en nuestros registros.`

      const objectProduct = arrayProducts.filter(obj => obj.id != id);

      await this.writeFile(objectProduct)

      return `SUC|El producto con el id ${id} fue eliminado.`
    }
    catch (error) {
      return `ERR|Error generico. Descripcion :${error}`
    }
  }
}

export default ProductManager;



