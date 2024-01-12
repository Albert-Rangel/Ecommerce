import mongoose from "mongoose";
import cartRepositories from '../../src/repositories/cartRepositories.js';
import Assert from 'assert'
import chai, { expect } from 'chai'

mongoose.connect('mongodb+srv://albertto71:WwtuyUvrpVbqG622@cluster0.yk9l1lt.mongodb.net/?retryWrites=true&w=majority')

const assert = Assert.strict

describe('Testeando el cartRepositories', () => {

    before(function () {

        this.cartRepositories = new cartRepositories()
    })

    it('Deberia retornar una lista de carritos', async function () {
        this.timeout(20000)
        const result = await this.cartRepositories.getcartsviaService()
        expect(result).to.be.an('array');
    })

    it('Deberia crear un carrito', async function () {
        this.timeout(20000)
        const result = await this.cartRepositories.addCartviaService()
        const swBool = result.split("|")[0] === 'SUC' ? true : false
         expect(swBool).to.be.true;
    })

    it('Deberia obtener un carrito por su cid', async function () {
        this.timeout(20000)
        var cid = ''
        const resultlist = await this.cartRepositories.getcartsviaService()
        cid = resultlist[0]._id;
        const result = await this.cartRepositories.getCartbyIDviaService(cid)
        expect(result).to.be.an('array');
    })

    it('Deberia eliminar un carrito recien creado', async function () {
        this.timeout(20000)
        var cid = ''
        var cartlist = {}

        await this.cartRepositories.addCartviaService()
        cartlist = await this.cartRepositories.getcartsviaService()
        cid = cartlist[cartlist.length - 1]._id;
        let resultDelete = await this.cartRepositories.deleteCartviaService(cid)
        const swBool = resultDelete.split("|")[0] === 'SUC' ? true : false
        expect(swBool).to.be.true;
    })

})