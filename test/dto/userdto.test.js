import mongoose from "mongoose";
import userdto from '../../src/dto/userdto.js';
import Assert from 'assert'
import chai, { expect } from 'chai'
import supertest from "supertest";

mongoose.connect('mongodb+srv://albertto71:WwtuyUvrpVbqG622@cluster0.yk9l1lt.mongodb.net/?retryWrites=true&w=majority')

const assert = Assert.strict

describe('Testeando el session', () => {

    before(function () {

    })

    it('Deberia retornar un dto de usuario para current', async function () {
        this.timeout(20000)
        var user = {
            _id: "6268151531513515",
            firstname: "user test dto",
            lastname: "user.lastname",
            age: "user.age",
            email: "user.email",
            cart: [
                {
                    _id: "16548615318348311" 
                }
            ],
            role: "user.role",
            password: 1234,
        }

        const result = await userdto.getUserInputFrom(user)

        expect(result).to.be.an("object");
    })

})