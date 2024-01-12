import mongoose from "mongoose";
import productRepositories from '../../src/repositories/productsRepositories.js';
import Assert from 'assert'
import chai, { expect } from 'chai'
import random from "random-string-generator";

mongoose.connect('mongodb+srv://albertto71:WwtuyUvrpVbqG622@cluster0.yk9l1lt.mongodb.net/?retryWrites=true&w=majority')


const assert = Assert.strict

describe('Testeando el productRepositories', () => {

    before(function () {

        this.productRepositorie = new productRepositories()
    })

    it('Deberia agregar un nuevo producto', async function () {

        this.timeout(20000)
        const newProduct = {

            title: "Test",
            description: "test",
            price: 1000,
            thumbnail: "https://m.media-amazon.com/images/I/71Q0E2DYf2L.jpg",
            code: random().toString(),
            stock: 10,
            status: true,
            category: "Technology",
            owner: 'adminCoder@coder.com'
        }

        const result = await this.productRepositorie.addProductviaService(newProduct)

        const swBool = result.split("|")[0] === 'SUC' ? true : false
        expect(swBool).to.be.true;
    })

    it('Deberia retornar una lista de productos', async function () {
        this.timeout(20000)
        const result = await this.productRepositorie.getProductNpaginviaService()
        expect(result).to.be.an('array');
    })

    it('Deberia obtener un producto por su PID', async function () {
        this.timeout(20000)
        var pid = '657e3697b4b73b1954ca209c'
        const result = await this.productRepositorie.getProductbyIDviaService(pid)
        expect(result).to.be.an('array');
    })

    it('Deberia actualizar el quantity a 1 en el ultimo producto agregado', async function () {
        this.timeout(20000)
        var pid = ''
        var newProduct = {}
        const resultlist = await this.productRepositorie.getProductNpaginviaService()
        // console.log(resultlist)

        if (resultlist.length > 0) {
            pid = resultlist[0]._id;
        } else {
            newProduct = {

                title: "Test",
                description: "test",
                price: 1000,
                thumbnail: "https://m.media-amazon.com/images/I/71Q0E2DYf2L.jpg",
                code: random().toString(),
                stock: 10,
                status: true,
                category: "Technology",
                owner: 'adminCoder@coder.com'
            }

            const resultadd = await this.productRepositorie.addProductviaService(newProduct)
            const resultlist = await this.productRepositorie.getProductNpaginviaService()
            pid = resultlist[0]._id;

        }

        const result = await this.productRepositorie.updateProductviaService(pid, { stock: 1 })

        const swBool = result.split("|")[0] === 'SUC' ? true : false
        expect(swBool).to.be.true;
    })

})